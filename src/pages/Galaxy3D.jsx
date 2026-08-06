import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GALAXIES, PLANETS, withAlpha } from "../data.js";
import { setGlowColor, resetGlowColor } from "../components/CursorGlow.jsx";

const ink = "#e7e8ea";
const inkDim = "#8f929a";
const inkFaint = "#54575e";
const line = "rgba(235,236,239,.10)";
const lineStrong = "rgba(235,236,239,.22)";
const steel = "#9cadbd";

const PLANET_COUNTS = PLANETS.reduce((acc, p) => {
  acc[p.galaxy] = (acc[p.galaxy] || 0) + 1;
  return acc;
}, {});

function discTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  const t = new THREE.Texture(c);
  t.needsUpdate = true;
  return t;
}

export default function Galaxy3D() {
  const stageRef = useRef(null);
  const labelsRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const labelBox = labelsRef.current;
    let W = stage.clientWidth, H = stage.clientHeight;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(55, W / H, 0.1, 2000);
    cam.position.set(0, 190, 300);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    stage.appendChild(renderer.domElement);

    const controls = new OrbitControls(cam, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
    controls.minDistance = 90;
    controls.maxDistance = 700;

    const sprite = discTexture();

    // spiral galaxy point cloud — desaturated white → steel → charcoal
    const COUNT = 14000, arms = 4, R = 260;
    const pos = new Float32Array(COUNT * 3), col = new Float32Array(COUNT * 3);
    const cInner = new THREE.Color("#f2f3f5"), cMid = new THREE.Color("#9aa3ad"), cOut = new THREE.Color("#4b4f56");
    for (let i = 0; i < COUNT; i++) {
      const t = Math.pow(Math.random(), 0.6);
      const rad = t * R;
      const arm = (Math.floor(Math.random() * arms) / arms) * Math.PI * 2;
      const spin = rad * 0.022;
      const spread = (1 - t) * 8 + Math.pow(Math.random(), 3) * 26 * (0.3 + t);
      const ang = arm + spin + (Math.random() - 0.5) * 0.5;
      const x = Math.cos(ang) * rad + (Math.random() - 0.5) * spread;
      const z = Math.sin(ang) * rad + (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread * 0.5 * (1 - t * 0.6);
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      const c = cInner.clone().lerp(cMid, Math.min(1, t * 1.6)).lerp(cOut, (Math.max(0, t - 0.4) / 0.6) * 0.7);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 2.4, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, opacity: 0.8 });
    const cloud = new THREE.Points(geo, mat);
    scene.add(cloud);

    // bright core
    const coreGeo = new THREE.BufferGeometry();
    const cN = 1200, cp = new Float32Array(cN * 3);
    for (let i = 0; i < cN; i++) {
      const r = Math.pow(Math.random(), 2) * 34;
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      cp[i * 3] = r * Math.sin(b) * Math.cos(a);
      cp[i * 3 + 1] = r * Math.cos(b) * 0.5;
      cp[i * 3 + 2] = r * Math.sin(b) * Math.sin(a);
    }
    coreGeo.setAttribute("position", new THREE.BufferAttribute(cp, 3));
    scene.add(new THREE.Points(coreGeo, new THREE.PointsMaterial({ size: 4, map: sprite, color: 0xeceeef, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.75 })));

    // distant starfield
    const sfN = 2500, sfp = new Float32Array(sfN * 3);
    for (let i = 0; i < sfN; i++) {
      const r = 700 + Math.random() * 600;
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      sfp[i * 3] = r * Math.sin(b) * Math.cos(a);
      sfp[i * 3 + 1] = r * Math.cos(b);
      sfp[i * 3 + 2] = r * Math.sin(b) * Math.sin(a);
    }
    const sfGeo = new THREE.BufferGeometry();
    sfGeo.setAttribute("position", new THREE.BufferAttribute(sfp, 3));
    scene.add(new THREE.Points(sfGeo, new THREE.PointsMaterial({ size: 1.6, map: sprite, color: 0xc7c9cd, transparent: true, depthWrite: false, opacity: 0.55 })));

    // galaxy category markers
    const markers = [];
    const layout = [{ id: "words", r: 150, ang: 0.6 }, { id: "code", r: 200, ang: 2.7 }, { id: "market", r: 120, ang: 4.6 }];
    layout.forEach((l) => {
      const g = GALAXIES.find((x) => x.id === l.id);
      const x = Math.cos(l.ang) * l.r, z = Math.sin(l.ang) * l.r, y = 8;

      const smat = new THREE.SpriteMaterial({ map: sprite, color: g.color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85 });
      const sp = new THREE.Sprite(smat);
      sp.position.set(x, y, z); sp.scale.set(46, 46, 1); scene.add(sp);

      const smat2 = new THREE.SpriteMaterial({ map: sprite, color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85 });
      const sp2 = new THREE.Sprite(smat2);
      sp2.position.set(x, y, z); sp2.scale.set(16, 16, 1); scene.add(sp2);

      const ring = new THREE.Mesh(new THREE.RingGeometry(30, 31.5, 64), new THREE.MeshBasicMaterial({ color: g.color, side: THREE.DoubleSide, transparent: true, opacity: 0.4 }));
      ring.rotation.x = Math.PI / 2; ring.position.set(x, y, z); scene.add(ring);

      const el = document.createElement("div");
      el.className = "glx-label";
      el.innerHTML =
        `<div style="font-family:'Chakra Petch',sans-serif;color:#e7e8ea;font-size:15px;letter-spacing:.06em;">${g.name}</div>` +
        `<div style="font-family:'Space Mono',monospace;font-size:10px;color:${g.color};letter-spacing:.12em;">${g.en} · ${PLANET_COUNTS[g.id] || 0}</div>`;
      labelBox.appendChild(el);
      markers.push({ pos: new THREE.Vector3(x, y, z), el });
    });

    function onResize() {
      W = stage.clientWidth; H = stage.clientHeight;
      cam.aspect = W / H; cam.updateProjectionMatrix();
      renderer.setSize(W, H);
    }
    window.addEventListener("resize", onResize);

    let stop = false;
    const v = new THREE.Vector3();
    function animate() {
      if (stop) return;
      requestAnimationFrame(animate);
      cloud.rotation.y += 0.0004;
      controls.update();
      const w = stage.clientWidth, h = stage.clientHeight;
      markers.forEach((m) => {
        v.copy(m.pos).project(cam);
        const sx = (v.x * 0.5 + 0.5) * w, sy = (-v.y * 0.5 + 0.5) * h;
        const vis = v.z < 1;
        m.el.style.left = sx + "px"; m.el.style.top = sy + "px"; m.el.style.opacity = vis ? 1 : 0;
      });
      renderer.render(scene, cam);
    }
    animate();

    return () => {
      stop = true;
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      markers.forEach((m) => m.el.remove());
      if (renderer.domElement.parentElement) renderer.domElement.parentElement.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "radial-gradient(1200px 900px at 50% 50%,#0d0e10 0%,#07080a 60%,#050506 100%)", fontFamily: "'Noto Sans TC',sans-serif", overflow: "hidden" }}>
      <div ref={stageRef} style={{ position: "absolute", inset: 0 }} />
      <div ref={labelsRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* corner brackets */}
      <div style={{ position: "absolute", top: 74, left: 24, width: 34, height: 34, borderLeft: `2px solid ${lineStrong}`, borderTop: `2px solid ${lineStrong}`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 74, right: 24, width: 34, height: 34, borderRight: `2px solid ${lineStrong}`, borderTop: `2px solid ${lineStrong}`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 24, left: 24, width: 34, height: 34, borderLeft: `2px solid ${lineStrong}`, borderBottom: `2px solid ${lineStrong}`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 24, right: 24, width: 34, height: 34, borderRight: `2px solid ${lineStrong}`, borderBottom: `2px solid ${lineStrong}`, pointerEvents: "none" }} />

      {/* top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: `1px solid ${line}`, background: "rgba(7,8,10,.6)", backdropFilter: "blur(6px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link to="/" style={{ fontFamily: "'Chakra Petch',sans-serif", color: inkDim, fontSize: 12, letterSpacing: ".14em" }}>◂ 星域</Link>
          <span style={{ width: 1, height: 18, background: line }} />
          <span style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontWeight: 600, letterSpacing: ".14em", fontSize: 14 }}>HOLO-GALAXY · 全息銀河系</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: "'Space Mono',monospace", fontSize: 12, color: inkDim }}>
          <Link to="/explore" style={{ color: steel }}>▦ 星圖圖譜</Link>
          <span>3 GALAXIES · 14 PLANETS</span>
        </div>
      </div>

      {/* title */}
      <div style={{ position: "absolute", top: 84, left: 32, pointerEvents: "none" }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: steel, letterSpacing: ".32em", textTransform: "uppercase" }}>STELLAR ARCHIVE // MILKY WAY VIEW</div>
        <h1 style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontSize: 30, margin: "8px 0 0", fontWeight: 600 }}>全銀河總覽</h1>
      </div>

      {/* instructions */}
      <div style={{ position: "absolute", bottom: 34, left: 32, fontFamily: "'Space Mono',monospace", fontSize: 12, color: inkDim, lineHeight: 1.9, pointerEvents: "none" }}>
        <div><span style={{ color: steel }}>拖曳</span> 旋轉銀河　<span style={{ color: steel }}>滾輪</span> 縮放　<span style={{ color: steel }}>右鍵拖曳</span> 平移</div>
        <div style={{ color: inkFaint }}>AUTO-ROTATE ENABLED · DRAG TO OVERRIDE</div>
      </div>

      {/* legend */}
      <div style={{ position: "absolute", bottom: 34, right: 36, display: "flex", flexDirection: "column", gap: 10, fontFamily: "'Chakra Petch',sans-serif", fontSize: 13 }}>
        {GALAXIES.map((g) => (
          <div
            key={g.id}
            onMouseEnter={() => setGlowColor(withAlpha(g.color, 0.24))}
            onMouseLeave={resetGlowColor}
            style={{ display: "flex", alignItems: "center", gap: 10, color: inkDim, justifyContent: "flex-end" }}
          >
            {g.name} <span style={{ width: 10, height: 10, borderRadius: "50%", background: g.color }} />
          </div>
        ))}
      </div>
    </div>
  );
}
