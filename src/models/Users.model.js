import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exits or must be unique"],
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      lowercase: true,
      trim: true,
      // Todo : validate:{}
    },
    password: {
      type: String,
      min: [6, "password must be greater then 6"],
      max: 12,
      required: [true, "Password is requird"],
    },
    fullName: {
      type: String,
      required: [true, "Name is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //* cloudinary url
      requied: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
