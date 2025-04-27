"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import LoginPhoto from "../assets/login.jpg"
import PasswordIcon from "../assets/password.png"
import { useUser } from "../context/UserContext"
import axios from "axios"
import { Eye, EyeOff } from "lucide-react"

const API_BASE_URL = "https://wolamhe-3.onrender.com"

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [token, setToken] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [tokenValid, setTokenValid] = useState(false)
  const [tokenChecked, setTokenChecked] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { resetPassword } = useUser()

  useEffect(() => {
    console.log("ResetPassword component mounted")
    console.log("Current location:", location)

    // Clear existing token from localStorage
    localStorage.removeItem("passwordResetToken")

    // Get token from URL search params (query string) - SAME AS VERIFY EMAIL
    const query = new URLSearchParams(location.search)
    const tokenFromQuery = query.get("token")

    console.log("URL search params:", location.search)
    console.log("Extracted token:", tokenFromQuery)

    // Check if we have a token in the query string
    if (tokenFromQuery && tokenFromQuery.length > 0) {
      console.log("Token found in query params:", tokenFromQuery)
      setToken(tokenFromQuery)
      verifyToken(tokenFromQuery)
    } else {
      // No token in URL, user needs to paste it manually
      setTokenChecked(true)
    }
  }, [location])

  const verifyToken = async (tokenToVerify) => {
    if (!tokenToVerify) {
      setError("Invalid token format")
      setTokenChecked(true)
      return
    }

    try {
      console.log("Verifying token:", tokenToVerify)

      // Make API call SIMILAR TO VERIFY EMAIL
      const response = await axios.get(`${API_BASE_URL}/verify-reset-token?token=${tokenToVerify}`)

      console.log("Token verification response:", response)

      if (response.data && response.data.valid) {
        setTokenValid(true)
        setError("")
        // Store valid token for form submission
        localStorage.setItem("passwordResetToken", tokenToVerify)
      } else {
        setError("This password reset link is invalid or has expired. Please request a new one.")
      }
    } catch (error) {
      console.error("Token verification error:", error)

      // Handle error cases
      const errorMessage =
        error.response?.data?.message || "Failed to verify reset token. The link may have expired or is invalid."

      setError(errorMessage)
    } finally {
      setTokenChecked(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Basic validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Submitting reset with token:", token)
      const result = await resetPassword(token, password)

      if (result.success) {
        // Clear the token from localStorage on success
        localStorage.removeItem("passwordResetToken")

        setSuccess(result.message || "Password has been reset successfully!")
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login?reset=success")
        }, 3000)
      } else {
        setError(result.message || "Failed to reset password. Please try again or request a new reset link.")
      }
    } catch (error) {
      console.error("Password reset error:", error)
      setError("An unexpected error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!tokenChecked) {
    return (
      <div className="bg-[#faf5f0] min-h-screen flex justify-center items-center p-4 mt-[108px]">
        <div className="bg-[#f6f2ea] rounded-lg shadow-lg w-full max-w-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65350f] mx-auto mb-4"></div>
          <p className="text-lg">Verifying your reset link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#faf5f0] flex justify-center p-4 mt-[108px]">
      <div className="flex flex-col md:flex-row bg-[#f6f2ea] rounded-lg overflow-hidden shadow-lg w-full max-w-4xl">
        <div className="w-full md:w-1/2 bg-[#e4ccb4] p-6 flex flex-col items-center justify-start text-center pt-10 md:pt-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-black">Reset Password</h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 w-full max-w-sm">{error}</div>}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 w-full max-w-sm">
              {success}
              <p className="mt-2 text-sm">Redirecting to login page...</p>
            </div>
          )}
          {tokenValid && !success && (
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <div className="mb-4 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5">
                  <img
                    src={PasswordIcon || "/placeholder.svg"}
                    alt="Password Icon"
                    className="w-4 h-4 object-contain"
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mb-6 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5">
                  <img
                    src={PasswordIcon || "/placeholder.svg"}
                    alt="Confirm Password Icon"
                    className="w-4 h-4 object-contain"
                  />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#65350f] text-white px-6 py-2 rounded-full w-full hover:bg-[#875223] transition duration-150 disabled:opacity-50"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
          {!tokenValid && !success && (
            <div className="mt-4 w-full max-w-sm">
              <p className="text-sm mb-2">Enter your reset token:</p>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Paste token here"
                  className="flex-1 pl-3 p-2 rounded-l-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <button
                  onClick={() => {
                    if (token && token.length > 10) {
                      verifyToken(token.trim())
                    } else {
                      setError("Please enter a valid token")
                    }
                  }}
                  className="bg-[#65350f] text-white px-4 py-2 rounded-r-full hover:bg-[#875223]"
                >
                  Verify
                </button>
              </div>
            </div>
          )}
          {!tokenValid && !success && (
            <div className="mt-4">
              <Link
                to="/forgot-password"
                className="bg-[#65350f] text-white px-6 py-2 rounded-full hover:bg-[#875223] transition duration-150 inline-block"
              >
                Request New Reset Link
              </Link>
            </div>
          )}
          <div className="mt-6">
            <p className="text-sm text-gray-700">
              Remember your password?{" "}
              <Link to="/login" className="text-[#2E2210] font-semibold underline">
                Log In
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

export default ResetPassword
