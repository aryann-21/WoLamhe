import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"

const GoogleAuthSuccess = () => {
  const navigate = useNavigate()
  const { fetchUser, user } = useUser()

  useEffect(() => {
    // Log the full URL for debugging
    console.log("GoogleAuthSuccess: window.location:", window.location)
    let token = null
    // Try to get token from search params
    const params = new URLSearchParams(window.location.search)
    token = params.get("token")
    // If not found, try hash fragment (for some OAuth flows)
    if (!token && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, "?"))
      token = hashParams.get("token")
      if (token) {
        console.log("GoogleAuthSuccess: token found in hash fragment:", token)
      }
    }
    console.log("GoogleAuthSuccess: token from URL:", token)
    if (token) {
      // Store token
      localStorage.setItem("token", token)
      // Fetch user info and update context
      fetchUser(token)
        .then(() => {
          console.log("GoogleAuthSuccess: fetchUser resolved, user:", user)
          navigate("/")
        })
        .catch((err) => {
          console.error("GoogleAuthSuccess: fetchUser error:", err)
          navigate("/")
        })
    } else {
      console.warn("GoogleAuthSuccess: No token found in URL, redirecting to /login. Full location:", window.location)
      navigate("/login")
    }
  }, [navigate, fetchUser])

  useEffect(() => {
    console.log("GoogleAuthSuccess: user context changed:", user)
  }, [user])

  return <div>Signing you in with Google...</div>
}

export default GoogleAuthSuccess 