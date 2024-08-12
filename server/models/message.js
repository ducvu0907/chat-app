import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
  },
  file: {
    url: { type: String },
    name: { type: String },
    type: { type: String },
  },
  seen: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: [],
    }
  ]
}, { timestamps: true });

const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;