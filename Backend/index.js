

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
const sgMail = require("@sendgrid/mail")
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const session = require("express-session")

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
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}))

app.options('*', cors())

// Express-session middleware (must be before passport.session)
app.use(session({
  secret: process.env.SESSION_SECRET || "default_session_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set to true if using HTTPS
}))

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5001/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id })
    if (!user) {
      // Create new user
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        isVerified: true,
        // phone and password can be left blank for Google users
      })
      await user.save()
    }
    return done(null, user)
  } catch (err) {
    return done(err, null)
  }
}))

// Google OAuth routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  if (!req.user) {
    return res.status(500).send("No user found after Google OAuth")
  }
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET || "fallback_secret_key", { expiresIn: "1h" })
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
  res.redirect(`${frontendUrl}/google-auth-success?token=${token}`)
})

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

// Replace the existing signup route with this implementation
app.post("/signup", async (req, res) => {
  try {

    const { name, email, phone, password } = req.body

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Instead of creating a user, store the registration data in a token
    const registrationToken = crypto.randomBytes(20).toString("hex")

    // Store registration data in the token document
    const tokenDoc = new Token({
      token: registrationToken,
      type: "registration", // New token type for registration
      // Store user data in the token document
      userData: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    })

    await tokenDoc.save()

    // Send verification email
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173"

    // Use the token directly for verification
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5001"
    const verificationLink = `${backendUrl}/verify-email?token=${registrationToken}`

    // Send email with the verification link
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
        subject: "Verify Your Email Address",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #65350f;">Welcome to Wolamhe!</h2>
            <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
            <div style="margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background-color: #65350f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p>${verificationLink}</p>
            <p>This link will expire in 12 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
        `,
      }

      await sgMail.send(msg)
    } else {
      console.error("SendGrid API key not configured")
      return res.status(500).json({ message: "Email service not configured" })
    }

    res.status(201).json({
      message: "Please check your email to verify your account and complete registration.",
    })
  } catch (error) {
    console.error("Registration Error:", error)
    res.status(500).json({ message: "Error during registration", error: error.message })
  }
})

// Update the verify-email route to create the user after verification
app.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" })
    }

    // Find the token in the database
    const tokenDoc = await Token.findOne({
      token: token,
    })

    if (!tokenDoc) {
      return res.status(400).json({
        message: "Invalid or expired verification token. Please register again.",
      })
    }

    // Check if this is a registration token
    if (tokenDoc.type === "registration" && tokenDoc.userData) {
      // Create the user from the stored data
      const userData = tokenDoc.userData

      const user = new User({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        isVerified: true, // User is verified from the start
      })

      await user.save()

      // Delete the used token
      await Token.deleteOne({ _id: tokenDoc._id })

      // Redirect to frontend with success message
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
      res.redirect(`${frontendUrl}/login?verified=true`)
      return
    }

    // Handle legacy verification tokens (for backward compatibility)
    if (tokenDoc.type === "verification" && tokenDoc.userId) {
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
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
      res.redirect(`${frontendUrl}/login?verified=true`)
      return
    }

    // If we get here, the token is invalid or of an unknown type
    return res.status(400).json({
      message: "Invalid verification token. Please register again.",
    })
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
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173"
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

// Forgot password route
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return res.status(200).json({
        message: "If your email is registered, you will receive a password reset link shortly.",
      })
    }

    // Delete any existing password reset tokens for this user
    await Token.deleteMany({
      userId: user._id,
      type: "password-reset",
    })

    // Generate a new reset token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // Save the token
    await new Token({
      userId: user._id,
      token: resetToken,
      type: "password-reset",
      // Token expires in 1 hour
      createdAt: Date.now(),
      expires: 3600,
    }).save()

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`

    // Send email with reset link
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      const msg = {
        to: user.email,
        from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
        subject: "Password Reset Request",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #65350f;">Reset Your Password</h2>
            <p>You requested a password reset for your Wolamhe account. Click the button below to set a new password:</p>
            <div style="margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #65350f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
        `,
      }

      await sgMail.send(msg)
    } else {
      console.error("SendGrid API key not configured")
      return res.status(500).json({ message: "Email service not configured" })
    }

    res.status(200).json({
      message: "If your email is registered, you will receive a password reset link shortly.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ message: "Error processing request", error: error.message })
  }
})

// Verify reset token route
app.get("/verify-reset-token", async (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({ message: "Token is required", valid: false })
    }

    // Find the token
    const tokenDoc = await Token.findOne({
      token,
      type: "password-reset",
    })

    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired token", valid: false })
    }

    res.status(200).json({ valid: true })
  } catch (error) {
    console.error("Token verification error:", error)
    res.status(500).json({ message: "Error verifying token", error: error.message, valid: false })
  }
})

// Reset password route
app.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" })
    }

    // Find the token
    const tokenDoc = await Token.findOne({
      token,
      type: "password-reset",
    })

    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    // Find the user
    const user = await User.findById(tokenDoc.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user's password
    user.password = hashedPassword
    await user.save()

    // Delete the used token
    await Token.deleteOne({ _id: tokenDoc._id })

    res.status(200).json({ message: "Password has been reset successfully" })
  } catch (error) {
    console.error("Password reset error:", error)
    res.status(500).json({ message: "Error resetting password", error: error.message })
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

    // Always return id for consistency
    const userObj = user.toObject()
    userObj.id = userObj._id
    delete userObj._id

    res.json(userObj)
  } catch (error) {
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
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" })
    }
    res.status(500).json({ message: "Error updating user", error: error.message })
  }
})

// Create order with Cloudinary and email notifications
app.post("/api/orders", async (req, res) => {
  try {

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

    // Send email notification to admin
    try {
      const nodemailer = require("nodemailer")

      // Create transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

      // Get user details
      const userDetails = await User.findById(userId).select("name email phone")

      // Format products list with links
      const productsList = parsedProducts
        .map((product) => {
          return `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${product.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${product.price}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
              ${product.imageUrl ? `<a href="${product.imageUrl}" target="_blank">View Image</a>` : "No image"}
            </td>
          </tr>
        `
        })
        .join("")

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Order Placed - Order #${order._id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #65350f; text-align: center;">New Order Notification</h2>
            <p>A new order has been placed on your website.</p>
            
            <h3 style="margin-top: 20px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Order Details</h3>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Amount:</strong> ₹${total}</p>
            
            <h3 style="margin-top: 20px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Customer Information</h3>
            <p><strong>Name:</strong> ${userDetails.name}</p>
            <p><strong>Email:</strong> ${userDetails.email}</p>
            <p><strong>Phone:</strong> ${userDetails.phone}</p>
            <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
            
            <h3 style="margin-top: 20px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Products Ordered</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Image Link</th>
                </tr>
              </thead>
              <tbody>
                ${productsList}
              </tbody>
            </table>
            
            <h3 style="margin-top: 20px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Payment Proof</h3>
            <p><a href="${paymentProof}" target="_blank">View Payment Screenshot</a></p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777;">
              <p>This is an automated email notification from your e-commerce system.</p>
            </div>
          </div>
        `,
      }

      // Send email
      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      // Log error but don't fail the order process
      console.error("Error sending admin notification email:", emailError)
    }

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
