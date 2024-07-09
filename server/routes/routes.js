import express from "express";
import registerUser from "../controllers/registerUser.js";
import loginUser from "../controllers/loginUser.js";
import logoutUser from "../controllers/logoutUser.js";

const router = express.Router();

// auth routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;