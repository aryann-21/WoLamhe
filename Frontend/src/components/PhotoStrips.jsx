import React from "react";
import strips from "../assets/strips.jpg";

const PhotoStrips = () => {
  return (
    <div className="relative group bg-[#8B6641] text-[#2E2210] overflow-hidden min-h-[400px]">
      <div className="absolute top-0 left-0 z-10 p-4">
        <h3 className="text-4xl">Photo Strips</h3>
      </div>
      <img
        src={strips}
        alt="Photo Strips"
        className="absolute bottom-0 right-0 w-[80%] h-[80%] object-cover"
      />
      {/* <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <p className="text-white text-center">
          Trendy photo strips for a modern touch.
        </p>
      </div> */}
    </div>
  );
};

export default PhotoStrips;
