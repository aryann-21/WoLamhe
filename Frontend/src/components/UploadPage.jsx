"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { X, ChevronLeft, ChevronRight, ShoppingCart, Plus, Upload, Edit2, Save } from "lucide-react"

const UploadPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [uploadedImages, setUploadedImages] = useState([])
  const [customText, setCustomText] = useState("")
  const [addedText, setAddedText] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { state } = useLocation()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleNext = () => {
    if (uploadedImages.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % uploadedImages.length)
      setIsEditing(false)
    }
  }

  const handleBack = () => {
    if (uploadedImages.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? uploadedImages.length - 1 : prevIndex - 1))
      setIsEditing(false)
    }
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setUploadedImages((prevImages) => [...prevImages, ...newImages])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files) {
      const newImages = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => URL.createObjectURL(file))

      if (newImages.length > 0) {
        setUploadedImages((prevImages) => [...prevImages, ...newImages])
        toast.success(`${newImages.length} image${newImages.length > 1 ? "s" : ""} uploaded successfully`)
      }
    }
  }

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages((prevImages) => {
      setAddedText((prevText) => {
        const newText = { ...prevText }
        delete newText[indexToRemove]

        // Reindex the remaining text entries
        const updatedText = {}
        let newIndex = 0

        prevImages.forEach((_, index) => {
          if (index !== indexToRemove && prevText[index]) {
            updatedText[newIndex] = prevText[index]
            newIndex++
          }
        })

        return updatedText
      })

      if (currentImageIndex >= uploadedImages.length - 1) {
        setCurrentImageIndex(Math.max(uploadedImages.length - 2, 0))
      }
      return prevImages.filter((_, index) => index !== indexToRemove)
    })
  }

  const getPriceForType = (type, quantity = 0) => {
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

  const handleAddToCart = async () => {
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

      try {
        const quantity = uploadedImages.length
        const totalPrice = calculateTotalPrice(quantity)
        const pricePerItem = totalPrice / quantity

        // Add items to cart with blob URLs
        uploadedImages.forEach(async (image, index) => {
          // Convert blob URL to File object for later upload
          const response = await fetch(image)
          const blob = await response.blob()
          const file = new File([blob], `image-${index}.jpg`, { type: blob.type })

          const selectedImage = {
            name: `Uploaded Image ${index + 1}`,
            image: image, // Store blob URL
            imageFile: file, // Store File object for later upload
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
      } catch (error) {
        console.error("Error in handleAddToCart:", error)
        toast.error("An error occurred while adding items to cart")
      }
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

      toast.success("Custom text added successfully", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
      })
    }
  }

  const handleEditText = () => {
    setCustomText(addedText[currentImageIndex] || "")
    setIsEditing(true)
  }

  const getDescription = (type) => {
    const freeDeliveryNote = "Free delivery for non-NITJ customers on orders over ₹300!"
    let description = ""

    switch (type) {
      case "Polaroids":
        description =
          "Print your retro instant style Polaroids online from your mobile or computer. Just select your photos, upload and purchase.\nPaper Quality: 260 GSM Photo paper\nPaper Finish: Matte\nSize: 5.6 cm x 8.4 cm (Including white space)"
        break
      case "Wall Posters":
        description =
          "Print your retro instant style Wall Posters online from your mobile or computer. Just select your photos, upload and purchase.\nPaper Quality: 260 GSM Photo paper\nPaper Finish: Matte\nSize: A4 (Including white space)"
        break
      case "Postcards":
        description =
          "Print your retro instant style Postcards online from your mobile or computer. Just select your photos, upload and purchase.\nPaper Quality: 240 GSM Photo paper\nPaper Finish: Matte\nSize: 4 x 6 inch"
        break
      default:
        description = "Select your photos, upload and purchase to create beautiful prints of your memories."
    }

    return `${freeDeliveryNote}\n\n${description}`
  }

  const getDeliveryInfo = () => {
    return "Delivery time varies depending on your location. Standard delivery is typically 3-5 business days. Express delivery options are available at checkout."
  }

  return (
    <main className="bg-[#FDF6F0] min-h-screen py-8 md:py-16 pt-[150px] md:pt-[180px] -mt-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Left Section: Thumbnails and Main Image */}
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail Images */}
            <div className="flex md:flex-col order-2 md:order-1 mb-4 md:mb-0 md:mr-4 overflow-x-auto md:overflow-y-auto md:max-h-[500px] md:w-24 scrollbar-thin scrollbar-thumb-[#C4A381] scrollbar-track-[#ebe1d2]">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative min-w-20 h-20 m-1 md:m-0 md:mb-2 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    currentImageIndex === index ? "border-[#C4A381] shadow-md" : "border-transparent"
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
                    aria-label="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 order-1 md:order-2 mb-4 md:mb-0">
              {uploadedImages.length > 0 ? (
                <div className="relative group">
                  <img
                    src={uploadedImages[currentImageIndex] || "/placeholder.svg"}
                    alt="Main Upload"
                    className="rounded-lg shadow-lg w-full h-auto max-h-[350px] md:max-h-[500px] object-contain bg-[#ebe1d2] p-2"
                  />

                  {/* Navigation Buttons */}
                  {uploadedImages.length > 1 && (
                    <>
                      <button
                        onClick={handleBack}
                        aria-label="Previous image"
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#C4A381]/80 text-white p-2 rounded-full hover:bg-[#af8a6c] transition opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#C4A381]"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleNext}
                        aria-label="Next image"
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#C4A381]/80 text-white p-2 rounded-full hover:bg-[#af8a6c] transition opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#C4A381]"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center h-[350px] md:h-[500px] bg-[#ebe1d2] rounded-lg p-4 border-2 border-dashed ${isDragging ? "border-[#C4A381] bg-[#ebe1d2]/70" : "border-gray-300"} transition-colors`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-[#C4A381] mb-4" />
                  <p className="text-center text-gray-600 text-lg mb-2">Drag and drop images here</p>
                  <p className="text-center text-gray-500 text-sm">or</p>
                  <label
                    htmlFor="upload"
                    className="mt-4 bg-[#C4A381] text-white py-2 px-4 rounded-md hover:bg-[#af8a6c] transition cursor-pointer"
                  >
                    Browse Files
                  </label>
                  <input
                    type="file"
                    id="upload"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              )}

              {/* Custom Text and Edit Button */}
              {uploadedImages.length > 0 && (
                <div className="mt-6 flex justify-center items-center space-x-2">
                  {isEditing || !addedText[currentImageIndex] ? (
                    <div className="flex w-full max-w-md">
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Add Custom Text Here"
                        className="flex-1 border rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#C4A381]"
                        onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                      />
                      <button
                        onClick={handleAddText}
                        className="bg-[#C4A381] text-white px-4 py-2 rounded-r-md hover:bg-[#af8a6c] transition flex items-center"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full max-w-md bg-[#C4A381] text-white py-3 px-4 rounded-lg shadow-md flex justify-between items-center">
                      <p className="text-sm flex-1 mr-2 break-words">{addedText[currentImageIndex]}</p>
                      <button
                        onClick={handleEditText}
                        className="bg-white text-[#C4A381] py-1 px-3 rounded-md text-sm hover:bg-gray-100 transition flex items-center"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* Buttons below the image */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={uploadedImages.length === 0}
                  className={`flex-1 py-3 px-4 rounded-md transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    uploadedImages.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#C4A381] text-white hover:bg-[#af8a6c] focus:ring-[#C4A381]"
                  }`}
                >
                  <Plus className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleViewCart}
                  className="flex-1 bg-[#97784c] text-white py-3 px-4 rounded-md hover:bg-[#2E2210] transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#97784c] focus:ring-offset-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>View Cart</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Section: Upload, Cart, and Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-3 text-[#2E2210]">
              {state?.fromPage || "Upload Page"}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-6 border-b border-[#ebe1d2] pb-4">
              Upload your custom images and add them to your cart!
            </p>

            <div className="space-y-6">
              <div>
                <label htmlFor="upload" className="block text-sm font-medium text-[#2E2210] mb-2">
                  Upload Photos Here:
                </label>
                <div
                  className={`border-2 border-dashed rounded-md p-6 mb-4 transition-colors ${isDragging ? "border-[#C4A381] bg-[#ebe1d2]/30" : "border-gray-400"}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="upload"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-[#C4A381] mb-2" />
                    <label
                      htmlFor="upload"
                      className="text-center text-gray-500 cursor-pointer hover:text-[#C4A381] transition"
                    >
                      Click or drag images here to upload
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Price:</h2>
                {state?.fromPage === "Polaroids" ? (
                  <div className="mb-4">
                    <p className="text-lg text-gray-800">Base price: ₹19 per Polaroid</p>
                    <div className="mt-2 p-4 bg-[#eee1cf] rounded-lg">
                      <h3 className="font-semibold text-[#2E2210] mb-2">Special Offers:</h3>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
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
                  <div className="p-4 bg-[#ebe1d2] rounded-lg">
                    <p className="text-lg font-medium text-[#2E2210]">
                      Total: ₹{calculateTotalPrice(uploadedImages.length)} for {uploadedImages.length} items
                    </p>
                    {state?.fromPage === "Polaroids" && uploadedImages.length >= 6 && (
                      <p className="text-sm text-green-700 mt-1">
                        Includes {Math.floor(uploadedImages.length / 6)} free Polaroid
                        {Math.floor(uploadedImages.length / 6) > 1 ? "s" : ""}!
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Description:</h2>
                <p className="text-gray-700 mb-4 whitespace-pre-line">{getDescription(state?.fromPage)}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Delivery:</h2>
                <p className="text-gray-700 mb-4 whitespace-pre-line">{getDeliveryInfo()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  )
}

export default UploadPage
