import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

export default async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "token not found",
        error: true,
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({
        message: "invalid token",
        error: true,
      });
    }

    const user = await UserModel.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        error: true,
      })
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("server error while verifying token");
    res.status(500).json({
      message: error.message,
      error: true,
    });
  }
}