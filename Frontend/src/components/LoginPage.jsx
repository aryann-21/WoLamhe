import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext"; // Use the custom hook to access the user context

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser(); // Access setUser from context to update user data

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      

      if (response.data.success || response.status === 200) {
        // Save token to local storage or cookies
        localStorage.setItem("token", response.data.token);
        console.log("Login Successful");

        // Set user information in context
        const userName = response.data.name; // Assuming the backend returns the user's name
        setUser({ name: userName, email: response.data.email }); // Store user info in context

        // Redirect to home page after login
        navigate("/", { state: { name: userName, email: response.data.email } }); // Since user data is now in context, no need to pass state via navigate
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#faf5f0] flex justify-center p-4 mt-[108px]">
      <div className="flex bg-[#f6f2ea] rounded-lg overflow-hidden shadow-lg w-full max-w-4xl h-auto">
        <div className="w-1/2 bg-[#e4ccb4] p-6 flex flex-col items-center justify-start text-center pt-20">
          <h2 className="text-4xl font-extrabold mb-8 text-black">Log In</h2>
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <div className="mb-5 relative">
              <span className="absolute left-2 top-2">
                <img
                  src="/src/assets/email.png"
                  alt="Email Icon"
                  className="w-6"
                />
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
            <div className="mb-8 relative">
              <span className="absolute left-[11px] top-2">
                <img
                  src="/src/assets/password.png"
                  alt="Password Icon"
                  className="w-5"
                />
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
          <p className="mt-8 text-sm text-gray-700">
            Not already a user?{" "}
            <Link to="/signup" className="text-[#2E2210] font-semibold underline">
              Sign Up
            </Link>
          </p>
        </div>
        <div className="w-1/2">
          <img
            src="/src/assets/login.jpg"
            alt="Photographer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
