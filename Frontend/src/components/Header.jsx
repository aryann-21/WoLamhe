import React from 'react';
import logo from '../assets/logo.png'; // Ensure this path is correct
import personIcon from '../assets/logo.png'; // Ensure this path is correct

const Header = () => {
  return (
    <header>
      {/* Top Strip with Photo */}
        
      <div className="bg-[#2E2210] text-[#EDE8E0] py-2 text-center">
          Dil se Dil Tak
      </div>

      {/* Navbar */}
      <div className="bg-[#EDE8E0] text-[#2E2210] py-4">
        <div className="container mx-auto flex justify-between items-center text-lg font-semibold px-4">
          <nav className="flex-1">
            <ul className="flex justify-around">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Polaroids</a></li>
              <li><a href="#" className="hover:underline">Postcards</a></li>
              <li><a href="#" className="hover:underline">Wall Posters</a></li>
              <li><a href="#" className="hover:underline">Strips</a></li>
              <li><a href="#" className="hover:underline">Square Prints</a></li>
            </ul>
          </nav>
          {/* <img src={personIcon} alt="Person Icon" className="h-8" />
           */}
           <p>ID</p>
        </div>
      </div>
    </header>
  );
};

export default Header;