import { useParams } from "react-router-dom";
import { artifacts } from "../data";
import { useRef } from "react";
import "@google/model-viewer";

export default function ArtifactDetails() {
  const { id } = useParams();
  const artifact = artifacts.find((item) => item.id.toString() === id);
  const modelRef = useRef(null);

  const handleARClick = () => {
    if (modelRef.current) {
      modelRef.current.activateAR();
    }
  };

  if (!artifact) return <div style={{ color: "white", textAlign: "center", padding: "100px" }}>Loading...</div>;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

    .detail-page {
      min-height: 100vh;
      background: transparent;
      color: white;
      padding: 120px 5% 60px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .detail-model-col {
      width: 100%;
      max-width: 700px;
      position: sticky;
      top: 120px;
      height: 80vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
      align-self: flex-start;
    }

    .detail-model-box {
      width: 100%;
      flex: 1;
      background: rgba(0,0,0,0.4);
      border-radius: 40px;
      border: 1px solid rgba(255,215,0,0.2);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 50px rgba(0,0,0,0.5);
      overflow: hidden;
    }

    .detail-title {
      font-family: 'Cinzel', serif;
      font-size: 2rem;
      color: gold;
      font-weight: 700;
      text-align: center;
      margin: 0;
    }

    .detail-meta {
      text-align: center;
      color: gold;
      font-family: 'Cinzel', serif;
      font-size: 1rem;
      letter-spacing: 2px;
    }

    .ar-btn {
      display: none;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #d4af5a, #f0d080);
      color: #1a1200;
      border: none;
      border-radius: 50px;
      padding: 13px 32px;
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 4px 20px rgba(212,175,90,0.4);
      transition: all 0.3s ease;
    }

    .ar-btn:hover {
      box-shadow: 0 6px 28px rgba(212,175,90,0.6);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .detail-page {
        padding: 100px 5% 60px;
      }

      .detail-model-col {
        position: relative;
        top: 0;
        height: auto;
        width: 100%;
      }

      .detail-model-box {
        height: 55vw;
        min-height: 280px;
        max-height: 400px;
        border-radius: 20px;
      }

      .ar-btn {
        display: flex;
        font-size: 0.7rem;
        padding: 10px 22px;
      }

      .detail-meta {
        margin-top: 8px;
        font-size: 0.85rem;
      }

      .detail-title {
        font-size: 1.5rem;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="detail-page">

        <div className="detail-model-col">
          <h1 className="detail-title">{artifact.name}</h1>

          <div className="detail-model-box">
            <model-viewer
              ref={modelRef}
              src={artifact.modelPath}
              alt={artifact.name}
              auto-rotate
              camera-controls
              ar
              ar-modes="webxr quick-look scene-viewer"
              shadow-intensity="2"
              exposure="1.2"
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", width: "100%" }}>
            <button className="ar-btn" onClick={handleARClick}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#1a1200" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="#1a1200" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="#1a1200" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View in Your Space
            </button>

            <div className="detail-meta">
              {artifact.kingdom} | {artifact.material}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}