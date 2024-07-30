import MessageModel from "../models/message";
import ConversationModel from "../models/conversation";

// FIXME: handle sending files in the message
export default async function sendMessageToUser(req, res) {
  try {
    const userId = req.user._id;
    const receiverId = req.params.receiverId;
    const { text } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : null; // path to /uploads folder

    let conversation = await ConversationModel.findOne({
      participants: { $in: userId, $in: receiverId },
      isGroup: false,
    });
    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [userId, receiverId],
        isGroup: false,
      });
    }
    const message = new MessageModel({
      sender: userId,
      text: text,
      file: file,
      seen: false,
    });
    await message.save();
    conversation.messages.push(message._id);
    res.status(201).json(message);

  } catch (error) {
    console.log("server error while sending message to user");
    res.status(500).json({
      error: error.message,
    });
  }
}