import React, { forwardRef } from 'react';
import Polaroid from '../assets/Polaroids.jpg';

const Polaroids = (props, ref) => {
  return (
    <div ref={ref} className="relative group bg-[#EDE8E0] overflow-hidden min-h-[300px]">
      <img
        src={Polaroid}
        alt="Polaroids"
        className="absolute top-0 left-0 w-[80%] h-[70%] object-cover"
      />
      <div className="absolute bottom-0 right-0 z-10 p-4">
        <h3 className="text-6xl text-[#2E2210]">Polaroids</h3>
      </div>
    </div>
  );
};

// Wrap with forwardRef
export default forwardRef(Polaroids);
