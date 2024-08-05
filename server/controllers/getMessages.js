import ConversationModel from "../models/conversation.js";

export default async function getMessages(req, res) {
  try {
    const userId = req.user._id;
    const conversationId = req.params.conversationId;
    const conversation = await ConversationModel.findById(conversationId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "name profilePic",
      },
    }).exec();
    if (!conversation) {
      return res.status(200).json([]);
    }
    if (!conversation.participants.includes(userId)) {
      return res.status(401).json({
        error: "user not in conversation",
      });
    }
    const messages = conversation.messages;
    res.status(200).json(messages);

  } catch (error) {
    console.log("server error while getting messages");
    res.status(500).json({
      error: error.message,
    });
  }
}