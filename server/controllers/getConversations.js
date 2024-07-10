import ConversationModel from "../models/ConversationModel.js";

export default async function getConversations(req, res) {
  try {
    const loggedInUserId = req.user._id;

    const conversations = await ConversationModel.find({
      participants: { $in: loggedInUserId },
    }).populate("participants");

    let users = [];

    conversations.forEach(conversation => {
      const receiver = conversation.participants.filter(participant => participant._id !== loggedInUserId)[0];
      users.push(receiver);
    });

    res.status(200).json(users);

  } catch (error) {
    console.log("error in getting user's conversations");
    res.status(500).json({
      message: error.message,
      error: true,
    });
  }
}