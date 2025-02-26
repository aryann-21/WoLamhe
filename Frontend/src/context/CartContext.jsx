import { createContext, useState, useContext, useEffect } from "react"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || []
    setCartItems(storedCart)
  }, [])
  
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])
  
  const addToCart = (item) => {
    setCartItems((prevCart) => [...prevCart, item])
  }
  
  const removeFromCart = (itemIndex) => {
    setCartItems((prevCart) => prevCart.filter((_, index) => index !== itemIndex))
  }
  
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("cartItems")
  }
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  return useContext(CartContext)
}

export default CartContext