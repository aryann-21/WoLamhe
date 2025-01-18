import React, { useState, useEffect } from "react";

const UploadPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customText, setCustomText] = useState("");
  const [addedText, setAddedText] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Scroll to top when the component is mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNext = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % uploadedImages.length
    );
    setIsEditing(false);
  };

  const handleBack = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? uploadedImages.length - 1 : prevIndex - 1
    );
    setIsEditing(false);
  };

  const handleAddText = () => {
    if (customText.trim()) {
      setAddedText((prevAddedText) => ({
        ...prevAddedText,
        [currentImageIndex]: customText,
      }));
      setCustomText("");
      setIsEditing(false);
    }
  };

  const handleEditText = () => {
    setCustomText(addedText[currentImageIndex] || "");
    setIsEditing(true);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setUploadedImages((prevImages) => [...prevImages, ...newImages]);
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
                    currentImageIndex === index
                      ? "border-[#C4A381]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      currentImageIndex === index ? "opacity-80" : "opacity-100"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                  <div
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                      currentImageIndex === index
                        ? "bg-opacity-70"
                        : "bg-opacity-10"
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

          {/* Right Section: Order Details */}
          <div>
            <h1 className="text-2xl font-semibold mb-4 text-[#2E2210]">
              Ordering Text
            </h1>
            <p className="text-2xl text-gray-700 mb-6">
              !!!!!!!!!!!!!!!!!!!!!!!!!!!!
            </p>

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

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">
              Description:
            </h2>
            <p className="text-gray-700">
              Add a description here about the product. For example, details
              about the print quality, sizes available, or any special
              instructions for the user.
            </p>

            <button className="mt-6 w-full bg-[#C4A381] text-white py-2 px-4 rounded-md hover:bg-[#af8a6c] transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UploadPage;