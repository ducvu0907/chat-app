import MessageModel from "../models/message.js";
import ConversationModel from "../models/conversation.js";
import { getUserSocket, io } from "../socket/server.js";

export default async function sendMessage(req, res) {
  try {
    const userId = req.user._id;
    const conversationId = req.params.conversationId;
    const { text } = req.body;
    const file = req.file;
    const fileData = file ? {
      url: `/uploads/${file.filename}`,
      name: file.originalname,
      type: file.mimetype
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
      file: fileData,
    });
    conversation.messages.push(message._id);
    await Promise.all([message.save(), conversation.save()]);
    let participantSockets = [];
    conversation.participants.forEach(id => {
      if (getUserSocket[id]) {
        participantSockets.push(getUserSocket[id]);
      }
    });
    await message.populate({
      path: "sender",
      select: "name profilePic",
    });
    io.to(participantSockets).emit("message", message);
    res.status(201).json(message);

  } catch (error) {
    console.log("server error while sending message");
    res.status(500).json({
      error: error.message,
    });
  }
}