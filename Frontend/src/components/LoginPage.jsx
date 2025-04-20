"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useUser } from "../context/UserContext"
import LoginPhoto from "../assets/login.jpg"
import EmailIcon from "../assets/email.png"
import PasswordIcon from "../assets/password.png"
import axios from "axios"

const API_BASE_URL = "https://wolamhe-3.onrender.com"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [needsVerification, setNeedsVerification] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useUser()

  useEffect(() => {
    // Check if user just verified their email
    const query = new URLSearchParams(location.search)
    const verified = query.get("verified")

    if (verified === "true") {
      setSuccessMessage("Your email has been verified successfully! You can now log in.")
    }
  }, [location])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setNeedsVerification(false)

    try {
      const result = await login(email, password)
      if (result.success) {
        navigate("/")
      } else {
        if (result.message && result.message.includes("verify your email")) {
          setNeedsVerification(true)
        } else {
          setError(result.message)
        }
      }
    } catch (error) {
      console.error("Login failed:", error)
      setError("An unexpected error occurred. Please try again.")
    }
  }

  const handleResendVerification = async () => {
    try {
      setResendingEmail(true)
      const response = await axios.post(`${API_BASE_URL}/resend-verification`, { email })
      setSuccessMessage("Verification email has been resent. Please check your inbox.")
      setNeedsVerification(false)
    } catch (error) {
      console.error("Failed to resend verification email:", error)
      setError(error.response?.data?.message || "Failed to resend verification email. Please try again.")
    } finally {
      setResendingEmail(false)
    }
  }

  return (
    <div className="bg-[#faf5f0] flex justify-center p-4 mt-[108px]">
      <div className="flex flex-col md:flex-row bg-[#f6f2ea] rounded-lg overflow-hidden shadow-lg w-full max-w-4xl">
        <div className="w-full md:w-1/2 bg-[#e4ccb4] p-6 flex flex-col items-center justify-start text-center pt-10 md:pt-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-black">Log In</h2>

          {successMessage && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 w-full max-w-sm">{successMessage}</div>
          )}

          {error && !needsVerification && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 w-full max-w-sm">{error}</div>
          )}

          {needsVerification && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-4 w-full max-w-sm">
              <p className="mb-2">Your email is not verified. Please check your inbox for the verification link.</p>
              <button
                onClick={handleResendVerification}
                disabled={resendingEmail}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {resendingEmail ? "Sending..." : "Resend verification email"}
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <div className="mb-4 md:mb-5 relative">
              <span className="absolute left-2 top-2">
                <img src={EmailIcon || "/placeholder.svg"} alt="Email Icon" className="w-5 md:w-6" />
              </span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
            <div className="mb-6 md:mb-8 relative">
              <div className="flex items-center">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Link to="/forgot-password" className="ml-auto inline-block text-sm underline text-[#2E2210]">
                  Forgot your password?
                </Link>
              </div>
              <span className="absolute left-[11px] top-2">
                <img src={PasswordIcon || "/placeholder.svg"} alt="Password Icon" className="w-4 md:w-5" />
              </span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#65350f] text-white px-6 py-2 rounded-full w-full hover:bg-[#875223] transition duration-150 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <p className="mt-6 md:mt-8 text-sm text-gray-700">
            Not already a user?{" "}
            <Link to="/signup" className="text-[#2E2210] font-semibold underline">
              Sign Up
            </Link>
          </p>
        </div>
        <div className="w-full md:w-1/2 h-48 md:h-auto">
          <img src={LoginPhoto || "/placeholder.svg"} alt="Photographer" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
