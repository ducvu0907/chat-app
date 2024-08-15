import ConversationModel from "../models/conversation.js";
import UserModel from "../models/user.js";

export default async function getConversationById(req, res) {
  try {
    const userId = req.user._id;
    const conversationId = req.params.conversationId;
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      res.status(400).json({
        error: "invalid user"
      });
    }

    const conversation = await ConversationModel.findById(conversationId).populate([
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
    ]);

    if (!conversation) {
      return res.status(400).json({
        error: "invalid conversation",
      });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(401).json({
        error: "user not in conversation",
      });
    }

    res.status(200).json(conversation);

  } catch (error) {
    console.log("server error while getting conversation by id");
    res.status(500).json({
      error: error.message,
    });
  }
}