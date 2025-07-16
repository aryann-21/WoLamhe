"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Define API_BASE_URL directly instead of importing from config
const API_BASE_URL = "https://wolamhe-4.onrender.com";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const verified = query.get("verified");
    if (verified === "true") {
      setStatus("success");
      return;
    }
    if (token && token.length > 0) {
      verifyEmail(token);
    } else {
      setStatus("needsToken");
      setMessage("Please enter your email to receive a verification link.");
    }
  }, [location]);

  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/verify-email?token=${token}`
      );
      setStatus("success");
      setTimeout(() => {
        navigate("/login?verified=true");
      }, 3000);
    } catch (error) {
      setStatus("error");
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    try {
      setStatus("sending");
      const response = await axios.post(`${API_BASE_URL}/resend-verification`, {
        email,
      });
      setStatus("resent");
      setMessage(
        "Verification email has been resent. Please check your inbox."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to resend verification email. Please try again later."
      );
      setStatus("error");
    }
  };

  return (
    <div className="bg-[#faf5f0] min-h-screen flex justify-center items-center p-4 mt-[108px]">
      <div className="bg-[#f6f2ea] rounded-lg shadow-lg w-full max-w-md p-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-[#2E2210]">
          Email Verification
        </h2>

        {status === "verifying" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65350f] mx-auto mb-4"></div>
            <p className="text-lg">Verifying your email address...</p>
          </div>
        )}

        {status === "needsToken" && (
          <div className="text-center">
            <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-6">
              <p className="text-lg font-semibold">
                Verification Link Required
              </p>
              <p className="mt-2">{message}</p>
            </div>

            <div className="mt-6">
              <p className="mb-4">Need a verification link?</p>
              <form onSubmit={handleResendVerification} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded-full bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#65350f]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#65350f] text-white px-6 py-2 rounded-full w-full hover:bg-[#875223] transition duration-300"
                >
                  Send Verification Email
                </button>
              </form>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
              <p className="text-lg font-semibold">
                Email verified successfully!
              </p>
              <p className="mt-2">
                You will be redirected to the login page shortly.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#65350f] text-white px-6 py-2 rounded-full hover:bg-[#875223] transition duration-300"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              <p className="text-lg font-semibold">Verification Failed</p>
              <p className="mt-2">{message}</p>
            </div>

            <div className="mt-6">
              <p className="mb-4">Need a new verification link?</p>
              <form onSubmit={handleResendVerification} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded-full bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#65350f]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#65350f] text-white px-6 py-2 rounded-full w-full hover:bg-[#875223] transition duration-300"
                >
                  Resend Verification Email
                </button>
              </form>
            </div>
          </div>
        )}

        {status === "sending" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#65350f] mx-auto mb-4"></div>
            <p className="text-lg">Sending verification email...</p>
          </div>
        )}

        {status === "resent" && (
          <div className="text-center">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
              <p className="text-lg font-semibold">Verification Email Sent!</p>
              <p className="mt-2">{message}</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#65350f] text-white px-6 py-2 rounded-full hover:bg-[#875223] transition duration-300 mt-4"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
