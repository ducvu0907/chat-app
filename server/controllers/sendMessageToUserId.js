import ConversationModel from "../models/ConversationModel.js";
import MessageModel from "../models/MessageModel.js";

export default async function sendMessageToUserId(req, res) {
  try {
    const { text, imageUrl, videoUrl } = req.body;
    const userId = req.params.userId;
    const loggedInUserId = req.user._id;

    if (!text && !imageUrl && !videoUrl) {
      return res.status(400).json({
        message: "invalid message",
        error: true
      });
    }

    let conversation;

    if (loggedInUserId == userId) { // handle monologue
      conversation = await ConversationModel.findOne({
        participants: [loggedInUserId, userId],
      });
    } else {
      conversation = await ConversationModel.findOne({
        participants: { $all: [loggedInUserId, userId] },
      });
    }

    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [loggedInUserId, userId],
      });
    }

    const newMessage = new MessageModel({
      senderId: loggedInUserId,
      text: text || "",
      imageUrl: imageUrl || "",
      videoUrl: videoUrl || "",
      seen: false,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([newMessage.save(), conversation.save()]);
    res.status(201).json(newMessage);

  } catch (error) {
    console.log("error in sending message controller");
    res.status(500).json({
      message: error.message,
      error: true
    });
  }
}