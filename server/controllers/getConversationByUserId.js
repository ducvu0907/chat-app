import ConversationModel from "../models/conversation.js";
import UserModel from "../models/user.js";

// only for 1-on-1 conversation
export default async function getConversationByUserId(req, res) {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.receiverId;
    const participants = [currentUserId, otherUserId].sort();

    let conversation = await ConversationModel.findOne({
      participants: participants,
      isGroup: false,
    });

    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: participants,
        isGroup: false,
      });

      await Promise.all(participants.map(async (id) => {
        let user = await UserModel.findById(id);
        if (user && !user.conversations.includes(conversation._id)) {
          user.conversations.push(conversation._id);
          await user.save();
        }
      }));
    }
    await conversation.populate([
      {
        path: "participants",
        select: "name profilePic"
      },
      {
        path: "messages",
        populate: {
          path: "sender",
          select: "name profilePic"
        },
      }
    ])

    res.status(200).json(conversation);

  } catch (error) {
    console.error("server error while getting conversation by user id:", error);
    res.status(500).json({ error: error.message });
  }
}