import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  name: {
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