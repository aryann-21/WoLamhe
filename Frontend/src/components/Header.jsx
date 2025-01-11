import React from 'react';
import headerPhoto from '../assets/header.png'; // Ensure this path is correct
import profileIcon from '../assets/profile.png'; // Ensure this path is correct

const Header = () => {
  return (
    <header>
      {/* Top Strip with Photo */}
        
      <div className="bg-[#2E2210] text-[#EDE8E0] flex justify-center items-center">
        <img src={headerPhoto} className='w-40'/>
      </div>

      {/* Navbar */}
      <div className="bg-[#EDE8E0] text-[#2E2210] py-3">
        <div className="container mx-auto flex justify-between items-center text-lg font-semibold px-20">
          <nav className="flex-1">
            <ul className="flex justify-start space-x-24">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Polaroids</a></li>
              <li><a href="#" className="hover:underline">Postcards</a></li>
              <li><a href="#" className="hover:underline">Wall Posters</a></li>
              <li><a href="#" className="hover:underline">Strips</a></li>
              <li><a href="#" className="hover:underline">Square Prints</a></li>
            </ul>
          </nav>
          <img src={profileIcon} className='w-6'/>
        </div>
      </div>
    </header>
  );
};

export default Header;