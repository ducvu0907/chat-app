import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true
  },
  profilePic: {
    type: String
  }
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;