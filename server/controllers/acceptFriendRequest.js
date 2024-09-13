import UserModel from "../models/user";

export default async function acceptFriendRequest(req, res) {
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
        error: "invalid users"
      });
    }

    if (!currentUser.friendRequests.includes(otherUserId)) {
      return res.status(401).json({
        error: "invalid friend request"
      });
    }

    // remove request from the list and add update friends list
    currentUser.friendRequests = currentUser.friendRequests.filter(rq => rq === otherUserId);
    currentUser.friends.push(otherUserId);
    otherUser.friends.push(currentUserId);

    await Promise.all([await currentUser.save(), await otherUser.save()]);

    res.status(201).json({
      message: "accept request successfully"
    });

  } catch (error) {
    console.log("error while adding friend", error);
    res.status(500).json({
      error: "internal server error",
    });
  }
}
