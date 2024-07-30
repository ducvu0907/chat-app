import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

export default async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        error: "token not found",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({
        error: "invalid token",
      });
    }

    const user = await UserModel.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({
        error: "user not found",
      })
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("server error while verifying token");
    res.status(500).json({
      error: error.message,
    });
  }
}