import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    profilePic: {
      type: String,
      default: "uploads/defaultProfilePic.jpg",
    },
    ChatId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", UserSchema);
