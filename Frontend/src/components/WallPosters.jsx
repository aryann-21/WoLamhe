import React, { forwardRef, useState } from "react";
import wall from "../assets/wall.jpg";
import cameraPhoto from "../assets/camera.png";

const WallPosters = (props, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  const categories = Array.from({ length: 12 }, (_, i) => `Category ${i + 1}`);

  return (
    <div
      ref={ref}
      className="relative group bg-[#EDE8E0] text-[#2E2210] overflow-hidden min-h-[400px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title */}
      <div className="absolute top-0 left-0 z-10 p-4">
        <h3 className="text-6xl">Wall Posters</h3>
      </div>

      {/* Background Image */}
      <img
        src={wall}
        alt="Wall Posters"
        className="absolute bottom-0 right-0 w-[80%] h-[70%] object-cover"
      />

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-70 flex text-white text-lg transition-all duration-700 ease-in-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Left Section */}
        <div className="w-1/2 flex flex-col items-center justify-center p-6">
          <img
            src={cameraPhoto}
            alt="Upload"
            className="w-24 h-24 object-cover mb-8 border-2 p-3 rounded-lg border-gray-300"
          />
          <p className="text-center text-xl font-semibold">
            Upload your own photos
          </p>
        </div>

        {/* Divider Line */}
        <div className="w-px bg-white self-center h-3/4 mx-4" />

        {/* Right Section */}
        <div className="w-1/2 flex flex-col justify-center p-6">
          <h3 className="text-2xl font-bold mb-4 text-center z-40">Categories</h3>
          <ul className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <li key={index} className="text-center">
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Wrap with forwardRef
export default forwardRef(WallPosters);
