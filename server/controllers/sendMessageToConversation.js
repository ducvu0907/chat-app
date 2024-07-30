import MessageModel from "../models/message";
import ConversationModel from "../models/conversation";

// FIXME: handle sending files in the message
export default async function sendMessageToConversation(req, res) {
  try {
    const userId = req.user._id;
    const conversationId = req.params.conversationId;
    const { text } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : null; // path to /uploads folder

    const conversation = await ConversationModel.findById(conversationId);
    const message = new MessageModel({
      sender: userId,
      text: text,
      file: file,
      seen: false,
    });
    await message.save();
    conversation.messsages.push(message._id);
    res.status(201).json(message);

  } catch (error) {
    console.log("server error while sending message");
    res.status(500).json({
      error: error.message,
    });
  }
}