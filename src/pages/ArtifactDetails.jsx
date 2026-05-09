import { useParams } from "react-router-dom";
import { artifacts } from "../data";
import { useState, Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
if (!customElements.get('model-viewer')) {
  import('@google/model-viewer');
}
import * as THREE from "three";

function DustParticles() {
  const mesh = useRef();
  const count = 400;

  const [positions] = useState(() =>
    new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 8)
  );
  const [speeds] = useState(() =>
    new Float32Array(count).map(() => 0.002 + Math.random() * 0.003)
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i];
      pos[i * 3] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.0004;
      if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -4;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#d4a060"
        size={0.018}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={2}
      />
    </points>
  );
}

function CinematicLights() {
  const spotRef = useRef();
  useFrame((state) => {
    if (spotRef.current)
      spotRef.current.intensity = 5 + Math.sin(state.clock.elapsedTime * 2.1) * 0.1;
  });
  return (
    <>
      <ambientLight intensity={1.2} color="#fff8e8" />
      <spotLight ref={spotRef} position={[0, 5, 2]} angle={Math.PI / 7} penumbra={0.5}
        intensity={5} color="#ffe8b0" castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0003} />
      <directionalLight position={[3, 3, 3]} intensity={1.5} color="#fff8e8" />
      <directionalLight position={[-3, 2, -4]} intensity={0.8} color="#c8a060" />
      <pointLight position={[2.5, 1.5, 0.5]} intensity={1.5} color="#d4a060" distance={8} />
      <pointLight position={[0, -1.2, 1.5]} intensity={0.8} color="#7a4010" distance={6} />
    </>
  );
}

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
      progress += 0.025;
      if (progress >= 1) { progress = 1; animating.current = false; }
      const eased = 1 - Math.pow(1 - progress, 3);
      camera.position.lerpVectors(startPos, endPos, eased);
      controlsRef.current.target.lerpVectors(startTarget, endTarget, eased);
      controlsRef.current.update();
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
    return () => { animating.current = false; };
  }, [target]);

  return null;
}

function IdleDrift({ active }) {
  const { camera } = useThree();
  useFrame((state) => {
    if (active) return;
    camera.position.x += (Math.sin(state.clock.elapsedTime * 0.15) * 0.06 - camera.position.x * 0.005) * 0.02;
    camera.position.y += (Math.sin(state.clock.elapsedTime * 0.1) * 0.03 - (camera.position.y - 0.3) * 0.005) * 0.02;
  });
  return null;
}

function HotspotDot({ hotspot, isActive, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const showRing = hovered || isActive;
  return (
    <mesh
      position={hotspot.position}
      onClick={(e) => { e.stopPropagation(); onSelect(hotspot); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
      scale={hovered ? 1.5 : 1}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#d4af5a" transparent opacity={0.01} />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.085, 32]} />
        <meshBasicMaterial color="#d4af5a" transparent opacity={showRing ? 0.95 : 0} side={2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshBasicMaterial color={isActive ? "#f0d080" : "#d4af5a"} transparent opacity={showRing ? 1 : 0} />
      </mesh>
    </mesh>
  );
}

function Model({ path, scale, position, hotspots = [], activeHotspot, onSelect }) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group position={position}>
      <primitive
        object={scene}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          const localPoint = e.point.clone();
          scene.worldToLocal(localPoint);
          console.log(`[${localPoint.x.toFixed(4)}, ${localPoint.y.toFixed(4)}, ${localPoint.z.toFixed(4)}]`);
        }}
      />
      {hotspots.map((h) => (
        <HotspotDot
          key={h.id}
          hotspot={h}
          isActive={activeHotspot?.id === h.id}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <shadowMaterial opacity={0.5} />
    </mesh>
  );
}

export default function ArtifactDetails() {
  const { id } = useParams();
  const artifact = artifacts.find((item) => item.id.toString() === id);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [cameraTarget, setCameraTarget] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const controlsRef = useRef();
  const isMobile = window.matchMedia("(max-width: 1023px)").matches;

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 120);
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
    if (!isSame) setDrawerOpen(false);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@300;400;600&family=Lato:ital,wght@0,300;0,400;1,300&display=swap');
    :root {
      --gold: #d4af5a; --gold-light: #f0d080; --gold-dark: #8a6820;
      --bg: #060504; --white: #f5f0e8; --muted: rgba(245,240,232,0.4);
    }
    .cinema-page { position: fixed; inset: 0; overflow: hidden; opacity: 0; transition: opacity 1s ease; }
    .cinema-page.entered { opacity: 1; }
    .vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(6,5,4,0.7) 100%); pointer-events: none; z-index: 2; }
    .cinema-top { position: absolute; top: 0; left: 0; right: 0; z-index: 10; display: flex; align-items: flex-start; justify-content: space-between; padding: 28px 36px; pointer-events: none; }
    .cinema-kingdom { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); background: rgba(212,175,90,0.08); border: 1px solid rgba(212,175,90,0.2); border-radius: 50px; padding: 5px 14px; pointer-events: all; }
    .cinema-catalog { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.3em; color: var(--muted); }
    .cinema-title-wrap { position: absolute; bottom: 130px; left: 50%; transform: translateX(-50%); text-align: center; z-index: 10; pointer-events: none; white-space: nowrap; }
    .cinema-name { font-family: 'Cinzel Decorative', serif; font-size: clamp(2rem, 5vw, 4.5rem); font-weight: 700; color: transparent; background: linear-gradient(160deg, #f5e49c 0%, var(--gold) 45%, #7a5e28 100%); -webkit-background-clip: text; background-clip: text; letter-spacing: 0.06em; display: block; opacity: 0; transform: translateY(16px); transition: opacity 1s ease 0.3s, transform 1s ease 0.3s; }
    .cinema-page.entered .cinema-name { opacity: 1; transform: translateY(0); }
    .cinema-dynasty { font-family: 'Lato', sans-serif; font-size: 0.7rem; font-weight: 300; letter-spacing: 0.32em; text-transform: uppercase; color: var(--muted); margin-top: 8px; display: block; opacity: 0; transition: opacity 1.2s ease 0.6s; }
    .cinema-page.entered .cinema-dynasty { opacity: 1; }
    .cinema-ornament { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 10px; opacity: 0; transition: opacity 1.2s ease 0.8s; }
    .cinema-page.entered .cinema-ornament { opacity: 1; }
    .orn-line { height: 1px; width: 40px; background: linear-gradient(to right, transparent, var(--gold)); }
    .orn-line.r { background: linear-gradient(to left, transparent, var(--gold)); }
    .orn-diamond { width: 4px; height: 4px; background: var(--gold); transform: rotate(45deg); }
    .cinema-left { position: absolute; left: 36px; top: 50%; transform: translateY(-50%); z-index: 10; pointer-events: none; opacity: 0; transition: opacity 1s ease 1s; background: rgba(6,5,4,0.6); border: 1px solid rgba(212,175,90,0.2); border-radius: 12px; padding: 18px 20px; backdrop-filter: blur(12px); }
    .cinema-page.entered .cinema-left { opacity: 1; }
    .info-label { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; opacity: 0.8; }
    .info-row { margin-bottom: 10px; }
    .info-key { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.2em; color: var(--gold); text-transform: uppercase; display: block; margin-bottom: 2px; opacity: 0.7; }
    .info-val { font-family: 'Lato', sans-serif; font-size: 0.8rem; font-weight: 300; color: var(--white); }
    .info-divider { width: 24px; height: 1px; background: linear-gradient(to right, var(--gold), transparent); margin: 12px 0; opacity: 0.4; }
    .hotspot-card { position: absolute; right: 36px; top: 50%; transform: translateY(-50%) translateX(20px); z-index: 10; max-width: 240px; background: rgba(6,5,4,0.88); border: 1px solid rgba(212,175,90,0.25); border-radius: 14px; padding: 20px; backdrop-filter: blur(20px); box-shadow: 0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,90,0.1); opacity: 0; pointer-events: none; transition: opacity 0.4s ease, transform 0.4s ease; }
    .hotspot-card.visible { opacity: 1; transform: translateY(-50%) translateX(0); pointer-events: all; }
    .hcard-num { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.3em; color: var(--gold-dark); margin-bottom: 6px; }
    .hcard-title { font-family: 'Cinzel', serif; font-size: 0.85rem; font-weight: 600; color: var(--gold); letter-spacing: 0.06em; margin-bottom: 10px; line-height: 1.3; }
    .hcard-divider { height: 1px; background: linear-gradient(to right, var(--gold), transparent); margin-bottom: 12px; opacity: 0.3; }
    .hcard-desc { font-family: 'Lato', sans-serif; font-size: 0.75rem; font-weight: 300; font-style: italic; color: var(--muted); line-height: 1.75; }
    .hcard-close { position: absolute; top: 10px; right: 14px; font-family: 'Lato', sans-serif; font-size: 0.7rem; color: var(--gold-dark); cursor: pointer; background: none; border: none; padding: 0; transition: color 0.2s; }
    .hcard-close:hover { color: var(--gold); }
    .cinema-bottom { position: absolute; bottom: 0; left: 0; right: 0; z-index: 10; display: flex; align-items: flex-end; justify-content: space-between; padding: 0 36px 28px; }
    .drawer-toggle { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); background: rgba(6,5,4,0.8); border: 1px solid rgba(212,175,90,0.25); border-radius: 50px; padding: 9px 20px; cursor: pointer; backdrop-filter: blur(12px); transition: all 0.3s ease; display: flex; align-items: center; gap: 8px; }
    .drawer-toggle:hover { background: rgba(212,175,90,0.1); border-color: rgba(212,175,90,0.5); }
    .drawer-toggle-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); animation: goldPulse 2s ease-in-out infinite; }
    .cinema-hint { font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.25em; color: var(--muted); opacity: 0.5; display: flex; align-items: center; gap: 8px; pointer-events: none; transition: opacity 0.4s; }
    .cinema-hint.hidden { opacity: 0; }
    .hint-line { width: 1px; height: 22px; background: linear-gradient(to bottom, transparent, var(--gold)); animation: lineGrow 2.5s ease-in-out infinite; }
    @keyframes lineGrow { 0%,100% { height: 16px; opacity: 0.4; } 50% { height: 28px; opacity: 0.9; } }
    .hotspot-drawer { position: absolute; bottom: 0; left: 0; right: 0; z-index: 20; background: rgba(6,5,4,0.95); border-top: 1px solid rgba(212,175,90,0.15); backdrop-filter: blur(24px); padding: 20px 36px 36px; transform: translateY(100%); transition: transform 0.45s cubic-bezier(0.4,0,0.2,1); }
    .hotspot-drawer.open { transform: translateY(0); }
    .drawer-handle { width: 36px; height: 3px; background: rgba(212,175,90,0.3); border-radius: 3px; margin: 0 auto 16px; cursor: pointer; }
    .drawer-title { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(212,175,90,0.45); margin-bottom: 14px; }
    .drawer-grid { display: flex; gap: 8px; flex-wrap: wrap; }
    .drawer-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,90,0.1); border-radius: 8px; padding: 10px 14px; cursor: pointer; transition: all 0.25s ease; display: flex; align-items: center; gap: 8px; min-width: 130px; }
    .drawer-item:hover { background: rgba(212,175,90,0.07); border-color: rgba(212,175,90,0.3); }
    .drawer-item.active { background: rgba(212,175,90,0.1); border-color: rgba(212,175,90,0.45); }
    .drawer-item-num { font-family: 'Cinzel', serif; font-size: 0.6rem; color: var(--gold-dark); min-width: 16px; }
    .drawer-item.active .drawer-item-num { color: var(--gold); }
    .drawer-pip { width: 5px; height: 5px; border-radius: 50%; background: var(--gold-dark); flex-shrink: 0; }
    .drawer-item.active .drawer-pip { background: var(--gold-light); box-shadow: 0 0 8px rgba(240,208,128,0.5); }
    .drawer-item-name { font-family: 'Cinzel', serif; font-size: 0.7rem; color: var(--gold); font-weight: 600; letter-spacing: 0.04em; }
    .ar-btn-mobile { display: none; }
    .corner { position: absolute; width: 22px; height: 22px; z-index: 3; pointer-events: none; }
    .corner.tl { top: 16px; left: 16px; border-top: 1px solid rgba(212,175,90,0.35); border-left: 1px solid rgba(212,175,90,0.35); }
    .corner.tr { top: 16px; right: 16px; border-top: 1px solid rgba(212,175,90,0.35); border-right: 1px solid rgba(212,175,90,0.35); }
    .corner.bl { bottom: 16px; left: 16px; border-bottom: 1px solid rgba(212,175,90,0.35); border-left: 1px solid rgba(212,175,90,0.35); }
    .corner.br { bottom: 16px; right: 16px; border-bottom: 1px solid rgba(212,175,90,0.35); border-right: 1px solid rgba(212,175,90,0.35); }
    @keyframes goldPulse { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(212,175,90,0.4); } 50% { opacity: 0.4; box-shadow: 0 0 0 5px rgba(212,175,90,0); } }
    @media (max-width: 768px) {
      .cinema-left { display: none; }
      .hotspot-card { right: 16px; left: 16px; max-width: none; width: auto; top: 80px; bottom: auto; transform: none; opacity: 0; pointer-events: none; }
      .hotspot-card.visible { opacity: 1; transform: none; pointer-events: all; }
      .cinema-name { font-size: 1.6rem; }
      .cinema-bottom { padding: 0 16px 20px; }
      .hotspot-drawer { padding: 16px 16px 28px; }
      .ar-btn-mobile { display: flex; }
    }
  `;

  const activeIndex = hotspots.findIndex(h => h.id === activeHotspot?.id);

  return (
    <>
      {/* AR model viewer — hidden */}
      <div style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", opacity: 0, top: 0, left: 0 }}>
        <model-viewer
          id="ar-trigger"
          src={artifact.modelPath}
          ar
          ar-modes="scene-viewer webxr quick-look"
          ar-placement="floor"
          camera-controls
        >
          <button slot="ar-button" id="real-ar-button"></button>
        </model-viewer>
      </div>

      <style>{styles}</style>
      <div className={`cinema-page ${entered ? "entered" : ""}`}>

        <div className="corner tl" /><div className="corner tr" />
        <div className="corner bl" /><div className="corner br" />
        <div className="vignette" />

        <Canvas
          shadows
          camera={{ position: [0, 0.3, 3.8], fov: 42 }}
          gl={{ antialias: true, toneMappingExposure: 1.1 }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <fog attach="fog" args={["#060504", 6, 18]} />
          <CinematicLights />
          <DustParticles />
          <Floor />

          <Suspense fallback={null}>
            <Model
              path={artifact.modelPath}
              scale={artifact.modelScale || 2.0}
              position={artifact.modelPosition || [0, -1.5, 0]}
              hotspots={hotspots}
              activeHotspot={activeHotspot}
              onSelect={handleHotspotSelect}
            />
          </Suspense>

          <CameraController target={cameraTarget} controlsRef={controlsRef} />
          <IdleDrift active={!!activeHotspot} />

          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            autoRotate={!activeHotspot && !drawerOpen}
            autoRotateSpeed={0.5}
            minDistance={1.5}
            maxDistance={7}
            zoomSpeed={0.6}
          />
        </Canvas>

        <div className="cinema-top">
          <div className="cinema-kingdom">{artifact.kingdom}</div>
          <div className="cinema-catalog">CAT. {String(artifact.id).padStart(3, "0")} / 007</div>
        </div>

        <div className="cinema-left">
          <div className="info-label">Details</div>
          <div className="info-row">
            <span className="info-key">Material</span>
            <span className="info-val">{artifact.material}</span>
          </div>
          <div className="info-divider" />
          <div className="info-row">
            <span className="info-key">Kingdom</span>
            <span className="info-val">{artifact.kingdom}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Hotspots</span>
            <span className="info-val">{hotspots.length} points</span>
          </div>
        </div>

        <div className={`hotspot-card ${activeHotspot ? "visible" : ""}`}>
          <button className="hcard-close" onClick={() => handleHotspotSelect(activeHotspot)}>✕</button>
          {activeHotspot && (
            <>
              <div className="hcard-num">{String(activeIndex + 1).padStart(2, "0")} / {String(hotspots.length).padStart(2, "0")}</div>
              <div className="hcard-title">{activeHotspot.title}</div>
              <div className="hcard-divider" />
              <div className="hcard-desc">{activeHotspot.description}</div>
            </>
          )}
        </div>

        <div className="cinema-title-wrap">
          <span className="cinema-name">{artifact.name}</span>
          <span className="cinema-dynasty">{artifact.kingdom} · {artifact.material}</span>
          <div className="cinema-ornament">
            <div className="orn-line" />
            <div className="orn-diamond" />
            <div className="orn-line r" />
          </div>
        </div>

        <div className="cinema-bottom">
          <div className={`cinema-hint ${activeHotspot || drawerOpen ? "hidden" : ""}`}>
            <div className="hint-line" />
            Drag to rotate
          </div>
          {hotspots.length > 0 && (
            <button className="drawer-toggle"
              onClick={() => { setDrawerOpen(!drawerOpen); setActiveHotspot(null); setCameraTarget(null); }}>
              <div className="drawer-toggle-dot" />
              {drawerOpen ? "Close" : "Explore Points"}
            </button>
          )}
        </div>

        <div className={`hotspot-drawer ${drawerOpen ? "open" : ""}`}>
          <div className="drawer-handle" onClick={() => setDrawerOpen(false)} />
          <div className="drawer-title">Explore Points</div>
          <div className="drawer-grid">
            {hotspots.map((h, i) => (
              <div key={h.id}
                className={`drawer-item ${activeHotspot?.id === h.id ? "active" : ""}`}
                onClick={() => { handleHotspotSelect(h); setDrawerOpen(false); }}>
                <span className="drawer-item-num">0{i + 1}</span>
                <div className="drawer-pip" />
                <span className="drawer-item-name">{h.title}</span>
              </div>
            ))}
          </div>

          {/* AR button جوا الـ drawer على موبايل بس */}
          <button
            className="ar-btn-mobile"
            onClick={() => {
              const mv = document.getElementById('ar-trigger');
              if (mv) mv.activateAR();
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: "16px",
              backgroundColor: "rgba(212,175,90,0.1)",
              border: "1px solid rgba(212,175,90,0.3)",
              color: "#d4af5a",
              padding: "12px 24px",
              borderRadius: "50px",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
            }}
          >
            ✨ View in Your Space ✨
          </button>
        </div>

      </div>
    </>
  );
}