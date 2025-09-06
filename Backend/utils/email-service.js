const sgMail = require("@sendgrid/mail")
const Token = require("../models/token")
const crypto = require("crypto")

// Helper function to generate a random token
const generateToken = () => {
  return crypto.randomBytes(20).toString("hex")
}

const sendVerificationEmail = async (user, baseUrl) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      return { success: false, error: "Email service not configured" }
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const token = generateToken()
    await new Token({
      userId: user._id,
      token: token,
      type: "verification",
    }).save()
    const backendUrl = process.env.BACKEND_URL || "https://https://wolamhe-4.onrender.com"
    const verificationLink = `${backendUrl}/verify-email?token=${token}`
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`
    const msg = {
      to: user.email,
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
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

module.exports = {
  sendVerificationEmail,
}
