"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ChevronLeft, ChevronRight, ShoppingCart, Plus } from 'lucide-react'

// Import image categories
import general from "../PostcardsImg/general"
import green from "../PostcardsImg/green"
import blue from "../PostcardsImg/blue"
import red from "../PostcardsImg/red"
import yellow from "../PostcardsImg/yellow"
import vangogh from "../PostcardsImg/vanGogh"
import mountains from "../PolaroidsImg/mountains"
import moons from "../PolaroidsImg/moon"
import vangoghh from "../PolaroidsImg/vangoghp"
import india from "../PolaroidsImg/india"
import girly from "../PolaroidsImg/girly"
import flowers from "../PolaroidsImg/flowers"
import dogs from "../PolaroidsImg/dogs"
import diljit from "../PolaroidsImg/diljit"
import singers from "../PolaroidsImg/singers"
import cats from "../PolaroidsImg/cats"
import cars from "../PolaroidsImg/cars"
import birds from "../PolaroidsImg/birds"

// Add this CSS
const styles = `
  @media (max-width: 640px) {
    body {
      overflow-x: hidden;
    }
    .thumbnails-container {
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      max-height: 100px;
      touch-action: pan-x;
      padding-bottom: 1rem;
    }
    .thumbnails-inner {
      display: flex;
      gap: 0.5rem;
      min-width: max-content;
    }
  }
`

const PresetsPage = () => {
  const { category } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [uploadedImages, setUploadedImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const categoryMap = {
      general,
      green,
      blue,
      red,
      yellow,
      vangogh,
      mountains,
      moons,
      india,
      girly,
      flowers,
      dogs,
      diljit,
      singers,
      cats,
      cars,
      birds,
      vangoghh,
    }

    if (category && categoryMap[category]) {
      setUploadedImages(categoryMap[category] || [])
    } else {
      setUploadedImages([])
    }

    setCurrentImageIndex(0)
    setIsLoading(false)
  }, [category])

  useEffect(() => {
    // Add the styles to the document
    const styleElement = document.createElement("style")
    styleElement.textContent = styles
    document.head.appendChild(styleElement)

    // Clean up function
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  useEffect(() => {
    // Function to handle touch events on thumbnails container
    const handleTouchInContainer = (e) => {
      e.stopPropagation()
    }

    // Get the thumbnails container
    const thumbnailsContainer = document.querySelector(".thumbnails-container")

    if (thumbnailsContainer) {
      thumbnailsContainer.addEventListener("touchstart", handleTouchInContainer, { passive: false })
      thumbnailsContainer.addEventListener("touchmove", handleTouchInContainer, { passive: false })

      // Clean up
      return () => {
        thumbnailsContainer.removeEventListener("touchstart", handleTouchInContainer)
        thumbnailsContainer.removeEventListener("touchmove", handleTouchInContainer)
      }
    }
  }, [])

  const handleNext = () => {
    if (Array.isArray(uploadedImages) && uploadedImages.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % uploadedImages.length)
    }
  }

  const handleBack = () => {
    if (Array.isArray(uploadedImages) && uploadedImages.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? uploadedImages.length - 1 : prevIndex - 1))
    }
  }

  const handleAddToCart = () => {
    if (Array.isArray(uploadedImages) && uploadedImages.length > 0) {
      const imageName = `${state?.fromPage} - ${category}`

      const selectedImage = {
        name: imageName,
        image: state?.fromPage === "Polaroids" ? uploadedImages[0] : uploadedImages[currentImageIndex],
        type: "preset",
        price: getPriceForType(state?.fromPage),
      }

      addToCart(selectedImage)

      toast.success("Item added to cart!", {
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
    }
  }

  const handleViewCart = () => {
    navigate("/order")
  }

  const getPriceForType = (type) => {
    switch (type) {
      case "Polaroids":
        return 149
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

  const getDescription = (type) => {
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

    return description
  }

  const getDeliveryInfo = () => {
    return "Free delivery for people in NITJ campus. For customers outside NITJ campus, delivery is free for orders above ₹300. For orders below ₹300, minimal delivery charges will be applicable based on your location. We will contact you to inform you about the delivery charges."
  }

  const getHeading = () => {
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1)
    if (state?.fromPage === "Polaroids") {
      return `${formattedCategory} Polaroids Set Of 9`
    } else {
      return `${formattedCategory} Themed`
    }
  }

  const descriptionText = getDescription(state?.fromPage)
  const deliveryInfo = getDeliveryInfo()

  return (
    <main className="bg-[#FDF6F0] min-h-screen py-8 md:py-16 pt-[150px] md:pt-[180px] -mt-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Left Section: Thumbnails and Main Image */}
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail Images */}
            <div className="flex md:flex-col order-2 md:order-1 mb-4 md:mb-0 md:mr-4 overflow-x-auto md:overflow-y-auto md:max-h-[500px] md:w-24 scrollbar-thin scrollbar-thumb-[#C4A381] scrollbar-track-[#ebe1d2]">
              {isLoading ? (
                <div className="flex justify-center items-center w-full h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C4A381]"></div>
                </div>
              ) : Array.isArray(uploadedImages) && uploadedImages.length > 0 ? (
                uploadedImages.map((image, index) => (
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
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        currentImageIndex === index ? "opacity-90" : "opacity-100"
                      }`}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 p-4">No images available.</p>
              )}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 order-1 md:order-2 mb-4 md:mb-0">
              {isLoading ? (
                <div className="flex justify-center items-center w-full h-[300px] md:h-[400px] bg-[#ebe1d2] rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C4A381]"></div>
                </div>
              ) : Array.isArray(uploadedImages) && uploadedImages.length > 0 ? (
                <div className="relative group">
                  <img
                    src={uploadedImages[currentImageIndex] || "/placeholder.svg"}
                    alt="Main Polaroid"
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
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {uploadedImages.length}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] md:h-[400px] bg-[#ebe1d2] rounded-lg p-4">
                  <p className="text-center text-gray-500 text-lg md:text-xl">No images available for this category.</p>
                </div>
              )}
              
              {/* Cart Buttons - Moved from the right to below the main image */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#C4A381] text-white py-3 px-4 rounded-md transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#C4A381] focus:ring-offset-2"
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

          {/* Right Section: Details and Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-3 text-[#2E2210]">{getHeading()}</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-6 border-b border-[#ebe1d2] pb-4">
              Pick your favorite designs and customize your cart effortlessly!
            </p>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Price:</h2>
                <p className="text-xl text-gray-800 font-medium">₹{getPriceForType(state?.fromPage)}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Description:</h2>
                <p className="text-gray-700 whitespace-pre-line">{descriptionText}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Delivery:</h2>
                <p className="text-gray-700 whitespace-pre-line">{deliveryInfo}</p>
              </div>
              {/* Cart buttons removed from here and moved under the main image */}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </main>
  )
}

export default PresetsPage