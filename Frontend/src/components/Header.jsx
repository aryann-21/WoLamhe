import React from "react";
import { Link } from "react-router-dom";
import headerPhoto from "../assets/header.png";
import profileIcon from "../assets/profile.png";
import { useUser } from "../context/UserContext";

const Header = ({
  polaroidsRef,
  postcardsRef,
  wallPostersRef,
  squarePrintsRef,
  photoStripsRef,
}) => {
  const { user, setUser } = useUser();

  // Log out handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user from localStorage on logout
  };

  // Scroll to section handler
  const scrollToSection = (ref) => {
    if (ref.current) {
      const offset = -110; // Adjust the scroll position by 10px above the section
      window.scrollTo({
        top: ref.current.getBoundingClientRect().top + window.pageYOffset + offset,
        behavior: "smooth",
      });
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top Strip with Photo */}
      <div className="bg-[#2E2210] text-[#EDE8E0] flex justify-center items-center">
        <img src={headerPhoto} className="w-40" alt="Header" />
      </div>

      {/* Navbar */}
      <div className="bg-[#ebe1d2] text-[#2E2210] py-3">
        <div className="container mx-auto flex justify-between items-center text-lg font-semibold px-20">
          <nav className="flex-1">
            <ul className="flex justify-start space-x-24">
              <li>
                <button onClick={scrollToTop} className="hover:underline">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(polaroidsRef)} className="hover:underline">
                  Polaroids
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(postcardsRef)} className="hover:underline">
                  Postcards
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(wallPostersRef)} className="hover:underline">
                  Wall Posters
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(photoStripsRef)} className="hover:underline">
                  Strips
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection(squarePrintsRef)} className="hover:underline">
                  Square Prints
                </button>
              </li>
            </ul>
          </nav>
          {/* Profile or User Name */}
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-[#2E2210]">{user.name}</span>
              <button onClick={handleLogout} className="text-red-600 hover:underline">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <img src={profileIcon} className="w-6 cursor-pointer" alt="Profile Icon" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
