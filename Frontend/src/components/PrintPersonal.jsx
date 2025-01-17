import React, { useState } from "react";

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customText, setCustomText] = useState("");
  const [addedText, setAddedText] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % uploadedImages.length);
  };

  const handleBack = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? uploadedImages.length - 1 : prevIndex - 1
    );
  };

  const handleAddText = () => {
    setAddedText(customText);
    setCustomText(""); // Clear the input field after adding
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
  };

  return (
    <main className="bg-[#FDF6F0] min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section: Image with Thumbnails */}
          <div className="flex">
            {/* Thumbnail Images */}
            <div className="flex flex-col space-y-2 pr-4">
              {uploadedImages.map((image, index) => (
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
              {uploadedImages.length > 0 ? (
                <img
                  src={uploadedImages[currentImageIndex]}
                  alt="Main Polaroid"
                  className="rounded-lg shadow-lg max-h-96 object-cover mx-auto"
                />
              ) : (
                <p>No images uploaded yet. Please upload images.</p>
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

              {/* Custom Text Input and Add Button */}
              <div className="mt-8 flex justify-center items-center space-x-2">
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
                  Add
                </button>
              </div>

              {/* Display Added Text */}
              {addedText && (
                <p className="mt-2 text-center text-[#2E2210] font-semibold">
                  Added Text: {addedText}
                </p>
              )}
            </div>
          </div>

          {/* Right Section: Order Details */}
          <div>
            <h1 className="text-2xl font-semibold mb-4 text-[#2E2210]">Ordering Text</h1>
            <p className="text-sm text-gray-700 mb-6">!!!!!!!!!!!!!!!!!!!!!!</p>

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Price:</h2>
            <p className="text-lg text-gray-800 mb-4">$XX.XX</p>

            <label
              htmlFor="upload"
              className="block text-sm font-medium text-[#2E2210] mb-2"
            >
              Upload Photos Here:
            </label>
            <div className="border-2 border-dashed border-gray-400 rounded-md p-6 mb-4">
              <input
                type="file"
                id="upload"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
              <label
                htmlFor="upload"
                className="block text-center text-gray-500 cursor-pointer hover:underline"
              >
                Click here to upload images
              </label>
            </div>

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Description:</h2>
            <p className="text-gray-700">
              Add a description here about the product. For example, details about the print
              quality, sizes available, or any special instructions for the user.
            </p>

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

