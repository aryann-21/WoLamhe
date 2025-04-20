const express = require("express")
const crypto = require("crypto")
const User = require("../models/user")
const Token = require("../models/token")
const { sendVerificationEmail } = require("../utils/email-service")

const router = express.Router()

// Email verification route
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" })
    }

    // Find the token in the database
    const tokenDoc = await Token.findOne({
      token: token,
      type: "verification",
    })

    if (!tokenDoc) {
      return res.status(400).json({
        message: "Invalid or expired verification token. Please request a new verification email.",
      })
    }

    // Find and update the user
    const user = await User.findById(tokenDoc.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user verification status
    user.isVerified = true
    await user.save()

    // Delete the used token
    await Token.deleteOne({ _id: tokenDoc._id })

    // Redirect to frontend with success message
    res.redirect(`${process.env.FRONTEND_URL || "https://wolamhe-4.onrender.com"}/login?verified=true`)
  } catch (error) {
    console.error("Verification Error:", error)
    res.status(500).json({ message: "Error verifying email", error: error.message })
  }
})

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" })
    }

    // Delete any existing verification tokens for this user
    await Token.deleteMany({
      userId: user._id,
      type: "verification",
    })

    // Send new verification email
    const baseUrl = process.env.FRONTEND_URL || "https://wolamhe-4.onrender.com"
    const emailResult = await sendVerificationEmail(user, baseUrl)

    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send verification email" })
    }

    res.status(200).json({ message: "Verification email sent successfully" })
  } catch (error) {
    console.error("Resend Verification Error:", error)
    res.status(500).json({ message: "Error resending verification email", error: error.message })
  }
})

module.exports = router
