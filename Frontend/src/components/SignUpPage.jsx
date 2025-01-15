import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    // Add your signup logic here
    navigate("/login"); // Redirect to login page after signing up
  };

  return (
    <div className="bg-[#faf5f0] flex justify-center p-4">
      {/* Outer Container */}
      <div className="flex bg-[#f6f2ea] rounded-lg overflow-hidden shadow-lg w-full max-w-4xl h-auto">
        {/* Left Section */}
        <div className="w-1/2 bg-[#e4ccb4] p-6 flex flex-col items-center justify-start text-center pt-12">
          <h2 className="text-4xl font-extrabold mb-6 text-black">Sign Up</h2>
          <form onSubmit={handleSignUp} className="w-full max-w-sm">
            {/* Input: Name */}
            <div className="mb-3 relative">
              <span className="absolute left-3 top-[11px]">
                <img src="/src/assets/user.png" alt="User Icon" className="w-4" />
              </span>
              <input
                type="text"
                placeholder="Name"
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Input: Email */}
            <div className="mb-3 relative">
              <span className="absolute left-2 top-2">
                <img src="/src/assets/email.png" alt="Email Icon" className="w-6" />
              </span>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Input: Phone */}
            <div className="mb-3 relative">
              <span className="absolute left-3 top-[12px]">
                <img src="/src/assets/phone.png" alt="Phone Icon" className="w-4" />
              </span>
              <input
                type="tel"
                placeholder="Phone"
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Input: Password */}
            <div className="mb-3 relative">
              <span className="absolute left-[10px] top-[8px]">
                <img src="/src/assets/password.png" alt="Password Icon" className="w-5" />
              </span>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Input: Confirm Password */}
            <div className="mb-5 relative">
              <span className="absolute left-[9px] top-[10px]">
                <img src="/src/assets/confirm.png" alt="Confirm Password Icon" className="w-6" />
              </span>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#65350f] text-white px-6 py-2 rounded-full w-full hover:bg-[#875223] transition duration-300"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-8 text-sm text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-[#2E2210] font-semibold underline">
              Log In
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

export default SignUpPage;