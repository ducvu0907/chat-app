import MessageModel from "../models/message.js";
import ConversationModel from "../models/conversation.js";
import UserModel from "../models/user.js";

// FIXME: handle sending files in the message
export default async function sendMessageToUser(req, res) {
  try {
    const userId = req.user._id;
    const receiverId = req.params.receiverId;
    const { text } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : null;
    const user = await UserModel.findById(userId);
    const receiver = await UserModel.findById(receiverId);
    if (!receiver) {
      return res.status(400).json({
        error: "invalid receiver",
      });
    }

    let conversation = await ConversationModel.findOne({
      participants: [userId, receiverId],
      isGroup: false,
    });

    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [userId, receiverId],
        isGroup: false,
      });
      user.conversations.push(conversation._id);
      receiverId === userId ? receiver.conversations.push(conversation._id) : null;
    }

    const message = new MessageModel({
      sender: userId,
      text: text,
      file: file,
    });
    conversation.messages.push(message._id);
    await Promise.all([message.save(), conversation.save(), user.save(), receiver.save()]);
    res.status(201).json(message);

  } catch (error) {
    console.log("server error while sending message to user");
    res.status(500).json({
      error: error.message,
    });
  }
}