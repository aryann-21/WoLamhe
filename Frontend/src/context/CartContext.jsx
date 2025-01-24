import React, { createContext, useState, useContext, useEffect } from "react";

// Create the CartContext
const CartContext = createContext();

// CartProvider to wrap the app and provide cart data
export const CartProvider = ({ children }) => {
  const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
  const [cartItems, setCartItems] = useState(storedCart);

  // Sync cart data with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevCart) => [...prevCart, item]);
  };

  // Remove item from cart
  const removeFromCart = (itemIndex) => {
    setCartItems((prevCart) => prevCart.filter((_, index) => index !== itemIndex));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart context
export const useCart = () => {
  return useContext(CartContext);
};
