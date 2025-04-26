/*
const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Make this optional for registration tokens
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["verification", "password-reset", "registration"],
    default: "verification",
  },
  // Add userData field to store registration data
  userData: {
    type: Object,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 43200, // Token expires after 12 hours (in seconds)
  },
})

module.exports = mongoose.model("Token", tokenSchema)
*/

const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Make this optional for registration tokens
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["verification", "password-reset", "registration"],
    default: "verification",
  },
  // Add userData field to store registration data
  userData: {
    type: Object,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 43200, // Token expires after 12 hours (in seconds)
  },
})

module.exports = mongoose.model("Token", tokenSchema)
