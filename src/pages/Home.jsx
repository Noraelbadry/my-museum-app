import { useState } from "react";
import { artifacts } from "../data";
import ArtifactCard from "../components/ArtifactCard";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa";

export default function Home() {
  const [kingdomFilter, setKingdomFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  const kingdoms = ["all", "Old Kingdom", "Middle Kingdom", "New Kingdom", "Greco-Roman Period", "Ptolemaic Period"];

  const filteredArtifacts = artifacts.filter((artifact) => {
    const matchesSearch = artifact.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKingdom = kingdomFilter === "all" || artifact.kingdom === kingdomFilter;
    return matchesSearch && matchesKingdom;
  });

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Lato:ital,wght@0,300;0,400;0,700&display=swap');

    .home-page {
      width: 100%;
      min-height: 100vh;
      padding: 120px 20px 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      position: relative;
    }

    .home-page::before {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(to right, transparent, #d4af5a 30%, #f0d080 50%, #d4af5a 70%, transparent);
      z-index: 100;
    }

    /* HERO */
    .hero { text-align: center; margin-bottom: 40px; width: 100%; }

    .hero-eyebrow {
      font-family: 'Lato', sans-serif;
      font-weight: 300;
      font-size: 0.7rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #d4af5a;
      margin-bottom: 14px;
      opacity: 0.85;
    }

    .hero-title {
      font-family: 'Cinzel Decorative', serif;
      font-size: clamp(1.6rem, 4vw, 3rem);
      font-weight: 900;
      color: #fff;
      line-height: 1.15;
      letter-spacing: 0.06em;
      text-shadow: 0 0 60px rgba(212,175,90,0.3), 0 4px 24px rgba(0,0,0,0.8);
      margin-bottom: 6px;
    }

    .hero-title span { color: #d4af5a; }

    .hero-ornament {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 20px auto;
    }

    .hero-ornament-line {
      height: 1px; width: 80px;
      background: linear-gradient(to right, transparent, #d4af5a);
    }
    .hero-ornament-line.r {
      background: linear-gradient(to left, transparent, #d4af5a);
    }
    .hero-ornament-diamond {
      width: 8px; height: 8px;
      background: #d4af5a;
      transform: rotate(45deg);
    }

    .hero-subtitle {
      font-family: 'Lato', sans-serif;
      font-weight: 300;
      font-size: 0.8rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.45);
      max-width: 520px;
      margin: 0 auto;
      line-height: 1.9;
    }

    /* SEARCH */
    .search-wrap {
      width: 100%;
      max-width: 500px;
      margin: 0 auto 28px;
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 20px; top: 50%;
      transform: translateY(-50%);
      color: #d4af5a;
      font-size: 16px;
      opacity: 0.7;
      pointer-events: none;
    }

    .home-search {
      width: 100%;
      padding: 14px 20px 14px 46px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(212,175,90,0.25);
      border-radius: 50px;
      color: white;
      font-family: 'Lato', sans-serif;
      font-size: 16px;
      font-weight: 300;
      outline: none;
      transition: border-color 0.3s, background 0.3s;
      box-sizing: border-box;
    }

    .home-search::placeholder { color: rgba(255,255,255,0.25); }
    .home-search:focus {
      border-color: rgba(212,175,90,0.6);
      background: rgba(255,255,255,0.06);
    }

    /* FILTER */
    .filter-row {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 48px;
      width: 100%;
    }

    .filter-label {
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #d4af5a;
      font-family: 'Lato', sans-serif;
      font-weight: 700;
      margin-right: 4px;
    }

    .filter-btn {
      padding: 7px 18px;
      border-radius: 50px;
      font-family: 'Lato', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid rgba(212,175,90,0.2);
      background: rgba(255,255,255,0.03);
      color: rgba(255,255,255,0.6);
      white-space: nowrap;
    }

    .filter-btn:hover {
      border-color: rgba(212,175,90,0.5);
      color: white;
      background: rgba(212,175,90,0.06);
    }

    .filter-btn.active {
      background: linear-gradient(135deg, #d4af5a, #f0d080);
      color: #1a1200;
      border-color: #d4af5a;
      box-shadow: 0 4px 18px rgba(212,175,90,0.3);
    }

    /* GRID */
    .artifacts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 28px;
      width: 100%;
      max-width: 1200px;
    }

    .empty-msg {
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
      color: #d4af5a;
      opacity: 0.6;
      margin-top: 80px;
      text-align: center;
      letter-spacing: 0.05em;
    }

    @media (max-width: 600px) {
      .hero-title { font-size: 1.4rem; }
      .hero-subtitle { font-size: 0.72rem; letter-spacing: 0.12em; }
      .artifacts-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
      .filter-btn { font-size: 0.68rem; padding: 6px 12px; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="home-page">

        <div className="hero">
          <div className="hero-eyebrow">· Cairo, Egypt </div>
          <h1 className="hero-title">
            The Royal <span>Egyptian</span> Gallery
          </h1>
          <div className="hero-ornament">
            <div className="hero-ornament-line"></div>
            <div className="hero-ornament-diamond"></div>
            <div className="hero-ornament-line r"></div>
          </div>
          <p className="hero-subtitle">
            Explore the dignity of Ancient Egypt — where every artifact tells a story of glory and mystery
          </p>
        </div>

        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="home-search"
            type="text"
            placeholder="Search for an artifact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <span className="filter-label"><FaFilter style={{verticalAlign:"middle", marginRight:6}}/>Era</span>
          {kingdoms.map((k) => (
            <button
              key={k}
              className={`filter-btn ${kingdomFilter === k ? "active" : ""}`}
              onClick={() => setKingdomFilter(k)}
            >
              {k === "all" ? "All Eras" : k}
            </button>
          ))}
        </div>

        <div className="artifacts-grid">
          {filteredArtifacts.map((artifact) => (
            <Link key={artifact.id} to={`/artifact/${artifact.id}`} style={{ textDecoration: "none" }}>
              <div
                onMouseEnter={() => setHoveredId(artifact.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
  opacity: hoveredId && hoveredId !== artifact.id ? 0.3 : 1,
  transition: "opacity 0.3s ease",
}}
              >
                <ArtifactCard artifact={artifact} />
              </div>
            </Link>
          ))}
        </div>

        {filteredArtifacts.length === 0 && (
          <p className="empty-msg">
            The sands of time haven't revealed this treasure yet...
          </p>
        )}

      </div>
    </>
  );
}