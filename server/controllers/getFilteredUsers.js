import UserModel from "../models/UserModel.js";

export default async function getFilteredUsers(req, res) {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await UserModel.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);

  } catch (error) {
    console.log("error in getting all filtered users");
    res.status(500).json({
      message: error.message,
      error: true,
    });
  }
}