"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

// Create a base URL to use consistently
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://wolamhe-4.onrender.com"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const fetchUser = async (token) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      setUser({
        ...response.data,
        id: response.data.id || response.data._id,
      })
      localStorage.setItem("user", JSON.stringify({
        ...response.data,
        id: response.data.id || response.data._id,
      }))
    } catch (error) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, userData)
      return {
        success: true,
        message: response.data.message || "Signup successful! Please check your email to verify your account.",
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed. Please try again.",
      }
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user)) // Store user in localStorage
      setUser(user)

      return { success: true, user }
    } catch (error) {
      // Check if this is a verification error
      if (error.response?.status === 401 && error.response?.data?.needsVerification) {
        return {
          success: false,
          needsVerification: true,
          message: error.response.data.message || "Please verify your email before logging in.",
        }
      }

      return {
        success: false,
        message: error.response?.data?.message || "An unexpected error occurred. Please try again.",
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("cartItems")
    setUser(null)
  }

  const updateUser = async (updatedData) => {
    try {
      const token = localStorage.getItem("token")
      if (!token || !user?.id) {
        throw new Error("No authentication token or user ID found")
      }

      const response = await axios.put(`${API_BASE_URL}/api/users/${user.id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      setUser(response.data)
      localStorage.setItem("user", JSON.stringify(response.data)) // Sync updated user to localStorage
      return {
        success: true,
        user: response.data,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update user information",
      }
    }
  }

// Method for requesting password reset
const forgotPassword = async (email) => {
  try {
    // Send a normal POST request without any special headers
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email })
    return {
      success: true,
      message:
        response.data.message || "If your email is registered, you will receive a password reset link shortly.",
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to process your request. Please try again later.",
    }
  }
}

  // Method for resetting password with token
  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, { token, password })
      return {
        success: true,
        message: response.data.message || "Password has been reset successfully!",
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to reset password. The link may have expired or is invalid.",
      }
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        updateUser,
        fetchUser,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export default UserContext