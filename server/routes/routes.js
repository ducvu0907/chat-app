import express from "express";
import multer from "multer";
import { login, signup, logout } from "../controllers/authenticateUser.js";
import getConversationById from "../controllers/getConversationById.js";
import getConversations from "../controllers/getConversations.js";
import getMessages from "../controllers/getMessages.js";
import getUsers from "../controllers/getUsers.js";
import sendMessage from "../controllers/sendMessage.js";
import verifyToken from "../middlewares/verifyToken.js";
import getConversationByUserId from "../controllers/getConversationByUserId.js";
import path from "path";
// setup uploads storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
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
router.get("/conversations/user/:receiverId", verifyToken, getConversationByUserId);

// message routes
router.get("/messages/:conversationId", verifyToken, getMessages);
router.post("/messages/conversation/:conversationId", verifyToken, upload.single("file"), sendMessage);

export default router;