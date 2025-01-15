// src/context/UserContext.jsx
import React, { createContext, useState, useContext } from "react";

// Create the UserContext
const UserContext = createContext();

// Create the UserProvider component to wrap your app and provide context values
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize with no user

  // Set the user info in context
  const setUserInfo = (userInfo) => {
    setUser(userInfo);
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
