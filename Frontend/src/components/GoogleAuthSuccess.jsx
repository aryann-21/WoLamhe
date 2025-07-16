import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"

const GoogleAuthSuccess = () => {
  const navigate = useNavigate()
  const { fetchUser, user } = useUser()

  useEffect(() => {
    let token = null
    const params = new URLSearchParams(window.location.search)
    token = params.get("token")
    if (!token && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, "?"))
      token = hashParams.get("token")
    }
    if (token) {
      localStorage.setItem("token", token)
      fetchUser(token)
        .then(() => {
          navigate("/")
        })
        .catch(() => {
          navigate("/")
        })
    } else {
      navigate("/login")
    }
  }, [navigate, fetchUser])

  return <div>Signing you in with Google...</div>
}

export default GoogleAuthSuccess 