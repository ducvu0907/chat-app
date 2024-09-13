import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  hashedPassword: {
    type: String,
  },
  profilePic: {
    type: String
  },
  friends: [{
    type: mongoose.Schema.ObjectId
  }],
  friendRequests: [{
    type: mongoose.Schema.ObjectId,
  }],
  conversations: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
      default: [],
    }
  ]
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;