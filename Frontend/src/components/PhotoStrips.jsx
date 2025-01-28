import React, { forwardRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import strips from "../assets/strips.jpg"
import cameraPhoto from "../assets/camera.png"

const PhotoStrips = forwardRef((props, ref) => {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/upload", { state: { fromPage: "Photo Strips" } })
  }

  return (
    <div
      ref={ref}
      className="relative group bg-[#8B6641] text-[#2E2210] overflow-hidden min-h-[300px] md:min-h-[400px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <img
        src={strips || "/placeholder.svg"}
        alt="Photo Strips"
        className="absolute bottom-0 right-0 w-full md:w-[80%] h-[80%] object-cover"
      />

      {/* Title */}
      <div className="absolute top-0 right-0 z-10 p-4">
        <h3
          className={`text-2xl md:text-3xl text-[#2E2210] transition-opacity duration-700 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          Photo Strips
        </h3>
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-sm transition-all duration-700 ease-in-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Section */}
        <div className="w-full flex flex-col items-center justify-center p-4">
          <h3 className="text-xl font-bold mb-3 text-center z-40">Photo Strips</h3>

          {/* Divider Line */}
          <div className="h-px bg-white w-3/4 self-center my-4 md:my-8" />

          <img
            src={cameraPhoto || "/placeholder.svg"}
            alt="Upload"
            className="w-16 h-16 md:w-20 md:h-20 object-cover mb-4 md:mb-6 border-2 p-2 rounded-lg border-gray-300 cursor-pointer"
            onClick={handleClick}
          />
          <p className="text-center text-base md:text-lg font-semibold">Upload your own photos</p>
        </div>
      </div>
    </div>
  )
})

export default PhotoStrips

