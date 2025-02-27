import React, { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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

const PresetsPage = () => {
  const { category } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [uploadedImages, setUploadedImages] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
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
    setUploadedImages(categoryMap[category] || null)
    setCurrentImageIndex(category === "Polaroids" ? 0 : currentImageIndex)
  }, [category, currentImageIndex])

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
    switch (type) {
      case "Polaroids":
        return "Print your retro instant style Polaroids online from your mobile or computer. Just select your photos, upload and purchase.\nPaper Quality: 260 GSM Photo paper\nPaper Finish: Matte\nSize: 5.6 cm x 8.4 cm (Including white space)"
      case "Wall Posters":
        return "Print your retro instant style Wall Posters online from your mobile or computer. Just select your photos, upload and purchase.\nPaper Quality: 260 GSM Photo paper\nPaper Finish: Matte\nSize: A4 (Including white space)"
      case "Postcards":
        return "Print your retro instant style PostCards online from your mobile or computer. Just select your photos, upload and purchase.\nPaper Quality: 240 GSM Photo paper\nPaper Finish: Matte\nSize: 4 x 6 inch"
      default:
        return "Select your photos, upload and purchase to create beautiful prints of your memories."
    }
  }

  const getHeading = () => {
    if (state?.fromPage === "Polaroids") {
      return `${category} Polaroids set of 9`
    } else {
      return `${category} Themed`
    }
  }

  const descriptionText = getDescription(state?.fromPage)

  return (
    <main className="bg-[#FDF6F0] min-h-screen py-16 mt-[108px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Section */}
          <div className="flex">
            <div className="flex flex-col space-y-2 pr-4 overflow-y-auto max-h-[450px]">
              {Array.isArray(uploadedImages) && uploadedImages.length > 0 ? (
                uploadedImages.map((image, index) => (
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
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        currentImageIndex === index ? "opacity-60" : "opacity-100"
                      }`}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No images available for this category.</p>
              )}
            </div>

            <div className="relative flex-1">
              {Array.isArray(uploadedImages) && uploadedImages.length > 0 ? (
                <img
                  src={uploadedImages[currentImageIndex] || "/placeholder.svg"}
                  alt="Main Polaroid"
                  className="rounded-lg shadow-lg max-h-96 object-cover mx-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-center text-gray-500 text-2xl">No images uploaded yet. Please upload images.</p>
                </div>
              )}

              {Array.isArray(uploadedImages) && uploadedImages.length > 0 && (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div>
            <h1 className="text-2xl font-semibold mb-4 text-[#2E2210]">{getHeading()}</h1>
            <p className="text-xl text-gray-700 mb-6">
              Pick your favorite designs and customize your cart effortlessly!
            </p>

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Price:</h2>
            <p className="text-lg text-gray-800 mb-4">₹{getPriceForType(state?.fromPage)}</p>

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Description:</h2>
            <p className="text-gray-700 whitespace-pre-line">{descriptionText}</p>

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

      {/* Toast Container */}
      <ToastContainer />
    </main>
  )
}

export default PresetsPage

