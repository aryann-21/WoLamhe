"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import LoginPhoto from "../assets/login.jpg"
import EmailIcon from "../assets/email.png"
import { useUser } from "../UserContext" // Import useUser hook

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { forgotPassword } = useUser() // Use the context method

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const result = await forgotPassword(email)
      
      if (result.success) {
        setSuccess(result.message || "Password reset email sent! Please check your inbox.")
        setEmail("")
      } else {
        setError(result.message || "Failed to send reset email. Please try again or contact support.")
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      setError("Failed to send reset email. Please try again or contact support.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#faf5f0] flex justify-center p-4 mt-[108px]">
      <div className="flex flex-col md:flex-row bg-[#f6f2ea] rounded-lg overflow-hidden shadow-lg w-full max-w-4xl">
        <div className="w-full md:w-1/2 bg-[#e4ccb4] p-6 flex flex-col items-center justify-start text-center pt-10 md:pt-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-black">Forgot Password</h2>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 w-full max-w-sm">{error}</div>}

          {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 w-full max-w-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="mb-6 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5">
                <img src={EmailIcon || "/placeholder.svg"} alt="Email Icon" className="w-5 h-5 object-contain" />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#65350f] text-white px-6 py-2 rounded-full w-full hover:bg-[#875223] transition duration-150 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-700">
              Remember your password?{" "}
              <Link to="/login" className="text-[#2E2210] font-semibold underline">
                Log In
              </Link>
            </p>
            <p className="text-sm text-gray-700">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#2E2210] font-semibold underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-48 md:h-auto">
          <img src={LoginPhoto || "/placeholder.svg"} alt="Photographer" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword