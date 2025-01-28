import React, { useState } from "react"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import { Trash2 } from "lucide-react"

const OrderPage = () => {
  const { user } = useUser()
  const { cartItems, removeFromCart, clearCart } = useCart()
  const [address, setAddress] = useState("")
  const [savedAddresses, setSavedAddresses] = useState(["Mega Boys Hostel", "Mega Girls Hostel"])
  const [selectedAddress, setSelectedAddress] = useState("")
  const [paymentScreenshot, setPaymentScreenshot] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPaymentScreenshot(URL.createObjectURL(file))
    }
  }

  const handleRemoveItem = (index) => {
    removeFromCart(index)
  }

  const handleAddAddress = () => {
    if (address.trim()) {
      setSavedAddresses([...savedAddresses, address.trim()])
      setSelectedAddress(address.trim())
      setAddress("")
    }
  }

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Please select or add an address.")
      return
    }
    if (!paymentScreenshot) {
      alert("Please upload a screenshot of the payment.")
      return
    }
    alert("Your order has been placed successfully!")
    clearCart()
  }

  return (
    <div className="min-h-screen bg-[#FDF6F0] p-4 md:p-6 mt-[108px]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#2E2210] mb-6 md:mb-8">Your Order</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Section: Order Summary */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-[#2E2210] mb-4">Order Summary</h2>
            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="bg-[#eee1cf] rounded-lg p-4 flex flex-col items-center">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-32 md:h-40 object-cover rounded-md mb-2"
                    />
                    <div className="space-y-1 w-full">
                      <p className="text-sm text-center text-[#2E2210] font-medium">
                        {item.type === "preset" ? (
                          <>
                            <span className="block font-semibold">Preset Image</span>
                            <span className="block text-xs mt-1">{item.name}</span>
                          </>
                        ) : (
                          <>
                            <span className="block font-semibold">Custom Upload</span>
                            <span className="block text-xs mt-1">{item.text || "No custom text added"}</span>
                          </>
                        )}
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
              <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
            )}
          </div>

          {/* Right Section: Checkout Details */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-[#2E2210] mb-4">Checkout</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-[#2E2210]">User Information</h3>
              <p className="text-gray-600">Name: {user?.name || "Guest"}</p>
              <p className="text-gray-600">Phone: {user?.phone || "Not provided"}</p>
              <p className="text-gray-600">Email: {user?.email || "Not provided"}</p>
            </div>

            {/* Address Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-[#2E2210]">Delivery Address</h3>
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
              <div className="flex flex-col sm:flex-row gap-2">
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
              <h3 className="text-lg font-semibold mb-2 text-[#2E2210]">Payment</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                {paymentScreenshot ? (
                  <img
                    src={paymentScreenshot || "/placeholder.svg"}
                    alt="Payment Screenshot"
                    className="max-w-full h-auto rounded-md"
                  />
                ) : (
                  <>
                    <input type="file" id="upload" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="upload" className="cursor-pointer text-[#C4A381] hover:text-[#af8a6c]">
                      Click here to upload payment screenshot
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#C4A381] text-white py-2 px-4 rounded-md hover:bg-[#af8a6c] transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage

