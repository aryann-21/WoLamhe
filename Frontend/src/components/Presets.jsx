import React, { useState } from "react";

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/src/assets/order.jpg", // Replace with actual image paths
    "/src/assets/Polaroids.jpg",
    "/src/assets/square.jpg",
    "/src/assets/strips.jpg",
    "/src/assets/wall.jpg",
  ];

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleBack = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <main className="bg-[#FDF6F0] min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section: Image with Thumbnails */}
          <div className="flex">
            {/* Thumbnail Images */}
            <div className="flex flex-col space-y-2 pr-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 rounded-lg cursor-pointer border ${
                    currentImageIndex === index
                      ? "border-[#C4A381]"
                      : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>

            {/* Main Image with Navigation */}
            <div className="relative flex-1">
              <img
                src={images[currentImageIndex]}
                alt="Main Polaroid"
                className="rounded-lg shadow-lg max-h-96 object-cover mx-auto"
              />
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
            <p className="text-sm text-gray-700 mb-6">!!!!!!!!!!!!!!!!!!!!!!</p>

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Price:</h2>
            <p className="text-lg text-gray-800 mb-4">$XX.XX</p>

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Description:</h2>
            <p className="text-gray-700">
              Add a description here about the product. For example, details about the print
              quality, sizes available, or any special instructions for the user.
            </p>

            {/* Add to Cart Button */}
            <button
              className="mt-6 w-full bg-[#C4A381] text-white py-2 px-4 rounded-md hover:bg-[#af8a6c] transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
