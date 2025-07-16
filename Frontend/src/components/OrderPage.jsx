"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import { Trash2, Copy, ShoppingBag, CreditCard, MapPin, Check, Loader2, Truck } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import axios from "axios"

const OrderPage = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { cartItems, removeFromCart, clearCart } = useCart()
  const [address, setAddress] = useState("")
  const [savedAddresses, setSavedAddresses] = useState(["NITJ"])
  const [selectedAddress, setSelectedAddress] = useState("")
  const [paymentScreenshot, setPaymentScreenshot] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const upiId = "dpsingh05656-1@okhdfcbank"

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "WoLamhePresets")

    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/duwjb0moz/image/upload", formData)
      return response.data.secure_url
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error)
      toast.error("Failed to upload image. Please try again.")
      return null
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB")
        return
      }

      const previewUrl = URL.createObjectURL(file)

      if (paymentScreenshot?.preview) {
        URL.revokeObjectURL(paymentScreenshot.preview)
      }

      setPaymentScreenshot({ file, preview: previewUrl })
      toast.success("Payment screenshot uploaded successfully")
    }
  }

  const handleRemoveItem = (index) => {
    removeFromCart(index)
    toast.success("Item removed from cart")
  }

  const handleAddAddress = () => {
    if (address.trim()) {
      setSavedAddresses([...savedAddresses, address.trim()])
      setSelectedAddress(address.trim())
      setAddress("")
      toast.success("New address added")
    }
  }

  const calculateTotalPrice = () => {
    let total = 0
    let polaroidCount = 0

    cartItems.forEach((item) => {
      if (item.type === "preset" && item.name.includes("Polaroids set")) {
        total += item.price || 0
      } else if (item.productType === "Polaroids") {
        polaroidCount++
      } else {
        total += item.price || 0
      }
    })

    if (polaroidCount >= 25) {
      total += polaroidCount * 16
    } else if (polaroidCount >= 15) {
      total += polaroidCount * 17
    } else if (polaroidCount >= 6) {
      const freeItems = Math.floor(polaroidCount / 6)
      total += (polaroidCount - freeItems) * 19
    } else {
      total += polaroidCount * 19
    }

    return total
  }

  const calculateDeliveryCharge = (subtotal) => {
    if (selectedAddress === "NITJ" || subtotal >= 300) {
      return 0
    }
    return 50
  }

  const calculateGrandTotal = () => {
    const subtotal = calculateTotalPrice()
    const deliveryCharge = calculateDeliveryCharge(subtotal)
    return subtotal + deliveryCharge
  }

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true)
      if (!user || !user.id) {
        toast.error("Please login to place an order")
        return
      }
      if (cartItems.length === 0) {
        toast.error("Your cart is empty.")
        return
      }
      if (!selectedAddress) {
        toast.error("Please select a delivery address.")
        return
      }
      if (!paymentScreenshot) {
        toast.error("Please upload a payment screenshot.")
        return
      }

      // Upload payment proof first
      const paymentProofUrl = await uploadToCloudinary(paymentScreenshot.file)
      if (!paymentProofUrl) {
        toast.error("Failed to upload payment proof.")
        setIsProcessing(false)
        return
      }

      // Upload all product images
      const productImageUrls = await Promise.all(
        cartItems.map(async (item) => {
          if (item.imageFile) {
            // Upload the stored File object
            return await uploadToCloudinary(item.imageFile)
          }
          return item.image || null // Fallback to existing URL if no file to upload
        }),
      )

      // Check if any uploads failed
      if (productImageUrls.some((url) => !url)) {
        toast.error("Failed to upload some product images")
        setIsProcessing(false)
        return
      }

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
      }

      const response = await axios.post("http://localhost:5001/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      toast.success("Order placed successfully!")
      clearCart()
      setTimeout(() => navigate("/profile"), 1500)
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const copyUpiId = () => {
    navigator.clipboard
      .writeText(upiId)
      .then(() => toast.success("UPI ID copied to clipboard!"))
      .catch(() => toast.error("Failed to copy UPI ID"))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6F0] p-6 pt-[120px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-[#C4A381] animate-spin mb-2" />
          <p className="text-[#2E2210]">Loading your order...</p>
        </div>
      </div>
    )
  }

  const subtotal = calculateTotalPrice()
  const deliveryCharge = calculateDeliveryCharge(subtotal)
  const grandTotal = calculateGrandTotal()

  return (
    <div className="min-h-screen bg-[#FDF6F0] p-4 md:p-6 pt-[120px] md:pt-[140px]">
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#2E2210] mb-6 md:mb-8">Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Section: Order Summary */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 text-[#C4A381] mr-2" />
                <h2 className="text-xl md:text-2xl font-semibold text-[#2E2210]">Order Summary</h2>
              </div>
              <span className="text-gray-600">Total Items: {cartItems.length}</span>
            </div>

            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="bg-[#eee1cf] rounded-lg p-4 flex flex-col relative group">
                    <div className="relative aspect-square mb-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-[#2E2210]">
                        {item.type === "preset" ? "Preset Image" : "Custom Upload"}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2 h-8">
                        {item.text ? `Text: "${item.text}"` : "No custom text"}
                      </p>
                      <p className="text-sm font-medium text-[#2E2210]">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#ebe1d2]/50 rounded-lg p-8 text-center">
                <p className="text-gray-500">Your cart is empty.</p>
                <button onClick={() => navigate("/")} className="mt-4 text-[#C4A381] hover:text-[#af8a6c] font-medium">
                  Continue Shopping
                </button>
              </div>
            )}

            {/* <div className="mt-6 flex justify-between items-center border-t border-[#ebe1d2] pt-4">
              <span className="text-gray-600">Total Items: {cartItems.length}</span>
              <p className="text-xl font-semibold text-[#2E2210]">Total: ₹{totalPrice}</p>
            </div> */}
          </div>

          {/* Right Section: Checkout Details */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-[#C4A381] mr-2" />
              <h2 className="text-xl md:text-2xl font-semibold text-[#2E2210]">Checkout</h2>
            </div>

            <div className="space-y-6">
              {/* User Information */}
              <div className="p-4 bg-[#ebe1d2]/50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-[#2E2210]">User Information</h3>
                <div className="space-y-1 text-gray-600">
                  <p>
                    Name: <span className="font-medium text-[#2E2210]">{user?.name || "Guest"}</span>
                  </p>
                  <p>
                    Phone: <span className="font-medium text-[#2E2210]">{user?.phone || "Not provided"}</span>
                  </p>
                  <p>
                    Email: <span className="font-medium text-[#2E2210]">{user?.email || "Not provided"}</span>
                  </p>
                </div>
              </div>

              {/* Address Section */}
              <div>
                <div className="flex items-center mb-3">
                  <MapPin className="h-4 w-4 text-[#C4A381] mr-2" />
                  <h3 className="text-lg font-semibold text-[#2E2210]">Delivery Address</h3>
                </div>

                <div className="space-y-2 mb-3">
                  {savedAddresses.map((addr, index) => (
                    <label
                      key={index}
                      className="flex items-center p-2 rounded-md hover:bg-[#ebe1d2]/30 transition-colors cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr}
                        checked={selectedAddress === addr}
                        onChange={() => setSelectedAddress(addr)}
                        className="mr-2 accent-[#C4A381]"
                      />
                      <span className="text-gray-700">{addr}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C4A381]"
                    placeholder="Add new address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddAddress()}
                  />
                  <button
                    onClick={handleAddAddress}
                    className="px-4 py-2 bg-[#C4A381] text-white rounded-md hover:bg-[#af8a6c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C4A381] focus:ring-offset-2"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Payment Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#2E2210]">Payment</h3>
                <div className="bg-[#eee1cf] p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium text-[#2E2210] mb-2">UPI ID for Payment:</p>
                  <div className="flex items-center justify-between bg-white p-3 rounded-md">
                    <span className="text-gray-700 font-mono">{upiId}</span>
                    <button
                      onClick={copyUpiId}
                      className="text-[#C4A381] hover:text-[#a58049] p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C4A381]"
                      aria-label="Copy UPI ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div
                  className={`border-2 border-dashed rounded-md p-4 text-center transition-colors ${paymentScreenshot ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-[#C4A381]"}`}
                >
                  {paymentScreenshot ? (
                    <div className="relative">
                      <img
                        src={paymentScreenshot.preview || "/placeholder.svg"}
                        alt="Payment Screenshot"
                        className="max-w-full h-auto rounded-md"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={() => setPaymentScreenshot(null)}
                          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Remove screenshot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="bg-green-500 text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input type="file" id="upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                      <label
                        htmlFor="upload"
                        className="cursor-pointer text-[#C4A381] hover:text-[#af8a6c] flex flex-col items-center"
                      >
                        <CreditCard className="h-8 w-8 mb-2" />
                        <span>Click here to upload payment screenshot</span>
                        <span className="text-xs text-gray-500 mt-1">(Max size: 5MB)</span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="bg-[#ebe1d2]/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-[#2E2210]">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-medium text-[#2E2210]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Delivery Charge:</span>
                    <span className="font-medium text-[#2E2210]">
                      {deliveryCharge === 0 ? <span className="text-green-600">Free</span> : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {deliveryCharge === 0 && (
                    <div className="text-sm text-green-600 flex items-center">
                      <Truck className="w-4 h-4 mr-1" />
                      {selectedAddress === "NITJ" ? "Free delivery for NITJ" : "Free delivery on orders over ₹300"}
                    </div>
                  )}
                  <div className="border-t border-gray-300 my-2"></div>
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#2E2210]">Total:</span>
                    <span className="text-xl text-[#2E2210]">₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || cartItems.length === 0 || !selectedAddress || !paymentScreenshot}
                className={`w-full py-3 px-4 rounded-md transition-colors flex items-center justify-center ${
                  isProcessing || cartItems.length === 0 || !selectedAddress || !paymentScreenshot
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#C4A381] hover:bg-[#af8a6c] text-white"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Place Order
                  </>
                )}
              </button>

              {(cartItems.length === 0 || !selectedAddress || !paymentScreenshot) && !isProcessing && (
                <p className="text-xs text-red-500 text-center mt-2">
                  {cartItems.length === 0
                    ? "Your cart is empty"
                    : !selectedAddress
                      ? "Please select a delivery address"
                      : "Please upload payment screenshot"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage

