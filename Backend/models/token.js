const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["verification", "password-reset"],
    default: "verification",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 43200, // Token expires after 12 hours (in seconds)
  },
})

module.exports = mongoose.model("Token", tokenSchema)
