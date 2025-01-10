import React from 'react';
import Square from '../assets/square.jpg';

const SquarePrints = () => {
  return (
    <div className="relative group bg-[#D3B495] text-[#2E2210] overflow-hidden min-h-[400px]">
      <img
        src={Square}
        alt="Square Prints"
        className="absolute top-0 right-0 w-[80%] h-[80%] object-cover"
      />
      <div className="absolute bottom-0 left-0 z-10 p-4">
        <h3 className="text-4xl">Square Prints</h3>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <p className="text-white text-center">Perfectly square prints for your memories.</p>
      </div>
    </div>
  );
};

export default SquarePrints;