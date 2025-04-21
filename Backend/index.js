const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const User = require("./models/user")
const Order = require("./models/order")
const Token = require("./models/token")
const { sendVerificationEmail } = require("./utils/email-service")
const crypto = require("crypto")

// Load environment variables
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5001

// Cloudinary configuration (if available)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

// CORS configuration - UPDATED to be more permissive
app.use(
  cors({
    origin: "*", // Allow all origins for now (you can restrict this later)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection with improved error handling
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err)
    process.exit(1)
  })

// Configure multer for file uploads (temporary storage before Cloudinary upload)
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"), false)
    }
  },
})

// Helper function to upload images to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) =>
      error ? reject(error) : resolve(result.secure_url),
    )
    uploadStream.end(fileBuffer)
  })
}

// Test route to check if server is running
app.get("/", (req, res) => {
  res.send("Server is running correctly!")
})

// User registration route with email verification
app.post("/signup", async (req, res) => {
  try {
    console.log("Signup request received:", req.body)

    const { name, email, phone, password } = req.body

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

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
      isVerified: false, // User starts as unverified
    })

    await user.save()
    console.log("User registered successfully:", user._id)

    // Send verification email
    const baseUrl = process.env.FRONTEND_URL || "https://wolamhe-4.onrender.com"
    const emailResult = await sendVerificationEmail(user, baseUrl)

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error)
      return res.status(201).json({
        message: "User registered, but we couldn't send a verification email. Please contact support.",
      })
    }

    res.status(201).json({
      message: "User registered successfully! Please check your email to verify your account.",
    })
  } catch (error) {
    console.error("Registration Error:", error)
    res.status(500).json({ message: "Error registering user", error: error.message })
  }
})

// Email verification route
a// Email verification route
app.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query
    console.log("Received verification request with token:", token)

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" })
    }

    // Find the token in the database
    const tokenDoc = await Token.findOne({
      token: token,
      type: "verification",
    })

    if (!tokenDoc) {
      console.log("Token not found in database:", token)
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
    console.log("User verified successfully:", user.email)

    // Delete the used token
    await Token.deleteOne({ _id: tokenDoc._id })

    // Redirect to frontend with success message
    const frontendUrl = process.env.FRONTEND_URL || "https://wolamhe-4.onrender.com"
    res.redirect(`${frontendUrl}/login?verified=true`)
  } catch (error) {
    console.error("Verification Error:", error)
    res.status(500).json({ message: "Error verifying email", error: error.message })
  }
})

// Resend verification email
app.post("/resend-verification", async (req, res) => {
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

// User login route with verification check
app.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body)

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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback_secret_key", { expiresIn: "1h" })

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

// Get user data route
app.get("/api/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key")
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("User Fetch Error:", error)
    res.status(401).json({ message: "Invalid token" })
  }
})

// Update user information
app.put("/api/users/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key")

    // Ensure the user is updating their own profile
    if (decoded.userId !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized to update this user" })
    }

    const updates = req.body
    const allowedUpdates = ["name", "email", "phone"]

    // Filter out any fields that shouldn't be updated
    const sanitizedUpdates = Object.keys(updates)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {})

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(decoded.userId, sanitizedUpdates, {
      new: true,
      runValidators: true,
    }).select("-password")

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    })
  } catch (error) {
    console.error("User Update Error:", error)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" })
    }
    res.status(500).json({ message: "Error updating user", error: error.message })
  }
})

// Create order with Cloudinary and email notifications
app.post("/api/orders", async (req, res) => {
  try {
    console.log("Incoming Order Data:", req.body)

    const { userId, total, deliveryAddress, paymentProof, products } = req.body

    if (!userId || !total || !deliveryAddress || !products || !paymentProof) {
      return res.status(400).json({ message: "Missing required order details" })
    }

    // Ensure products is an array
    const parsedProducts = Array.isArray(products) ? products : JSON.parse(products)

    // Verify user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    console.log("User found:", user.email)

    // Save order to DB
    const order = new Order({
      user: userId,
      products: parsedProducts,
      total: Number.parseFloat(total),
      deliveryAddress,
      paymentProof,
      status: "Processing",
    })

    await order.save()
    console.log("Order saved successfully:", order._id)

    res.status(201).json({ message: "Order placed successfully", orderId: order._id })
  } catch (error) {
    console.error("Order Creation Error:", error)
    res.status(500).json({ message: "Error placing order", error: error.message })
  }
})

// Get user orders
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ message: "Error fetching orders", error: error.message })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
