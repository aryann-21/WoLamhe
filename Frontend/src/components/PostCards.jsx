"use client"

import { forwardRef, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import postcard from "../assets/postcard.jpg"
import cameraPhoto from "../assets/camera.png"

const PostCards = forwardRef((props, ref) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const overlayRef = useRef(null)
  const navigate = useNavigate()

  const categories = ["General", "VanGogh", "Blue", "Yellow", "Red", "Green"]

  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category)
    navigate(`/presets/${category.toLowerCase()}`, {
      state: { fromPage: "Postcards", category: category },
    })
  }

  const handleTouchStart = (e) => {
    // Only toggle if touching the main container, not the overlay
    if (e.currentTarget === e.target) {
      e.preventDefault()
      setIsTouched(!isTouched)
    }
  }

  const handleOverlayTouch = (e) => {
    // Check if the touch is directly on the overlay background (not its children)
    if (e.target === overlayRef.current) {
      e.stopPropagation()
      setIsTouched(false)
    }
  }

  return (
    <div
      ref={ref}
      className="relative group bg-[#D3B495] overflow-hidden min-h-[300px] md:min-h-[400px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
    >
      <div className="absolute right-0 top-0 z-10 p-4">
        <h3
          className={`text-3xl md:text-6xl text-[#2E2210] transition-opacity duration-700 ${
            isHovered || isTouched ? "opacity-0" : "opacity-100"
          }`}
        >
          Postcards
        </h3>
      </div>

      <img
        src={postcard || "/placeholder.svg"}
        alt="PostCards"
        className="absolute bottom-0 left-0 w-full md:w-[80%] h-[70%] object-cover"
      />

      <div
        ref={overlayRef}
        className={`absolute inset-0 bg-black bg-opacity-70 flex flex-col md:flex-row text-white text-lg transition-all duration-700 ease-in-out overflow-y-auto ${
          isHovered || isTouched ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onTouchStart={handleOverlayTouch}
      >
        {/* Close button for mobile */}
       

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 min-h-[200px]">
          <img
            src={cameraPhoto || "/placeholder.svg"}
            alt="Upload"
            className="w-20 h-20 md:w-24 md:h-24 object-cover mb-8 border-2 p-3 rounded-lg border-gray-300 cursor-pointer"
            onClick={() => navigate("/upload", { state: { fromPage: "Postcards" } })}
          />
          <p className="text-center text-xl font-semibold">Upload your own photos</p>
        </div>

        <div className="hidden md:block w-px bg-white self-stretch mx-4" />

        <div className="w-full md:w-1/2 flex flex-col justify-center p-6">
          <h3 className="text-2xl font-bold mb-4 md:mb-8 text-center z-40">Postcards</h3>
          <div className="pb-4">
            <ul className="grid grid-cols-2 md:grid-cols-2 gap-4 pb-4">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="text-center z-40 cursor-pointer hover:bg-slate-300 hover:bg-opacity-20 p-2 rounded"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
})

export default PostCards
