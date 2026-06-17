import { useEffect, useRef } from "react";
import * as THREE from "three";

// Particle count — reduce if needed for performance
const COUNT = 1200;
// How many particles to check for connections (O(n²) so keep this under ~400)
const LINE_SAMPLE = 140;
// Only recompute the connection lines every N frames — distance checks are O(n^2)
// and don't need to update every frame to look smooth
const LINE_UPDATE_INTERVAL = 4;
const LINE_THRESH = 80;    // max distance between two particles to draw a line
const LINE_THRESH2 = LINE_THRESH * LINE_THRESH;

// Color palette: teal, blue, near-white, purple — matches the site's color scheme
const PALETTE = [
  [0.11, 0.62, 0.46],   // #1D9E75 teal
  [0.22, 0.54, 0.87],   // #378ADD blue
  [0.90, 0.93, 0.95],   // near-white
  [0.49, 0.47, 0.87],   // #7F77DD purple
];

export default function ParticleHero() {
  const wrapRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const W = wrap.clientWidth;
    const H = wrap.clientHeight;

    // --- Renderer ---
    // alpha: false because we own the background color (#0a0e1a)
    const renderer = new THREE.WebGLRenderer({
      canvas: wrap.querySelector("canvas"),
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x0a0e1a, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 200;

    // --- Particle data ---
    // positions: current x/y/z for each particle
    // home:      the "resting" position each particle drifts back toward
    // vel:       per-particle velocity, tiny random values
    const positions = new Float32Array(COUNT * 3);
    const home = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 500;
      const y = (Math.random() - 0.5) * 300;
      const z = (Math.random() - 0.5) * 200;
      positions[i * 3] = home[i * 3] = x;
      positions[i * 3 + 1] = home[i * 3 + 1] = y;
      positions[i * 3 + 2] = home[i * 3 + 2] = z;
      vel[i * 3] = (Math.random() - 0.5) * 0.04;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
    }

    // BufferGeometry with position + color attributes — the Points object
    // reads these directly from the typed arrays each frame
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,  // particles further away appear smaller
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    // --- Connection lines ---
    // We only check LINE_SAMPLE particles (the first N) for connections
    // because the brute-force O(n^2) check is expensive.
    // LINE_SAMPLE=140 with a 4-frame update interval keeps this cheap.
    const lineBuf = new Float32Array(LINE_SAMPLE * LINE_SAMPLE * 6);
    const lgeo = new THREE.BufferGeometry();
    lgeo.setAttribute("position", new THREE.BufferAttribute(lineBuf, 3));
    const lmat = new THREE.LineBasicMaterial({ color: 0x1D9E75, transparent: true, opacity: 0.07 });
    const lsegs = new THREE.LineSegments(lgeo, lmat);
    scene.add(lsegs);

    // --- Mouse parallax ---
    let mx = 0, my = 0;
    let rotX = 0, rotY = 0;

    const onMouseMove = e => {
      const r = wrap.getBoundingClientRect();
      mx = ((e.clientX - r.left) / W - 0.5) * 2;
      my = ((e.clientY - r.top) / H - 0.5) * 2;
    };
    wrap.addEventListener("mousemove", onMouseMove);

    // --- Animation loop ---
    let t = 0;
    let frame = 0;
    function animate() {
      animRef.current = requestAnimationFrame(animate);
      t += 0.004;

      // Move each particle: velocity + spring-back toward home + sine breathing
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        positions[ix] += vel[ix];
        positions[iy] += vel[iy];
        positions[iz] += vel[iz];
        // Spring: pull gently back to home so particles don't wander off screen
        positions[ix] += (home[ix] - positions[ix]) * 0.0008;
        positions[iy] += (home[iy] - positions[iy]) * 0.0008;
        positions[iz] += (home[iz] - positions[iz]) * 0.0008;
        // Vertical breathing — gives the field a living, organic feel
        positions[iy] += Math.sin(t + i * 0.01) * 0.015;
      }
      geo.attributes.position.needsUpdate = true;

      // Build connection lines for the sampled subset — only every
      // LINE_UPDATE_INTERVAL frames, since recalculating O(n^2) distances
      // every single frame is the main performance cost in this scene
      frame++;
      if (frame % LINE_UPDATE_INTERVAL === 0) {
        let li = 0;
        for (let i = 0; i < LINE_SAMPLE; i++) {
          for (let j = i + 1; j < LINE_SAMPLE; j++) {
            const ax = positions[i * 3], ay = positions[i * 3 + 1], az = positions[i * 3 + 2];
            const bx = positions[j * 3], by = positions[j * 3 + 1], bz = positions[j * 3 + 2];
            const d2 = (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2;
            if (d2 < LINE_THRESH2 && li + 5 < lineBuf.length) {
              lineBuf[li++] = ax; lineBuf[li++] = ay; lineBuf[li++] = az;
              lineBuf[li++] = bx; lineBuf[li++] = by; lineBuf[li++] = bz;
            }
          }
        }
        // Zero unused buffer slots so old lines don't ghost
        for (let i = li; i < lineBuf.length; i++) lineBuf[i] = 0;
        lgeo.attributes.position.needsUpdate = true;
        // setDrawRange tells Three.js to only draw the active portion of the buffer
        lgeo.setDrawRange(0, li / 3);
      }

      // Smooth mouse parallax — lerp toward target rotation each frame
      rotY += (mx * 0.3 - rotY) * 0.04;
      rotX += (-my * 0.15 - rotX) * 0.04;
      pts.rotation.y = lsegs.rotation.y = rotY + t * 0.015;
      pts.rotation.x = lsegs.rotation.x = rotX;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      wrap.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      geo.dispose();
      lgeo.dispose();
      mat.dispose();
      lmat.dispose();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "500px",
        background: "#0a0e1a",
        overflow: "hidden",
      }}
    >
      <canvas style={{ display: "block", width: "100%", height: "100%" }} />

      {/* Hero text overlay — sits on top of the canvas */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 2rem",
        pointerEvents: "none",
        fontFamily: "'Roboto', sans-serif",
      }}>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 700,
          color: "#e6edf3",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          marginBottom: "16px",
          fontFamily: "'Orbitron', sans-serif",
        }}>
          A <span style={{ color: "#1D9E75" }}>Cloud</span> Engineer
        </h1>

        <p style={{
          fontSize: "clamp(14px, 2vw, 17px)",
          color: "#8b949e",
          maxWidth: "500px",
          lineHeight: 1.7,
          marginBottom: "32px",
        }}>
          DevOps and systems administration — Kubernetes, CI/CD pipelines,
          Ansible automation, Prometheus and Grafana monitoring, and
          React applications built and shipped end to end.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", pointerEvents: "auto" }}>
          <a
            href="/projects"
            style={{
              padding: "11px 26px", borderRadius: "8px",
              fontSize: "14px", fontWeight: 500,
              background: "#1D9E75", color: "#fff",
              textDecoration: "none", border: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.target.style.opacity = "0.85"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >
            View Projects
          </a>
          <a
            href="/resume"
            style={{
              padding: "11px 26px", borderRadius: "8px",
              fontSize: "14px", fontWeight: 500,
              background: "rgba(255,255,255,0.08)",
              color: "#e6edf3",
              textDecoration: "none",
              border: "0.5px solid rgba(255,255,255,0.18)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.target.style.opacity = "0.8"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >
            Resume
          </a>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "28px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          animation: "particleHeroBounce 2s ease-in-out infinite",
        }}
        onClick={() => {
          wrapRef.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span style={{ fontSize: "11px", color: "#8b949e", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Scroll
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <style>{`
                @keyframes particleHeroBounce {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(8px); }
                }
            `}</style>
    </div>
  );
}