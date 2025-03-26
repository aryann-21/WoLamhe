import React, { useRef } from "react"
import { Routes, Route } from "react-router-dom"
import { UserProvider } from "./context/UserContext"
import { CartProvider } from "./context/CartContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Polaroids from "./components/Polaroids"
import PostCards from "./components/PostCards"
import WallPosters from "./components/WallPosters"
import SquarePrints from "./components/SquarePrints"
import PhotoStrips from "./components/PhotoStrips"
import LoginPage from "./components/LoginPage"
import mainPhoto from "./assets/main.jpg"
import SignUpPage from "./components/SignUpPage"
import Presets from "./components/Presets"
import UploadPage from "./components/UploadPage"
import OrderPage from "./components/OrderPage"
import ProfilePage from "./components/ProfilePage"

const App = () => {
  const polaroidsRef = useRef(null)
  const postcardsRef = useRef(null)
  const wallPostersRef = useRef(null)
  const squarePrintsRef = useRef(null)
  const photoStripsRef = useRef(null)

  return (
    <UserProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header
            polaroidsRef={polaroidsRef}
            postcardsRef={postcardsRef}
            wallPostersRef={wallPostersRef}
            squarePrintsRef={squarePrintsRef}
            photoStripsRef={photoStripsRef}
          />
          <Routes>
            <Route
              path="/"
              element={
                <main className="flex-grow bg-gray-100">
                  <section className="min-h-screen flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 h-[50vh] md:h-auto">
                      <img src={mainPhoto || "/placeholder.svg"} alt="Main" className="object-cover w-full h-full" />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center items-start bg-[#D3B495] text-[#2E2210] p-8">
                      <h1 className="text-4xl md:text-6xl font-bold mb-8 md:mb-12 tracking-wider leading-tight">
                        Mishri si yeh yaadein sambhali padhi hai in kagaz ke tukdo mein
                      </h1>
                      <p className="text-lg md:text-xl max-w-md tracking-wide leading-relaxed font-semibold">
                        Why let memories fade when you can turn them into timeless treasures? From Polaroids to
                        postcards, film strips to posters, we create prints that make your moments unforgettable. Start
                        preserving your story today!
                      </p>
                    </div>
                  </section>

                  {/* Sections Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <PostCards ref={postcardsRef} />
                    <Polaroids ref={polaroidsRef} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    <div className="col-span-1">
                      <WallPosters ref={wallPostersRef} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <SquarePrints ref={squarePrintsRef} />
                      <PhotoStrips ref={photoStripsRef} />
                    </div>
                  </div>
                </main>
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/polaroids" element={<Polaroids />} />
            <Route path="/postcards" element={<PostCards />} />
            <Route path="/wallposters" element={<WallPosters />} />
            <Route path="/strips" element={<PhotoStrips />} />
            <Route path="/squareprints" element={<SquarePrints />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/presets/:category" element={<Presets />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </UserProvider>
  )
}

export default App

