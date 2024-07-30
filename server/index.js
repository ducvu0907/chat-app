import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectToDB from "./configs/connectToDB.js";
import router from "./routes/routes.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

app.listen(PORT, () => {
  connectToDB();
  console.log(`server listening on port ${PORT}`);
});