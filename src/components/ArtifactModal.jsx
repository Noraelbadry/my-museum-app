import React from "react";

function ArtifactModal({ artifact, onClose }) {
  if (!artifact) return null;

  return (
    <div className="modal" style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000
      }}>
      <div style={{
        background: "#111", 
        padding: "20px", 
        borderRadius: "15px", 
        maxWidth: "600px", 
        width: "90%",
        color: "#fff",
        border: "1px solid #d4af37"
      }}>
        <button onClick={onClose} style={{float:"right", cursor: "pointer", background: "none", border: "none", color: "#fff"}}>✕ Close</button>
        <h2 style={{color: "#d4af37"}}>{artifact.name}</h2>

        {/* الحاوية الخاصة بمشغل الـ 3D */}
        <div style={{ width: "100%", height: "400px", backgroundColor: "#000", borderRadius: "10px", margin: "15px 0" }}>
          
          <model-viewer
            src={artifact.modelPath}  // المسار من ملف artifacts.js
            ar                        // تفعيل ميزة الواقع المعزز
            ar-modes="scene-viewer webxr quick-look" 
            ar-placement="floor"      // عشان يظهر على الأرض
            camera-controls           // عشان اليوزر يلف الموديل بإيده
            auto-rotate               // دوران تلقائي بسيط
            shadow-intensity="1"      // عشان يرمي ظل على الأرض في الـ AR
            style={{ width: "100%", height: "100%" }}
          >
            {/* الزرار اللي هيظهر جوه صفحة الـ 3D موبايل */}
            <button slot="ar-button" style={{
              backgroundColor: "#d4af37",
              borderRadius: "8px",
              border: "none",
              position: "absolute",
              bottom: "16px",
              right: "16px",
              padding: "12px 20px",
              color: "#000",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
            }}>
              🏠 View in AR
            </button>
          </model-viewer>

        </div>

        <p style={{fontSize: "14px", lineHeight: "1.6"}}>{artifact.description}</p>
        
        <audio controls style={{width: "100%", marginTop: "10px"}}>
          <source src={artifact.audioPath} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
}

export default ArtifactModal;