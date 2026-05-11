import { useParams, useNavigate } from "react-router-dom";
import { artifacts } from "../data";
import { getArtifactInfo } from "../api";
import { useState, useRef, useEffect } from "react";

export default function ArtifactNarration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const artifact = artifacts.find((item) => item.id.toString() === id);

  const mediaRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [info, setInfo] = useState(null);

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getArtifactInfo(id);
        setInfo({
          who: data.who_is_he,
          role: data.importance_and_role,
          statueDescription: data.statue_description,
          evidence: data.evidence_of_importance,
        });
      } catch (err) {
        console.error("Failed to fetch info:", err);
        setInfo(artifact?.info || null);
      }
    };
    fetchInfo();
  }, [id]);

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
      background: transparent;
      color: white;
      padding: 120px 5% 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .narration-inner {
      width: 100%;
      max-width: 1200px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .narration-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .narration-meta {
      font-family: 'Lato', sans-serif;
      font-size: 0.8rem;
      font-weight: 300;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #d4af5a;
      margin: 0;
    }

    .narration-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 700;
      margin: 0;
      color: #ffffff;
      text-shadow: 0 0 20px rgba(212, 175, 90, 0.3);
    }

    .narration-ornament {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 4px;
    }
    .orn-line { height: 1px; width: 50px; background: linear-gradient(to right, transparent, #d4af5a); }
    .orn-line.r { background: linear-gradient(to left, transparent, #d4af5a); }
    .orn-diamond { width: 4px; height: 4px; background: #d4af5a; transform: rotate(45deg); }

    .narration-body {
      display: flex;
      flex-direction: row-reverse;
      gap: 48px;
      align-items: flex-start;
    }

    .narration-video-wrap {
      flex: 0 0 25%;
      position: relative;
      margin-top: -140px;
    }

    .narration-video-wrap::before,
    .narration-video-wrap::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 24px;
      z-index: 2;
      pointer-events: none;
    }
    .narration-video-wrap::before {
      top: -8px; left: -8px;
      border-top: 2px solid #d4af5a;
      border-left: 2px solid #d4af5a;
    }
    .narration-video-wrap::after {
      bottom: -8px; right: -8px;
      border-bottom: 2px solid #d4af5a;
      border-right: 2px solid #d4af5a;
    }

    .narration-frame-tr,
    .narration-frame-bl {
      position: absolute;
      width: 24px;
      height: 24px;
      z-index: 2;
      pointer-events: none;
    }
    .narration-frame-tr {
      top: -8px; right: -8px;
      border-top: 2px solid #d4af5a;
      border-right: 2px solid #d4af5a;
    }
    .narration-frame-bl {
      bottom: -8px; left: -8px;
      border-bottom: 2px solid #d4af5a;
      border-left: 2px solid #d4af5a;
    }

    .narration-video {
      width: 100%;
      border-radius: 10px;
      border: 1px solid rgba(212,175,90,0.3);
      box-shadow: 0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,90,0.1);
      background: #000;
      display: block;
    }

    .narration-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-top: 8px;
    }

    .narration-text-label {
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(212,175,90,0.5);
    }

    .narration-text {
      font-family: 'Lato', sans-serif;
      font-size: 1.1rem;
      line-height: 2;
      font-weight: 300;
    }

    .narration-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 24px;
      flex-wrap: wrap;
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
      padding: 14px 36px;
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 4px 25px rgba(212,175,90,0.4);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .narration-btn:hover {
      box-shadow: 0 8px 35px rgba(212,175,90,0.6);
      transform: translateY(-4px);
    }

    .narration-btn-secondary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: transparent;
      color: #d4af5a;
      border: 1px solid rgba(212,175,90,0.5);
      border-radius: 50px;
      padding: 14px 28px;
      font-family: 'Cinzel', serif;
      font-weight: 400;
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .narration-btn-secondary:hover {
      background: rgba(212,175,90,0.1);
      border-color: #d4af5a;
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(212,175,90,0.2);
    }

    .modal-overlay {
      position: fixed;
      top: 70px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(12px);
      z-index: 9999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 16px;
      overflow-y: auto;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal-box {
      background: rgba(10,8,3,0.98);
      border: 1px solid rgba(212,175,90,0.3);
      border-radius: 24px;
      padding: 40px;
      max-width: 620px;
      width: 100%;
      position: relative;
      box-shadow: 0 25px 70px rgba(0,0,0,0.9), inset 0 1px 0 rgba(212,175,90,0.15);
      animation: slideUp 0.35s cubic-bezier(0.4,0,0.2,1);
    }

    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .modal-box::before {
      content: '';
      position: absolute;
      top: -1px; left: -1px;
      width: 40px; height: 40px;
      border-top: 2px solid #d4af5a;
      border-left: 2px solid #d4af5a;
      border-radius: 24px 0 0 0;
    }
    .modal-box::after {
      content: '';
      position: absolute;
      bottom: -1px; right: -1px;
      width: 40px; height: 40px;
      border-bottom: 2px solid #d4af5a;
      border-right: 2px solid #d4af5a;
      border-radius: 0 0 24px 0;
    }

    .modal-close {
      position: absolute;
      top: 16px; right: 20px;
      background: none;
      border: none;
      color: rgba(212,175,90,0.5);
      font-size: 1.2rem;
      cursor: pointer;
      transition: color 0.2s;
      padding: 4px;
      z-index: 10;
    }
    .modal-close:hover { color: #d4af5a; }

    .modal-eyebrow {
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: rgba(212,175,90,0.5);
      margin-bottom: 8px;
    }

    .modal-title {
      font-family: 'Cinzel', serif;
      font-size: 1.6rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 4px;
      text-shadow: 0 0 20px rgba(212,175,90,0.3);
    }

    .modal-ornament {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 12px 0 24px;
    }

    .modal-divider {
      height: 1px;
      background: linear-gradient(to right, #d4af5a, transparent);
      margin: 20px 0;
      opacity: 0.3;
    }

    .modal-section { margin-bottom: 20px; }

    .modal-section-label {
      font-family: 'Cinzel', serif;
      font-size: 0.6rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #d4af5a;
      margin-bottom: 8px;
      opacity: 0.8;
    }

    .modal-section-text {
      font-family: 'Lato', sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      color: rgba(245,240,232,0.75);
      line-height: 1.8;
    }

    @media (max-width: 768px) {
      .narration-page { padding: 90px 5% 60px; }
      .narration-title { font-size: 2rem; }
      .narration-body { flex-direction: column; gap: 28px; }
      .narration-video-wrap { flex: none; width: 58%; margin-top: 0; align-self: center;}
      .narration-text { font-size: 1rem; }
      .narration-actions { flex-direction: column; align-items: flex-start; }
      .narration-btn, .narration-btn-secondary { width: 100%; justify-content: center; }
      .modal-overlay { padding: 10px; }
      .modal-box { padding: 30px 20px; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="narration-page">
        <div className="narration-inner">

          <div className="narration-header">
            <p className="narration-meta">{artifact.kingdom} • {artifact.material}</p>
            <h1 className="narration-title">{artifact.name}</h1>
            <div className="narration-ornament">
              <div className="orn-line" />
              <div className="orn-diamond" />
              <div className="orn-line r" />
            </div>
          </div>

          <div className="narration-body">

            <div className="narration-video-wrap">
              <div className="narration-frame-tr" />
              <div className="narration-frame-bl" />
              <video
                ref={mediaRef}
                src={artifact.videoPath || ""}
                onTimeUpdate={handleTimeUpdate}
                controls
                className="narration-video"
                playsInline
              />
            </div>

            <div className="narration-right">
              <div className="narration-text-label">Narration</div>
              <div className="narration-text">
                {words.map((word, index) => {
                  const timestamps = artifact.timestamps || [];
                  const delay = 0.3;
                  const isActive = timestamps[index] !== undefined
                    ? currentTime >= (timestamps[index] - delay)
                    : false;
                  return (
                    <span
                      key={index}
                      style={{
                        color: isActive ? "#d4af5a" : "rgba(255,255,255,0.7)",
                        textShadow: isActive ? "0 0 12px rgba(212,175,90,0.8)" : "none",
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

              <div className="narration-actions">
                <button
                  className="narration-btn"
                  onClick={() => navigate(`/artifact/${id}/model`)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#1a1200" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M2 17l10 5 10-5" stroke="#1a1200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12l10 5 10-5" stroke="#1a1200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  View 3D Model
                </button>

                {info && (
                  <button
                    className="narration-btn-secondary"
                    onClick={() => setShowModal(true)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#d4af5a" strokeWidth="1.5"/>
                      <line x1="12" y1="16" x2="12" y2="11" stroke="#d4af5a" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="12" cy="8" r="0.8" fill="#d4af5a"/>
                    </svg>
                    More Information
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {showModal && info && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>

            <div className="modal-eyebrow">More Information</div>
            <h2 className="modal-title">{artifact.name}</h2>
            <div className="modal-ornament">
              <div className="orn-line" />
              <div className="orn-diamond" />
              <div className="orn-line r" />
            </div>

            <div className="modal-section">
              <div className="modal-section-label">Who is he?</div>
              <p className="modal-section-text">{info.who}</p>
            </div>

            <div className="modal-divider" />

            <div className="modal-section">
              <div className="modal-section-label">Importance & Role</div>
              <p className="modal-section-text">{info.role}</p>
            </div>

            <div className="modal-divider" />

            <div className="modal-section">
              <div className="modal-section-label">Statue Description</div>
              <p className="modal-section-text">{info.statueDescription}</p>
            </div>

            <div className="modal-divider" />

            <div className="modal-section">
              <div className="modal-section-label">Evidence of Importance</div>
              <p className="modal-section-text">{info.evidence}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}