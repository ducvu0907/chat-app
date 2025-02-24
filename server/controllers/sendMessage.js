import MessageModel from "../models/message.js";
import ConversationModel from "../models/conversation.js";
import { getUserSocketId, io } from "../socket/server.js";
import { redisClient } from "../socket/server.js";

export default async function sendMessage(req, res) {
  try {
    const userId = req.user._id;
    const conversationId = req.params.conversationId;
    const { text } = req.body;
    const file = req.file ? {
      name: req.file.filename,
      type: req.file.mimetype
    } : null;

    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      return res.status(400).json({
        error: "invalid conversation",
      });
    }

    // check if cache exists then invalidate the cache first to ensure synchronization between reads
    const cachedKey = `conversation:${conversation.id}`;
    const cachedConversation = await redisClient.get(cachedKey);
    if (cachedConversation) {
      await redisClient.del(cachedKey);
      console.log("Invalidates cached key first");
    }

    const message = new MessageModel({
      sender: userId,
      text: text,
      file: file,
      seen: [userId],
    });
    conversation.messages.push(message._id);

    await Promise.all([message.save(), conversation.save()]);
    let participantSocketIds = conversation.participants
      .map(id => getUserSocketId(id.toString()))
      .filter(Boolean);

    await Promise.all([
      message.populate([
        {
          path: "sender",
          select: "name profilePic",
        },
        {
          path: "seen",
          select: "name profilePic"
        }
      ]),
      conversation.populate([
        {
          path: "participants",
          select: "name profilePic"
        },
        {
          path: "messages",
          populate: {
            path: "sender",
            select: "name profilePic"
          },
        }
      ]),
    ]);

    // broadcast
    io.emit("message", { message, conversation });

    // write to cache if exists, should persist to handle the write even if cache failed
    if (cachedConversation) {
      try {
        await redisClient.setEx(cachedKey, 300, JSON.stringify(conversation));
        console.log("Cached conversation updated successfully");
      } catch (redisError) {
        console.error("Error updating cache:", redisError);
      }
    }

    res.status(201).json(message);

  } catch (error) {
    console.log("server error while sending message", error);
    res.status(500).json({
      error: error.message,
    });
  }
}