import React, { forwardRef, useState } from "react";
import Square from "../assets/square.jpg";
import cameraPhoto from "../assets/camera.png";

const SquarePrints = (props, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  const categories = Array.from({ length: 12 }, (_, i) => `Category ${i + 1}`);

  return (
    <div
      ref={ref}
      className="relative group bg-[#D3B495] text-[#2E2210] overflow-hidden min-h-[400px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <img
        src={Square}
        alt="Square Prints"
        className="absolute top-0 right-0 w-[80%] h-[80%] object-cover"
      />

      {/* Title */}
      <div className="absolute bottom-0 left-0 z-10 p-4">
        <h3 className="text-3xl">Square Prints</h3>
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-70 flex flex-col text-white text-sm transition-all duration-700 ease-in-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Section */}
        <div className="w-full flex flex-col items-center justify-center p-4">
          <img
            src={cameraPhoto}
            alt="Upload"
            className="w-20 h-20 object-cover mb-6 border-2 p-2 rounded-lg border-gray-300"
          />
          <p className="text-center text-lg font-semibold">
            Upload your own photos
          </p>
        </div>

        {/* Divider Line */}
        <div className="h-px bg-white w-3/4 self-center my-4" />

        {/* Bottom Section */}
        <div className="w-full flex flex-col justify-center p-4">
          <h3 className="text-xl font-bold mb-3 text-center z-40">Categories</h3>
          <ul className="grid grid-cols-3 gap-3">
            {categories.map((category, index) => (
              <li key={index} className="text-center z-50">
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
export default forwardRef(SquarePrints);
