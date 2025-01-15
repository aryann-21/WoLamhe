import React, { forwardRef } from 'react';
import postcard from '../assets/postcard.jpg';

const PostCards = (props, ref) => {
  return (
    <div ref={ref} className="relative group bg-[#D3B495] overflow-hidden min-h-[400px]">
      <div className="absolute top-0 right-0 z-10 p-4">
        <h3 className="text-6xl text-[#2E2210]">PostCards</h3>
      </div>
      <img
        src={postcard}
        alt="PostCards"
        className="absolute bottom-0 left-0 w-[80%] h-[70%] object-cover"
      />
    </div>
  );
};

// Wrap with forwardRef
export default forwardRef(PostCards);
