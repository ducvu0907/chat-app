import ConversationModel from "../models/conversation.js";
import UserModel from "../models/user.js";
import { getUserSocketId, io } from "../socket/server.js";

export default async function getConversationById(req, res) {
  try {
    const currentUserId = req.user._id;
    const conversationId = req.params.conversationId;
    const user = await UserModel.findOne({ _id: currentUserId });
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
        populate: [
          {
            path: "sender",
            select: "name profilePic"
          },
        ],
      }
    ]);


    if (!conversation) {
      return res.status(400).json({
        error: "invalid conversation",
      });
    }

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

        const participantSocketIds = conversation.participants
          .filter(participant => !participant._id.equals(currentUserId) && getUserSocketId(participant._id))
          .map(participant => getUserSocketId(participant._id.toString()));

        const newSeen = lastMessage.seen;

        participantSocketIds.forEach(socketId => {
          io.to(socketId).emit("read", { newSeen, conversation });
        });
      }
    }

    await conversation.messages.at(-1)?.populate({
      path: "seen",
      select: "name profilePic"
    });

    res.status(200).json(conversation);

  } catch (error) {
    console.log("server error while getting conversation by id", error);
    res.status(500).json({
      error: error.message,
    });
  }
}