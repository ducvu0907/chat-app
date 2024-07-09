import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/connectToDB.js";
import router from "./routes/routes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("This is a homepage");
});
app.use("/api", router);

app.listen(PORT, () => {
  connectToDB();
  console.log(`Listening on ${PORT}`);
});