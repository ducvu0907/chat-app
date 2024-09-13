import ConversationModel from "../models/conversation.js";
import UserModel from "../models/user.js";

export default async function createGroupConversation(req, res) {
  try {
    const userId = req.user._id;
    const participants = req.body.participants; // already contains user id
    const groupName = participants.map(user => user.name.split(' ')[0]).join(', ');

    const conversation = await ConversationModel.create({
      name: groupName,
      picture: "https://ui-avatars.com/api/?name=group",
      participants: participants,
      isGroup: true,
      createdBy: userId,
    });

    await Promise.all(participants.map(async (participant) => {
      const user = await UserModel.findById(participant._id);
      if (user && !user.conversations.includes(conversation._id)) {
        user.conversations.push(conversation._id);
        await user.save();
      }
    }));

    await conversation.populate([
      {
        path: "participants",
        select: "name profilePic"
      },
      {
        path: "messages",
        populate: [
          {
            path: "sender",
            select: "name profilePic"
          },
          {
            path: "seen",
            select: "name profilePic"
          }
        ]
      }
    ]);

    res.status(201).json(conversation);

  } catch (error) {
    console.log("server error while creating group conversation", error);
    res.status(500).json({
      error: error.message,
    });
  }
}