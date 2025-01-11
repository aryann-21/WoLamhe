import React from 'react';
import Polaroid from '../assets/Polaroids.jpg';

const Polaroids = () => {
  return (
    <div className="relative group bg-[#EDE8E0] overflow-hidden min-h-[300px]">
      <img
        src={Polaroid}
        alt="Polaroids"
        className="absolute top-0 left-0 w-[80%] h-[70%] object-cover"
      />
      <div className="absolute bottom-0 right-0 z-10 p-4">
        <h3 className="text-6xl text-[#2E2210]">Polaroids</h3>
      </div>
      {/* <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <p className="text-white text-center">Capture your favorite memories in polaroid style.</p>
      </div> */}
    </div>
  );
};

export default Polaroids;