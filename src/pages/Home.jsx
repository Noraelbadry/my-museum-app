import { useState } from "react";
import { artifacts } from "../data";
import ArtifactCard from "../components/ArtifactCard";
import { Link } from "react-router-dom";
// تأكدي من تثبيت المكتبة: npm install react-icons
import { FaFilter } from "react-icons/fa"; 

export default function Home() {
  const [kingdomFilter, setKingdomFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  const handleClick = (artifact) => {
    alert(`You clicked on ${artifact.name}!`);
  };

  // مصفوفة الممالك لتوليد الأزرار ديناميكياً وتجنب أخطاء الكتابة
  const kingdoms = ["all", "Old Kingdom", "Middle Kingdom", "New Kingdom", "Greco-Roman Period", "Ptolemaic Period"];

  // منطق الفلترة
  const filteredArtifacts = artifacts.filter((artifact) => {
    const matchesSearch = artifact.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // تأكدي أن artifact.kingdom في ملف data.js مطابق تماماً لهذه النصوص
    const matchesKingdom =
      kingdomFilter === "all" || artifact.kingdom === kingdomFilter;

    return matchesSearch && matchesKingdom;
  });

  // --- الستايلات ---
  const pageStyle = {
    width: "100vw",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundImage: 'url("/images/wallpaper.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed", // لجعل الخلفية ثابتة وشكلها أفخم
    boxSizing: "border-box",
  };

  const buttonStyle = (k) => ({
    padding: "10px 20px",
    margin: "5px",
    cursor: "pointer",
    borderRadius: "25px",
    border: "1px solid white",
    backgroundColor: kingdomFilter === k ? "gold" : "rgba(255, 255, 255, 0.1)",
    color: kingdomFilter === k ? "black" : "white",
    fontWeight: "600",
    transition: "all 0.3s ease",
    backdropFilter: "blur(5px)",
  });

  return (
    <div style={pageStyle}>
      <div style={{ position: "relative", zIndex: 1, width: "100%", textAlign: "center", color: "white" }}>
        
        <h1 style={{ fontSize: "3.1rem", marginBottom: "30px", fontWeight: "1000", textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}>
          Welcome to the Museum Experience
        </h1>

        {/* حقل البحث */}
        <input
          type="text"
          placeholder="Search for an artifact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "12px",
            margin: "0 auto 20px",
            width: "80%",
            maxWidth: "350px",
            borderRadius: "30px",
            border: "1px solid rgba(255,255,255,0.5)",
            display: "block",
            backgroundColor: "rgba(0,0,0,0.4)",
            color: "white",
            outline: "none",
            backdropFilter: "blur(5px)",
          }}
        />

        {/* قسم الفلتر بالأيقونة */}
        <div style={{ marginBottom: "40px", display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <FaFilter style={{ color: "gold", marginRight: "10px", fontSize: "1.2rem" }} />
          {kingdoms.map((k) => (
            <button 
              key={k} 
              onClick={() => setKingdomFilter(k)} 
              style={buttonStyle(k)}
            >
              {k === "all" ? "All Eras" : k}
            </button>
          ))}
        </div>

{/* شبكة العرض المعدلة */}
<div
  style={{
    display: "grid",
    // هنا بنقوله يعمل 4 أعمدة قد بعض بالظبط
    gridTemplateColumns: "repeat(3, 1fr)", 
    gap: "30px",
    padding: "20px",
    width: "80%", // عشان نضمن مساحة كافية للـ 4 كروت
    maxWidth: "1200px",
    margin: "0 auto", // سنترة الشبكة في نص الصفحة
  }}
        >
{filteredArtifacts.map((artifact) => (
    <Link
      key={artifact.id}
      to={`/artifact/${artifact.id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        onMouseEnter={() => setHoveredId(artifact.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          transform: hoveredId === artifact.id ? "scale(1.08)" : "scale(1)",
          transition: "all 0.4s ease",
          filter: hoveredId && hoveredId !== artifact.id ? "blur(3px)" : "none",
          zIndex: hoveredId === artifact.id ? 2 : 1,
        }}
      >
        <ArtifactCard artifact={artifact} onClick={handleClick} />
      </div>
    </Link>
  ))}
</div>

        {/* رسالة في حال عدم وجود نتائج */}
        {filteredArtifacts.length === 0 && (
          <p style={{ marginTop: "50px", fontSize: "1.2rem", opacity: 0.8 }}>
            No artifacts found in this kingdom...
          </p>
        )}
      </div>
    </div>
  );
}