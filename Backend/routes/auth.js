const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const Token = require("../models/token")
const { sendVerificationEmail } = require("../utils/email-service")

const router = express.Router()

// User registration route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
    })

    await user.save()

    // Send verification email
    const baseUrl = process.env.FRONTEND_URL || "https://wolamhe-4.onrender.com"
    const emailResult = await sendVerificationEmail(user, baseUrl)

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error)
    }

    res.status(201).json({
      message: "User registered successfully. Please check your email to verify your account.",
    })
  } catch (error) {
    console.error("Registration Error:", error)
    res.status(500).json({ message: "Error registering user", error: error.message })
  }
})

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

// User login route - updated to check verification
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in",
        needsVerification: true,
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    })
  } catch (error) {
    console.error("Login Error:", error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
})

module.exports = router
