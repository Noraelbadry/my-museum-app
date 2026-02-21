import { useState } from "react";
import { artifacts } from "../data";
import ArtifactCard from "../components/ArtifactCard";
import { Link } from "react-router-dom";
export default function Home() {
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredId, setHoveredId] = useState(null); 
  const handleClick = (artifact) => {
    setSelected(artifact);
    alert(`You clicked on ${artifact.name}!`);
  };

  const contentStyle = {
    position: "relative",
    zIndex: 1,
    width: "100%",
    color: "white",
    padding: "20px",
    textAlign: "center",
    fontWeight: "1000",
    letterSpacing: "0.5px",
     boxSizing: "border-box",
  };

  const pageStyle = {
    width: "100vw",
    minHeight: "100vh",
    margin: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundImage: 'url("/images/wallpaper.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
     boxSizing: "border-box",
  };

  const filteredArtifacts = artifacts.filter((artifact) =>
    artifact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <h1 style={{ fontSize: "3.1rem", marginBottom: "50px" }}>
          Welcome to the Museum Experience
        </h1>

        <input
          type="text"
          placeholder="Search for an artifact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            margin: "20px auto",
            width: "80%",
            maxWidth: "300px",
            borderRadius: "8px",
            border: "1px solid white",
            display: "block",
            backgroundColor: "rgba(0,0,0,0.3)", 
            color: "white",
            outline: "none",
            backdropFilter: "blur(1px)",
            fontWeight: 600,
          }}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {filteredArtifacts.map((artifact) => (
            <div
              key={artifact.id}
              onMouseEnter={() => setHoveredId(artifact.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                transform: hoveredId === artifact.id ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.3s, filter 0.3s",
                filter:
                  hoveredId && hoveredId !== artifact.id
                    ? "blur(2px)"
                    : "blur(0)",
                zIndex: hoveredId === artifact.id ? 2 : 1,
              }}
            >
              <Link to="/Akhenaten-details" className="artifact-card">
            <Link to="/Nefertit-details" className="artifact-card">
</Link>
            </Link>
              <ArtifactCard artifact={artifact} onClick={handleClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
