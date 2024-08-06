import UserModel from "../models/user.js";

// template controller for friends feature
export default async function getUsers(req, res) {
  try {
    const userId = req.user._id;
    const users = await UserModel.find({ _id: { $ne: userId } }).select("-hashedPassword");
    res.status(200).json(users);

  } catch (error) {
    console.log("server error while getting users");
    res.status(500).json({
      error: error.message,
    });
  }
}