import MessageModel from "../models/message.js";
import ConversationModel from "../models/conversation.js";
import { getUserSocketId, io } from "../socket/server.js";

export default async function sendMessage(req, res) {
  try {
    const userId = req.user._id;
    const conversationId = req.params.conversationId;
    const { text } = req.body;
    const file = req.file ? {
      name: req.file.originalname,
      type: req.file.mimetype
    } : null;

    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      return res.status(400).json({
        error: "invalid conversation",
      });
    }

    const message = new MessageModel({
      sender: userId,
      text: text,
      file: file,
    });
    conversation.messages.push(message._id);

    await Promise.all([message.save(), conversation.save()]);
    let participantSocketIds = conversation.participants
      .filter(id => !id.equals(userId) && getUserSocketId(id))
      .map(id => getUserSocketId(id.toString()))

    await Promise.all([
      message.populate({
        path: "sender",
        select: "name profilePic",
      }),
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
    console.log(conversation);

    // broadcast to all participants except for the sender
    participantSocketIds.forEach(socketId => {
      io.to(socketId).emit("message", { message, conversation });
    });

    res.status(201).json(message);

  } catch (error) {
    console.log("server error while sending message");
    res.status(500).json({
      error: error.message,
    });
  }
}