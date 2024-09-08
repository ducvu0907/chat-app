import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  picture: {
    type: String,
  },
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  isGroup: {
    type: Boolean,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
      default: [],
    },
  ],
}, { timestamps: true });

const ConversationModel = mongoose.model("Conversation", conversationSchema);
export default ConversationModel;