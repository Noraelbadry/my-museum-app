import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import ArtifactDetails from "./pages/ArtifactDetails";
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />


<Route path="/artifact/:id" element={<ArtifactDetails />} />
      </Routes>
    </>
  );
}

export default App;
