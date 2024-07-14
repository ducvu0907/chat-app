import ConversationModel from "../models/ConversationModel.js";

export default async function getMessagesByUserId(req, res) {
  try {
    const loggedInUserId = req.user._id;
    const userToChatId = req.params.userId;

    let conversation;
    if (loggedInUserId.equals(userToChatId)) {
      conversation = await ConversationModel.findOne({
        participants: [loggedInUserId, loggedInUserId],
      }).populate("messages");
    } else {
      conversation = await ConversationModel.findOne({
        participants: { $all: [loggedInUserId, userToChatId] },
      }).populate("messages");
    }

    if (conversation) {
      res.status(200).json(conversation.messages);
    } else {
      res.status(200).json([]);
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: true,
    });
  }
}