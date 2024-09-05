import ConversationModel from "../models/conversation.js";

export default async function createGroupConversation(req, res) {
  try {
    const { name, participants } = req.body; // participants also should contain userId

    const conversation = await ConversationModel.create({
      name: name,
      participants: participants,
      isGroup: true,
    });

    await Promise.all(participants.map(async (id) => {
      const user = await UserModel.findById(id);
      if (user && !user.conversations.includes(conversation._id)) {
        user.conversations.push(conversation._id);
        await user.save();
      }
    }));

    res.status(201).json(conversation);

  } catch (error) {
    console.log("server error while creating group conversation");
    res.status(500).json({
      error: error.message,
    });
  }
}