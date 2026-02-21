import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { artifacts } from "../data";
import "@google/model-viewer";   
import "./AkhenatonDetails.css";

export default function AkhenatonDetails() {
  const { id } = useParams();
  const artifact = artifacts.find((a) => a.id === parseInt(id));

  if (!artifact)
    return (
      <>
        <Navbar />
        <h2 style={{ color: "white", padding: "100px" }}>
          Artifact not found
        </h2>
      </>
    );

  return (
    <>
      <Navbar />

      <div className="details-container">
        <h1>{artifact.name}</h1>

        <p style={{ fontSize: "20px", marginTop: "20px" }}>
          Material: {artifact.material}
        </p>

        <p style={{ fontSize: "18px", marginTop: "10px" }}>
          Period: {artifact.period}
        </p>

        {/*  3D MODEL SECTION */}
        <div style={{ marginTop: "40px" }}>
          <model-viewer
            src="/models/akhenaten.glb"   
            alt="3D Model"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            min-field-of-view="0deg"
            max-field-of-view="45deg"
            interpolation-decay="200"
            style={{
             width: "100vw",
    minHeight: "100Vh",
    margin: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
     boxSizing: "border-box",
  
            }}
          ></model-viewer>
        </div>

      </div>
    </>
  );
}
