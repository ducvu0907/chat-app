import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export default async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: "username invalid",
        error: true,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "password incorrect",
        error: true,
      });
    }

    generateToken(user._id, res); // generate token and assign to cookie
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });

  } catch (error) {
    console.log("error in login user controller");
    res.status(500).json({
      message: error.message,
      error: true,
    });
  }
}