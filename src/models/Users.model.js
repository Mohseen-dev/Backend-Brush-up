import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

//! Ecrypt user password Before saving in database
// IDEA: or HACK: use normal function instead of arrow function
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hash(this.password, 10);
    next();
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_REFRESH_tOKEN_SECRET_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
