import React, { forwardRef } from 'react';
import wall from '../assets/wall.jpg';

const WallPosters = (props, ref) => {
  return (
    <div ref={ref} className="relative group bg-[#EDE8E0] text-[#2E2210] overflow-hidden min-h-[400px]">
      <div className="absolute top-0 left-0 z-10 p-4">
        <h3 className="text-6xl">Wall Posters</h3>
      </div>
      <img
        src={wall}
        alt="Wall Posters"
        className="absolute bottom-0 right-0 w-[80%] h-[70%] object-cover"
      />
    </div>
  );
};

// Wrap with forwardRef
export default forwardRef(WallPosters);
