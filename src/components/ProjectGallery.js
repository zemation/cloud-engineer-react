import { useEffect, useRef, useState } from "react";
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

    // Goal / description
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

    // Reserve space at the bottom for stats row (~36px) + tags (~50px)
    // so bullets never collide with either
    const statsAreaHeight = (project.stats && project.stats.length) ? 44 : 0;
    const bulletAreaBottom = H - 72 - statsAreaHeight;

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

    // Key-fact stats row — small label/value pairs in boxed cells, anchored
    // just above the tags. Fills the visual gap left by shorter bullet lists
    // with genuinely useful info (counts, tech choices) rather than blank space.
    if (project.stats && project.stats.length) {
        const statsY = H - 72 - statsAreaHeight + 14;

        // Divider above the stats row, separating it from the bullet list
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(36, statsY - 18);
        ctx.lineTo(W - 36, statsY - 18);
        ctx.stroke();

        const cellW = (W - 72) / project.stats.length;
        project.stats.forEach((stat, i) => {
            const cx = 36 + i * cellW;
            // Divider between cells (skip before the first)
            if (i > 0) {
                ctx.strokeStyle = "rgba(255,255,255,0.1)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cx, statsY - 6);
                ctx.lineTo(cx, statsY + 26);
                ctx.stroke();
            }
            const textX = cx + (i > 0 ? 18 : 0);
            ctx.fillStyle = accentHex;
            ctx.font = "600 20px 'Segoe UI', sans-serif";
            ctx.fillText(stat.value, textX, statsY + 10);
            ctx.fillStyle = "rgba(255,255,255,0.45)";
            ctx.font = "400 13px 'Segoe UI', sans-serif";
            ctx.fillText(stat.label.toUpperCase(), textX, statsY + 28);
        });
    }

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

// Royal blue for the central infinity-loop hub. No text on it — kept as a
// plain solid shape, since wrapping text onto a figure-8's curved surface
// inevitably twists/rotates the letters as the curve's direction changes
// (the loop's direction of travel sweeps a full 360° to trace both lobes).
const HUB_COLOR = 0x5B7FE8; // royal blue, lightened for better visibility under metalness

export default function ProjectGallery({ projects }) {
    const wrapRef = useRef(null);
    const animRef = useRef(null);

    // autoRotateRef is read inside the animation loop every frame — using a ref
    // (rather than state) means toggling it doesn't need to re-run the whole
    // Three.js setup effect. isAutoRotating (state) exists purely so the toggle
    // button's label/icon updates visually; the two are kept in sync below.
    const autoRotateRef = useRef(true);
    const [isAutoRotating, setIsAutoRotating] = useState(true);

    const toggleAutoRotate = () => {
        autoRotateRef.current = !autoRotateRef.current;
        setIsAutoRotating(autoRotateRef.current);
    };

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        // Mutable size object so onResize and onMouseMove always read the
        // current dimensions, not a stale snapshot from mount time
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

        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const key = new THREE.PointLight(0xffffff, 4);
        key.position.set(3, 4, 6);
        scene.add(key);
        // Fill light from the opposite side, slightly cool-toned — helps the
        // hub's clearcoat finish show a visible highlight sweep rather than
        // looking flat from angles the key light doesn't reach directly
        const fill = new THREE.PointLight(0xaaccff, 5);
        fill.position.set(-3, -2, 5);
        scene.add(fill);

        // --- Central infinity-loop hub ---
        // Built as a custom tube (not THREE.TubeGeometry) tracing a figure-8
        // (lemniscate) curve. At each point along the curve we generate a small
        // ring of vertices around a circular cross-section, oriented using a 2D
        // tangent computed purely in the flat XY plane — this avoids the twisting
        // problem THREE.TubeGeometry has on self-intersecting curves (its Frenet
        // frame rotates unpredictably), since our tangent calculation never needs
        // to track 3D orientation changes, only a 2D direction of travel.
        //
        // Earlier version: a flat ribbon (just 2 vertices per point, zero Z depth)
        // looked completely flat under lighting because computeVertexNormals() on
        // a perfectly flat mesh produces identical normals everywhere — there's no
        // curvature for a clearcoat highlight to move across. This version gives
        // the loop real thickness so light (and the clearcoat reflection) varies
        // naturally across its surface, like an actual physical tube.
        // Lemniscate of Bernoulli — a single continuous curve (no seams to kink
        // at the crossing point, unlike stitching two separate circles together)
        // that naturally produces rounder, more circular-looking loops than the
        // lemniscate of Gerono used previously, which had more pointed/pinched
        // lobes. This is the curve classically associated with the infinity symbol.
        function lemniscatePoint(t) {
            const angle = t * Math.PI * 2;
            const a = 2.2; // overall size
            const denom = 1 + Math.sin(angle) * Math.sin(angle);
            return {
                x: (a * Math.cos(angle)) / denom,
                y: (a * Math.cos(angle) * Math.sin(angle)) / denom,
            };
        }

        const TUBE_SEGMENTS = 200;   // points sampled along the loop's length
        const TUBE_RADIUS = 0.3;     // thickness of the tube's circular cross-section
        const RADIAL_SEGMENTS = 12;  // vertices around each cross-section ring

        const ribbonPositions = [];
        const ribbonIndices = [];

        for (let i = 0; i <= TUBE_SEGMENTS; i++) {
            const t = i / TUBE_SEGMENTS;
            const tNext = ((i + 1) % TUBE_SEGMENTS) / TUBE_SEGMENTS;
            const tPrev = ((i - 1 + TUBE_SEGMENTS) % TUBE_SEGMENTS) / TUBE_SEGMENTS;

            const p = lemniscatePoint(t);
            const pNext = lemniscatePoint(tNext);
            const pPrev = lemniscatePoint(tPrev);

            // 2D tangent direction (purely in the flat XY plane the curve lies in)
            const dx = pNext.x - pPrev.x;
            const dy = pNext.y - pPrev.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const tangentX = dx / len;
            const tangentY = dy / len;

            // The cross-section ring at this point sits in the plane perpendicular
            // to the tangent. Since the tangent is a 2D direction (always within
            // the XY plane, never tilting into Z), the perpendicular plane is
            // simply spanned by: (a) the in-plane normal (90° rotation of tangent,
            // still in XY) and (b) the Z axis directly. This is what keeps the
            // cross-section from twisting — both basis vectors are geometrically
            // fixed relative to the flat curve, with no rotating 3D frame involved.
            const normalX = -tangentY;
            const normalY = tangentX;

            for (let r = 0; r < RADIAL_SEGMENTS; r++) {
                const ringAngle = (r / RADIAL_SEGMENTS) * Math.PI * 2;
                const cosA = Math.cos(ringAngle);
                const sinA = Math.sin(ringAngle);
                // Offset = cos(ringAngle) * inPlaneNormal + sin(ringAngle) * Z axis
                const offX = normalX * cosA * TUBE_RADIUS;
                const offY = normalY * cosA * TUBE_RADIUS;
                const offZ = sinA * TUBE_RADIUS;
                ribbonPositions.push(p.x + offX, p.y + offY, offZ);
            }
        }

        // Connect each ring to the next ring with quads, wrapping around both
        // the tube's length (i) and its circumference (r)
        for (let i = 0; i < TUBE_SEGMENTS; i++) {
            for (let r = 0; r < RADIAL_SEGMENTS; r++) {
                const rNext = (r + 1) % RADIAL_SEGMENTS;
                const a = i * RADIAL_SEGMENTS + r;
                const b = i * RADIAL_SEGMENTS + rNext;
                const c = (i + 1) * RADIAL_SEGMENTS + r;
                const d = (i + 1) * RADIAL_SEGMENTS + rNext;
                ribbonIndices.push(a, b, c);
                ribbonIndices.push(b, d, c);
            }
        }

        const hubGeo = new THREE.BufferGeometry();
        hubGeo.setAttribute("position", new THREE.Float32BufferAttribute(ribbonPositions, 3));
        hubGeo.setIndex(ribbonIndices);
        hubGeo.computeVertexNormals();

        // Solid royal blue with a glossy clearcoat finish — MeshPhysicalMaterial
        // extends MeshStandardMaterial with a clearcoat layer (like polished car
        // paint or a glossy plastic badge), giving crisp specular highlights from
        // the scene's lights without needing an environment map for reflections.
        const hubMat = new THREE.MeshPhysicalMaterial({
            color: HUB_COLOR,
            roughness: 0.08,
            metalness: 0.35,
            clearcoat: 1.0,
            clearcoatRoughness: 0.03,
            side: THREE.DoubleSide,
        });
        const hub = new THREE.Mesh(hubGeo, hubMat);
        // Slight tilt so the ribbon shows real depth rather than looking like
        // a flat decal. Static — no rotation animation.
        hub.rotation.x = Math.PI / 14;
        scene.add(hub);

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

            const cardPos = new THREE.Vector3(Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS);

            // Position around the circle, facing outward
            mesh.position.copy(cardPos);
            mesh.lookAt(0, 0, 0);
            mesh.rotateY(Math.PI); // flip so text faces outward, not inward

            group.add(mesh);

            // Hub spoke — a line from the center (where the infinity loop sits)
            // out to this card's position. Lives inside `group` so it rotates
            // in lockstep with the cards and always tracks correctly.
            const spokeGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                cardPos,
            ]);
            const spokeMat = new THREE.LineBasicMaterial({
                color: accent, transparent: true, opacity: 0.25,
            });
            group.add(new THREE.Line(spokeGeo, spokeMat));

            // Small glowing node where the spoke meets the card — reinforces
            // the "connection point" visually, like a network diagram junction
            const nodeGeo = new THREE.SphereGeometry(0.07, 12, 12);
            const nodeMat = new THREE.MeshBasicMaterial({ color: accent });
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.copy(cardPos).multiplyScalar(0.94);
            group.add(node);

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

        // --- Drag-to-rotate (no click handling — this is a pure viewer;
        // actual project links live in a list below the gallery, not on the cards) ---
        let isDragging = false;
        let lastX = 0;
        let rotY = 0, velY = 0;

        const onDown = e => {
            // Ignore drag-start if the click originated on the toggle button —
            // React's stopPropagation() on synthetic events doesn't reliably block
            // this native addEventListener-based handler on the parent, so we
            // check the actual click target directly instead.
            if (e.target.closest("[data-gallery-control]")) return;
            isDragging = true;
            lastX = e.clientX;
            wrap.style.cursor = "grabbing";
            // Any deliberate interaction hands control to the user —
            // auto-rotation stops until they flip it back on via the toggle
            autoRotateRef.current = false;
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

        // Wheel also rotates the gallery
        const onWheel = e => {
            e.preventDefault();
            velY = e.deltaY * 0.0006;
            rotY += velY;
            autoRotateRef.current = false;
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

        let pulseT = 0;
        function animate() {
            animRef.current = requestAnimationFrame(animate);
            pulseT += 0.06;

            // Auto-rotation only applies when autoRotateRef.current is true —
            // toggled off automatically on first drag/scroll, or manually via the button.
            // Drag momentum (velY) still applies regardless, so flicks keep spinning briefly.
            rotY += (autoRotateRef.current ? 0.0015 : 0) + velY;
            velY *= 0.92;
            group.rotation.y = rotY;

            // The hub stays completely static in rotation — no spin — but
            // gently pulsates in scale via a sine wave, giving it a subtle
            // sense of life without distracting from the cards.
            const pulseScale = 1 + Math.sin(pulseT) * 0.04;
            hub.scale.setScalar(pulseScale);

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

            <button
                data-gallery-control="auto-rotate-toggle"
                onClick={toggleAutoRotate}
                onMouseDown={e => e.stopPropagation()}
                style={{
                    position: "absolute", top: "12px", right: "16px",
                    display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "11px", color: "rgba(255,255,255,0.7)",
                    background: "rgba(255,255,255,0.08)",
                    border: "0.5px solid rgba(255,255,255,0.18)",
                    borderRadius: "20px", padding: "5px 12px",
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
                {isAutoRotating ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
                ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
                )}
                {isAutoRotating ? "Pause rotation" : "Auto-rotate"}
            </button>

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