import React, { forwardRef } from 'react';
import Square from '../assets/square.jpg';

const SquarePrints = (props, ref) => {
  return (
    <div ref={ref} className="relative group bg-[#D3B495] text-[#2E2210] overflow-hidden min-h-[400px]">
      <img
        src={Square}
        alt="Square Prints"
        className="absolute top-0 right-0 w-[80%] h-[80%] object-cover"
      />
      <div className="absolute bottom-0 left-0 z-10 p-4">
        <h3 className="text-4xl">Square Prints</h3>
      </div>
    </div>
  );
};

// Wrap with forwardRef
export default forwardRef(SquarePrints);
