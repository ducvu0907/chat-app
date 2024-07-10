import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectToDB from "./config/connectToDB.js";
import router from "./routes/routes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

app.listen(PORT, () => {
  connectToDB();
  console.log(`Listening on ${PORT}`);
});