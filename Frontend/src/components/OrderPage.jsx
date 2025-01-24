import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // Import CartContext
import { useUser } from "../context/UserContext";

const OrderPage = () => {
  const { user } = useUser();
  const { cartItems, removeFromCart, clearCart } = useCart(); // Access removeFromCart function
  const [address, setAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([
    "Mega Boys Hostel",
    "Mega Girls Hostel",
  ]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(URL.createObjectURL(file));
    }
  };

  const handleRemoveItem = (index) => {
    removeFromCart(index); // Call removeFromCart with the index of the item to remove it
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Please select or add an address.");
      return;
    }
    if (!paymentScreenshot) {
      alert("Please upload a screenshot of the payment.");
      return;
    }
    alert("Your order has been placed successfully!");
    clearCart(); // Clear the cart after placing the order
  };

  return (
    <div className="min-h-screen bg-[#FDF6F0] p-6 mt-[108px]">
      <div className="grid grid-cols-3 gap-6">
        {/* Left Section: Order Summary */}
        <div className="col-span-1 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={item.image}
                    alt={`Cart Item ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover shadow-md mb-2"
                  />
                  <p className="text-sm text-center text-gray-700">{item.name}</p>
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="bg-red-800 text-white text-sm py-1 px-2 rounded-md hover:bg-red-700 transition mt-2"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-2 text-center">
                No items in your cart.
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Checkout Details */}
        <div className="col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">User Information</h3>
            <p>Name: {user?.name || "Guest"}</p>
            <p>Phone: {user?.phone || "Not provided"}</p>
            <p>Email: {user?.email || "Not provided"}</p>
          </div>

          {/* Address Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
            <ul>
              {savedAddresses.map((addr, index) => (
                <li key={index} className="mb-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="address"
                      value={addr}
                      checked={selectedAddress === addr}
                      onChange={() => setSelectedAddress(addr)}
                      className="mr-2"
                    />
                    {addr}
                  </label>
                </li>
              ))}
            </ul>
            <input
              type="text"
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              placeholder="Add new address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Payment Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Payment</h3>
            <div className="flex justify-center items-center">
              <div className="border-2 border-dashed border-gray-400 rounded-md p-6 mb-4 flex items-center justify-center w-full">
                {paymentScreenshot ? (
                  <img
                    src={paymentScreenshot}
                    alt="Payment Screenshot"
                    className="w-40 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      id="upload"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="upload"
                      className="block text-center text-gray-500 cursor-pointer hover:underline"
                    >
                      Click here to upload images
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Final Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-[#C4A381] text-white py-2 px-4 rounded-md hover:bg-[#af8a6c] transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
