import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useUser } from "../context/UserContext"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token)
        console.log("Login Successful")

        setUser({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
        })

        navigate("/")
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed. Please try again.")
    }
  }

  return (
    <div className="bg-[#faf5f0] flex justify-center p-4 mt-[108px]">
      <div className="flex flex-col md:flex-row bg-[#f6f2ea] rounded-lg overflow-hidden shadow-lg w-full max-w-4xl">
        <div className="w-full md:w-1/2 bg-[#e4ccb4] p-6 flex flex-col items-center justify-start text-center pt-10 md:pt-20">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-8 text-black">Log In</h2>
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <div className="mb-4 md:mb-5 relative">
              <span className="absolute left-2 top-2">
                <img src="/src/assets/email.png" alt="Email Icon" className="w-5 md:w-6" />
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
              <span className="absolute left-[11px] top-2">
                <img src="/src/assets/password.png" alt="Password Icon" className="w-4 md:w-5" />
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
              className="bg-[#65350f] text-white px-6 py-2 rounded-full w-full hover:bg-[#875223] transition duration-150"
            >
              Log In
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
          <img src="/src/assets/login.jpg" alt="Photographer" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}

export default LoginPage

