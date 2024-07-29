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
  conversations: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
    }
  ]
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;