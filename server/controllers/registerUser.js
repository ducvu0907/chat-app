import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export default async function registerUser(req, res) {
  try {
    const { fullName, username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(401).json({ message: "passwords don't match", error: true });
    }
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(401).json({ message: "username already exists", error: true });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const profilePic = `https://avatar.iran.liara.run/username?username=${fullName.split(' ').join('+')}`;

    const payload = {
      fullName,
      username,
      password: hashedPassword,
      profilePic,
    };

    const newUser = new UserModel(payload);
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName,
        username,
        profilePic
      });
    } else {
      res.status(401).json({
        message: "invalid user data",
        error: true,
      });
    }

  } catch (error) {
    console.log("error in register user controller");
    res.status(500).json({
      message: error.message,
      error: true
    });
  }
}