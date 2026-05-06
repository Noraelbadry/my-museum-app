import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import ArtifactDetails from "./pages/ArtifactDetails";
import AboutMuseum from "./pages/AboutMuseum";
import ArtifactNarration from "./pages/ArtifactNarration";
import IntroScreen from "./components/IntroScreen";
import GoldenParticles from "./components/GoldenParticles";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      <GoldenParticles />
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutMuseum />} />
        <Route path="/artifact/:id" element={<ArtifactNarration />} />
        <Route path="/artifact/:id/model" element={<ArtifactDetails />} />
      </Routes>
    </>
  );
}

export default App;