import React, { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import polaroid from "../assets/Polaroids.jpg";
import cameraPhoto from "../assets/camera.png";

const Polaroids = (props, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Mountains",
    "Moons",
    "Van Gogh",
    "India",
    "Girly",
    "Flowers",
    "Dogs",
    "Diljit",
    "Famous Singers",
    "Cats",
    "Cars",
    "Birds",
  ];

  const handleCategoryClick = (category) => {
    navigate(`/presets/${category.toLowerCase().replace(/\s+/g, '-')}`, {
      state: { fromPage: "Polaroids", category: category },
    });
  };

  return (
    <div
      ref={ref}
      className="relative group bg-[#D3B495] overflow-hidden min-h-[400px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute right-0 top-0 z-10 p-4">
        <h3
          className={`text-6xl text-[#2E2210] transition-opacity duration-700 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          Polaroids
        </h3>
      </div>

      <img
        src={polaroid}
        alt="Polaroids"
        className="absolute bottom-0 left-0 w-[80%] h-[70%] object-cover"
      />

      <div
        className={`absolute inset-0 bg-black bg-opacity-70 flex text-white text-lg transition-all duration-700 ease-in-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-1/2 flex flex-col items-center justify-center p-6">
          <img
            src={cameraPhoto}
            alt="Upload"
            className="w-24 h-24 object-cover mb-8 border-2 p-3 rounded-lg border-gray-300 cursor-pointer"
            onClick={() => navigate("/upload")}
          />
          <p className="text-center text-xl font-semibold">
            Upload your own photos
          </p>
        </div>

        <div className="w-px bg-white self-center h-3/4 mx-4" />

        <div className="w-1/2 flex flex-col justify-center p-6">
          <h3 className="text-2xl font-bold mb-12 text-center z-40">
            Categories
          </h3>
          <ul className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <li
                key={index}
                className="text-center z-40 cursor-pointer hover:bg-slate-300 hover:bg-opacity-20"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(Polaroids);
