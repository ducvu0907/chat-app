import express from "express";
import multer from "multer";
import { login, signup, logout } from "../controllers/authenticateUser.js";
import getConversationById from "../controllers/getConversationById.js";
import getConversations from "../controllers/getConversations.js";
import getMessages from "../controllers/getMessages.js";
import getUsers from "../controllers/getUsers.js";
import sendMessageToConversation from "../controllers/sendMessageToConversation.js";
import sendMessageToUser from "../controllers/sendMessageToUser.js";
import verifyToken from "../middlewares/verifyToken.js";
const upload = multer({ dest: "../uploads" });
const router = express.Router();

// auth routes
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

// user routes
router.get("/users", verifyToken, getUsers);

// conversation routes
router.get("/conversations", verifyToken, getConversations);
router.get("/conversations/:conversationId", verifyToken, getConversationById);

// message routes
router.get("/messages/:conversationId", verifyToken, getMessages);
router.post("/messages/conversation/:conversationId", verifyToken, upload.single("image"), sendMessageToConversation);
router.post("/messages/user/:receiverId", verifyToken, upload.single("image"), sendMessageToUser);

export default router;