import { useParams } from "react-router-dom";
import { artifacts } from "../data";
import { useState, useRef } from "react";
import "@google/model-viewer";

export default function ArtifactDetails() {
  const { id } = useParams();
  const artifact = artifacts.find((item) => item.id.toString() === id);

  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const modelRef = useRef(null);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleARClick = () => {
    if (modelRef.current) {
      modelRef.current.activateAR();
    }
  };

  if (!artifact) return <div style={{ color: "white", textAlign: "center", padding: "100px" }}>Loading...</div>;

  const storyText = artifact.description || "Ancient Egypt was a civilization of ancient North Africa.";
  const words = storyText.split(" ");

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

    .detail-page {
      min-height: 100vh;
      background: transparent;
      color: white;
      padding: 120px 5% 60px;
      display: flex;
      gap: 50px;
      flex-direction: row;
      align-items: flex-start;
    }

    .detail-text {
      flex: 1;
      height: 80vh;
      overflow-y: auto;
      padding-right: 30px;
      text-align: left;
      scrollbar-width: none;
    }

    .detail-text::-webkit-scrollbar { display: none; }

    .detail-title {
      font-family: 'Cinzel', serif;
      font-size: 3rem;
      color: gold;
      margin-bottom: 30px;
      font-weight: 700;
    }

    .detail-model-col {
      flex: 1;
      position: sticky;
      top: 120px;
      height: 80vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
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

    .detail-model-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      width: 100%;
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

    .detail-meta {
      text-align: center;
      color: gold;
      font-family: 'Cinzel', serif;
      font-size: 1rem;
      letter-spacing: 2px;
    }

    @media (max-width: 768px) {
      .detail-page {
      display: flex;
        flex-direction: column;
        padding: 100px 5% 60px;
        gap: 30px;
      }

      .detail-text {
        height: auto;
        padding-right: 0;
        width: 100%;
      }

      .detail-title {
        font-size: 1.8rem;
        margin-bottom: 20px;
      }

      .detail-model-col {
        position: sticky;
        top: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        align-self: flex-start;
        height: 80vh;
        
      }

      .detail-model-box {
        height: 55vw;
        min-height: 280px;
        max-height: 400px;
        border-radius: 20px;
      }

      .ar-btn {
        font-size: 0.7rem;
        padding: 10px 22px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="detail-page">

        {/* TEXT SIDE */}
        <div className="detail-text">
          <h1 className="detail-title">{artifact.name}</h1>

          <audio
            ref={audioRef}
            src={artifact.audioPath || "/audio/sample.mp3"}
            onTimeUpdate={handleTimeUpdate}
            controls
            style={{ marginBottom: "20px", width: "100%", opacity: 0.5 }}
          />

          <div style={{ fontSize: "1.5rem", lineHeight: "1.8", fontWeight: "700" }}>
            {words.map((word, index) => {
              const isActive = currentTime > index * 0.4;
              return (
                <span
                  key={index}
                  style={{
                    color: isActive ? "gold" : "rgba(255,255,255,0.15)",
                    textShadow: isActive ? "0 0 15px gold" : "none",
                    transition: "all 0.4s ease",
                    display: "inline-block",
                    marginRight: "10px",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>

        {/* MODEL SIDE */}
        <div className="detail-model-col">
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

          {/* الزرار برا الـ model-viewer */}
          <div className="detail-model-footer">
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