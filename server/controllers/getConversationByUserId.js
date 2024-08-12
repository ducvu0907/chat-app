import ConversationModel from "../models/conversation.js";
import UserModel from "../models/user.js";
import mongoose from "mongoose";

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
      // create a new conversation
      conversation = await ConversationModel.create({
        participants: participants,
        isGroup: false,
      });

      // update each participant's conversations
      await Promise.all(participants.map(async (id) => {
        let user = await UserModel.findById(id);
        if (user && !user.conversations.includes(conversation._id)) {
          user.conversations.push(conversation._id);
          await user.save();
        }
      }));
    }

    res.status(200).json(conversation);

  } catch (error) {
    console.error("Server error while getting conversation by user id:", error);
    res.status(500).json({ error: error.message });
  }
}