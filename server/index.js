import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectToDB from "./configs/connectToDB.js";
import router from "./routes/routes.js";
import { app, server } from "./socket/server.js";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use("/static", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

server.listen(PORT, () => {
  connectToDB();
  console.log(`server listening on port ${PORT}`);
});