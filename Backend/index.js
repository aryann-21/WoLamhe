const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const nodemailer = require("nodemailer")
const User = require("./models/user")
const Order = require("./models/order")

// Load environment variables
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5001

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Enhanced CORS configuration
app.use(
  cors({
    origin: "https://wolamhe-4.onrender.com",
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

// User registration route
app.post("/signup", async (req, res) => {
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
    })

    await user.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Registration Error:", error)
    res.status(500).json({ message: "Error registering user", error: error.message })
  }
})

// User login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
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

// Get user data route
app.get("/api/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

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

// Add this route after the "Get user data route" and before the "Create order" route

// Update user information
app.put("/api/users/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

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
      products: parsedProducts, // No need to modify imageUrl, it's already provided by frontend
      total: Number.parseFloat(total),
      deliveryAddress,
      paymentProof, // Directly use the URL sent from frontend
      status: "Processing",
    })

    await order.save()
    console.log("Order saved successfully:", order._id)

    // Send admin email notification
    console.log("Sending email notification...")
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Order Placed",
      html: `<h2>New Order Details</h2>
<p><strong>User:</strong> ${user.name} ${user.phone} ${user.email}</p>
<p><strong>Total:</strong> ₹${total}</p>
<p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
<p><strong>Products:</strong></p>
<ul>
  ${parsedProducts
    .map(
      (p) => `
    <li>
      ${p.name} - <a href="${p.imageUrl}">View Image</a>
      ${p.text ? `<p><strong>Custom Text:</strong> "${p.text}"</p>` : ""}
    </li>
  `,
    )
    .join("")}
</ul>
<p><strong>Payment Proof:</strong> <a href="${paymentProof}">View Image</a></p>`,
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email send error:", err)
      } else {
        console.log("Email sent successfully:", info.response)
      }
    })

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

