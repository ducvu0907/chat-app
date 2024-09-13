import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "email invalid",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: "password incorrect",
      });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });

  } catch (error) {
    console.log("server error while logging in", error);
    res.status(500).json({
      error: error.message,
    });
  }
}

export function logout(req, res) {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log("server error while logging out");
    res.status(500).json({
      error: error.message,
    });
  }
}

export async function signup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(401).json({
        error: "passwords don't match",
      });
    }
    if (await UserModel.findOne({ email })) {
      return res.status(401).json({
        error: "email already used",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const profilePic = `https://ui-avatars.com/api/?name=${name}`;

    const user = new UserModel({
      name,
      email,
      hashedPassword,
      profilePic,
    });

    generateToken(user._id, res);
    await user.save();
    res.status(201).json({
      _id: user._id,
      name,
      email,
      profilePic,
    });

  } catch (error) {
    console.log("server error while signing up", error);
    res.status(500).json({
      error: error.message,
    });
  }
}