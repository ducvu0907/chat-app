import express from "express";
import multer from "multer";
import { login, signup, logout } from "../controllers/authenticateUser";
import getConversationById from "../controllers/getConversationById";
import getConversations from "../controllers/getConversations";
import getMessages from "../controllers/getMessages";
import getUsers from "../controllers/getUsers";
import sendMessageToConversation from "../controllers/sendMessageToConversation";
import sendMessageToUser from "../controllers/sendMessageToUser";
import verifyToken from "../middlewares/verifyToken";
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
router.get("/conversations/:conversationId/messages", verifyToken, getMessages);
router.post("/conversations/:conversationId/messages", verifyToken, upload.single("image"), sendMessageToConversation);
router.post("/conversations/:receiverId/messages", verifyToken, upload.single("image"), sendMessageToUser);

export default router;