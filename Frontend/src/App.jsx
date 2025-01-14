import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; 
import Header from "./components/Header";
import Footer from "./components/Footer";
import Polaroids from "./components/Polaroids";
import PostCards from "./components/PostCards";
import WallPosters from "./components/WallPosters";
import SquarePrints from "./components/SquarePrints";
import PhotoStrips from "./components/PhotoStrips";
import LoginPage from "./components/LoginPage";
import mainPhoto from "./assets/main.jpg";
import SignUpPage from "./components/SignUpPage";

const App = () => {
  const polaroidsRef = useRef(null);
  const postcardsRef = useRef(null);
  const wallPostersRef = useRef(null);
  const squarePrintsRef = useRef(null);
  const photoStripsRef = useRef(null);

  return (
    <UserProvider>
      <div>
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
              <main className="bg-gray-100">
                <section className="h-screen flex">
                  <div className="w-1/2">
                    <img src={mainPhoto} alt="Main" className="object-cover h-full w-full" />
                  </div>
                  <div className="w-1/2 flex flex-col justify-center items-start bg-[#D3B495] text-[#2E2210] p-8">
                    <h1 className="text-6xl font-bold mb-12 tracking-wider leading-tight">Heyy...</h1>
                    <p className="text-xl max-w-md tracking-wide leading-relaxed font-semibold">
                      Realize the power of print and let your memories shine! From personalized polaroids to stunning postcards, trendy strips, sleek square prints, and epic wall posters—every format tells your story in style. Transform moments into timeless treasures, because your memories deserve more than just a screen!
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
        </Routes>
        <Footer />
      </div>
    </UserProvider>
  );
};

export default App;
