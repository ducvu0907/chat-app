import ConversationModel from "../models/conversation.js";

export default async function createGroupConversation(req, res) {
  try {
    const userId = req.user._id;
    const { name, participants } = req.body;
    participants.push(userId);
    const conversation = await ConversationModel.create({
      name: name,
      participants: participants,
      isGroup: true,
    });
    res.status(201).json(conversation);

  } catch (error) {
    console.log("server error while creating group conversation");
    res.status(500).json({
      error: error.message,
    });
  }
}