"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

// Create a base URL to use consistently
const API_BASE_URL = "http://localhost:5000"

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
        console.error("Failed to parse user from localStorage:", error)
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      setUser(response.data)
      localStorage.setItem("user", JSON.stringify(response.data)) // Sync user to localStorage
    } catch (error) {
      console.error("Error fetching user:", error.message)
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
        message: "Signup successful! Please login."
      }
    } catch (error) {
      console.error("Signup Error:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed. Please try again."
      }
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      const { token, user } = response.data;
  
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Store user in localStorage
      setUser(user);
  
      return { success: true, user };
    } catch (error) {
      console.error("Login Error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "An unexpected error occurred. Please try again."
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")  // Ensure user data is removed
    setUser(null)
  }

  const updateUser = async (updatedData) => {
    try {
      const token = localStorage.getItem("token")
      if (!token || !user?.id) {
        throw new Error('No authentication token or user ID found')
      }

      const response = await axios.put(`${API_BASE_URL}/api/users/${user.id}`, updatedData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      setUser(response.data)
      localStorage.setItem("user", JSON.stringify(response.data)) // Sync updated user to localStorage
      return {
        success: true,
        user: response.data
      }
    } catch (error) {
      console.error("Error updating user:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update user information"
      }
    }
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      signup,
      updateUser,
      fetchUser,
      isAuthenticated: !!user
    }}>
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
