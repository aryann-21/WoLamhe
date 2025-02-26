import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import headerPhoto from "../assets/header.png"
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"

const Header = ({ polaroidsRef, postcardsRef, wallPostersRef, squarePrintsRef, photoStripsRef }) => {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const { cartItems } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/", { replace: true })
  }

  const scrollToSection = (ref) => {
    if (ref.current) {
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
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="bg-[#2E2210] text-[#EDE8E0] flex justify-center items-center">
        <img src={headerPhoto || "/placeholder.svg"} className="w-32 md:w-40" alt="Header" />
      </div>

      <div className="bg-[#ebe1d2] text-[#2E2210] py-3">
        <div className="container mx-auto flex justify-between items-center text-lg font-semibold px-4">
          <nav className="hidden md:flex flex-1">
            <ul className="flex justify-start space-x-6 lg:space-x-24">
              <li>
                <button onClick={scrollToTop} className="hover:underline">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleSectionClick(postcardsRef)} className="hover:underline">
                  Postcards
                </button>
              </li>
              <li>
                <button onClick={() => handleSectionClick(polaroidsRef)} className="hover:underline">
                  Polaroids
                </button>
              </li>
              <li>
                <button onClick={() => handleSectionClick(wallPostersRef)} className="hover:underline">
                  Wall Posters
                </button>
              </li>
              <li>
                <button onClick={() => handleSectionClick(squarePrintsRef)} className="hover:underline">
                  Square Prints
                </button>
              </li>
              <li>
                <button onClick={() => handleSectionClick(photoStripsRef)} className="hover:underline">
                  Photo Strips
                </button>
              </li>
            </ul>
          </nav>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-6">
              <Link to="/order" className="relative hover:opacity-80 transition-opacity">
                <ShoppingCart className="w-6 h-6 text-[#2E2210]" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity">
                  <User className="w-6 h-6 text-[#2E2210]" />
                  <span className="text-[#2E2210] hidden md:inline">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#ebe1d2] transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#ebe1d2] transition-colors"
                  >
                    <LogOut className="w-4 h-4 inline-block mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-[#2E2210] hover:underline">
                Login
              </Link>
              <Link to="/signup" className="text-[#2E2210] hover:underline">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#ebe1d2] text-[#2E2210] py-4">
          <ul className="flex flex-col items-center space-y-4">
            <li>
              <button
                onClick={() => {
                  scrollToTop()
                  setIsMenuOpen(false)
                }}
                className="hover:underline"
              >
                Home
              </button>
            </li>
            <li>
              <button onClick={() => handleSectionClick(postcardsRef)} className="hover:underline">
                Postcards
              </button>
            </li>
            <li>
              <button onClick={() => handleSectionClick(polaroidsRef)} className="hover:underline">
                Polaroids
              </button>
            </li>
            <li>
              <button onClick={() => handleSectionClick(wallPostersRef)} className="hover:underline">
                Wall Posters
              </button>
            </li>
            <li>
              <button onClick={() => handleSectionClick(squarePrintsRef)} className="hover:underline">
                Square Prints
              </button>
            </li>
            <li>
              <button onClick={() => handleSectionClick(photoStripsRef)} className="hover:underline">
                Photo Strips
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Header

