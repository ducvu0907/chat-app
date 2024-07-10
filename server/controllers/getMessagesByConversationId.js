import ConversationModel from "../models/ConversationModel.js";

export default async function getMessagesByConversationId(req, res) {
  try {
    const conversationId = req.params;
    const loggedInUserId = req.user._id;
    const conversation = await ConversationModel.findById(conversationId).populate("messages");

    // check if the current user not in the conversation or the converstation doesn't exist
    if (conversation && !conversation.participants.includes(loggedInUserId)) {
      return res.status(400).json({
        message: "invalid conversation",
        error: true
      });
    } else if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;
    res.status(200).json(messages);

  } catch (error) {
    console.log("error in get messages controller");
    res.status(500).json({
      message: error.message,
      error: true
    });
  }
}