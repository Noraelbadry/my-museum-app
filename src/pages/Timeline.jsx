import { useState, useEffect } from "react";
import { getEras } from "../api";

const kings_static = [
  { name: "Narmer", achievements: ["Unified Upper and Lower Egypt for the first time", "Founded the First Dynasty of Egypt", "Created the Narmer Palette — earliest record of Egyptian kingship"] },
  { name: "Djoser", achievements: ["Built the Step Pyramid at Saqqara — first monumental stone structure", "Elevated the architect Imhotep to divine status", "Established the tradition of pyramid building"] },
  { name: "Khufu", achievements: ["Built the Great Pyramid of Giza — one of the Seven Wonders", "Organized the largest construction workforce in ancient history", "Centralized royal power to its peak"] },
  { name: "Khafre", achievements: ["Built the second pyramid at Giza", "Commissioned the Great Sphinx", "Continued the golden age of pyramid construction"] },
  { name: "Intef II", achievements: ["Extended Theban power northward against the Herakleopolitan rulers", "Laid the groundwork for Egypt's eventual reunification", "Reigned for nearly 50 years — one of the longest of the period"] },
  { name: "Mentuhotep II", achievements: ["Reunified Egypt after the First Intermediate Period", "Founded the Middle Kingdom", "Built the mortuary temple at Deir el-Bahari"] },
  { name: "Senusret III", achievements: ["Expanded Egypt's territory deep into Nubia", "Reorganized the government and weakened the nomarchs", "Known for his realistic portraiture in sculpture"] },
  { name: "Kamose", achievements: ["Last king of the Seventeenth Dynasty of Thebes", "Launched the war against the Hyksos occupiers of northern Egypt", "Paved the way for Ahmose I to expel the Hyksos and reunify Egypt"] },
  { name: "Ahmose I", achievements: ["Expelled the Hyksos and reunified Egypt", "Founded the New Kingdom — Egypt's most powerful era", "Established a professional standing army"] },
  { name: "Hatshepsut", achievements: ["One of Egypt's most successful female pharaohs", "Expanded trade routes to the land of Punt", "Built the magnificent temple at Deir el-Bahari"] },
  { name: "Thutmose III", achievements: ["Egypt's greatest military pharaoh — never lost a battle", "Expanded the empire to its largest extent", "Won the Battle of Megiddo — one of history's earliest recorded battles"] },
  { name: "Akhenaten", achievements: ["Revolutionized Egyptian religion — worshipped only Aten", "Founded the new capital city of Amarna", "Introduced a revolutionary new artistic style"] },
  { name: "Tutankhamun", achievements: ["Restored the traditional Egyptian religion after Akhenaten", "His intact tomb discovered in 1922 revolutionized Egyptology", "Symbol of ancient Egypt's mystery worldwide"] },
  { name: "Ramesses II", achievements: ["Reigned for 66 years — one of the longest reigns in history", "Signed the world's first known peace treaty with the Hittites", "Built Abu Simbel and countless monuments across Egypt"] },
  { name: "Ramesses III", achievements: ["Defended Egypt against the Sea Peoples invasions", "Last great pharaoh of the New Kingdom", "Built the mortuary temple of Medinet Habu"] },
  { name: "Cleopatra VII", achievements: ["Last active ruler of the Ptolemaic Kingdom", "Spoke nine languages including Egyptian", "Allied with Julius Caesar and Mark Antony to preserve Egypt"] },
];

const periodColors = {
  "Early Dynastic Period": "#8B6914",
  "Old Kingdom": "#C9922A",
  "First Intermediate Period": "#A0785A",
  "Middle Kingdom": "#7A9E6E",
  "Second Intermediate Period": "#8A7A9E",
  "New Kingdom": "#C9A84C",
  "Ptolemaic Period": "#6E9E9A",
};

export default function Timeline() {
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [kings, setKings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEras();
        const allKings = data.map((king) => {
          const localKing = kings_static.find(k =>
            k.name.toLowerCase() === king.king_name.toLowerCase()
          );
          return {
            id: king.king_id,
            name: king.king_name,
            period: king.era_name,
            dynasty: king.dynasty,
            reign: king.rule_period,
            achievements: localKing?.achievements || [],
          };
        });
        setKings(allKings);
      } catch (err) {
        console.error("Failed to fetch timeline data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const periods = ["all", ...new Set(kings.map(k => k.period))];
  const filtered = filter === "all" ? kings : kings.filter(k => k.period === filter);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@300;400;600&family=Lato:ital,wght@0,300;0,400;1,300&display=swap');

    :root {
      --gold: #d4af5a;
      --gold-light: #f0d080;
      --gold-dark: #8a6820;
      --white: #f5f0e8;
      --muted: rgba(245,240,232,0.5);
    }

    .timeline-page {
      width: 100%;
      min-height: 100vh;
      padding: 120px 5% 80px;
      box-sizing: border-box;
      position: relative;
      z-index: 1;
    }

    .timeline-hero {
      text-align: center;
      margin-bottom: 60px;
    }

    .timeline-eyebrow {
      font-family: 'Lato', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: var(--gold);
      opacity: 0.7;
      margin-bottom: 16px;
    }

    .timeline-title {
      font-family: 'Cinzel Decorative', serif;
      font-size: clamp(1.8rem, 4vw, 3.2rem);
      font-weight: 700;
      color: transparent;
      background: linear-gradient(160deg, #f5e49c 0%, var(--gold) 45%, #7a5e28 100%);
      -webkit-background-clip: text;
      background-clip: text;
      letter-spacing: 0.06em;
      margin: 0 0 16px;
    }

    .timeline-ornament {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 16px auto 20px;
    }

    .orn-line { height: 1px; width: 60px; background: linear-gradient(to right, transparent, var(--gold)); }
    .orn-line.r { background: linear-gradient(to left, transparent, var(--gold)); }
    .orn-diamond { width: 5px; height: 5px; background: var(--gold); transform: rotate(45deg); }

    .timeline-subtitle {
      font-family: 'Lato', sans-serif;
      font-size: 0.8rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .timeline-filter {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      margin-bottom: 48px;
    }

    .filter-btn {
      font-family: 'Cinzel', serif;
      font-size: 0.6rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 7px 16px;
      border-radius: 50px;
      border: 1px solid rgba(212,175,90,0.2);
      background: rgba(255,255,255,0.03);
      color: rgba(245,240,232,0.5);
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .filter-btn:hover {
      border-color: rgba(212,175,90,0.5);
      color: var(--gold);
    }

    .filter-btn.active {
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      color: #1a1200;
      border-color: var(--gold);
      box-shadow: 0 4px 16px rgba(212,175,90,0.3);
    }

    .kings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      max-width: 1300px;
      margin: 0 auto;
    }

    .king-card {
      background: rgba(8,6,2,0.7);
      border: 1px solid rgba(212,175,90,0.12);
      border-radius: 16px;
      padding: 28px 24px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(12px);
    }

    .king-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(to right, transparent, var(--period-color, #d4af5a), transparent);
      opacity: 0.6;
      transition: opacity 0.3s;
    }

    .king-card:hover {
      border-color: rgba(212,175,90,0.35);
      transform: translateY(-6px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,90,0.1);
    }

    .king-card:hover::before { opacity: 1; }

    .king-card.expanded {
      border-color: rgba(212,175,90,0.4);
      box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,90,0.15);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 14px;
    }

    .card-number {
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.5em;
      color: var(--gold-dark);
    }

    .card-period-badge {
      font-family: 'Lato', sans-serif;
      font-size: 0.60rem;
      font-weight: 300;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 50px;
      border: 1px solid;
      white-space: nowrap;
    }

    .king-name {
      font-family: 'Cinzel Decorative', serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--white);
      margin: 0 0 6px;
      letter-spacing: 0.04em;
      line-height: 1.2;
    }

    .king-dynasty {
      font-family: 'Cinzel', serif;
      font-size: 0.9rem;
      letter-spacing: 0.2em;
      color: var(--gold);
      opacity: 1;
      margin-bottom: 4px;
    }

    .king-reign {
      font-family: 'Lato', sans-serif;
      font-size: 0.72rem;
      font-weight: 300;
      font-style: italic;
      color: rgba(245,240,232,0.8);
      margin-bottom: 16px;
    }

    .card-divider {
      height: 1px;
      background: linear-gradient(to right, var(--gold), transparent);
      margin-bottom: 16px;
      opacity: 0.2;
    }

    .achievements-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease;
      opacity: 0;
    }

    .king-card.expanded .achievements-list {
      max-height: 300px;
      opacity: 1;
    }

    .achievement-item {
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }

    .achievement-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--gold);
      flex-shrink: 0;
      margin-top: 7px;
    }

    .achievement-text {
      font-family: 'Lato', sans-serif;
      font-size: 0.90rem;
      font-weight: 300;
      color: rgba(245,240,232,0.7);
      line-height: 1.65;
    }

    .expand-hint {
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.2em;
      color: var(--gold);
      opacity: 0.5;
      margin-top: 14px;
      text-align: right;
      transition: opacity 0.3s;
    }

    .king-card:hover .expand-hint { opacity: 0.9; }
    .king-card.expanded .expand-hint { opacity: 0; height: 0; margin: 0; overflow: hidden; }

    .timeline-count {
      text-align: center;
      font-family: 'Cinzel', serif;
      font-size: 0.6rem;
      letter-spacing: 0.25em;
      color: var(--muted);
      margin-bottom: 32px;
      opacity: 0.5;
    }

    .timeline-loading {
      text-align: center;
      font-family: 'Cinzel', serif;
      font-size: 0.9rem;
      color: var(--gold);
      letter-spacing: 0.2em;
      margin-top: 80px;
      opacity: 0.7;
    }

    @media (max-width: 768px) {
      .timeline-page { padding: 100px 4% 60px; }
      .kings-grid { grid-template-columns: 1fr; gap: 16px; }
      .timeline-title { font-size: 1.6rem; }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .kings-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="timeline-page">

        <div className="timeline-hero">
          <div className="timeline-eyebrow">· Ancient Egypt ·</div>
          <h1 className="timeline-title">Kings of the Nile</h1>
          <div className="timeline-ornament">
            <div className="orn-line" />
            <div className="orn-diamond" />
            <div className="orn-line r" />
          </div>
          <p className="timeline-subtitle">From Narmer to Cleopatra — The Pharaohs Who Shaped Civilization</p>
        </div>

        {loading ? (
          <div className="timeline-loading">Loading the pharaohs...</div>
        ) : error ? (
          <div className="timeline-loading">Failed to load data. Please try again.</div>
        ) : (
          <>
            <div className="timeline-filter">
              {periods.map(p => (
                <button
                  key={p}
                  className={`filter-btn ${filter === p ? "active" : ""}`}
                  onClick={() => setFilter(p)}
                >
                  {p === "all" ? "All Periods" : p}
                </button>
              ))}
            </div>

            <div className="timeline-count">
              Showing {filtered.length} of {kings.length} rulers
            </div>

            <div className="kings-grid">
              {filtered.map((king, index) => {
                const color = periodColors[king.period] || "#d4af5a";
                const isExpanded = activeId === king.id;

                return (
                  <div
                    key={king.id}
                    className={`king-card ${isExpanded ? "expanded" : ""}`}
                    style={{ "--period-color": color }}
                    onClick={() => setActiveId(isExpanded ? null : king.id)}
                  >
                    <div className="card-top">
                      <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="card-period-badge" style={{ color, borderColor: color + "55" }}>
                        {king.period}
                      </span>
                    </div>

                    <h2 className="king-name">{king.name}</h2>
                    <div className="king-dynasty">{king.dynasty}</div>
                    <div className="king-reign">{king.reign}</div>

                    <div className="card-divider" />

                    <div className="achievements-list">
                      {king.achievements.map((a, i) => (
                        <div key={i} className="achievement-item">
                          <div className="achievement-dot" />
                          <span className="achievement-text">{a}</span>
                        </div>
                      ))}
                    </div>

                    <div className="expand-hint">Click to reveal →</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </>
  );
}