import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { X } from "lucide-react"

const UploadPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [uploadedImages, setUploadedImages] = useState([])
  const [customText, setCustomText] = useState("")
  const [addedText, setAddedText] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const { state } = useLocation()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % uploadedImages.length)
    setIsEditing(false)
  }

  const handleBack = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? uploadedImages.length - 1 : prevIndex - 1))
    setIsEditing(false)
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setUploadedImages((prevImages) => [...prevImages, ...newImages])
  }

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove))
    setAddedText((prevText) => {
      const newText = { ...prevText }
      delete newText[indexToRemove]
      return newText
    })
    if (currentImageIndex >= uploadedImages.length - 1) {
      setCurrentImageIndex(Math.max(uploadedImages.length - 2, 0))
    }
  }

  const getPriceForType = (type, quantity) => {
    switch (type) {
      case "Polaroids":
        if (quantity >= 25) return 16
        if (quantity >= 15) return 17
        return 19
      case "Square Prints":
        return 29
      case "Postcards":
        return 39
      case "Wall Posters":
        return 79
      case "Photo Strips":
        return 99
      default:
        return 0
    }
  }

  const calculateTotalPrice = (quantity) => {
    if (state?.fromPage === "Polaroids") {
      if (quantity < 5) return 0 // Minimum order not met
      if (quantity >= 25) return quantity * 16
      if (quantity >= 15) return quantity * 17
      if (quantity >= 6) {
        const freeItems = Math.floor(quantity / 6)
        return (quantity - freeItems) * 19
      }
      return quantity * 19
    }
    return quantity * getPriceForType(state?.fromPage, quantity)
  }

  const handleAddToCart = () => {
    if (uploadedImages.length > 0) {
      if (state?.fromPage === "Polaroids" && uploadedImages.length < 5) {
        toast.error("Minimum order of 5 Polaroids required!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          style: {
            backgroundColor: "#ebe1d2",
            color: "#2E2210",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            padding: "12px",
          },
        })
        return
      }

      const quantity = uploadedImages.length
      const totalPrice = calculateTotalPrice(quantity)
      const pricePerItem = totalPrice / quantity

      uploadedImages.forEach((image, index) => {
        const selectedImage = {
          name: `Uploaded Image ${index + 1}`,
          image: image,
          text: addedText[index] || "",
          type: "uploaded",
          price: pricePerItem,
          productType: state?.fromPage,
        }
        addToCart(selectedImage)
      })

      const freeItems = state?.fromPage === "Polaroids" ? Math.floor(quantity / 6) : 0
      toast.success(
        `${quantity} items added to cart! Total price: ₹${totalPrice}${
          freeItems > 0 ? ` (Includes ${freeItems} free Polaroid${freeItems > 1 ? "s" : ""})` : ""
        }`,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          style: {
            backgroundColor: "#ebe1d2",
            color: "#2E2210",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            padding: "12px",
          },
        },
      )
    }
  }

  const handleViewCart = () => {
    navigate("/order")
  }

  const handleAddText = () => {
    if (customText.trim()) {
      setAddedText((prevAddedText) => ({
        ...prevAddedText,
        [currentImageIndex]: customText,
      }))
      setCustomText("")
      setIsEditing(false)
    }
  }

  const handleEditText = () => {
    setCustomText(addedText[currentImageIndex] || "")
    setIsEditing(true)
  }

  const getDescription = (type) => {
    switch (type) {
      case "Polaroids":
        return "Print your retro instant style Polaroids online from your mobile or computer. Just select your photos, upload and purchase.\nPaper Quality: 260 GSM Photo paper\nPaper Finish: Matte\nSize: 5.6 cm x 8.4 cm (Including white space)"
      case "Wall Posters":
        return "Print your retro instant style Polaroids online from your mobile or computer. Just select your photos, upload and purchase.\nPaper Quality: 260 GSM Photo paper\nPaper Finish: Matte\nSize: A4 (Including white space)"
      case "Postcards":
        return "Print your retro instant style Polaroids online from your mobile or computer. Just select your photos, upload and purchase.\nPaper Quality: 240 GSM Photo paper\nPaper Finish: Matte\nSize: 4 x 6 inch"
      default:
        return "Select your photos, upload and purchase to create beautiful prints of your memories."
    }
  }

  return (
    <main className="bg-[#FDF6F0] min-h-screen py-16 mt-[108px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section: Thumbnails and Main Image */}
          <div className="flex">
            {/* Thumbnail Images */}
            <div className="flex flex-col space-y-2 pr-4 overflow-y-auto max-h-[450px]">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    currentImageIndex === index ? "border-[#C4A381]" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg opacity-0 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage(index)
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1">
              {uploadedImages.length > 0 ? (
                <img
                  src={uploadedImages[currentImageIndex] || "/placeholder.svg"}
                  alt="Main Upload"
                  className="rounded-lg shadow-lg max-h-96 object-cover mx-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-center text-gray-500 text-2xl">No images uploaded yet. Please upload images.</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <button
                onClick={handleBack}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-[#C4A381] text-white px-2 py-1 rounded-l-md hover:bg-[#af8a6c] transition"
              >
                &#9664;
              </button>
              <button
                onClick={handleNext}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-[#C4A381] text-white px-2 py-1 rounded-r-md hover:bg-[#af8a6c] transition"
              >
                &#9654;
              </button>

              {/* Custom Text and Edit Button */}
              {uploadedImages.length > 0 && (
                <div className="mt-8 flex justify-center items-center space-x-2">
                  {isEditing || !addedText[currentImageIndex] ? (
                    <>
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Add Custom Text Here"
                        className="border rounded-md py-2 px-4 w-3/4 lg:w-2/3 focus:outline-none focus:ring-2 focus:ring-[#C4A381]"
                      />
                      <button
                        onClick={handleAddText}
                        className="bg-[#C4A381] text-white px-4 py-2 rounded-md hover:bg-[#af8a6c] transition"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <div className="relative w-3/4 lg:w-2/3 bg-[#C4A381] text-white py-2 px-4 rounded-lg shadow-lg flex justify-between items-center">
                      <p className="text-sm">{addedText[currentImageIndex]}</p>
                      <button
                        onClick={handleEditText}
                        className="ml-4 bg-white text-[#C4A381] py-1 px-3 rounded-md text-sm hover:bg-gray-100 transition"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section: Upload, Cart, and Actions */}
          <div>
            <h1 className="text-2xl font-semibold mb-4 text-[#2E2210]">{state?.fromPage || "Upload Page"}</h1>
            <p className="text-xl text-gray-700 mb-6">Upload your custom images and add them to your cart!</p>

            <label htmlFor="upload" className="block text-sm font-medium text-[#2E2210] mb-2">
              Upload Photos Here:
            </label>
            <div className="border-2 border-dashed border-gray-400 rounded-md p-6 mb-4">
              <input type="file" id="upload" className="hidden" multiple onChange={handleFileChange} />
              <label htmlFor="upload" className="block text-center text-gray-500 cursor-pointer hover:underline">
                Click here to upload images
              </label>
            </div>

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Price:</h2>
            {state?.fromPage === "Polaroids" ? (
              <div className="mb-4">
                <p className="text-lg text-gray-800">Base price: ₹19 per Polaroid</p>
                <div className="mt-2 p-3 bg-[#eee1cf] rounded-lg">
                  <h3 className="font-semibold text-[#2E2210]">Special Offers:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    <li>Buy 6 get 1 free</li>
                    <li>On order of 15+ Polaroids: ₹17 each</li>
                    <li>On order of 25+ Polaroids: ₹16 each</li>
                    <li>Minimum order of 5 required</li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-lg text-gray-800 mb-4">
                ₹{getPriceForType(state?.fromPage, uploadedImages.length)} per item
              </p>
            )}
            {uploadedImages.length > 0 && (
              <p className="text-lg text-gray-800 mb-4">
                Total: ₹{calculateTotalPrice(uploadedImages.length)} for {uploadedImages.length} items
                {state?.fromPage === "Polaroids" && uploadedImages.length >= 6 && (
                  <span className="block text-sm text-green-600 mt-1">
                    (Includes {Math.floor(uploadedImages.length / 6)} free Polaroid
                    {uploadedImages.length >= 12 ? "s" : ""})
                  </span>
                )}
              </p>
            )}

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Description:</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{getDescription(state?.fromPage)}</p>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#C4A381] text-white py-2 px-4 rounded-md hover:bg-[#af8a6c] transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleViewCart}
                className="flex-1 bg-[#97784c] text-white py-2 px-4 rounded-md hover:bg-[#2E2210] transition"
              >
                View My Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  )
}

export default UploadPage

