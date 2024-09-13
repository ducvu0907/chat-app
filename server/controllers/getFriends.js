import UserModel from "../models/user.js";

export default async function getFriends(req, res) {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId).populate({
      path: "friends",
      select: "-hashedPassword", // populate fields excluding password
    });
    if (!user) {
      return res.status(404).json({
        error: "user not found"
      });
    }

    res.status(200).json(user.friends);

  } catch (error) {
    console.log("server error while getting friends", error);
    res.status(500).json({
      error: "internal server error",
    });
  }
}