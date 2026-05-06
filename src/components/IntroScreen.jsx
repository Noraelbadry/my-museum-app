import { useEffect, useState, useRef } from "react";

export default function IntroScreen({ onComplete }) {
  const [phase, setPhase] = useState("entering"); // entering → hold → leaving
  const canvasRef = useRef();

  // ── Particles ──────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 180;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.4 + 0.1),
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.opacity})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += (Math.random() - 0.5) * 0.01;
        p.opacity = Math.max(0.1, Math.min(0.8, p.opacity));
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Timing ─────────────────────────────────────────────
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("leaving"), 2800);
    const t3 = setTimeout(() => onComplete(), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Lato:wght@300;400&display=swap');

    .intro-wrap {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background: #060504;
      transition: opacity 1s ease;
    }

    .intro-wrap.leaving {
      opacity: 0;
      pointer-events: none;
    }

    .intro-canvas {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    /* Vignette */
    .intro-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, transparent 30%, rgba(6,5,4,0.85) 100%);
      pointer-events: none;
    }

    /* Center content */
    .intro-content {
      position: relative;
      z-index: 10;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
    }

    /* Top ornament line */
    .intro-top-line {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
      opacity: 0;
      transform: scaleX(0);
      transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
    }
    .intro-wrap:not(.leaving) .intro-top-line {
      opacity: 1;
      transform: scaleX(1);
    }
    .intro-line {
      height: 1px;
      width: 60px;
      background: linear-gradient(to right, transparent, #C9A84C);
    }
    .intro-line.r {
      background: linear-gradient(to left, transparent, #C9A84C);
    }
    .intro-diamond {
      width: 5px; height: 5px;
      background: #C9A84C;
      transform: rotate(45deg);
      flex-shrink: 0;
    }

    /* Eye of Horus icon */
    .intro-eye {
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s;
      margin-bottom: 18px;
    }
    .intro-wrap:not(.leaving) .intro-eye { opacity: 0.7; transform: translateY(0); }

    /* Main title */
    .intro-title {
      font-family: 'Cinzel Decorative', serif;
      font-size: clamp(2.8rem, 8vw, 6rem);
      font-weight: 700;
      color: transparent;
      background: linear-gradient(160deg, #f5e49c 0%, #C9A84C 45%, #7a5e28 100%);
      -webkit-background-clip: text;
      background-clip: text;
      letter-spacing: 0.1em;
      line-height: 1;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 1s ease 0.4s, transform 1s ease 0.4s;
      margin-bottom: 0;
    }
    .intro-wrap:not(.leaving) .intro-title { opacity: 1; transform: translateY(0); }

    /* Subtitle */
    .intro-subtitle {
      font-family: 'Lato', sans-serif;
      font-size: clamp(0.65rem, 1.5vw, 0.85rem);
      font-weight: 300;
      letter-spacing: 0.45em;
      text-transform: uppercase;
      color: rgba(245,240,232,0.45);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 1s ease 0.8s, transform 1s ease 0.8s;
      margin-top: 14px;
    }
    .intro-wrap:not(.leaving) .intro-subtitle { opacity: 1; transform: translateY(0); }

    /* Bottom ornament */
    .intro-bottom-line {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 28px;
      opacity: 0;
      transform: scaleX(0);
      transition: opacity 0.8s ease 1s, transform 0.8s ease 1s;
    }
    .intro-wrap:not(.leaving) .intro-bottom-line {
      opacity: 1;
      transform: scaleX(1);
    }

    /* Loading bar */
    .intro-loader {
      width: 120px;
      height: 1px;
      background: rgba(201,168,76,0.15);
      margin-top: 40px;
      position: relative;
      overflow: hidden;
      opacity: 0;
      transition: opacity 0.6s ease 1.2s;
    }
    .intro-wrap:not(.leaving) .intro-loader { opacity: 1; }
    .intro-loader::after {
      content: '';
      position: absolute;
      left: -100%;
      top: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, transparent, #C9A84C, transparent);
      animation: loaderSlide 1.6s ease 1.4s forwards;
    }
    @keyframes loaderSlide { to { left: 100%; } }

    /* Enter text */
    .intro-enter {
      font-family: 'Lato', sans-serif;
      font-size: 0.6rem;
      font-weight: 300;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(201,168,76,0.4);
      margin-top: 16px;
      opacity: 0;
      transition: opacity 0.8s ease 1.8s;
      animation: enterPulse 2s ease-in-out 2s infinite;
    }
    .intro-wrap:not(.leaving) .intro-enter { opacity: 1; }
    @keyframes enterPulse {
      0%,100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }

    /* Corner accents */
    .intro-corner {
      position: absolute;
      width: 30px; height: 30px;
      opacity: 0;
      transition: opacity 0.6s ease 0.6s;
    }
    .intro-wrap:not(.leaving) .intro-corner { opacity: 0.4; }
    .intro-corner.tl { top: 24px; left: 24px; border-top: 1px solid #C9A84C; border-left: 1px solid #C9A84C; }
    .intro-corner.tr { top: 24px; right: 24px; border-top: 1px solid #C9A84C; border-right: 1px solid #C9A84C; }
    .intro-corner.bl { bottom: 24px; left: 24px; border-bottom: 1px solid #C9A84C; border-left: 1px solid #C9A84C; }
    .intro-corner.br { bottom: 24px; right: 24px; border-bottom: 1px solid #C9A84C; border-right: 1px solid #C9A84C; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className={`intro-wrap ${phase === "leaving" ? "leaving" : ""}`}>

        {/* Particles canvas */}
        <canvas ref={canvasRef} className="intro-canvas" />

        {/* Vignette */}
        <div className="intro-vignette" />

        {/* Corner accents */}
        <div className="intro-corner tl" />
        <div className="intro-corner tr" />
        <div className="intro-corner bl" />
        <div className="intro-corner br" />

        {/* Center content */}
        <div className="intro-content">

        

          {/* Top ornament */}
          <div className="intro-top-line">
            <div className="intro-line" />
            <div className="intro-diamond" />
            <div className="intro-line r" />
          </div>

          {/* Title */}
          <div className="intro-title">ARchive</div>

          {/* Subtitle */}
          <div className="intro-subtitle">Virtual Museum</div>

          {/* Bottom ornament */}
          <div className="intro-bottom-line">
            <div className="intro-line" />
            <div className="intro-diamond" />
            <div className="intro-line r" />
          </div>

          {/* Loader */}
          <div className="intro-loader" />

          {/* Enter hint */}
          <div className="intro-enter">Entering the archive</div>

        </div>
      </div>
    </>
  );
}