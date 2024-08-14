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
          populate: {
            path: "sender",
            select: "name profilePic"
          },
        }
      ]
    }).exec();

    if (!user) {
      res.status(400).json({
        error: "invalid user"
      });
    }
    const conversations = user.conversations.filter(c => c.messages.length > 0);
    res.status(200).json(conversations);

  } catch (error) {
    console.log("server error while getting conversations");
    res.status(500).json({
      error: error.message,
    });
  }
}