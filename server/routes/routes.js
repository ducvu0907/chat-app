import express from "express";
import registerUser from "../controllers/registerUser.js";
import loginUser from "../controllers/loginUser.js";
import logoutUser from "../controllers/logoutUser.js";
import getConversations from "../controllers/getConversations.js";
import getMessagesByUserId from "../controllers/getMessagesByUserId.js";
import getMessagesByConversationId from "../controllers/getMessagesByConversationId.js";
import verifyToken from "../utils/verifyToken.js";
import sendMessageToUserId from "../controllers/sendMessageToUserId.js";
import sendMessageToConversationId from "../controllers/sendMessageToConversationId.js";

const router = express.Router();

// user routes
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);

// message routes
router.get("/message/:userId", verifyToken, getMessagesByUserId);
router.post("/message/send/:userId", verifyToken, sendMessageToUserId);

// conversation routes
router.get("/conversation", verifyToken, getConversations);

export default router;