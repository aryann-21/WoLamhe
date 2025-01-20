import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate }  from "react-router-dom";
import general from "../PostcardsImg/general";
import green from "../PostcardsImg/green";
import blue from "../PostcardsImg/blue";
import red from "../PostcardsImg/red";
import yellow from "../PostcardsImg/yellow";
import vanGogh from "../PostcardsImg/vanGogh";
import mountains from "../PolaroidsImg/mountains";
import moons from "../PolaroidsImg/moon";
import vangoghpol from "../PolaroidsImg/vangoghpol";
import india from "../PolaroidsImg/india";
import girly from "../PolaroidsImg/girly";
import flowers from "../PolaroidsImg/flowers";
import dogs from "../PolaroidsImg/dogs";
import diljit from "../PolaroidsImg/diljit";
import famoussingers from "../PolaroidsImg/famoussingers";
import cats from "../PolaroidsImg/cats";
import cars from "../PolaroidsImg/cars";
import birds from "../PolaroidsImg/birds";

const PresetsPage = () => {
  const { category } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploadedImages, setUploadedImages] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    switch (category) {
      case "general":
        setUploadedImages(general);
        break;
      case "green":
        setUploadedImages(green);
        break;
      case "blue":
        setUploadedImages(blue);
        break;
      case "red":
        setUploadedImages(red);
        break;
      case "yellow":
        setUploadedImages(yellow);
        break;
      case "vangogh":
        setUploadedImages(vanGogh);
        break;
      case "mountains":
        setUploadedImages(mountains);
        break;
      case "moons":
        setUploadedImages(moons);
        break;
      case "india":
        setUploadedImages(india);
        break;
      case "girly":
        setUploadedImages(girly);
        break;
      case "flowers":
        setUploadedImages(flowers);
        break;
      case "dogs":
        setUploadedImages(dogs);
        break;
      case "diljit":
        setUploadedImages(diljit);
        break;
      case "famous-singers":
        setUploadedImages(famoussingers);
        break;
      case "cats":
        setUploadedImages(cats);
        break;
      case "cars":
        setUploadedImages(cars);
        break;
      case "birds":
        setUploadedImages(birds);
        break;
      default:
        setUploadedImages(null);
        break;
    }
    setCurrentImageIndex(0);
  }, [category]);

  const handleNext = () => {
    if (Array.isArray(uploadedImages) && uploadedImages.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % uploadedImages.length
      );
    }
  };

  const handleBack = () => {
    if (Array.isArray(uploadedImages) && uploadedImages.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? uploadedImages.length - 1 : prevIndex - 1
      );
    }
  };

const handleOrder = () => {
  if (Array.isArray(uploadedImages) && uploadedImages.length > 0) 
    navigate('/order');
}




  return (
    <main className="bg-[#FDF6F0] min-h-screen py-16 mt-[108px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex">
            <div className="flex flex-col space-y-2 pr-4 overflow-y-auto max-h-[450px]">
              {Array.isArray(uploadedImages) && uploadedImages.length > 0 ? (
                uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer ${
                      currentImageIndex === index
                        ? "border-[#C4A381]"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        currentImageIndex === index
                          ? "opacity-80"
                          : "opacity-100"
                      }`}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No images available for this category.
                </p>
              )}
            </div>

            <div className="relative flex-1">
              {Array.isArray(uploadedImages) && uploadedImages.length > 0 ? (
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
            </div>2E2210
          </div>

          <div>
            <h1 className="text-2xl font-semibold mb-4 text-[#2E2210]">
              Ordering Text
            </h1>
            <p className="text-2xl text-gray-700 mb-6">
              !!!!!!!!!!!!!!!!!!!!!!!!!!!!
            </p>

            <h2 className="text-lg font-semibold mb-2 text-[#2E2210]">Price:</h2>
            <p className="text-lg text-gray-800 mb-4">$XX.XX</p>

            <h2 className="text-lg font-semibold mb-2 text-[#]">
              Description:
            </h2>
            <p className="text-gray-700">
              Add a description here about the product. For example, details
              about the print quality, sizes available, or any special
              instructions for the user.
            </p>

            <div className="flex space-x-4 mt-6">
              <button className="flex-1 bg-[#C4A381] text-white py-2 px-4 rounded-md hover:bg-[#af8a6c] transition">
                Add to Cart
              </button>
              <button onClick={handleOrder} className="flex-1 bg-[#97784c]  text-white py-2 px-4 rounded-md hover:bg-[#2E2210] transition">
                View My Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PresetsPage;
