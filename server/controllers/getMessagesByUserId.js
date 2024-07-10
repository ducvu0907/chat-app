import ConversationModel from "../models/ConversationModel.js";

export default async function getMessagesByUserId(req, res) {
  try {
    const loggedInUserId = req.user._id;
    const userToChatId = req.params.userId;

    const conversation = await ConversationModel.findOne({
      participants: { $all: [loggedInUserId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      res.status(400).json([]);
    } else {
      res.status(200).json(conversation.messages);
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: true,
    });
  }
}