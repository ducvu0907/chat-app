import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const userSocket = {};
export function getUserSocket(userId) {
  return userSocket[userId];
}

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocket[userId] = socket.id;
    socket.userId = userId;
  }
  io.emit("getOnlineUsers", Object.keys(userSocket));
  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);

    if (socket.userId) {
      delete userSocket[socket.userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocket));
  });
});

export { app, server, io };