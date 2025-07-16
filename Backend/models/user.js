const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    phone: {
      type: String,
      required: false, // Made optional for Google OAuth
      trim: true,
    },
    password: {
      type: String,
      required: false, // Made optional for Google OAuth
      minlength: [6, "Password must be at least 6 characters long"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("User", userSchema)
