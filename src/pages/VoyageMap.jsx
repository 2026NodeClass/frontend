import { Link } from "react-router-dom";
import { GALAXIES, PLANETS, diffStars, withAlpha } from "../data.js";
import PageTopBar, { ExplorerBadge } from "../components/PageTopBar.jsx";
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
const danger = "#b08585";

export default function VoyageMap() {
  const { identity } = useIdentity();
  const { favIds, removeFavorite } = useFavorites();

  const items = favIds.map((id) => PLANETS.find((p) => p.id === id)).filter(Boolean);
  const isEmpty = items.length === 0;

  const galSet = new Set(items.map((p) => p.galaxy));
  const avgDiff = items.length ? items.reduce((s, p) => s + p.difficulty, 0) / items.length : 0;
  const stats = {
    count: items.length,
    galaxies: galSet.size,
    diff: items.length ? avgDiff.toFixed(1) + "★" : "—",
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#07080a", fontFamily: "'Noto Sans TC',sans-serif" }}>
      <PageTopBar
        title="MY VOYAGE MAP · 我的航線地圖"
        right={(
          <>
            <Link to="/explore" style={{ color: inkDim }}>星圖</Link>
            <ExplorerBadge name={identity.name} />
          </>
        )}
      />

      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, filter: "grayscale(0.85) brightness(.85) contrast(1.05)" }}>
          <Starfield nebula="radial-gradient(1000px 640px at 50% -10%,#111214 0%,#0a0b0c 55%,#050506 100%)" />
        </div>

        <div style={{ position: "relative", padding: "48px clamp(24px,5vw,64px) 90px", maxWidth: 960, margin: "0 auto" }}>
          {/* header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: steel, letterSpacing: ".3em", marginBottom: 14, textTransform: "uppercase" }}>VOYAGE LOG · 個人收藏</div>
            <h1 style={{ fontFamily: "'Chakra Petch',sans-serif", fontWeight: 600, color: ink, fontSize: "clamp(30px,4vw,42px)", margin: "0 0 10px", letterSpacing: ".01em" }}>我的航線地圖</h1>
            <p style={{ color: inkDim, fontSize: 14.5, lineHeight: 1.75, margin: 0, maxWidth: 520 }}>你收藏的每一顆行星，依標記順序串成一條專屬航線。</p>

            <div style={{ display: "flex", gap: 1, marginTop: 26, flexWrap: "wrap", background: line }}>
              <div style={{ flex: 1, minWidth: 150, padding: "16px 18px", background: "#08090a" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: inkFaint, letterSpacing: ".14em", textTransform: "uppercase" }}>已收藏航點</div>
                <div style={{ color: ink, fontFamily: "'Chakra Petch',sans-serif", fontSize: 26, marginTop: 6 }}>{stats.count}</div>
              </div>
              <div style={{ flex: 1, minWidth: 150, padding: "16px 18px", background: "#08090a" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: inkFaint, letterSpacing: ".14em", textTransform: "uppercase" }}>橫跨星系</div>
                <div style={{ color: ink, fontFamily: "'Chakra Petch',sans-serif", fontSize: 26, marginTop: 6 }}>{stats.galaxies}</div>
              </div>
              <div style={{ flex: 1, minWidth: 150, padding: "16px 18px", background: "#08090a" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: inkFaint, letterSpacing: ".14em", textTransform: "uppercase" }}>平均難度</div>
                <div style={{ color: steel, fontFamily: "'Chakra Petch',sans-serif", fontSize: 26, marginTop: 6 }}>{stats.diff}</div>
              </div>
            </div>
          </div>

          {isEmpty ? (
            <div style={{ border: `1px dashed ${lineStrong}`, borderRadius: 2, padding: "70px 30px", textAlign: "center" }}>
              <div style={{ fontSize: 42, color: inkFaint, marginBottom: 16 }}>◎</div>
              <div style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontSize: 17, letterSpacing: ".04em" }}>尚未標記任何航點</div>
              <p style={{ color: inkFaint, fontSize: 13, lineHeight: 1.8, margin: "10px 0 26px" }}>前往星圖，找到值得收藏的 skill 或 prompt，在行星詳情頁點選「收藏至航點」。</p>
              <Link to="/explore" style={{ display: "inline-flex", alignItems: "center", height: 46, padding: "0 28px", background: "rgba(255,255,255,.06)", color: ink, fontFamily: "'Space Mono',monospace", fontWeight: 400, fontSize: 12.5, borderRadius: 2, letterSpacing: ".14em", textTransform: "uppercase", border: `1px solid ${lineStrong}` }}>▶ 前往星圖探索</Link>
            </div>
          ) : (
            <div>
              {items.map((p, i) => {
                const g = GALAXIES.find((x) => x.id === p.galaxy) || { color: steel, name: "—", en: "" };
                const isLast = i === items.length - 1;
                return (
                  <div key={p.id} style={{ display: "flex", gap: 20 }}>
                    {/* rail */}
                    <div style={{ flex: "none", width: 44, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 32, height: 32, border: `1px solid ${g.color}`, background: withAlpha(g.color, 0.14), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono',monospace", fontSize: 11, color: ink, flex: "none" }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div style={isLast ? { flex: 1, width: 0 } : { flex: 1, width: 1, minHeight: 20, background: line, marginTop: 4 }} />
                    </div>
                    {/* card */}
                    <div
                      onMouseEnter={() => setGlowColor(withAlpha(g.color, 0.2))}
                      onMouseLeave={resetGlowColor}
                      style={{ flex: 1, border: `1px solid ${line}`, borderRadius: 2, padding: "20px 22px", marginBottom: 22, background: "rgba(255,255,255,.015)" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: inkDim, border: `1px solid ${line}`, borderRadius: 2, padding: "4px 10px", letterSpacing: ".06em", textTransform: "uppercase" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: g.color }} />
                          {g.name}
                        </span>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: inkFaint, border: `1px solid ${line}`, borderRadius: 2, padding: "3px 9px", letterSpacing: ".08em" }}>{p.type.toUpperCase()}</span>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: inkFaint, marginLeft: "auto" }}>{p.coord}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14 }}>
                        <div>
                          <Link to={`/planet/${p.id}`} style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontSize: 18 }}>{p.name}</Link>
                          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: inkDim, marginTop: 3, letterSpacing: ".06em" }}>{p.en}</div>
                        </div>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: g.color, flex: "none" }}>{diffStars(p.difficulty)}</span>
                      </div>
                      <p style={{ color: inkDim, fontSize: 13.5, lineHeight: 1.75, margin: "12px 0 0" }}>{p.summary}</p>
                      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                        <Link to={`/planet/${p.id}`} style={{ height: 36, display: "inline-flex", alignItems: "center", padding: "0 16px", border: `1px solid ${lineStrong}`, color: ink, borderRadius: 2, fontFamily: "'Space Mono',monospace", fontSize: 11.5, letterSpacing: ".08em", textTransform: "uppercase" }}>▶ 登陸行星</Link>
                        <button onClick={() => removeFavorite(p.id)} style={{ height: 36, padding: "0 16px", border: `1px solid ${danger}55`, background: "transparent", color: danger, borderRadius: 2, fontFamily: "'Space Mono',monospace", fontSize: 11.5, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer" }}>✕ 移除航點</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
