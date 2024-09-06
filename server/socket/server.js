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

  io.emit("getOnlineUsers", Object.keys(userSocket));

  socket.on("disconnect", () => {
    if (socket.userId) {
      delete userSocket[socket.userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocket));
  });

  // TODO: handle video calling events
  socket.on("callUser", (data) => {
    io.to(data.to).emit("callMade", {
      offer: data.offer,
      socket: socket.id,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("answerMade", {
      answer: data.answer,
      socket: socket.id,
    });
  });

  socket.on("rejectCall", (data) => {
    io.to(data.to).emit("callRejected", {
      socket: socket.id,
    });
  });

  socket.on("iceCandidate", (data) => {
    io.to(data.to).emit("iceCandidatePosted", {
      candidate: data.candidate,
      socket: socket.id,
    });
  });

});

export { app, server, io, getUserSocketId };