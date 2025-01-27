import React, { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext" // Import CartContext
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css" // Import toast styles

import general from "../PostcardsImg/general"
import green from "../PostcardsImg/green"
import blue from "../PostcardsImg/blue"
import red from "../PostcardsImg/red"
import yellow from "../PostcardsImg/yellow"
import vanGogh from "../PostcardsImg/vanGogh"
import mountains from "../PolaroidsImg/mountains"
import moons from "../PolaroidsImg/moon"
import vangoghpol from "../PolaroidsImg/van-gogh"
import india from "../PolaroidsImg/india"
import girly from "../PolaroidsImg/girly"
import flowers from "../PolaroidsImg/flowers"
import dogs from "../PolaroidsImg/dogs"
import diljit from "../PolaroidsImg/diljit"
import famoussingers from "../PolaroidsImg/famoussingers"
import cats from "../PolaroidsImg/cats"
import cars from "../PolaroidsImg/cars"
import birds from "../PolaroidsImg/birds"

const PresetsPage = () => {
  const { category } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { addToCart } = useCart() // Access addToCart from CartContext

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
      vangogh: vanGogh,
      mountains,
      moons,
      india,
      girly,
      flowers,
      dogs,
      diljit,
      "famous-singers": famoussingers,
      cats,
      cars,
      birds,
      "van-gogh": vangoghpol,
    }
    setUploadedImages(categoryMap[category] || null)
    setCurrentImageIndex(category === "Polaroids" ? 0 : currentImageIndex) // Show first image if "Polaroids" category
  }, [category, currentImageIndex]) // Added currentImageIndex to dependencies

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
      // Dynamically create the image name based on the category and fromPage state
      const imageName = `${state?.fromPage} - ${category}`

      const selectedImage = {
        name: imageName, // Use the dynamic name
        image: state?.fromPage === "Polaroids" ? uploadedImages[0] : uploadedImages[currentImageIndex], // Check category and use the 0th image if "Polaroids"
        type: "preset",
      }

      addToCart(selectedImage)

      // Display toast notification in the center with a custom style
      toast.success("Item added to cart!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          backgroundColor: "#ebe1d2", // Off-white background
          color: "#2E2210", // Dark brown text color
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

  const descriptionText =
    state?.fromPage === "Polaroids"
      ? "This is a Polaroid bundle, and all photos in the collection will be printed."
      : "Any of these photos can be chosen independently for printing."

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
            <h1 className="text-2xl font-semibold mb-4 text-[#2E2210]">{state?.fromPage || "Selected Category"}</h1>
            <p className="text-xl text-gray-700 mb-6">
              Pick your favorite designs and customize your cart effortlessly!
            </p>

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Price:</h2>
            <p className="text-lg text-gray-800 mb-4">$XX.XX</p>

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Description:</h2>
            <p className="text-gray-700">{descriptionText}</p>

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

