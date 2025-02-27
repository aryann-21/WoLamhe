"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { Trash2, Copy } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrderPage = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Just use user from context, don't try to modify it here
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([
    "Mega Boys Hostel",
    "Mega Girls Hostel",
  ]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const upiId = "dpsingh05656-1@okhdfcbank";

  useEffect(() => {
    // Simply check if we have user data and set loading to false
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      // Don't try to set user data here, just use what's in context
      // Instead just finish loading
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "WoLamhePresets"); // Replace with your Cloudinary preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duwjb0moz/image/upload", // Replace 'your_cloud_name'
        formData
      );
      return response.data.secure_url; // Return the Cloudinary image URL
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      toast.error("Failed to upload image. Please try again.");
      return null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      // Revoke the previous object URL before setting a new one
      if (paymentScreenshot?.preview) {
        URL.revokeObjectURL(paymentScreenshot.preview);
      }

      setPaymentScreenshot({ file, preview: previewUrl });
      toast.success("Payment screenshot uploaded successfully");
    }
  };

  const handleRemoveItem = (index) => {
    removeFromCart(index);
    toast.success("Item removed from cart");
  };

  const handleAddAddress = () => {
    if (address.trim()) {
      setSavedAddresses([...savedAddresses, address.trim()]);
      setSelectedAddress(address.trim());
      setAddress("");
      toast.success("New address added");
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    let polaroidCount = 0;

    cartItems.forEach((item) => {
      if (item.type === "preset" && item.name.includes("Polaroids set")) {
        total += item.price || 0;
      } else if (item.type === "uploaded" && item.name.includes("Polaroid")) {
        polaroidCount++;
      } else {
        total += item.price || 0;
      }
    });

    // Apply discounts for uploaded Polaroids
    if (polaroidCount >= 25) {
      total += polaroidCount * 16;
    } else if (polaroidCount >= 15) {
      total += polaroidCount * 17;
    } else if (polaroidCount >= 6) {
      total += polaroidCount * 19 - 19; // Buy 6 get 1 free
    } else {
      total += polaroidCount * 19;
    }

    return total;
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      if (!user || !user.id) {
        toast.error("Please login to place an order");
        return;
      }
      if (cartItems.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }
      if (!selectedAddress) {
        toast.error("Please select a delivery address.");
        return;
      }
      if (!paymentScreenshot) {
        toast.error("Please upload a payment screenshot.");
        return;
      }

      // Upload payment screenshot
      const paymentProofUrl = await uploadToCloudinary(paymentScreenshot.file);
      if (!paymentProofUrl) {
        toast.error("Failed to upload payment proof.");
        setIsProcessing(false);
        return;
      }

      // Upload product images
      const productImageUrls = await Promise.all(
        cartItems.map(async (item) => {
          if (item.imageFile) {
            return await uploadToCloudinary(item.imageFile);
          }
          return item.image || null;
        })
      );

      // Order data
      const orderData = {
        userId: user.id,
        total: calculateTotalPrice(),
        deliveryAddress: selectedAddress,
        paymentProof: paymentProofUrl,
        products: cartItems.map((item, index) => ({
          name: item.name,
          price: item.price,
          type: item.type,
          text: item.text || "",
          imageUrl: productImageUrls[index],
        })),
      };

      console.log("Payment Proof URL:", paymentProofUrl);
      console.log("Product Image URLs:", productImageUrls);
      console.log("Final Order Data:", orderData);

      // Send order to backend
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Order placed successfully!");
      clearCart();
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard
      .writeText(upiId)
      .then(() => toast.success("UPI ID copied to clipboard!"))
      .catch(() => toast.error("Failed to copy UPI ID"));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6F0] p-6 mt-[108px] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6F0] p-6 mt-[108px]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#FDF6F0",
            color: "#2E2210",
            border: "1px solid #C4A381",
          },
        }}
      />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2E2210] mb-8">Your Order</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section: Order Summary */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-[#2E2210] mb-4">
              Order Summary
            </h2>
            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#eee1cf] rounded-lg p-4 flex flex-col items-center"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <div className="space-y-1 w-full">
                      <p className="text-sm text-center text-[#2E2210] font-medium">
                        {item.type === "preset" ? (
                          <>
                            <span className="block">Type: Preset Image</span>
                            <span className="block text-xs mt-1">
                              {item.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="block">Type: Custom Upload</span>
                            <span className="block text-xs mt-1">
                              {item.text || "No custom text added"}
                            </span>
                          </>
                        )}
                      </p>
                      <p className="text-sm text-center text-[#2E2210]">
                        Price: ₹{item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="mt-3 flex items-center justify-center w-full bg-[#caac80] text-[#2E2210] rounded-md py-1 px-2 hover:bg-[#a58049] transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Your cart is empty.
              </p>
            )}
            <div className="mt-6 text-right">
              <p className="text-xl font-semibold text-[#2E2210]">
                Total: ₹{calculateTotalPrice()}
              </p>
            </div>
          </div>

          {/* Right Section: Checkout Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-[#2E2210] mb-4">
              Checkout
            </h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-[#2E2210]">
                User Information
              </h3>
              <p className="text-gray-600">Name: {user?.name || "Guest"}</p>
              <p className="text-gray-600">
                Phone: {user?.phone || "Not provided"}
              </p>
              <p className="text-gray-600">
                Email: {user?.email || "Not provided"}
              </p>
            </div>

            {/* Address Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-[#2E2210]">
                Delivery Address
              </h3>
              {savedAddresses.map((addr, index) => (
                <label key={index} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="address"
                    value={addr}
                    checked={selectedAddress === addr}
                    onChange={() => setSelectedAddress(addr)}
                    className="mr-2"
                  />
                  <span className="text-gray-600">{addr}</span>
                </label>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  className="mt-2 flex-1 p-2 border border-gray-300 rounded"
                  placeholder="Add new address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddAddress()}
                />
                <button
                  onClick={handleAddAddress}
                  className="mt-2 px-4 py-2 bg-[#C4A381] text-white rounded hover:bg-[#af8a6c] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Payment Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-[#2E2210]">
                Payment
              </h3>
              <div className="bg-[#eee1cf] p-4 rounded-lg mb-4">
                <p className="text-sm font-medium text-[#2E2210] mb-2">
                  UPI ID for Payment:
                </p>
                <div className="flex items-center justify-between bg-white p-2 rounded">
                  <span className="text-gray-700">{upiId}</span>
                  <button
                    onClick={copyUpiId}
                    className="text-[#C4A381] hover:text-[#a58049]"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                {paymentScreenshot ? (
                  <div className="relative">
                    <img
                      src={paymentScreenshot?.preview || "/placeholder.svg"}
                      alt="Payment Screenshot"
                      className="max-w-full h-auto rounded-md"
                    />
                    <button
                      onClick={() => setPaymentScreenshot(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      id="upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <label
                      htmlFor="upload"
                      className="cursor-pointer text-[#C4A381] hover:text-[#af8a6c]"
                    >
                      Click here to upload payment screenshot
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing || cartItems.length === 0}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                isProcessing || cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#C4A381] hover:bg-[#af8a6c] text-white"
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </div>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
