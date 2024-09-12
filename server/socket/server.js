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
  socket.on("offer", ({ offer, to, convId }) => {
    const toSocketId = getUserSocketId(to);
    if (toSocketId) {
      io.to(toSocketId).emit("receive-offer", {
        offer: offer,
        from: socket.userId,
        convId: convId
      });
    }
  });

  socket.on("answer", ({ answer, to, convId }) => {
    const toSocketId = getUserSocketId(to);
    if (toSocketId) {
      io.to(toSocketId).emit("receive-answer", {
        answer: answer,
        from: socket.userId,
        convId: convId
      });
    }
  });

  socket.on("ice-candidate", ({ candidate, to, convId }) => {
    const toSocketId = getUserSocketId(to);
    if (toSocketId) {
      io.to(toSocketId).emit("receive-ice-candidate", {
        candidate: candidate,
        from: socket.userId,
        convId: convId
      });
    }
  });

  socket.on("leave", ({ to, convId }) => {
    const toSocketId = getUserSocketId(to);
    if (toSocketId) {
      io.to(toSocketId).emit("receive-leave", {
        from: socket.userId,
        convId: convId
      });
    }
  });

});

export { app, server, io, getUserSocketId };