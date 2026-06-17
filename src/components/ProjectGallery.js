import { useEffect, useRef } from "react";
import * as THREE from "three";

// --- Tag color map (mirrors Projects.js TAG_COLORS, used when drawing canvas textures) ---
const TAG_COLORS = {
  blue: { bg: "#0C447C", text: "#B5D4F4" },
  teal: { bg: "#085041", text: "#9FE1CB" },
  green: { bg: "#27500A", text: "#C0DD97" },
  purple: { bg: "#3C3489", text: "#CECBF6" },
  amber: { bg: "#633806", text: "#FAC775" },
  coral: { bg: "#712B13", text: "#F5C4B3" },
  warning: { bg: "#664d03", text: "#ffe69c" },
  secondary: { bg: "#444441", text: "#D3D1C7" },
};

// --- Canvas texture builder ---
// Draws a full project card — title, goal, bullet list, tags — onto an offscreen
// <canvas>, which is then used as a texture on a Three.js plane mesh.
// This is the standard way to render crisp text in WebGL without a font-loading
// library — we let the browser's 2D canvas renderer do the text layout for us.
// Canvas is taller than before (880px) since the full bullet list now lives
// on the card face instead of behind a click-through modal.
function buildCardTexture(project, accentHex) {
  const W = 560, H = 880;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background panel
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, W, H);

  // Accent border glow strip at top
  ctx.fillStyle = accentHex;
  ctx.fillRect(0, 0, W, 6);

  // Border
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  // Title
  ctx.fillStyle = "#e6edf3";
  ctx.font = "600 32px 'Segoe UI', sans-serif";
  let cursorY = wrapText(ctx, project.title, 36, 66, W - 72, 38, 2);

  // Goal / description (italic-style via font, since canvas has no italic shorthand issues)
  cursorY += 18;
  ctx.fillStyle = "#8b949e";
  ctx.font = "400 19px 'Segoe UI', sans-serif";
  cursorY = wrapText(ctx, project.goal, 36, cursorY, W - 72, 26, 3);

  // Divider line
  cursorY += 20;
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, cursorY);
  ctx.lineTo(W - 36, cursorY);
  ctx.stroke();
  cursorY += 32;

  // Reserve space at the bottom for tags (~50px) so bullets never collide with them
  const bulletAreaBottom = H - 72;

  // Bullet list — dynamically sized font/line-height so all bullets fit
  // regardless of how many a given project has (3 to 5 bullets across projects)
  const bullets = project.bullets || [];
  const lineHeight = bullets.length > 4 ? 22 : 25;
  const fontSize = bullets.length > 4 ? 16 : 17;
  ctx.font = `400 ${fontSize}px 'Segoe UI', sans-serif`;
  ctx.fillStyle = "#c9d1d9";

  bullets.forEach(bullet => {
    if (cursorY > bulletAreaBottom - lineHeight) return; // safety: stop if we'd overflow
    // Bullet marker
    ctx.fillStyle = accentHex;
    ctx.beginPath();
    ctx.arc(42, cursorY - 6, 3, 0, Math.PI * 2);
    ctx.fill();
    // Bullet text, indented past the marker
    ctx.fillStyle = "#c9d1d9";
    const maxLinesPerBullet = Math.max(1, Math.floor((bulletAreaBottom - cursorY) / lineHeight));
    const endY = wrapTextWithLimit(ctx, bullet, 56, cursorY, W - 92, lineHeight, maxLinesPerBullet);
    cursorY = endY + (lineHeight * 0.35);
  });

  // Tags as pill shapes, anchored to the bottom of the card
  let tx = 36, ty = H - 56;
  ctx.font = "500 16px 'Segoe UI', sans-serif";
  project.tags.slice(0, 4).forEach(tag => {
    const c = TAG_COLORS[tag.color] || TAG_COLORS.secondary;
    const textW = ctx.measureText(tag.label).width;
    const pillW = textW + 28;
    if (tx + pillW > W - 36) { tx = 36; ty += 38; }
    ctx.fillStyle = c.bg;
    roundRect(ctx, tx, ty, pillW, 30, 15);
    ctx.fill();
    ctx.fillStyle = c.text;
    ctx.fillText(tag.label, tx + 14, ty + 20);
    tx += pillW + 10;
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Word-wrap for canvas text, with a max line count (ellipsis if exceeded).
// Returns the Y position immediately after the last drawn line, so callers
// can chain multiple text blocks vertically (title -> goal -> bullets).
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(" ");
  let line = "";
  let lines = [];
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = test;
    }
  }
  lines.push(line);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = lines[maxLines - 1].trim() + "…";
  }
  lines.forEach((l, i) => ctx.fillText(l.trim(), x, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

// Bullet-specific wrapper — same wrapping logic, named separately at the call
// site for clarity since bullets get a per-bullet dynamic line limit
const wrapTextWithLimit = wrapText;

const ACCENT_COLORS = ["#1D9E75", "#378ADD", "#7F77DD", "#EF9F27", "#D85A30"];

export default function ProjectGallery({ projects }) {
  const wrapRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const size = { W: wrap.clientWidth, H: wrap.clientHeight };

    const renderer = new THREE.WebGLRenderer({
      canvas: wrap.querySelector("canvas"),
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size.W, size.H);
    renderer.setClearColor(0x05070d, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, size.W / size.H, 0.1, 100);
    camera.position.set(0, 0, 13);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.PointLight(0xffffff, 1.2);
    key.position.set(4, 6, 8);
    scene.add(key);

    // --- Decorative central wireframe torus (the "sci-fi" core element) ---
    const torusGeo = new THREE.TorusKnotGeometry(1.6, 0.35, 120, 16);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x1D9E75, wireframe: true, transparent: true, opacity: 0.35,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    // --- Card group (rotates as a whole — the "cylinder" of cards) ---
    const group = new THREE.Group();
    scene.add(group);

    const RADIUS = 7.5;

    projects.forEach((project, i) => {
      const angle = (i / projects.length) * Math.PI * 2;
      const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
      const texture = buildCardTexture(project, accent);

      const cardW = 3.0, cardH = 4.7; // matches the 560:880 canvas aspect ratio
      const geo = new THREE.PlaneGeometry(cardW, cardH);
      const mat = new THREE.MeshBasicMaterial({
        map: texture, transparent: true, side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);

      // Position around the circle, facing outward
      mesh.position.set(Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS);
      mesh.lookAt(0, 0, 0);
      mesh.rotateY(Math.PI); // flip so text faces outward, not inward

      group.add(mesh);

      // Subtle glow plane behind each card
      const glowGeo = new THREE.PlaneGeometry(cardW + 0.3, cardH + 0.3);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accent), transparent: true, opacity: 0.15,
        side: THREE.DoubleSide,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.copy(mesh.position);
      glow.position.multiplyScalar(0.97);
      glow.lookAt(0, 0, 0);
      glow.rotateY(Math.PI);
      group.add(glow);
    });

    // --- Drag-to-rotate (no click handling — this is a pure viewer now;
    // actual project links live in a list below the gallery, not on the cards) ---
    let isDragging = false;
    let lastX = 0;
    let rotY = 0, velY = 0;

    const onDown = e => {
      isDragging = true;
      lastX = e.clientX;
      wrap.style.cursor = "grabbing";
    };
    const onUp = () => {
      isDragging = false;
      wrap.style.cursor = "grab";
    };
    const onMove = e => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      velY = dx * 0.0045;
      rotY += velY;
      lastX = e.clientX;
    };

    wrap.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);

    // Wheel also rotates the gallery (feels like the reference's scroll-driven spiral)
    const onWheel = e => {
      e.preventDefault();
      velY = e.deltaY * 0.0006;
      rotY += velY;
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });

    const onResize = () => {
      size.W = wrap.clientWidth;
      size.H = wrap.clientHeight;
      camera.aspect = size.W / size.H;
      camera.updateProjectionMatrix();
      renderer.setSize(size.W, size.H);
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    function animate() {
      animRef.current = requestAnimationFrame(animate);
      t += 0.005;

      // Gentle auto-rotation, with drag momentum decaying over time
      rotY += 0.0015 + velY;
      velY *= 0.92;
      group.rotation.y = rotY;

      torus.rotation.x = t * 0.3;
      torus.rotation.y = t * 0.2;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mousedown", onDown);
      wrap.removeEventListener("wheel", onWheel);
      renderer.dispose();
    };
  }, [projects]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: "680px",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#05070d",
        cursor: "grab",
        marginBottom: "1.5rem",
      }}
    >
      <canvas style={{ display: "block", width: "100%", height: "100%" }} />
      <div style={{
        position: "absolute", bottom: "12px", right: "16px",
        fontSize: "11px", color: "rgba(255,255,255,0.3)",
        fontFamily: "inherit", pointerEvents: "none",
      }}>
        drag · scroll to rotate
      </div>
    </div>
  );
}