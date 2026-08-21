import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

// --- Canvas texture builder ---
// Draws a full project card — title, goal, bullet list, and stats — onto an offscreen
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

    // Reserve space at the bottom for the key-fact stats row.
    const statsAreaHeight = (project.stats && project.stats.length) ? 44 : 0;
    const bulletAreaBottom = H - 34 - statsAreaHeight;

    // Bullet list — dynamically sized font/line-height so all bullets fit
    // regardless of how many a given project has (3 to 6 bullets across projects)
    const bullets = project.bullets || [];
    const lineHeight = bullets.length > 5 ? 19 : bullets.length > 4 ? 22 : 25;
    const fontSize = bullets.length > 5 ? 14 : bullets.length > 4 ? 16 : 17;
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
        const statsY = H - 34 - statsAreaHeight + 14;

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

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
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
    const navigationRef = useRef(null);
    const activeIndexRef = useRef(0);

    // autoRotateRef is read inside the animation loop every frame — using a ref
    // (rather than state) means toggling it doesn't need to re-run the whole
    // Three.js setup effect. isAutoRotating (state) exists purely so the toggle
    // button's label/icon updates visually; the two are kept in sync below.
    const autoRotateRef = useRef(true);
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);

    const toggleAutoRotate = () => {
        autoRotateRef.current = !autoRotateRef.current;
        setIsAutoRotating(autoRotateRef.current);
    };

    const stopAutoRotate = useCallback(() => {
        autoRotateRef.current = false;
        setIsAutoRotating(false);
    }, []);

    const focusProject = useCallback(direction => {
        const next = (activeIndexRef.current + direction + projects.length) % projects.length;
        navigationRef.current = next;
        setShowDetails(false);
        stopAutoRotate();
    }, [projects.length, stopAutoRotate]);

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
        const cardEntries = [];

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
            cardEntries.push({ mesh, glow, angle });
        });

        // --- Drag-to-rotate (no click handling — this is a pure viewer;
        // actual project links live in a list below the gallery, not on the cards) ---
        let isDragging = false;
        let lastX = 0;
        let pointerStartX = 0;
        let pointerStartY = 0;
        let pointerMoved = false;
        let rotY = 0, velY = 0;
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        const onDown = e => {
            // Ignore drag-start if the click originated on the toggle button —
            // React's stopPropagation() on synthetic events doesn't reliably block
            // this native addEventListener-based handler on the parent, so we
            // check the actual click target directly instead.
            if (e.target.closest("[data-gallery-control]")) return;
            isDragging = true;
            lastX = e.clientX;
            pointerStartX = e.clientX;
            pointerStartY = e.clientY;
            pointerMoved = false;
            wrap.setPointerCapture?.(e.pointerId);
            wrap.style.cursor = "grabbing";
            // Any deliberate interaction hands control to the user —
            // auto-rotation stops until they flip it back on via the toggle
            stopAutoRotate();
        };
        const onUp = e => {
            const wasClick = !pointerMoved && Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY) < 7;
            isDragging = false;
            wrap.style.cursor = "grab";
            const rect = wrap.getBoundingClientRect();
            pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
            raycaster.setFromCamera(pointer, camera);
            const focusedMesh = cardEntries[activeIndexRef.current]?.mesh;
            if (wasClick && e.target === wrap.querySelector("canvas") && focusedMesh && raycaster.intersectObject(focusedMesh).length > 0) {
                stopAutoRotate();
                setShowDetails(true);
            }
        };
        const onMove = e => {
            if (!isDragging) return;
            const dx = e.clientX - lastX;
            if (Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY) >= 7) pointerMoved = true;
            velY = dx * 0.002;
            rotY += velY;
            lastX = e.clientX;
        };

        const onKeyDown = e => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            focusProject(e.key === "ArrowLeft" ? -1 : 1);
        };

        wrap.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointermove", onMove);
        wrap.addEventListener("keydown", onKeyDown);

        // Wheel also rotates the gallery
        const onWheel = e => {
            // Preserve normal vertical page scrolling. Trackpads can rotate with
            // a horizontal gesture, while drag/pointer controls work everywhere.
            if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
            e.preventDefault();
            velY = e.deltaX * 0.0006;
            rotY += velY;
            stopAutoRotate();
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

        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        let pulseT = 0;
        const step = (Math.PI * 2) / projects.length;
        const wrapIndex = value => ((value % projects.length) + projects.length) % projects.length;
        function animate() {
            animRef.current = requestAnimationFrame(animate);
            pulseT += 0.06;

            // Auto-rotation only applies when autoRotateRef.current is true —
            // toggled off automatically on first drag/scroll, or manually via the button.
            // Drag momentum (velY) still applies regardless, so flicks keep spinning briefly.
            rotY += (autoRotateRef.current && !reduceMotion ? 0.0015 : 0) + velY;
            velY *= 0.92;

            if (navigationRef.current !== null) {
                const baseTarget = -navigationRef.current * step;
                const target = baseTarget + Math.round((rotY - baseTarget) / (Math.PI * 2)) * Math.PI * 2;
                rotY += (target - rotY) * (reduceMotion ? 1 : 0.12);
                if (Math.abs(target - rotY) < 0.001) {
                    rotY = target;
                    navigationRef.current = null;
                }
            } else if (!isDragging && !autoRotateRef.current && Math.abs(velY) < 0.0005) {
                const target = Math.round(rotY / step) * step;
                rotY += (target - rotY) * (reduceMotion ? 1 : 0.08);
            }

            group.rotation.y = rotY;

            const focusedIndex = wrapIndex(Math.round(-rotY / step));
            if (focusedIndex !== activeIndexRef.current) {
                activeIndexRef.current = focusedIndex;
                setActiveIndex(focusedIndex);
                setShowDetails(false);
            }

            cardEntries.forEach(({ mesh, glow, angle }, index) => {
                const facing = Math.max(0, Math.cos(angle + rotY));
                const targetScale = index === focusedIndex ? 1.1 : 0.9 + facing * 0.08;
                const nextScale = mesh.scale.x + (targetScale - mesh.scale.x) * 0.12;
                mesh.scale.setScalar(nextScale);
                glow.scale.copy(mesh.scale);
                mesh.material.opacity += ((index === focusedIndex ? 1 : 0.35 + facing * 0.35) - mesh.material.opacity) * 0.12;
                glow.material.opacity += ((index === focusedIndex ? 0.3 : 0.06) - glow.material.opacity) * 0.12;
            });

            // The hub stays completely static in rotation — no spin — but
            // gently pulsates in scale via a sine wave, giving it a subtle
            // sense of life without distracting from the cards.
            const pulseScale = reduceMotion ? 1 : 1 + Math.sin(pulseT) * 0.04;
            hub.scale.setScalar(pulseScale);

            renderer.render(scene, camera);
        }
        animate();

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointermove", onMove);
            wrap.removeEventListener("pointerdown", onDown);
            wrap.removeEventListener("keydown", onKeyDown);
            wrap.removeEventListener("wheel", onWheel);
            scene.traverse(object => {
                object.geometry?.dispose();
                const materials = Array.isArray(object.material) ? object.material : [object.material];
                materials.filter(Boolean).forEach(material => {
                    material.map?.dispose();
                    material.dispose();
                });
            });
            renderer.renderLists?.dispose();
            renderer.dispose();
        };
    }, [focusProject, projects, stopAutoRotate]);

    const activeProject = projects[activeIndex] || projects[0];
    return (
        <>
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
                touchAction: "pan-y",
                marginBottom: "1.5rem",
            }}
            role="region"
            aria-label="Interactive 3D project gallery. Drag horizontally to rotate, or select the focused card to view details."
            tabIndex={0}
        >
            <canvas style={{ display: "block", width: "100%", height: "100%" }} />

            <button
                data-gallery-control="auto-rotate-toggle"
                onClick={toggleAutoRotate}
                onMouseDown={e => e.stopPropagation()}
                aria-pressed={isAutoRotating}
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

            <div className="gallery-navigation gallery-navigation-left" data-gallery-control="navigation">
                <button type="button" onClick={() => focusProject(-1)} aria-label="Previous project">&#8592;</button>
            </div>
            <div className="gallery-navigation gallery-navigation-right" data-gallery-control="navigation">
                <button type="button" onClick={() => focusProject(1)} aria-label="Next project">&#8594;</button>
            </div>

            <div style={{
                position: "absolute", bottom: "12px", right: "16px",
                fontSize: "11px", color: "rgba(255,255,255,0.3)",
                fontFamily: "inherit", pointerEvents: "none",
            }}>
                drag · horizontal scroll · arrow keys
            </div>
        </div>
        {showDetails && activeProject && (
            <section id="focused-project-details" className="focused-project-details">
                <div>
                    <span className="focused-project-kicker">Focused project</span>
                    <h2>{activeProject.title}</h2>
                    <p>{activeProject.goal}</p>
                </div>
                <button type="button" className="focused-project-close" onClick={() => setShowDetails(false)} aria-label="Close project details">&#215;</button>
                <ul>
                    {activeProject.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}
                </ul>
                <div className="focused-project-links">
                    {[activeProject.link, activeProject.secondaryLink, activeProject.githubUrl, activeProject.secondaryGithubUrl].filter(Boolean).map(url => (
                        <a key={url} href={url} target="_blank" rel="noopener noreferrer">{url.includes("github.com") ? "View repository" : "Visit live project"} &#8599;</a>
                    ))}
                </div>
            </section>
        )}
        </>
    );
}
