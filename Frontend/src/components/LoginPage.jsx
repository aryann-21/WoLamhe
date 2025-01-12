import React from "react";

const LoginPage = () => {
  return (
    <div className="bg-[#faf5f0] min-h-screen flex items-center justify-center">
      {/* Outer Container */}
      <div className="flex bg-[#f6f2ea] rounded-lg overflow-hidden shadow-lg w-4/5 max-w-5xl h-96">
        {/* Left Section */}
        <div className="w-1/2 bg-[#e4ccb4] p-6 flex flex-col items-center justify-center text-center">
          {/* Wo Lamhe Logo */}
          <img 
            src="/src/assets/footer.png" // Replace with the actual path to your Wo Lamhe logo image
            alt="Wo Lamhe Logo"
            className="h-16 mb-4"
          />

          <h2 className="text-2xl font-bold mb-4 text-black">Log In</h2>
          <form className="w-full max-w-sm">
            {/* Input: Email/Username */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Email or Username"
                className="w-full p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Input: Password */}
            <div className="mb-5">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#2E2210] text-white px-6 py-2 rounded-full w-full hover:bg-[#65350f] transition duration-300"
            >
              Log In
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="w-1/2">
          <img
            src="/src/assets/login.jpg" // Replace with your login background image path
            alt="Photographer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
