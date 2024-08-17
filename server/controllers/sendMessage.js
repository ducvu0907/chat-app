import MessageModel from "../models/message.js";
import ConversationModel from "../models/conversation.js";
import { getUserSocketId, io } from "../socket/server.js";

export default async function sendMessage(req, res) {
  try {
    const userId = req.user._id;
    const conversationId = req.params.conversationId;
    const { text } = req.body;
    const file = req.file ? {
      url: `/uploads/${req.file.filename}`,
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
    await message.populate({
      path: "sender",
      select: "name profilePic",
    });
    // broadcast to all users in the conversation except for the sender
    participantSocketIds.forEach(socketId => {
      io.to(socketId).emit("message", { message, conversationId });
    });
    res.status(201).json(message);

  } catch (error) {
    console.log("server error while sending message");
    res.status(500).json({
      error: error.message,
    });
  }
}