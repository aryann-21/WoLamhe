import React, { forwardRef } from "react";
import strips from "../assets/strips.jpg";

const PhotoStrips = (props, ref) => {
  return (
    <div ref={ref} className="relative group bg-[#8B6641] text-[#2E2210] overflow-hidden min-h-[400px]">
      <div className="absolute top-0 left-0 z-10 p-4">
        <h3 className="text-4xl">Photo Strips</h3>
      </div>
      <img
        src={strips}
        alt="Photo Strips"
        className="absolute bottom-0 right-0 w-[80%] h-[80%] object-cover"
      />
    </div>
  );
};

// Wrap with forwardRef
export default forwardRef(PhotoStrips);
