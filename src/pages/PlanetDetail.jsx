import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GALAXIES, PLANETS, diffStars, withAlpha } from "../data.js";
import PageTopBar from "../components/PageTopBar.jsx";
import CornerBrackets from "../components/CornerBrackets.jsx";
import Starfield from "../components/Starfield.jsx";
import { setGlowColor, resetGlowColor } from "../components/CursorGlow.jsx";
import { useIdentity } from "../hooks/useIdentity.js";
import { useFavorites } from "../hooks/useFavorites.js";

const ink = "#e7e8ea";
const inkDim = "#8f929a";
const inkFaint = "#54575e";
const line = "rgba(235,236,239,.10)";
const lineStrong = "rgba(235,236,239,.24)";
const steel = "#9cadbd";

export default function PlanetDetail() {
  const { id } = useParams();
  const { identity } = useIdentity();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);

  const p = useMemo(() => PLANETS.find((x) => x.id === id) || PLANETS[0], [id]);
  const g = useMemo(() => GALAXIES.find((x) => x.id === p.galaxy), [p]);
  const related = useMemo(
    () => PLANETS.filter((x) => x.galaxy === p.galaxy && x.id !== p.id).slice(0, 3),
    [p],
  );

  const isFav = isFavorite(p.id);
  const col = g.color;

  useEffect(() => {
    setGlowColor(withAlpha(col, 0.18));
    return resetGlowColor;
  }, [col]);

  function copy() {
    try { navigator.clipboard.writeText(p.body); } catch { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const favBtnStyle = isFav
    ? { height: 48, padding: "0 26px", background: "rgba(255,255,255,.06)", color: ink, border: `1px solid ${lineStrong}`, borderRadius: 2, fontFamily: "'Space Mono',monospace", fontWeight: 400, fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }
    : { height: 48, padding: "0 26px", background: "rgba(255,255,255,.06)", color: ink, border: `1px solid ${lineStrong}`, borderRadius: 2, fontFamily: "'Space Mono',monospace", fontWeight: 400, fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#07080a", fontFamily: "'Noto Sans TC',sans-serif" }}>
      <PageTopBar
        backHref="/explore"
        backLabel="◂ 返回星圖"
        title={`${p.coord} · LANDED`}
        titleColor={inkDim}
        right={(
          <>
            <Link to="/voyage" style={{ color: inkDim }}>我的航線</Link>
            <span style={{ color: steel }}>探索家 · {identity.name}</span>
          </>
        )}
      />

      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", minHeight: "calc(100vh - 56px)" }}>
        {/* LEFT viewport */}
        <div style={{ position: "relative", overflow: "hidden", borderRight: `1px solid ${line}` }}>
          <div style={{ position: "absolute", inset: 0, filter: "grayscale(0.85) brightness(.85) contrast(1.05)" }}>
            <Starfield nebula="radial-gradient(700px 600px at 50% 45%,#131416 0%,#0a0b0c 55%,#050506 100%)" twinkleOpacity={0.35} />
          </div>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 420, height: 420, border: `1px solid ${line}`, borderRadius: "50%", animation: "spinSlow 55s linear infinite" }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, border: `1px dashed ${withAlpha(col, 0.3)}`, borderRadius: "50%", animation: "spinRev 80s linear infinite" }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle at 34% 30%, #f5f3fa, ${col} 42%, #2a2d32 72%, #0a0b0d 100%)`, boxShadow: `0 0 70px ${withAlpha(col, 0.16)}, inset -32px -24px 78px rgba(0,0,0,.6)`, animation: "drift 13s ease-in-out infinite" }} />
          <div style={{ position: "absolute", left: 36, bottom: 32, fontFamily: "'Space Mono',monospace", fontSize: 12, color: inkDim, lineHeight: 1.9 }}>
            <div style={{ color: col, letterSpacing: ".2em", textTransform: "uppercase" }}>PLANET SURVEY // 行星勘測</div>
            <div>座標 {p.coord} · 難度 {diffStars(p.difficulty)}</div>
            <div style={{ color: inkFaint }}>屬 {g.name} · {g.en}</div>
          </div>
          <CornerBrackets corners={["tl", "tr"]} size={30} offset={24} />
        </div>

        {/* RIGHT content */}
        <div style={{ padding: "52px clamp(32px,4vw,64px)", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "'Space Mono',monospace", fontSize: 11, color: inkDim, border: `1px solid ${withAlpha(col, 0.4)}`, borderRadius: 2, padding: "5px 12px", letterSpacing: ".06em", textTransform: "uppercase" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: col }} />
              {g.name}
            </span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: inkFaint, border: `1px solid ${line}`, borderRadius: 2, padding: "4px 10px", letterSpacing: ".1em" }}>{p.type.toUpperCase()}</span>
          </div>

          <h1 style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontSize: 38, margin: "0 0 6px", fontWeight: 600 }}>{p.name}</h1>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: col, letterSpacing: ".1em", marginBottom: 24 }}>{p.en}</div>
          <p style={{ color: inkDim, fontSize: 16, lineHeight: 1.85, margin: "0 0 30px", maxWidth: 620 }}>{p.summary}</p>

          <div style={{ display: "flex", gap: 1, marginBottom: 32, background: line }}>
            <div style={{ flex: 1, padding: "14px 16px", background: "#08090a" }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: inkFaint, letterSpacing: ".1em", textTransform: "uppercase" }}>難度 DIFFICULTY</div>
              <div style={{ color: col, fontSize: 17, marginTop: 4 }}>{diffStars(p.difficulty)}</div>
            </div>
            <div style={{ flex: 1, padding: "14px 16px", background: "#08090a" }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: inkFaint, letterSpacing: ".1em", textTransform: "uppercase" }}>航行次數 VOYAGES</div>
              <div style={{ color: ink, fontFamily: "'Chakra Petch',sans-serif", fontSize: 18, marginTop: 4 }}>{p.uses.toLocaleString()}</div>
            </div>
            <div style={{ flex: 1, padding: "14px 16px", background: "#08090a" }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: inkFaint, letterSpacing: ".1em", textTransform: "uppercase" }}>座標 COORD</div>
              <div style={{ color: ink, fontFamily: "'Space Mono',monospace", fontSize: 16, marginTop: 6 }}>{p.coord}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11.5, color: col, letterSpacing: ".2em", textTransform: "uppercase" }}>▤ TRANSMISSION // {p.type.toUpperCase()} 內容</div>
            <button
              onClick={copy}
              style={{ border: `1px solid ${lineStrong}`, background: copied ? "rgba(255,255,255,.06)" : "transparent", color: ink, fontFamily: "'Space Mono',monospace", fontSize: 11.5, letterSpacing: ".08em", textTransform: "uppercase", padding: "7px 16px", borderRadius: 2, cursor: "pointer", transition: "all .2s" }}
            >
              {copied ? "✓ 已複製" : "⧉ 複製"}
            </button>
          </div>
          <div style={{ position: "relative", border: `1px solid ${line}`, borderRadius: 2, background: "rgba(255,255,255,.02)", padding: 22, fontFamily: "'Space Mono',monospace", fontSize: 14, lineHeight: 1.9, color: "#c9cbd0" }}>
            <div style={{ position: "absolute", top: 0, left: 22, right: 22, height: 1, background: `linear-gradient(90deg,transparent,${lineStrong},transparent)` }} />
            {p.body}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
            <button onClick={() => toggleFavorite(p.id)} style={favBtnStyle}>{isFav ? "✓ 已收藏至航點" : "✦ 收藏至航點"}</button>
            <Link to="/explore" style={{ height: 48, display: "inline-flex", alignItems: "center", padding: "0 26px", border: `1px solid ${line}`, color: inkDim, borderRadius: 2, fontFamily: "'Space Mono',monospace", fontSize: 12.5, letterSpacing: ".08em", textTransform: "uppercase" }}>◂ 回星圖</Link>
          </div>

          <div style={{ marginTop: 44, paddingTop: 26, borderTop: `1px solid ${line}` }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: inkFaint, letterSpacing: ".16em", marginBottom: 14, textTransform: "uppercase" }}>同星系鄰近行星 · NEARBY IN {g.en}</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {related.map((r) => (
                <Link key={r.id} to={`/planet/${r.id}`} style={{ flex: 1, minWidth: 180, border: `1px solid ${line}`, borderRadius: 2, padding: "14px 16px", display: "block" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: col }} />
                    <span style={{ color: ink, fontFamily: "'Chakra Petch',sans-serif", fontSize: 14 }}>{r.name}</span>
                  </div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: inkFaint, marginTop: 8 }}>{r.coord} · {r.type.toUpperCase()}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
