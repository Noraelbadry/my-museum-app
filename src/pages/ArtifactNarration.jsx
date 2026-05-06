import { useParams, useNavigate } from "react-router-dom";
import { artifacts } from "../data";
import { useState, useRef } from "react";

export default function ArtifactNarration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const artifact = artifacts.find((item) => item.id.toString() === id);

  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  if (!artifact) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "100px" }}>
        Loading...
      </div>
    );
  }

  const storyText = artifact.description || "";
  const words = storyText.split(" ");

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:wght@300;400;700&display=swap');

    .narration-page {
      min-height: 100vh;
      background: transparent; /* شفافة عشان تبين الـ Particles اللي وراها */
      color: white;
      padding: 120px 8% 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .narration-inner {
      width: 100%;
      max-width: 800px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .narration-meta {
      font-family: 'Lato', sans-serif;
      font-size: 0.8rem;
      font-weight: 300;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #d4af5a; /* اللون الذهبي للمعلومات فوق */
      margin-bottom: -10px;
    }

    .narration-title {
      font-family: 'Cinzel', serif;
      font-size: 3.5rem;
      font-weight: 700;
      margin: 0;
      color: #ffffff;
      text-shadow: 0 0 20px rgba(212, 175, 90, 0.3);
    }

   /* ابحثي عن .narration-audio في الكود واستبدليها بهذا التنسيق */

.narration-audio {
  width: 80%;
  height: 60px;
  margin: 30px 0;
  opacity: 0.3; 
  position: center;
  
  
  /* تحويل ألوان المشغل لدرجة ذهبية خافتة تليق بالصورة */
  filter: invert(90%) sepia(80%) saturate(400%) hue-rotate(15deg) brightness(1.5);
  
  border-radius: 30px;
  transition: all 0.5s ease;
}

.narration-audio:hover {
  /* عند الوقوف عليه بالماوس يظهر بوضوح أكثر */
  opacity: 0.8;
  filter: invert(100%) sepia(40%) saturate(600%) hue-rotate(20deg) brightness(2.0);
}
    .narration-text {
      font-family: 'Lato', sans-serif;
      font-size: 1.4rem;
      line-height: 1.8;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.4); /* الكلمات اللي لسه مإتقالتش تكون باهتة */
    }

    .narration-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: linear-gradient(135deg, #d4af5a, #f0d080);
      color: #1a1200;
      border: none;
      border-radius: 50px;
      padding: 16px 40px;
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 4px 25px rgba(212, 175, 90, 0.4);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      align-self: center;
      margin-top: 50px;
    }

    .narration-btn:hover {
      box-shadow: 0 8px 35px rgba(212, 175, 90, 0.6);
      transform: translateY(-5px);
    }

    @media (max-width: 768px) {
      .narration-title { font-size: 2.2rem; }
      .narration-text { font-size: 1.1rem; }
      .narration-page { padding-top: 80px; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="narration-page">
        <div className="narration-inner">
          
          {/* 1. المعلومات الفرعية فوق */}
          <p className="narration-meta">
            {artifact.kingdom} • {artifact.material}
          </p>

          {/* 2. اسم القطعة */}
          <h1 className="narration-title">
            {artifact.name}
          </h1>

          {/* 3. مشغل الصوت */}
          <audio
            ref={audioRef}
            src={artifact.audioPath}
            onTimeUpdate={handleTimeUpdate}
            controls
            className="narration-audio"
          />

          {/* 4. النص المتزامن مع الصوت */}
          <div className="narration-text">
            {words.map((word, index) => {
              const timestamps = artifact.timestamps || [];
              const delay = 0.3; // تقليل الـ delay عشان التزامن يبقى أحسن
              
              const isActive = timestamps[index] !== undefined
                ? currentTime >= (timestamps[index] - delay)
                : false;

              return (
                <span
                  key={index}
                  style={{
                    color: isActive ? "#d4af5a" : "rgba(255, 255, 255, 0.2)",
                    textShadow: isActive ? "0 0 12px rgba(212, 175, 90, 0.8)" : "none",
                    transition: "all 0.3s ease",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* 5. زرار الانتقال للموديل */}
          <button className="narration-btn" onClick={() => navigate(`/artifact/${id}/model`)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#1a1200" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="#1a1200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="#1a1200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View 3D Model
          </button>

        </div>
      </div>
    </>
  );
}