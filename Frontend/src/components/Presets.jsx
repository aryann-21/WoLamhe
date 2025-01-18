import React, { useState, useEffect } from "react";
import general from "../PostcardsImg/general"; // Import your image data

const PresetsPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploadedImages, setUploadedImages] = useState(general); // Initialize with "general" images

  // Function to update images based on selected category
  const handleCategoryChange = (category) => {
    switch (category) {
      case "general":
        setUploadedImages(general);
        break;
      default:
        setUploadedImages(general); // Default to general if no category is matched
        break;
    }
  };

  // Scroll to top when the component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle next image
  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % uploadedImages.length);
  };

  // Handle previous image
  const handleBack = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex === 0 ? uploadedImages.length - 1 : prevIndex - 1)
    );
  };

  return (
    <main className="bg-[#FDF6F0] min-h-screen py-16 mt-[108px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section: Image with Thumbnails */}
          <div className="flex">
            {/* Thumbnail Images */}
            <div className="flex flex-col space-y-2 pr-4 overflow-y-auto max-h-[450px]">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer ${
                    currentImageIndex === index ? "border-[#C4A381]" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      currentImageIndex === index ? "opacity-80" : "opacity-100"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                      currentImageIndex === index ? "bg-opacity-70" : "bg-opacity-10"
                    }`}
                  ></div>
                </div>
              ))}
            </div>

            {/* Main Image with Navigation */}
            <div className="relative flex-1">
              {uploadedImages.length > 0 ? (
                <img
                  src={uploadedImages[currentImageIndex]}
                  alt="Main Polaroid"
                  className="rounded-lg shadow-lg max-h-96 object-cover mx-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-center text-gray-500 text-2xl">
                    No images uploaded yet. Please upload images.
                  </p>
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
            </div>
          </div>

          {/* Right Section: Order Details */}
          <div>
            <h1 className="text-2xl font-semibold mb-4 text-[#2E2210]">Ordering Text</h1>
            <p className="text-2xl text-gray-700 mb-6">!!!!!!!!!!!!!!!!!!!!!!!!!!!!</p>

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Price:</h2>
            <p className="text-lg text-gray-800 mb-4">$XX.XX</p>

            {/* Order Details */}
            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Description:</h2>
            <p className="text-gray-700">
              Add a description here about the product. For example, details about the print quality, sizes available, or any special instructions for the user.
            </p>

            {/* Flex container for two buttons */}
            <div className="flex space-x-4 mt-6">
              <button className="w-1/2 bg-[#C4A381] text-white py-2 px-4 rounded-md hover:bg-[#af8a6c] transition">
                Add to Cart
              </button>
              <button className="w-1/2 bg-[#433218] text-white py-2 px-4 rounded-md hover:bg-[#613b1c] transition">
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PresetsPage;
