import MessageModel from "../models/message.js";
import ConversationModel from "../models/conversation.js";
import { getUserSocket, io } from "../socket/server.js";

export default async function sendMessageToConversation(req, res) {
  try {
    const userId = req.user._id;
    const conversationId = req.params.conversationId;
    const { text } = req.body;
    // FIXME: fix file format
    const file = req.file ? req.file.path : null;

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
    let participantsSocket = [];
    conversation.participants.forEach(id => {
      if (getUserSocket[id]) {
        participantsSocket.push(getUserSocket[id]);
      }
    });
    io.to(participantsSocket).emit("message", message);
    res.status(201).json(message);

  } catch (error) {
    console.log("server error while sending message");
    res.status(500).json({
      error: error.message,
    });
  }
}