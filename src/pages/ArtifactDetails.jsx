import { useParams } from "react-router-dom";
import { artifacts } from "../data";
import { useState, Suspense, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ── Camera Controller ─────────────────────────────────────
function CameraController({ target, controlsRef }) {
  const { camera } = useThree();
  const animating = useRef(false);

  useEffect(() => {
    if (!target || !controlsRef.current) return;
    animating.current = true;
    const startPos = camera.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const endPos = new THREE.Vector3(...target.cameraPosition);
    const endTarget = new THREE.Vector3(...target.cameraTarget);
    let progress = 0;
    const animate = () => {
      if (!animating.current) return;
      progress += 0.03;
      if (progress >= 1) { progress = 1; animating.current = false; }
      camera.position.lerpVectors(startPos, endPos, progress);
      controlsRef.current.target.lerpVectors(startTarget, endTarget, progress);
      controlsRef.current.update();
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
    return () => { animating.current = false; };
  }, [target]);

  return null;
}

// ── Hotspot Dot ───────────────────────────────────────────
function HotspotDot({ hotspot, isActive, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <mesh
      position={hotspot.position}
      onClick={(e) => { e.stopPropagation(); onSelect(hotspot); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
      scale={hovered ? 1.4 : 1}
    >
      {/* الكرة الشفافة */}
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial
        color="#d4af5a"
        transparent
        opacity={isActive || hovered ? 0.2 : 0.15}
      />

      {/* Ring خارجي */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.08, 32]} />
        <meshBasicMaterial
          color="#d4af5a"
          transparent
          opacity={isActive ? 0.1 : 0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* نقطة صغيرة في المنتصف */}
      <mesh>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshBasicMaterial color={isActive || hovered ? "#f0d080" : "#d4af5a"} />
      </mesh>
    </mesh>
  );
}

// ── Model ─────────────────────────────────────────────────
function Model({ path, scale, position }) {
  const { scene } = useGLTF(path);
  return (
    <primitive
      object={scene}
      scale={scale}
      position={position}
      onClick={(e) => console.log("Point:", e.point)}
    />
  );
}
// ── Main Page ─────────────────────────────────────────────
export default function ArtifactDetails() {
  const { id } = useParams();
  const artifact = artifacts.find((item) => item.id.toString() === id);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [cameraTarget, setCameraTarget] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const controlsRef = useRef();

  useEffect(() => {
    const t = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!artifact) return (
    <div style={{ color: "white", textAlign: "center", padding: "100px" }}>Loading...</div>
  );

  const hotspots = artifact.hotspots || [];

  const handleHotspotSelect = (hotspot) => {
    const isSame = hotspot.id === activeHotspot?.id;
    setActiveHotspot(isSame ? null : hotspot);
    setCameraTarget(isSame ? null : hotspot);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Lato:ital,wght@0,300;0,400;1,300&display=swap');

    :root {
      --gold: #d4af5a;
      --gold-light: #f0d080;
      --gold-dark: #8a6820;
      --gold-muted: rgba(212,175,90,0.35);
      --bg-card: rgba(8,6,2,0.82);
      --white: #f5f0e8;
      --muted: rgba(245,240,232,0.4);
    }

    .detail-page {
      min-height: 100vh;
      color: var(--white);
      padding: 80px 0 0;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }

    .detail-page.loaded {
      opacity: 1;
      transform: translateY(0);
    }

    .detail-hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28px 5% 24px;
      border-bottom: 1px solid rgba(212,175,90,0.12);
      position: relative;
    }

    .detail-hero::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 5%; right: 5%;
      height: 1px;
      background: linear-gradient(to right, transparent, var(--gold), transparent);
    }

    .detail-kingdom-badge {
      font-family: 'Lato', sans-serif;
      font-size: 0.62rem;
      font-weight: 400;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--gold);
      background: rgba(212,175,90,0.08);
      border: 1px solid rgba(212,175,90,0.2);
      border-radius: 50px;
      padding: 5px 14px;
    }

    .detail-title-wrap {
      text-align: center;
      flex: 1;
      padding: 0 24px;
    }

    .detail-title {
      font-family: 'Cinzel Decorative', serif;
      font-size: clamp(1.4rem, 3vw, 2.6rem);
      font-weight: 700;
      color: transparent;
      background: linear-gradient(160deg, #f5e49c 0%, #d4af5a 45%, #a07830 100%);
      -webkit-background-clip: text;
      background-clip: text;
      margin: 0;
      letter-spacing: 0.08em;
      line-height: 1.1;
    }

    .detail-subtitle {
      font-family: 'Lato', sans-serif;
      font-size: 0.68rem;
      font-weight: 300;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--muted);
      margin-top: 6px;
      font-style: italic;
    }

    .detail-material-badge {
      font-family: 'Lato', sans-serif;
      font-size: 0.62rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
      text-align: right;
      min-width: 120px;
    }

    .detail-body {
      display: flex;
      flex: 1;
      height: calc(100vh - 160px);
      min-height: 500px;
    }

    .detail-sidebar {
      width: 300px;
      flex-shrink: 0;
      border-right: 1px solid rgba(212,175,90,0.08);
      display: flex;
      flex-direction: column;
      padding: 32px 24px;
      gap: 6px;
      position: relative;
      overflow-y: auto;
      scrollbar-width: none;
    }

    .detail-sidebar::after {
      content: '';
      position: absolute;
      top: 10%; right: -1px; bottom: 10%;
      width: 1px;
      background: linear-gradient(to bottom, transparent, var(--gold-muted), transparent);
    }

    .sidebar-label {
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(212,175,90,0.45);
      margin-bottom: 12px;
      padding-left: 16px;
    }

    .hotspot-item {
      border-radius: 10px;
      padding: 14px 16px;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      position: relative;
      border: 1px solid transparent;
    }

    .hotspot-item::before {
      content: '';
      position: absolute;
      left: 0; top: 12px; bottom: 12px;
      width: 2px;
      background: linear-gradient(to bottom, transparent, var(--gold), transparent);
      border-radius: 2px;
      opacity: 0;
      transition: opacity 0.35s ease;
    }

    .hotspot-item:hover {
      background: rgba(212,175,90,0.05);
      border-color: rgba(212,175,90,0.15);
    }

    .hotspot-item.active {
      background: rgba(212,175,90,0.08);
      border-color: rgba(212,175,90,0.3);
      box-shadow: 0 2px 20px rgba(212,175,90,0.08), inset 0 1px 0 rgba(212,175,90,0.1);
    }

    .hotspot-item.active::before { opacity: 1; }

    .hotspot-item-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .hotspot-index {
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      color: var(--gold-dark);
      min-width: 18px;
      transition: color 0.3s;
    }

    .hotspot-item.active .hotspot-index { color: var(--gold); }

    .hotspot-pip {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--gold-dark);
      flex-shrink: 0;
      transition: all 0.35s ease;
      position: relative;
    }

    .hotspot-pip::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      border: 1px solid var(--gold);
      opacity: 0;
      transition: opacity 0.35s ease;
    }

    .hotspot-item.active .hotspot-pip {
      background: var(--gold-light);
      box-shadow: 0 0 10px rgba(240,208,128,0.5);
    }

    .hotspot-item.active .hotspot-pip::after { opacity: 1; }

    .hotspot-name {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--gold);
      letter-spacing: 0.06em;
      transition: color 0.3s;
    }

    .hotspot-desc {
      font-family: 'Lato', sans-serif;
      font-size: 0.73rem;
      font-weight: 300;
      font-style: italic;
      color: rgba(245,240,232,0.5);
      line-height: 1.7;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.45s cubic-bezier(0.4,0,0.2,1),
                  opacity 0.35s ease,
                  margin-top 0.35s ease;
      margin-top: 0;
      padding-left: 30px;
    }

    .hotspot-item.active .hotspot-desc {
      max-height: 160px;
      opacity: 1;
      margin-top: 10px;
    }

    .sidebar-divider {
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(212,175,90,0.15), transparent);
      margin: 4px 0;
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px solid rgba(212,175,90,0.08);
    }

    .sidebar-footer-text {
      font-family: 'Lato', sans-serif;
      font-size: 0.62rem;
      font-weight: 300;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(212,175,90,0.3);
      text-align: center;
    }

    .detail-canvas-wrap {
      flex: 1;
      position: relative;
      background: radial-gradient(ellipse at 50% 40%, rgba(212,175,90,0.04) 0%, transparent 65%);
    }

    .canvas-corner {
      position: absolute;
      width: 28px; height: 28px;
      z-index: 5;
      pointer-events: none;
    }
    .canvas-corner.tl { top: 20px; left: 20px; border-top: 1px solid rgba(212,175,90,0.4); border-left: 1px solid rgba(212,175,90,0.4); }
    .canvas-corner.tr { top: 20px; right: 20px; border-top: 1px solid rgba(212,175,90,0.4); border-right: 1px solid rgba(212,175,90,0.4); }
    .canvas-corner.bl { bottom: 20px; left: 20px; border-bottom: 1px solid rgba(212,175,90,0.4); border-left: 1px solid rgba(212,175,90,0.4); }
    .canvas-corner.br { bottom: 20px; right: 20px; border-bottom: 1px solid rgba(212,175,90,0.4); border-right: 1px solid rgba(212,175,90,0.4); }

    .active-info-bar {
      position: absolute;
      top: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(-6px);
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-card);
      border: 1px solid rgba(212,175,90,0.3);
      border-radius: 50px;
      padding: 8px 20px;
      pointer-events: none;
      backdrop-filter: blur(16px);
      opacity: 0;
      transition: opacity 0.4s ease, transform 0.4s ease;
      white-space: nowrap;
    }

    .active-info-bar.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .active-info-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--gold-light);
      box-shadow: 0 0 8px rgba(240,208,128,0.6);
    }

    .active-info-title {
      font-family: 'Cinzel', serif;
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--gold);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .canvas-hint {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(8,6,2,0.7);
      border: 1px solid rgba(212,175,90,0.18);
      border-radius: 50px;
      padding: 7px 18px;
      pointer-events: none;
      backdrop-filter: blur(10px);
      transition: opacity 0.4s ease;
    }

    .canvas-hint.hidden { opacity: 0; }

    .hint-pulse {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--gold);
      animation: goldPulse 2s ease-in-out infinite;
    }

    .hint-label {
      font-family: 'Lato', sans-serif;
      font-size: 0.62rem;
      font-weight: 300;
      letter-spacing: 0.18em;
      color: rgba(245,240,232,0.4);
      text-transform: uppercase;
    }

    @keyframes goldPulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(212,175,90,0.4); }
      50% { opacity: 0.5; box-shadow: 0 0 0 5px rgba(212,175,90,0); }
    }

    @media (max-width: 900px) {
      .detail-body { flex-direction: column; height: auto; }
      .detail-sidebar {
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        border-right: none;
        border-bottom: 1px solid rgba(212,175,90,0.08);
        padding: 16px;
        gap: 8px;
      }
      .detail-sidebar::after { display: none; }
      .sidebar-label { width: 100%; }
      .hotspot-item { flex: 1; min-width: 130px; }
      .sidebar-footer { display: none; }
      .detail-canvas-wrap { height: 55vw; min-height: 320px; }
      .detail-title { font-size: 1.4rem; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className={`detail-page ${pageLoaded ? "loaded" : ""}`}>

        <div className="detail-hero">
          <div className="detail-kingdom-badge">{artifact.kingdom}</div>
          <div className="detail-title-wrap">
            <h1 className="detail-title">{artifact.name}</h1>
            <p className="detail-subtitle">Ancient Egyptian Artifact</p>
          </div>
          <div className="detail-material-badge">{artifact.material}</div>
        </div>

        <div className="detail-body">

          <div className="detail-sidebar">
            <div className="sidebar-label">Explore Points</div>
            {hotspots.length === 0 && (
              <p style={{ fontFamily: "Lato", fontSize: "0.72rem", color: "rgba(245,240,232,0.25)", fontWeight: 300, fontStyle: "italic", padding: "0 16px" }}>
                No annotations available.
              </p>
            )}
            {hotspots.map((h, i) => (
              <>
                <div
                  key={h.id}
                  className={`hotspot-item ${activeHotspot?.id === h.id ? "active" : ""}`}
                  onClick={() => handleHotspotSelect(h)}
                >
                  <div className="hotspot-item-header">
                    <span className="hotspot-index">0{i + 1}</span>
                    <div className="hotspot-pip"></div>
                    <div className="hotspot-name">{h.title}</div>
                  </div>
                  <div className="hotspot-desc">{h.description}</div>
                </div>
                {i < hotspots.length - 1 && <div className="sidebar-divider" />}
              </>
            ))}
            <div className="sidebar-footer">
              <p className="sidebar-footer-text">Click a point to navigate</p>
            </div>
          </div>

          <div className="detail-canvas-wrap">
            <div className="canvas-corner tl" />
            <div className="canvas-corner tr" />
            <div className="canvas-corner bl" />
            <div className="canvas-corner br" />

            <div className={`active-info-bar ${activeHotspot ? "visible" : ""}`}>
              <div className="active-info-dot" />
              <span className="active-info-title">{activeHotspot?.title || ""}</span>
            </div>

            <Canvas
              camera={{ position: [0, 0, 3], fov: 45 }}
              style={{ width: "100%", height: "100%" }}
            >
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 8, 5]} intensity={1.4} color="#fff8e8" />
              <directionalLight position={[-4, 2, -4]} intensity={0.35} color="#c8a060" />
              <pointLight position={[0, 3, 2]} intensity={0.4} color="#d4af5a" />

              <Suspense fallback={null}>
                <Model
                  path={artifact.modelPath}
                  scale={artifact.modelScale || 2.0}
                  position={artifact.modelPosition || [0, -1.5, 0]}
                />
                {hotspots.map((h) => (
                  <HotspotDot
                    key={h.id}
                    hotspot={h}
                    isActive={activeHotspot?.id === h.id}
                    onSelect={handleHotspotSelect}
                  />
                ))}
              </Suspense>

              <CameraController target={cameraTarget} controlsRef={controlsRef} />

              <OrbitControls
                ref={controlsRef}
                enableZoom={true}
                enablePan={false}
                autoRotate={!activeHotspot}
                autoRotateSpeed={0.6}
                minDistance={1.5}
                maxDistance={6}
              />
            </Canvas>

            <div className={`canvas-hint ${activeHotspot ? "hidden" : ""}`}>
              <div className="hint-pulse" />
              <span className="hint-label">Click the gold dots to explore</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}