import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { artifacts } from "../data";
import { useState, useRef } from "react";

export default function ArtifactNarration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const artifact = artifacts.find((item) => item.id.toString() === id);

  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  if (!artifact) return <div style={{ color: "white", textAlign: "center", padding: "100px" }}>Loading...</div>;

  const storyText = artifact.description || "Ancient Egypt was a civilization of ancient North Africa.";
  const words = storyText.split(" ");

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:wght@300;400;700&display=swap');

    .narration-page {
      min-height: 100vh;
      background: transparent;
      color: white;
      padding: 120px 8% 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .narration-inner {
      width: 100%;
      max-width: 800px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .narration-title {
      font-family: 'Cinzel', serif;
      font-size: 3rem;
      font-weight: 700;
      color: transparent;
      background: linear-gradient(180deg, #f5e49c 0%, #d4af5a 50%, #a07830 100%);
      -webkit-background-clip: text;
      background-clip: text;
      margin: 0;
    }

    .narration-ornament {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: -16px;
    }

    .orn-line { height: 1px; width: 60px; background: linear-gradient(to right, transparent, #d4af5a); }
    .orn-line.r { background: linear-gradient(to left, transparent, #d4af5a); }
    .orn-diamond { width: 5px; height: 5px; background: #d4af5a; transform: rotate(45deg); }

    .narration-meta {
      font-family: 'Lato', sans-serif;
      font-size: 0.75rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
    }

    .narration-audio {
      width: 100%;
      opacity: 0.6;
    }

    .narration-text {
      font-family: 'Lato', sans-serif;
      font-size: 1.4rem;
      line-height: 2;
      font-weight: 300;
    }

    .narration-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(135deg, #d4af5a, #f0d080);
      color: #1a1200;
      border: none;
      border-radius: 50px;
      padding: 15px 36px;
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(212,175,90,0.4);
      transition: all 0.3s ease;
      align-self: center;
      margin-top: 20px;
    }

    .narration-btn:hover {
      box-shadow: 0 6px 28px rgba(212,175,90,0.6);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .narration-title { font-size: 2rem; }
      .narration-text { font-size: 1.1rem; }
      .narration-btn { font-size: 0.75rem; padding: 12px 28px; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="narration-page">
        <div className="narration-inner">

<div>
  <h1
    className="narration-title"
    style={{
      color: currentTime > 0 ? "#d4af5a" : "rgba(255,255,255,0.2)",
      textShadow: currentTime > 0 ? "0 0 20px rgba(212,175,90,0.6)" : "none",
      transition: "all 0.6s ease",
      background: "none",
      WebkitBackgroundClip: "unset",
      backgroundClip: "unset",
    }}
  >
    {artifact.name}
  </h1>
</div>

          <p className="narration-meta">{artifact.kingdom} · {artifact.material}</p>

          <audio
            ref={audioRef}
            src={artifact.audioPath}
            onTimeUpdate={handleTimeUpdate}
            controls
            className="narration-audio"
          />

          <div className="narration-text">
            {words.map((word, index) => {
              const timestamps = artifact.timestamps || [];
              const delay = 1.0;
              const isActive = timestamps[index] !== undefined
                ? currentTime >= timestamps[index] + delay
                : currentTime > index * 0.4;
              return (
                <span
                  key={index}
                  style={{
                    color: isActive ? "#d4af5a" : "rgba(255,255,255,0.2)",
                    textShadow: isActive ? "0 0 15px rgba(212,175,90,0.5)" : "none",
                    transition: "all 0.4s ease",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <button className="narration-btn" onClick={() => navigate(`/artifact/${id}/model`)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#1a1200" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="#1a1200" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="#1a1200" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View 3D Model
          </button>

        </div>
      </div>
    </>
  );
}