import UserModel from "../models/user";

export default async function sendFriendRequest(req, res) {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.body.userId;
    let currentUser, otherUser;

    await Promise.all([
      currentUser = UserModel.findById(currentUserId),
      otherUser = UserModel.findById(otherUserId),
    ]);

    if (!currentUser || !otherUser) {
      return res.status(403).json({
        error: "invalid users",
      });
    }

    otherUser.friendRequests.push(currentUserId);

    await otherUser.save();

    res.status(201).json({
      message: "send friend request successfully"
    });

  } catch (error) {
    console.log("error while adding friend", error);
    res.status(500).json({
      error: "internal server error",
    });
  }
}
