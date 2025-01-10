import React from 'react';
import wall from '../assets/wall.jpg';

const WallPosters = () => {
  return (
    <div className="relative group bg-[#EDE8E0] text-[#2E2210] overflow-hidden min-h-[400px]">
      <div className="absolute top-0 left-0 z-10 p-4">
        <h3 className="text-6xl">Wall Posters</h3>
      </div>
      <img
        src={wall}
        alt="Wall Posters"
        className="absolute bottom-0 right-0 w-[80%] h-[70%] object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <p className="text-white text-center">Decorate your space with stunning wall posters.</p>
      </div>
    </div>
  );
};

export default WallPosters;