import React, { useState } from "react";

const OrderPage = () => {
  const [address, setAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([
    "123, Main Street, New Delhi",
    "456, Park Avenue, Mumbai",
  ]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const handlePayment = () => {
    if (!paymentScreenshot) {
      alert("Please upload a screenshot of the payment.");
      return;
    }
    alert("Proceeding to payment...");
  };

  const [sections, setSections] = useState({
    login: false,
    address: false,
    summary: false,
    payment: false,
  });

  const toggleSection = (section) => {
    setSections({ ...sections, [section]: !sections[section] });
  };

  const handleFileChange = (e) => {
    setPaymentScreenshot(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex mt-[108px]">
      <div className="w-3/4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        {/* Login Section */}
        <div className="border-b pb-4 mb-4">
          <button
            className="w-full text-left font-semibold text-lg p-2 bg-brown-100 rounded"
            onClick={() => toggleSection("login")}
          >
            1. Login
          </button>
          {sections.login && (
            <div className="mt-4">
              <p className="text-gray-700">Login details go here...</p>
            </div>
          )}
        </div>

        {/* Address Section */}
        <div className="border-b pb-4 mb-4">
          <button
            className="w-full text-left font-semibold text-lg p-2 bg-brown-100 rounded"
            onClick={() => toggleSection("address")}
          >
            2. Delivery Address
          </button>
          {sections.address && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
              <ul className="space-y-3">
                {savedAddresses.map((addr, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="address"
                      value={addr}
                      checked={selectedAddress === addr}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="text-blue-500"
                    />
                    <label className="text-gray-700">{addr}</label>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Add a new address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                />
                <button
                  onClick={() => {
                    setSavedAddresses([...savedAddresses, address]);
                    setAddress("");
                  }}
                  className="mt-3 bg-[#2E2210] text-white px-4 py-2 rounded"
                >
                  Add Address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-b pb-4 mb-4">
          <button
            className="w-full text-left font-semibold text-lg p-2 bg-brown-100 rounded"
            onClick={() => toggleSection("summary")}
          >
            3. Order Summary
          </button>
          {sections.summary && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Item 1</span>
                <span>₹500</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Item 2</span>
                <span>₹300</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹800</span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="border-b pb-4 mb-4">
          <button
            className="w-full text-left font-semibold text-lg p-2 bg-brown-100 rounded"
            onClick={() => toggleSection("payment")}
          >
            4. Payment
          </button>
          {sections.payment && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Payment Options</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    UPI Payment
                  </label>
                  <img
                    src="/src/assets/orders.jpg" // Replace with the correct path to the UPI scanner image
                    alt="UPI Scanner"
                    className="w-1/2 mx-auto mb-4"
                  />
                </div>
                <div>
                  <label
                    htmlFor="paymentScreenshot"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Upload Payment Screenshot
                  </label>
                  <input
                    type="file"
                    id="paymentScreenshot"
                    onChange={handleFileChange}
                    className="block w-full border border-gray-300 rounded p-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Place Order Button */}
        <div className="p-6">
          <button
            onClick={handlePayment}
            className="w-full bg-[#2E2210] text-white text-lg font-semibold px-4 py-2 rounded"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="w-1/4 ml-6 bg-brown-100 p-4 rounded-lg shadow-lg" style={{ height: "auto" }}>
        <h3 className="text-lg font-semibold mb-4">Price Summary</h3>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹800</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>₹50</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹850</span>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
