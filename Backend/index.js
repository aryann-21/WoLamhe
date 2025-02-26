const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("./models/user")
const Order = require("./models/order")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Load environment variables
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Enhanced CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust to your frontend URL
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
    process.exit(1) // Exit process if DB connection fails
  })

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads")
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"), false)
    }
  },
})

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// User registration route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    })

    await user.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Registration Error:", error)
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    })
  }
})

// User login route with comprehensive error handling
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    // Respond with token and user info
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
    console.error("Login Error Details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    res.status(500).json({
      message: "Internal server error",
      errorDetails: error.message,
    })
  }
})

// Get user data route (requires authentication)
app.get("/api/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
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

// Create order with enhanced logging and error handling
app.post("/api/orders", upload.single("paymentProof"), async (req, res) => {
  console.log("Received order request")
  try {
    const { userId, total, deliveryAddress, products } = req.body
    console.log("Request body:", { userId, total, deliveryAddress, products: JSON.parse(products) })

    // Validate userId
    if (!userId || typeof userId !== "string") {
      console.error("Invalid user ID:", userId)
      return res.status(400).json({ message: "Invalid user ID" })
    }

    let parsedProducts
    try {
      parsedProducts = JSON.parse(products)
      console.log("Parsed products:", parsedProducts)
    } catch (error) {
      console.error("Error parsing products:", error)
      return res.status(400).json({ message: "Invalid products data format" })
    }

    if (!req.file) {
      console.error("No payment proof file uploaded")
      return res.status(400).json({ message: "Payment proof is required" })
    }
    console.log("Payment proof file:", req.file.filename)

    // Use findOne instead of findById to avoid potential casting issues
    const user = await User.findOne({ _id: userId })
    if (!user) {
      console.error("User not found for ID:", userId)
      return res.status(404).json({ message: "User not found" })
    }
    console.log("User found:", user._id)

    const order = new Order({
      user: userId,
      products: parsedProducts,
      total: Number.parseFloat(total),
      deliveryAddress,
      paymentProof: `/uploads/${req.file.filename}`,
      status: "Processing",
    })

    console.log("Order object created:", order)

    await order.save()
    console.log("Order saved successfully")

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
  console.log(`Connected to MongoDB: ${process.env.MONGODB_URI}`)
})

