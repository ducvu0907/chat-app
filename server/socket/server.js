import express from "express";
import { createServer } from "http";
import { createClient } from "redis";
import { Server } from "socket.io";
import * as Minio from "minio";

const app = express();
const server = createServer(app);
// ws server
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

// minio client
const minioClient = new Minio.Client({
  endPoint: 'minio',
  port: 9000,
  useSSL: false,
  accessKey: 'v7XfYYn81Op5T4Nbmhic',
  secretKey: 'bdPYjeDUi1C9gyuPBMrUyE9ldrJ54YP3pIzKymIv',
});

// redis client
const redisClient = createClient({
  url: "redis://redis:6379",
});
redisClient.on("error", error => console.log("Redis client error", error))
await redisClient.connect();

// map user id to corresponding socket id
const userSocket = {};

function getUserSocketId(id) {
  return userSocket[id];
}

io.on("connection", (socket) => {
  console.log("New user connected", socket.id);
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

export { app, server, io, getUserSocketId, minioClient, redisClient };