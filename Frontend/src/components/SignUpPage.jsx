import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        phone,
        password,
      });

      if (response.data.success || response.status === 201) {
        console.log("Sign Up Successful! Please log in.");
        navigate("/login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Sign Up failed:", error);
      alert("Sign Up failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#faf5f0] flex justify-center p-4">
      <div className="flex bg-[#f6f2ea] rounded-lg overflow-hidden shadow-lg w-full max-w-4xl h-auto">
        <div className="w-1/2 bg-[#e4ccb4] p-6 flex flex-col items-center justify-start text-center pt-12">
          <h2 className="text-4xl font-extrabold mb-6 text-black">Sign Up</h2>
          <form onSubmit={handleSignUp} className="w-full max-w-sm">
            <div className="mb-3 relative">
              <span className="absolute left-3 top-[11px]">
                <img src="/src/assets/user.png" alt="User Icon" className="w-4" />
              </span>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
            <div className="mb-3 relative">
              <span className="absolute left-2 top-2">
                <img src="/src/assets/email.png" alt="Email Icon" className="w-6" />
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
            <div className="mb-3 relative">
              <span className="absolute left-3 top-[12px]">
                <img src="/src/assets/phone.png" alt="Phone Icon" className="w-4" />
              </span>
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
            <div className="mb-3 relative">
              <span className="absolute left-[10px] top-[8px]">
                <img src="/src/assets/password.png" alt="Password Icon" className="w-5" />
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
            <div className="mb-5 relative">
              <span className="absolute left-[9px] top-[10px]">
                <img src="/src/assets/confirm.png" alt="Confirm Password Icon" className="w-6" />
              </span>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 p-2 rounded-full bg-[#2E2210] text-white placeholder-gray-400 focus:outline-none"
                required
              />
            </div>
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

export default SignUpPage;
