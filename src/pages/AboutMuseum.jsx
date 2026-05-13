import { useState, useEffect } from "react";
import { getMuseumById } from "../api";

export default function AboutMuseum() {
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [museumData, setMuseumData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedMuseum) return;
    const fetchMuseum = async () => {
      setLoading(true);
      try {
        const data = await getMuseumById(1);
        setMuseumData({
          title: data.name,
          subtitle: "Gateway to Ancient Civilization",
          sections: [
            { heading: "Overview", text: data.overview },
            { heading: "The Idea", text: data.idea },
            { heading: "Construction", text: data.construction },
            { heading: "Today", text: data.today },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch museum:", err);
        setMuseumData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMuseum();
  }, [selectedMuseum]);

  const museums = {
    gem: { title: "Grand Egyptian Museum" },
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

    .about-page {
      width: 100%;
      min-height: 100vh;
      padding: 120px 40px 60px;
      display: flex;
      justify-content: center;
      font-family: 'Lato', sans-serif;
      box-sizing: border-box;
    }

    .about-container {
      display: flex;
      gap: 32px;
      width: 100%;
      max-width: 1200px;
      align-items: flex-start;
    }

    .about-menu {
      width: 240px;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(212, 175, 90, 0.25);
      border-radius: 12px;
      padding: 24px 0;
      backdrop-filter: blur(12px);
    }

    .about-menu h3 {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #d4af5a;
      margin: 0 0 16px;
      padding: 0 20px 16px;
      border-bottom: 1px solid rgba(212, 175, 90, 0.2);
    }

    .menu-item {
      padding: 12px 20px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 300;
      color: rgba(255,255,255,0.7);
      letter-spacing: 0.04em;
      transition: all 0.25s ease;
      border-left: 2px solid transparent;
    }

    .menu-item:hover {
      color: #fff;
      background: rgba(212, 175, 90, 0.08);
      border-left-color: #d4af5a;
    }

    .menu-item.active {
      color: #d4af5a;
      background: rgba(212, 175, 90, 0.1);
      border-left-color: #d4af5a;
      font-weight: 400;
    }

    .about-content {
      flex: 1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 40px 44px;
      backdrop-filter: blur(14px);
      min-height: 400px;
    }

    .content-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 300px;
      color: rgba(255,255,255,0.3);
      font-family: 'Cinzel', serif;
      font-size: 1rem;
      letter-spacing: 0.1em;
      text-align: center;
    }

    .museum-title {
      font-family: 'Cinzel', serif;
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 4px;
      line-height: 1.2;
    }

    .museum-subtitle {
      font-family: 'Lato', sans-serif;
      font-size: 0.85rem;
      font-weight: 300;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #d4af5a;
      margin: 0 0 32px;
    }

    .divider {
      width: 60px;
      height: 1px;
      background: linear-gradient(to right, #d4af5a, transparent);
      margin-bottom: 32px;
    }

    .section { margin-bottom: 28px; }

    .section-heading {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #d4af5a;
      margin: 0 0 8px;
    }

    .section-text {
      font-size: 0.95rem;
      font-weight: 300;
      line-height: 1.85;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }

    @media (max-width: 768px) {
      .about-container { flex-direction: column; }
      .about-menu { width: 100%; }
      .about-content { padding: 28px 24px; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="about-page">
        <div className="about-container">

          <div className="about-menu">
            <h3>Museums</h3>
            {Object.entries(museums).map(([key, m]) => (
              <div
                key={key}
                className={`menu-item ${selectedMuseum === key ? "active" : ""}`}
                onClick={() => setSelectedMuseum(key)}
              >
                {m.title}
              </div>
            ))}
          </div>

          <div className="about-content">
            {!selectedMuseum ? (
              <div className="content-placeholder">
                Select a museum to explore its history
              </div>
            ) : loading ? (
              <div className="content-placeholder">
                Loading...
              </div>
            ) : museumData ? (
              <>
                <h1 className="museum-title">{museumData.title}</h1>
                <p className="museum-subtitle">{museumData.subtitle}</p>
                <div className="divider" />
                {museumData.sections.map((s, i) => (
                  <div className="section" key={i}>
                    <h3 className="section-heading">{s.heading}</h3>
                    <p className="section-text">{s.text}</p>
                  </div>
                ))}
              </>
            ) : (
              <div className="content-placeholder">
                Failed to load museum data.
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}