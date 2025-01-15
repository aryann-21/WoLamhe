import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="bg-[#faf5f0] flex justify-center p-4">
      {/* Outer Container */}
      <div className="flex bg-[#f6f2ea] rounded-lg overflow-hidden shadow-lg w-full max-w-4xl h-auto">
        {/* Left Section */}
        <div className="w-1/2 bg-[#e4ccb4] p-6 flex flex-col items-center justify-start text-center pt-20">
          <h2 className="text-4xl font-extrabold mb-8 text-black">Log In</h2>
          <form className="w-full max-w-sm">
            {/* Input: Email/Username */}
            <div className="mb-5 relative">
              <span className="absolute left-2 top-2">
                <img
                  src="/src/assets/email.png" // Replace with actual path
                  alt="Email Icon"
                  className="w-6"
                />
              </span>
              <input
                type="text"
                placeholder="Email"
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Input: Password */}
            <div className="mb-8 relative">
              <span className="absolute left-[11px] top-2">
                <img
                  src="/src/assets/password.png" // Replace with actual path
                  alt="Password Icon"
                  className="w-5"
                />
              </span>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Submit Button */}
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
        {/* Right Section */}
        <div className="w-1/2">
          <img
            src="/src/assets/login.jpg" // Replace with actual path
            alt="Photographer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;