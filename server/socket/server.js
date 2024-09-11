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

function getUserSocketId(id) {
  return userSocket[id];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocket[userId] = socket.id;
    socket.userId = userId;
  }

  io.emit("get-online-users", Object.keys(userSocket));

  socket.on("disconnect", () => {
    if (socket.userId) {
      delete userSocket[socket.userId];
      io.emit("get-online-users", Object.keys(userSocket));
    }
  });

  // video call events
  socket.on("offer", ({ offer, to }) => {
    const toSocketId = getUserSocketId(to);
    if (toSocketId) {
      io.to(toSocketId).emit("receive-offer", {
        offer: offer,
        from: socket.userId,
      });
    }
  });

  socket.on("answer", ({ answer, to }) => {
    const toSocketId = getUserSocketId(to);
    if (toSocketId) {
      io.to(toSocketId).emit("receive-answer", {
        answer: answer,
        from: socket.userId,
      });
    }
  });

  socket.on("ice-candidate", ({ candidate, to }) => {
    const toSocketId = getUserSocketId(to);
    if (toSocketId) {
      io.to(toSocketId).emit("receive-ice-candidate", {
        candidate: candidate,
        from: socket.userId,
      });
    }
  });
});

export { app, server, io, getUserSocketId };