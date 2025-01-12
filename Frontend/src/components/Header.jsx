import React from 'react';
import { Link } from 'react-router-dom';
import headerPhoto from '../assets/header.png';
import profileIcon from '../assets/profile.png';

const Header = () => {
  return (
    <header>
      {/* Top Strip with Photo */}
      <div className="bg-[#2E2210] text-[#EDE8E0] flex justify-center items-center">
        <img src={headerPhoto} className="w-40" alt="Header" />
      </div>

      {/* Navbar */}
      <div className="bg-[#EDE8E0] text-[#2E2210] py-3">
        <div className="container mx-auto flex justify-between items-center text-lg font-semibold px-20">
          <nav className="flex-1">
            <ul className="flex justify-start space-x-24">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/polaroids" className="hover:underline">Polaroids</Link></li>
              <li><Link to="/postcards" className="hover:underline">Postcards</Link></li>
              <li><Link to="/wallposters" className="hover:underline">Wall Posters</Link></li>
              <li><Link to="/strips" className="hover:underline">Strips</Link></li>
              <li><Link to="/squareprints" className="hover:underline">Square Prints</Link></li>
            </ul>
          </nav>
          {/* Profile Icon Link */}
          <Link to="/login">
            <img src={profileIcon} className="w-6 cursor-pointer" alt="Profile Icon" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
