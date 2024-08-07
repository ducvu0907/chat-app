import ConversationModel from "../models/conversation.js";

export default async function getConversationByUserId(req, res) {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.receiverId;
    let conversation = await ConversationModel.findOne({
      participants: [currentUserId, otherUserId].sort(),
      isGroup: false,
    });
    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [currentUserId, otherUserId].sort(),
        isGroup: false,
      });
    }
    res.status(200).json(conversation);

  } catch (error) {
    console.log("server error while getting conversation by user id");
    res.status(500).json({
      error: error.message,
    });
  }
}