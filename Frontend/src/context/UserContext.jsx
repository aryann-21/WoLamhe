// src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the UserContext
const UserContext = createContext();

// Create the UserProvider component to wrap your app and provide context values
export const UserProvider = ({ children }) => {
  // Check if there's any user data in localStorage on component mount
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser || null); // Initialize with stored user data or null

  // Set the user info in context and store in localStorage
  const setUserInfo = (userInfo) => {
    setUser(userInfo);
    if (userInfo) {
      localStorage.setItem("user", JSON.stringify(userInfo)); // Store user data in localStorage
    } else {
      localStorage.removeItem("user"); // Remove user data from localStorage if logging out
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext in other components
export const useUser = () => {
  return useContext(UserContext);
};
