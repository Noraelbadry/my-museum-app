export default function ArtifactCard({ artifact }) {
  // شيلنا الـ useNavigate والـ model-viewer عشان نخليهم في صفحة الـ Details
  return (
    <div
      className="artifact-card"
      style={{
        border: "1px solid rgba(255, 215, 0, 0.3)", // إطار ذهبي رقيق
        borderRadius: "15px",
        padding: "0", 
        margin: "10px",
        width: "280px", // العرض اللي طلبتيه (أعرض من الأول)
        textAlign: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)", // خلفية فخمة
        overflow: "hidden", 
        boxShadow: "0 8px 20px rgba(0,0,0,0.6)", // ظل أقوى عشان يبرز الكارد
        color: "white",
        transition: "transform 0.3s ease"
      }}
    >
      {/* المكان المعروض فيه التمثال (عرضناه وخلينا طوله مناسب) */}
      <div style={{ width: "100%", height: "300px", backgroundColor: "#000" }}>
        <img
          src={artifact.image}
          alt={artifact.name}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover", // أهم خاصية عشان الصورة تملى المساحة العريضة
            display: "block"
          }}
        />
      </div>

      {/* منطقة النصوص تحت الصورة */}
      <div style={{ padding: "15px" }}>
        <h3 style={{ margin: "5px 0", color: "gold", fontSize: "1.3rem" }}>
          {artifact.name}
        </h3>
        <p style={{ margin: "0", fontSize: "0.9rem", opacity: 0.8, color: "#ccc" }}>
          {artifact.kingdom}
        </p>
      </div>
    </div>
  );
}