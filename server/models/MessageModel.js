import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.ObjectId,
    require: true,
    ref: "User",
  },
  text: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    default: "",
  },
  videoUrl: {
    type: String,
    default: "",
  },
  seen: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;