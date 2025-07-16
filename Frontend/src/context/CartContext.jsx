"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useUser } from "./UserContext"
import axios from "axios"

const CartContext = createContext()

// Create a base URL to use consistently
const API_BASE_URL = "https://wolamhe-3.onrender.com"

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const { user } = useUser()

  // Load cart items when component mounts or user changes
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // If user is logged in, try to fetch cart from server
        try {
          const token = localStorage.getItem("token")
          const response = await axios.get(`${API_BASE_URL}/api/cart`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.data && response.data.items) {
            // If there are items in localStorage, merge them with server items
            const localCart = JSON.parse(localStorage.getItem("cartItems")) || []

            if (localCart.length > 0) {
              // Merge local cart with server cart and update server
              const mergedCart = [...response.data.items, ...localCart]
              setCartItems(mergedCart)

              // Update server with merged cart
              await axios.post(
                `${API_BASE_URL}/api/cart`,
                { items: mergedCart },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              )

              // Clear local storage cart after merging
              localStorage.removeItem("cartItems")
            } else {
              // Just use server cart
              setCartItems(response.data.items)
            }
          } else {
            // No server cart, check if there's a local cart
            const localCart = JSON.parse(localStorage.getItem("cartItems")) || []
            setCartItems(localCart)

            // If local cart exists and user is logged in, save to server
            if (localCart.length > 0) {
              await axios.post(
                `${API_BASE_URL}/api/cart`,
                { items: localCart },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                },
              )
              // Clear local storage cart after saving to server
              localStorage.removeItem("cartItems")
            }
          }
        } catch (error) {
          console.error("Error fetching cart from server:", error)
          // If server fetch fails, fall back to local storage
          const storedCart = JSON.parse(localStorage.getItem("cartItems")) || []
          setCartItems(storedCart)
        }
      } else {
        // If no user is logged in, use localStorage
        const storedCart = JSON.parse(localStorage.getItem("cartItems")) || []
        setCartItems(storedCart)
      }
    }

    loadCart()
  }, [user])

  // Save cart items whenever they change
  useEffect(() => {
    const saveCart = async () => {
      if (user) {
        // If user is logged in, save to server
        try {
          const token = localStorage.getItem("token")
          await axios.post(
            `${API_BASE_URL}/api/cart`,
            { items: cartItems },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          )
        } catch (error) {
          console.error("Error saving cart to server:", error)
          // If server save fails, fall back to local storage
          localStorage.setItem("cartItems", JSON.stringify(cartItems))
        }
      } else {
        // If no user is logged in, use localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
      }
    }

    saveCart()
  }, [cartItems, user])

  const addToCart = (item) => {
    setCartItems((prevCart) => [...prevCart, item])
  }

  const removeFromCart = (itemIndex) => {
    setCartItems((prevCart) => prevCart.filter((_, index) => index !== itemIndex))
  }

  const clearCart = async () => {
    setCartItems([])

    if (user) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`${API_BASE_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error("Error clearing cart on server:", error)
      }
    }

    localStorage.removeItem("cartItems")
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>{children}</CartContext.Provider>
  )
}

export const useCart = () => {
  return useContext(CartContext)
}

export default CartContext
