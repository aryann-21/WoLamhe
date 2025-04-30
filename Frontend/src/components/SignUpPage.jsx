"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
import SignupPhoto from "../assets/login.jpg"
import UserIcon from "../assets/user.png"
import EmailIcon from "../assets/email.png"
import PhoneIcon from "../assets/phone.png"
import PasswordIcon from "../assets/password.png"

const SignUpPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { signup, loading } = useUser()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    // Basic validation
    if (!name || !email || !phone || !password) {
      setError("All fields are required")
      setIsSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      setIsSubmitting(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Submitting signup form with data:", { name, email, phone })
      const result = await signup({
        name,
        email,
        phone,
        password,
      })

      if (result.success) {
        setSuccess(
          result.message ||
            "Woohoo! Email verification on its way! 🚀 It might be taking a coffee break in your spam folder, so peek there too if you don't see it soon. The internet can be a maze sometimes! ✉️",
        )
        // Clear form
        setName("")
        setEmail("")
        setPhone("")
        setPassword("")
        setConfirmPassword("")

        // Don't navigate immediately, let the user see the success message
        setTimeout(() => {
          navigate("/login")
        }, 5000)
      } else {
        setError(result.message || "Signup failed. Please try again.")
      }
    } catch (error) {
      console.error("Sign Up failed:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#faf5f0] flex justify-center p-4 mt-[108px]">
      <div className="flex flex-col md:flex-row bg-[#f6f2ea] rounded-lg overflow-hidden shadow-lg w-full max-w-4xl">
        <div className="w-full md:w-1/2 bg-[#e4ccb4] p-6 flex flex-col items-center justify-start text-center pt-8 md:pt-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 md:mb-6 text-black">Sign Up</h2>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 w-full max-w-sm">{error}</div>}

          {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 w-full max-w-sm">{success}</div>}

          <form onSubmit={handleSignUp} className="w-full max-w-sm">
            <div className="mb-3 relative">
              <span className="absolute left-3 top-[11px]">
                <img src={UserIcon || "/placeholder.svg"} alt="User Icon" className="w-4" />
              </span>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
            <div className="mb-3 relative">
              <span className="absolute left-2 top-2">
                <img src={EmailIcon || "/placeholder.svg"} alt="Email Icon" className="w-6" />
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
            <div className="mb-3 relative">
              <span className="absolute left-3 top-[12px]">
                <img src={PhoneIcon || "/placeholder.svg"} alt="Phone Icon" className="w-4" />
              </span>
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
            <div className="mb-3 relative">
              <span className="absolute left-[10px] top-[8px]">
                <img src={PasswordIcon || "/placeholder.svg"} alt="Password Icon" className="w-5" />
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
            <div className="mb-5 relative">
              <span className="absolute left-[10px] top-[8px]">
                <img src={PasswordIcon || "/placeholder.svg"} alt="Confirm Password Icon" className="w-5" />
              </span>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="bg-[#65350f] text-white px-6 py-2 rounded-full w-full hover:bg-[#875223] transition duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-6 md:mt-8 text-sm text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-[#2E2210] font-semibold underline">
              Log In
            </Link>
          </p>
        </div>
        <div className="w-full md:w-1/2 h-48 md:h-auto">
          <img src={SignupPhoto || "/placeholder.svg"} alt="Photographer" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
