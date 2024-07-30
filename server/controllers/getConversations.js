import UserModel from "../models/user";

export default async function getConversations(req, res) {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId).populate("conversations");
    if (!user) {
      res.status(400).json({
        error: "invalid user"
      });
    }
    const conversations = user.conversations;
    res.status(200).json(conversations);

  } catch (error) {
    console.log("server error while getting conversations");
    res.status(500).json({
      error: error.message,
    });
  }
}