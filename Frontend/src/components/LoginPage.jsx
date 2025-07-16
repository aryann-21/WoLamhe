"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useUser } from "../context/UserContext"
import LoginPhoto from "../assets/login.jpg"
import EmailIcon from "../assets/email.png"
import PasswordIcon from "../assets/password.png"
import axios from "axios"

const API_BASE_URL = "http://localhost:5001"

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

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
    window.location.href = `${backendUrl}/auth/google`
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
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5">
                <img src={EmailIcon || "/placeholder.svg"} alt="Email Icon" className="w-5 h-5 object-contain" />
              </div>
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
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Link to="/forgot-password" className="ml-auto inline-block text-sm underline text-[#2E2210]">
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5">
                  <img
                    src={PasswordIcon || "/placeholder.svg"}
                    alt="Password Icon"
                    className="w-4 h-4 object-contain"
                  />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#65350f] text-white px-6 py-2 rounded-full w-full hover:bg-[#875223] transition duration-150 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <button
            onClick={handleGoogleLogin}
            className="bg-white text-[#65350f] border border-[#65350f] px-6 py-2 rounded-full w-full mt-4 hover:bg-[#f6e7d8] transition duration-150 flex items-center justify-center gap-2"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.12h12.98c-.56 3.008-2.24 5.552-4.768 7.264v6.032h7.712c4.52-4.168 7.128-10.304 7.128-17.712z" fill="#4285F4"/><path d="M24.48 48c6.48 0 11.92-2.144 15.888-5.824l-7.712-6.032c-2.144 1.44-4.88 2.288-8.176 2.288-6.288 0-11.616-4.248-13.528-9.968H2.56v6.208C6.512 43.888 14.624 48 24.48 48z" fill="#34A853"/><path d="M10.952 28.464A14.98 14.98 0 0 1 9.12 24c0-1.552.272-3.056.768-4.464v-6.208H2.56A23.98 23.98 0 0 0 0 24c0 3.872.928 7.52 2.56 10.672l8.392-6.208z" fill="#FBBC05"/><path d="M24.48 9.52c3.528 0 6.656 1.216 9.136 3.584l6.832-6.832C36.392 2.144 30.96 0 24.48 0 14.624 0 6.512 4.112 2.56 13.328l8.392 6.208c1.912-5.72 7.24-9.968 13.528-9.968z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><path fill="#fff" d="M0 0h48v48H0z"/></clipPath></defs></svg>
            Sign in with Google
          </button>
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
