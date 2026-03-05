import { useParams, useNavigate } from "react-router-dom";
import { artifacts } from "../data";
import "@google/model-viewer";

export default function ArtifactDetails() {
  const { id } = useParams();
  const artifact = artifacts.find((item) => item.id.toString() === id);

  if (!artifact) return <div style={{ color: "white", textAlign: "center", padding: "100px" }}>Loading...</div>;

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#0a0a0a", 
      color: "white",
      padding: "20px" // رجعنا البادينج طبيعي
    }}>
      
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center" 
      }}>
        
        {/* الحل هنا: استخدمنا marginTop للعنوان فقط عشان ينزل تحت النيف بار */}
        <h1 style={{ 
          fontSize: "3rem", 
          color: "gold", 
          marginTop: "80px", // المسافة دي عشان النيف بار
          marginBottom: "20px", 
          fontWeight: "1000" 
        }}>
          {artifact.name}
        </h1>

        {/* حاوية الموديل */}
        <div style={{ 
          width: "100%", 
          height: "600px", 
          backgroundColor: "rgba(255, 255, 255, 0.03)", 
          borderRadius: "30px",
          border: "1px solid rgba(255, 215, 0, 0.2)",
          marginBottom: "30px",
          display: "flex", // عشان نضمن السنترة جوه
          justifyContent: "center",
          alignItems: "center"
        }}>
          <model-viewer
            src={artifact.modelPath}
            alt={artifact.name}
            auto-rotate
            camera-controls
            shadow-intensity="2"
            exposure="1.2"
            environment-image="neutral"
            style={{ width: "95%", height: "95%" }} // سيبنا مساحة صغيرة جوه الحاوية
          >
          </model-viewer>
        </div>

        <div style={{ textAlign: "center", maxWidth: "800px" }}>
          <h2 style={{ color: "gold", borderBottom: "1px solid gold", display: "inline-block", paddingBottom: "5px" }}>
            About the Artifact
          </h2>
          <p style={{ fontSize: "1.2rem", marginTop: "20px", lineHeight: "1.6" }}>
            <strong>Kingdom:</strong> {artifact.kingdom} <br />
            <strong>Material:</strong> {artifact.material}
          </p>
        </div>
      </div>
    </div>
  );
}