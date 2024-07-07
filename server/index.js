import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/connectToDB.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.listen(PORT, () => {
  connectToDB();
  console.log(`Server is running on ${PORT}`);
});