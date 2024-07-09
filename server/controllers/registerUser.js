import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export default async function registerUser(req, res) {
  try {
    const { fullName, username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "passwords don't match" });
    }
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "username already exists", error: true });
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
    await newUser.save();

    return res.status(200).json({
      message: "user created successfully",
      data: newUser,
    });

  } catch (error) {
    console.log("error in register user controller");
    res.status(500).json({
      message: error.message,
      error: true
    });
  }
}