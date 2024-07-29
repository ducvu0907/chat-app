import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  },
  seen: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    }
  ]
}, { timestamps: true });

const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;