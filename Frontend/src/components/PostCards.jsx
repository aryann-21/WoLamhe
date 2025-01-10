import React from 'react';
import postcard from '../assets/postcard.jpg';

const PostCards = () => {
  return (
    <div className="relative group bg-[#D3B495] overflow-hidden min-h-[400px]">
      <div className="absolute top-0 right-0 z-10 p-4">
        <h3 className="text-6xl text-[#2E2210]">PostCards</h3>
      </div>
      <img
        src={postcard}
        alt="PostCards"
        className="absolute bottom-0 left-0 w-[80%] h-[70%] object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <p className="text-white text-center">Personalized postcards for every occasion.</p>
      </div>
    </div>
  );
};

export default PostCards;