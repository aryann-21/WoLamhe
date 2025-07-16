"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import headerPhoto from "../assets/header.png"
import { ShoppingCart, User, LogOut, Menu, X, ChevronDown } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"

const Header = ({ polaroidsRef, postcardsRef, wallPostersRef, squarePrintsRef, photoStripsRef }) => {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItems } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate("/", { replace: true })
  }

  const scrollToSection = (ref) => {
    if (ref?.current) {
      const offset = -110
      window.scrollTo({
        top: ref.current.getBoundingClientRect().top + window.pageYOffset + offset,
        behavior: "smooth",
      })
    }
  }

  const scrollToTop = () => {
    navigate("/", { replace: true })
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleSectionClick = (ref) => {
    if (location.pathname === "/") {
      scrollToSection(ref)
    } else {
      navigate("/", { replace: true })
      setTimeout(() => {
        scrollToSection(ref)
      }, 350)
    }
    setIsMenuOpen(false)
  }

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
      {/* Logo Banner */}
      <div className="bg-[#2E2210] text-[#EDE8E0] flex justify-center items-center py-1 md:py-2">
        <img
          src={headerPhoto || "/placeholder.svg?height=80&width=160"}
          className="w-28 md:w-40 transition-all duration-300"
          alt="Header"
        />
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#ebe1d2] text-[#2E2210] py-3 transition-all duration-300 font-semibold">
        <div className="container mx-auto flex justify-between items-center text-lg px-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1">
            <ul className="flex justify-start space-x-4 lg:space-x-8 xl:space-x-16">
              <li>
                <button
                  onClick={scrollToTop}
                  className="px-2 py-1 hover:text-[#5c4421] transition-colors relative group"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E2210] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick(postcardsRef)}
                  className="px-2 py-1 hover:text-[#5c4421] transition-colors relative group"
                >
                  Postcards
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E2210] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick(polaroidsRef)}
                  className="px-2 py-1 hover:text-[#5c4421] transition-colors relative group"
                >
                  Polaroids
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E2210] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick(wallPostersRef)}
                  className="px-2 py-1 hover:text-[#5c4421] transition-colors relative group"
                >
                  Wall Posters
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E2210] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick(squarePrintsRef)}
                  className="px-2 py-1 hover:text-[#5c4421] transition-colors relative group"
                >
                  Square Prints
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E2210] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick(photoStripsRef)}
                  className="px-2 py-1 hover:text-[#5c4421] transition-colors relative group"
                >
                  Photo Strips
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E2210] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1 rounded-md hover:bg-[#d6cbb9] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* User Actions */}
          {user ? (
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Cart */}
              <Link
                to="/order"
                className="relative p-1.5 rounded-full hover:bg-[#d6cbb9] transition-all duration-200"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-[#2E2210]" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8B4513] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium animate-pulse">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center space-x-1 p-1.5 rounded-md hover:bg-[#d6cbb9] transition-all duration-200"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="w-5 h-5 md:w-6 md:h-6 text-[#2E2210]" />
                  <span className="text-[#2E2210] hidden md:inline text-sm md:text-base truncate max-w-[100px]">
                    {user.name}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 hidden md:block transition-transform duration-200"
                    style={{ transform: isUserMenuOpen ? "rotate(180deg)" : "rotate(0)" }}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-[#d6cbb9] overflow-hidden">
                    <div className="px-4 py-2 bg-[#f5f0e8] border-b border-[#d6cbb9]">
                      <p className="text-sm font-medium text-[#2E2210] truncate">{user.name}</p>
                      <p className="text-xs text-[#5c4421] truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-[#2E2210] hover:bg-[#f5f0e8] transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-[#2E2210] hover:bg-[#f5f0e8] transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-x-2 md:space-x-4">
              <Link
                to="/login"
                className="px-5 py-1.5 text-sm md:text-base bg-[#2E2210] text-[#EDE8E0] hover:bg-[#5c4421] rounded-md transition-colors"
              >
                Login
              </Link>
              {/* <Link
                to="/signup"
                className="px-3 py-1.5 text-sm md:text-base bg-[#2E2210] text-[#EDE8E0] hover:bg-[#5c4421] rounded-md transition-colors"
              >
                Sign Up
              </Link> */}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-[#f5f0e8] text-[#2E2210] overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-96 border-b border-[#d6cbb9]" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col py-2">
          <li>
            <button
              onClick={() => {
                scrollToTop()
                setIsMenuOpen(false)
              }}
              className="w-full text-left px-6 py-3 hover:bg-[#ebe1d2] transition-colors"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSectionClick(postcardsRef)}
              className="w-full text-left px-6 py-3 hover:bg-[#ebe1d2] transition-colors"
            >
              Postcards
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSectionClick(polaroidsRef)}
              className="w-full text-left px-6 py-3 hover:bg-[#ebe1d2] transition-colors"
            >
              Polaroids
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSectionClick(wallPostersRef)}
              className="w-full text-left px-6 py-3 hover:bg-[#ebe1d2] transition-colors"
            >
              Wall Posters
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSectionClick(squarePrintsRef)}
              className="w-full text-left px-6 py-3 hover:bg-[#ebe1d2] transition-colors"
            >
              Square Prints
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSectionClick(photoStripsRef)}
              className="w-full text-left px-6 py-3 hover:bg-[#ebe1d2] transition-colors"
            >
              Photo Strips
            </button>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header

