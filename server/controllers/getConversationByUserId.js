import ConversationModel from "../models/conversation.js";
import UserModel from "../models/user.js";
import { getUserSocketId, io } from "../socket/server.js";

// currently only for 1-on-1 conversation
export default async function getConversationByUserId(req, res) {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.receiverId;
    const participants = [currentUserId, otherUserId].sort();
    let user;

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
        user = await UserModel.findById(id);
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
    ]);

    // update the seen list of the last message
    if (conversation.messages.length > 0) {
      const lastMessage = conversation.messages.at(-1);
      if (!lastMessage.seen.includes(currentUserId) && !currentUserId.equals(lastMessage.sender._id)) {
        lastMessage.seen.push(currentUserId);
        await lastMessage.save();
        await lastMessage.populate({
          path: "seen",
          select: "name profilePic"
        });
        const otherSocketId = getUserSocketId[otherUserId];
        const newSeen = lastMessage.seen;
        if (otherSocketId) {
          io.to(socketId).emit("read", { newSeen, conversation });
        }
      }
    }

    await conversation.messages.at(-1)?.populate({
      path: "seen",
      select: "name profilePic"
    });

    res.status(200).json(conversation);

  } catch (error) {
    console.error("server error while getting conversation by user id", error);
    res.status(500).json({ error: error.message });
  }
}