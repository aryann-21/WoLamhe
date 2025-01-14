import React from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    // Add your signup logic here
    navigate("/login"); // Redirect to login page after signing up
  };

  return (
    <div className="bg-[#faf5f0] min-h-screen flex items-center justify-center p-4">
      {/* Outer Container */}
      <div className="flex bg-[#f6f2ea] rounded-lg overflow-hidden shadow-lg w-full max-w-4xl h-auto my-8">
        {/* Left Section */}
        <div className="w-1/2 bg-[#e4ccb4] p-6 flex flex-col items-center justify-start text-center pt-12">
          <h2 className="text-4xl font-extrabold mb-6 text-black">Sign Up</h2>
          <form onSubmit={handleSignUp} className="w-full max-w-sm">
            {/* Input: Name */}
            <div className="mb-3 relative">
              <span className="absolute left-3 top-2">
                <img src="/src/assets/user.png" alt="User Icon" className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Name"
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Input: Email */}
            <div className="mb-3 relative">
              <span className="absolute left-3 top-2">
                <img src="/src/assets/email.png" alt="Email Icon" className="h-5 w-5" />
              </span>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Input: Phone */}
            <div className="mb-3 relative">
              <span className="absolute left-3 top-2">
                <img src="/src/assets/phone.png" alt="Phone Icon" className="h-5 w-5" />
              </span>
              <input
                type="tel"
                placeholder="Phone"
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Input: Password */}
            <div className="mb-3 relative">
              <span className="absolute left-3 top-2">
                <img src="/src/assets/password.png" alt="Password Icon" className="h-5 w-5" />
              </span>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Input: Confirm Password */}
            <div className="mb-5 relative">
              <span className="absolute left-3 top-2">
                <img src="/src/assets/confirm.png" alt="Confirm Password Icon" className="h-5 w-5" />
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
              className="bg-[#2E2210] text-white px-6 py-2 rounded-full w-full hover:bg-[#65350f] transition duration-300"
            >
              Sign Up
            </button>
          </form>
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
