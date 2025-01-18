import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  // Log out handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user from localStorage on logout
    navigate("/", { replace: true });
  };

  // Scroll to section handler
  const scrollToSection = (ref) => {
    if (ref.current) {
      const offset = -110; // Adjust the scroll position by 10px above the section
      window.scrollTo({
        top:
          ref.current.getBoundingClientRect().top + window.pageYOffset + offset,
        behavior: "smooth",
      });
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    navigate("/", { replace: true });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle scroll to section and redirection
  const handleSectionClick = (ref) => {
    if (location.pathname === "/") {
      // If we are on the home page, scroll directly to the section
      scrollToSection(ref);
    } else {
      // If we are on another route, navigate to home and then scroll to the section
      navigate("/", { replace: true });
      setTimeout(() => {
        scrollToSection(ref);
      }, 350); // Delay to allow navigation to happen first
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top Strip with Photo */}
      <div className="bg-[#2E2210] text-[#EDE8E0] flex justify-center items-center">
        <img src={headerPhoto} className="w-40" alt="Header" />
      </div>

      {/* Navbar */}
      <div className="bg-[#ebe1d2] text-[#2E2210] py-3">
        <div className="container mx-auto flex justify-between items-center text-lg font-semibold px-10">
          <nav className="flex-1">
            <ul className="flex justify-start space-x-24">
              <li>
                <button onClick={scrollToTop} className="hover:underline">
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick(postcardsRef)}
                  className="hover:underline"
                >
                  Postcards
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick(polaroidsRef)}
                  className="hover:underline"
                >
                  Polaroids
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick(wallPostersRef)}
                  className="hover:underline"
                >
                  Wall Posters
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick(squarePrintsRef)}
                  className="hover:underline"
                >
                  Square Prints
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick(photoStripsRef)}
                  className="hover:underline"
                >
                  Photo Strips
                </button>
              </li>
            </ul>
          </nav>
          {/* Profile or User Name */}
          {user ? (
            <div className="flex items-center space-x-8">
              <div className="lefty flex items-center justify-start space-x-2">
                <img
                  src={profileIcon}
                  className="w-5 cursor-pointer"
                  alt="Profile Icon"
                />
                <span className="text-[#2E2210]">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-700 text-[16px] text-white py-1 px-3 rounded-lg hover:bg-red-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
            <Link to="/login">
              {/* <img src={profileIcon} className="w-6 cursor-pointer" alt="Profile Icon" /> */}
              <span className="text-green-950 hover:underline">Login</span> /{" "}
              {/* <span className="text-blue-700 hover:underline">SignUp</span> */}
            </Link>
            <Link to="/signup">
              <span className="text-blue-950 hover:underline">SignUp</span>
            </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
