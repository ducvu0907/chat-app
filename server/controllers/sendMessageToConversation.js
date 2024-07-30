import MessageModel from "../models/message.js";
import ConversationModel from "../models/conversation.js";

// FIXME: handle sending files in the message
export default async function sendMessageToConversation(req, res) {
  try {
    const userId = req.user._id;
    const conversationId = req.params.conversationId;
    const { text } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : null;

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
    res.status(201).json(message);

  } catch (error) {
    console.log("server error while sending message");
    res.status(500).json({
      error: error.message,
    });
  }
}