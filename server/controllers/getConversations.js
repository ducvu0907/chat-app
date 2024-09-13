import UserModel from "../models/user.js";

export default async function getConversations(req, res) {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId).populate({
      path: "conversations",
      populate: [
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
          ],
        }
      ]
    });

    if (!user) {
      res.status(400).json({
        error: "invalid user"
      });
    }
    // sort based on most recent message
    const conversations = user.conversations.sort((a, b) => {
      const dateA = a.messages.length > 0 ? new Date(a.messages.at(-1).createdAt) : new Date(0);
      const dateB = b.messages.length > 0 ? new Date(b.messages.at(-1).createdAt) : new Date(0);
      return dateB - dateA;
    });

    res.status(200).json(conversations);

  } catch (error) {
    console.log("server error while getting conversations", error);
    res.status(500).json({
      error: error.message,
    });
  }
}