import { useState } from "react";
import { Link } from "react-router-dom";
import { GALAXIES, PLANETS, withAlpha } from "../data.js";
import { setGlowColor, resetGlowColor } from "../components/CursorGlow.jsx";

const uid = () => "x" + Math.random().toString(36).slice(2, 8);

const ink = "#e7e8ea";
const inkDim = "#8f929a";
const inkFaint = "#54575e";
const line = "rgba(235,236,239,.10)";
const lineStrong = "rgba(235,236,239,.24)";
const steel = "#9cadbd";
const danger = "#b08585";
const defaultGalaxyColor = "#8b96a3";

const lblStyle = { display: "block", fontFamily: "'Space Mono',monospace", fontSize: 11, color: inkDim, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 };
const inputStyle = { width: "100%", height: 44, background: "rgba(255,255,255,.03)", border: `1px solid ${line}`, borderRadius: 2, color: ink, padding: "0 13px", fontSize: 14, outline: "none", fontFamily: "'Noto Sans TC',sans-serif" };
const navBase = { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 13px", borderRadius: 2, cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8, transition: "all .15s", border: "none" };
const navOn = { border: `1px solid ${lineStrong}`, background: "rgba(255,255,255,.05)", color: ink };
const navOff = { border: `1px solid ${line}`, background: "transparent", color: inkDim };
const chipBase = { height: 32, padding: "0 16px", borderRadius: 2, cursor: "pointer", fontSize: 11.5, fontFamily: "'Space Mono',monospace", letterSpacing: ".06em", textTransform: "uppercase", transition: "all .15s", border: "none" };
const typeTabBase = { flex: 1, height: 34, borderRadius: 2, cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: 12, border: "none", letterSpacing: ".06em", textTransform: "uppercase" };

export default function AdminConsole() {
  const [view, setView] = useState("galaxies");
  const [galaxies, setGalaxies] = useState(() => GALAXIES.map((g) => ({ ...g })));
  const [planets, setPlanets] = useState(() => PLANETS.map((p) => ({ ...p })));
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(null); // { kind: 'galaxy'|'planet', isNew, data }

  const isGal = view === "galaxies";
  const countFor = (gid) => planets.filter((p) => p.galaxy === gid).length;
  const galById = (id) => galaxies.find((g) => g.id === id) || { name: "—", color: steel, en: "" };

  function openGalaxyForm(g) {
    setForm({ kind: "galaxy", isNew: !g, data: g ? { ...g } : { id: uid(), name: "", en: "", desc: "", color: defaultGalaxyColor } });
  }
  function openPlanetForm(p) {
    const g0 = galaxies[0];
    setForm({ kind: "planet", isNew: !p, data: p ? { ...p } : { id: uid(), name: "", en: "", galaxy: g0 ? g0.id : "", type: "prompt", coord: "", difficulty: 2, uses: 0, summary: "", body: "" } });
  }
  function set(key, value) {
    setForm((f) => ({ ...f, data: { ...f.data, [key]: value } }));
  }
  function save() {
    const d = form.data;
    if (form.kind === "galaxy") {
      setGalaxies((arr) => {
        const i = arr.findIndex((x) => x.id === d.id);
        const next = [...arr];
        if (i >= 0) next[i] = d; else next.push(d);
        return next;
      });
    } else {
      const d2 = { ...d, difficulty: Number(d.difficulty) };
      setPlanets((arr) => {
        const i = arr.findIndex((x) => x.id === d2.id);
        const next = [...arr];
        if (i >= 0) next[i] = d2; else next.push(d2);
        return next;
      });
    }
    setForm(null);
  }
  function delGalaxy(id) {
    setGalaxies((arr) => arr.filter((g) => g.id !== id));
    setPlanets((arr) => arr.filter((p) => p.galaxy !== id));
  }
  function delPlanet(id) {
    setPlanets((arr) => arr.filter((p) => p.id !== id));
  }

  const chips = [{ id: "all", label: "全部" }].concat(galaxies.map((g) => ({ id: g.id, label: g.name })));
  const planetRows = planets.filter((p) => filter === "all" || p.galaxy === filter);
  const fd = form ? form.data : {};

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", background: "#07080a", fontFamily: "'Noto Sans TC',sans-serif" }}>
      {/* top bar */}
      <div style={{ flex: "none", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: `1px solid ${line}`, background: "rgba(7,8,10,.72)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link to="/" style={{ fontFamily: "'Chakra Petch',sans-serif", color: inkDim, fontSize: 12, letterSpacing: ".14em" }}>◂ 星域</Link>
          <span style={{ width: 1, height: 18, background: line }} />
          <span style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontWeight: 600, letterSpacing: ".14em", fontSize: 14 }}>CREATOR CONSOLE · 造物者控制台</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "'Space Mono',monospace", fontSize: 12, color: inkDim }}>
          <span style={{ border: `1px solid ${lineStrong}`, color: ink, borderRadius: 2, padding: "4px 12px", letterSpacing: ".1em", textTransform: "uppercase" }}>✦ 造物者 CREATOR</span>
          <span style={{ width: 28, height: 28, border: `1px solid ${lineStrong}`, display: "flex", alignItems: "center", justifyContent: "center", color: ink }}>造</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "210px 1fr" }}>
        {/* nav */}
        <div style={{ borderRight: `1px solid ${line}`, padding: "22px 16px", background: "rgba(255,255,255,.015)" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: inkFaint, letterSpacing: ".2em", marginBottom: 14, textTransform: "uppercase" }}>MANAGE // 管理</div>
          <button onClick={() => setView("galaxies")} style={{ ...navBase, ...(isGal ? navOn : navOff) }}><span>◎</span> 星系 <span style={{ marginLeft: "auto", fontFamily: "'Space Mono',monospace", fontSize: 11, opacity: 0.7 }}>{galaxies.length}</span></button>
          <button onClick={() => setView("planets")} style={{ ...navBase, ...(!isGal ? navOn : navOff) }}><span>◉</span> 行星 <span style={{ marginLeft: "auto", fontFamily: "'Space Mono',monospace", fontSize: 11, opacity: 0.7 }}>{planets.length}</span></button>
          <div style={{ marginTop: 26, padding: 14, border: `1px solid ${line}`, borderRadius: 2 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: inkFaint, textTransform: "uppercase", letterSpacing: ".08em" }}>系統狀態</div>
            <div style={{ color: ink, fontFamily: "'Chakra Petch',sans-serif", fontSize: 13, marginTop: 6 }}>ARCHIVE ONLINE</div>
            <div style={{ color: inkFaint, fontFamily: "'Space Mono',monospace", fontSize: 10, marginTop: 4 }}>最後同步 3407.12</div>
          </div>
        </div>

        {/* main */}
        <div style={{ padding: "28px 34px", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontSize: 24, margin: 0, fontWeight: 600 }}>{isGal ? "星系管理" : "行星管理"}</h1>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: inkFaint, marginTop: 4 }}>{isGal ? `GALAXIES · ${galaxies.length} 個類別` : `PLANETS · ${planets.length} 個 skill / prompt`}</div>
            </div>
            <button onClick={() => (isGal ? openGalaxyForm(null) : openPlanetForm(null))} style={{ height: 42, padding: "0 22px", background: "rgba(255,255,255,.06)", color: ink, border: `1px solid ${lineStrong}`, borderRadius: 2, fontFamily: "'Space Mono',monospace", fontWeight: 400, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }}>+ {isGal ? "命名新星系" : "新增行星"}</button>
          </div>

          {isGal ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 1, background: line }}>
              {galaxies.map((g) => (
                <div
                  key={g.id}
                  onMouseEnter={() => setGlowColor(withAlpha(g.color, 0.22))}
                  onMouseLeave={resetGlowColor}
                  style={{ padding: 20, background: "#08090a" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{ width: 28, height: 28, border: `1px solid ${lineStrong}`, background: withAlpha(g.color, 0.28), flex: "none" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontSize: 16 }}>{g.name}</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: inkFaint }}>{g.en}</div>
                    </div>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: inkDim }}>{countFor(g.id)} 行星</span>
                  </div>
                  <p style={{ color: inkDim, fontSize: 13, lineHeight: 1.6, margin: "0 0 16px", minHeight: 38 }}>{g.desc}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => openGalaxyForm(g)} style={{ flex: 1, height: 34, border: `1px solid ${line}`, background: "transparent", color: inkDim, borderRadius: 2, fontFamily: "'Space Mono',monospace", fontSize: 11.5, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer" }}>✎ 編輯</button>
                    <button onClick={() => delGalaxy(g.id)} style={{ height: 34, padding: "0 14px", border: `1px solid ${danger}55`, background: "transparent", color: danger, borderRadius: 2, fontFamily: "'Space Mono',monospace", fontSize: 12, cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {chips.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFilter(c.id)}
                    style={{ ...chipBase, ...(filter === c.id ? { border: `1px solid ${lineStrong}`, background: "rgba(255,255,255,.06)", color: ink } : { border: `1px solid ${line}`, background: "transparent", color: inkDim }) }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div style={{ border: `1px solid ${line}`, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.3fr 0.8fr 0.7fr 0.9fr 110px", padding: "12px 18px", background: "rgba(255,255,255,.03)", fontFamily: "'Space Mono',monospace", fontSize: 10.5, color: inkDim, letterSpacing: ".08em", textTransform: "uppercase" }}>
                  <span>名稱 NAME</span><span>星系 GALAXY</span><span>類型</span><span>座標</span><span>難度</span><span style={{ textAlign: "right" }}>操作</span>
                </div>
                {planetRows.map((p) => {
                  const g = galById(p.galaxy);
                  return (
                    <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.3fr 0.8fr 0.7fr 0.9fr 110px", alignItems: "center", padding: "13px 18px", borderTop: `1px solid ${line}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 14, height: 14, border: `1px solid ${lineStrong}`, background: withAlpha(g.color, 0.3), flex: "none" }} />
                        <div>
                          <div style={{ color: ink, fontSize: 14 }}>{p.name}</div>
                          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: inkFaint }}>{p.en}</div>
                        </div>
                      </div>
                      <span style={{ color: inkDim, fontSize: 13 }}>{g.name}</span>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: inkDim, textTransform: "uppercase" }}>{p.type}</span>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: inkDim }}>{p.coord}</span>
                      <span style={{ color: g.color, fontSize: 12 }}>{"★".repeat(p.difficulty)}</span>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button onClick={() => openPlanetForm(p)} style={{ width: 32, height: 32, border: `1px solid ${line}`, background: "transparent", color: inkDim, borderRadius: 2, cursor: "pointer" }}>✎</button>
                        <button onClick={() => delPlanet(p.id)} style={{ width: 32, height: 32, border: `1px solid ${danger}55`, background: "transparent", color: danger, borderRadius: 2, cursor: "pointer" }}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DRAWER / MODAL */}
      {form && (
        <>
          <div onClick={() => setForm(null)} style={{ position: "fixed", inset: 0, background: "rgba(2,3,4,.7)", backdropFilter: "blur(3px)", zIndex: 40 }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 440, zIndex: 50, background: "#08090a", borderLeft: `1px solid ${lineStrong}`, padding: 30, overflowY: "auto", boxShadow: "-30px 0 60px rgba(0,0,0,.5)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
              <div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: steel, letterSpacing: ".2em", textTransform: "uppercase" }}>{form.kind === "galaxy" ? "GALAXY" : "PLANET"}</div>
                <h2 style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontSize: 20, margin: "6px 0 0" }}>
                  {form.isNew ? (form.kind === "galaxy" ? "命名新星系" : "登錄新行星") : (form.kind === "galaxy" ? "編輯星系" : "編輯行星")}
                </h2>
              </div>
              <button onClick={() => setForm(null)} style={{ width: 34, height: 34, border: `1px solid ${line}`, background: "transparent", color: inkDim, borderRadius: 2, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            {form.kind === "galaxy" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div><label style={lblStyle}>星系名稱</label><input value={fd.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. 設計星系" style={inputStyle} /></div>
                <div><label style={lblStyle}>英文代號</label><input value={fd.en} onChange={(e) => set("en", e.target.value)} placeholder="e.g. DESIGN SYSTEM" style={inputStyle} /></div>
                <div><label style={lblStyle}>星系描述</label><textarea value={fd.desc} onChange={(e) => set("desc", e.target.value)} placeholder="這個類別收藏什麼？" style={{ ...inputStyle, height: 80, paddingTop: 10 }} /></div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div><label style={lblStyle}>行星名稱</label><input value={fd.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. 摘要器" style={inputStyle} /></div>
                <div><label style={lblStyle}>英文代號</label><input value={fd.en} onChange={(e) => set("en", e.target.value)} placeholder="e.g. Digest" style={inputStyle} /></div>
                <div>
                  <label style={lblStyle}>歸屬星系</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {galaxies.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => set("galaxy", g.id)}
                        style={{ height: 34, padding: "0 14px", borderRadius: 2, cursor: "pointer", fontSize: 12, fontFamily: "'Noto Sans TC',sans-serif", ...(fd.galaxy === g.id ? { border: `1px solid ${g.color}`, background: withAlpha(g.color, 0.14), color: ink } : { border: `1px solid ${line}`, background: "transparent", color: inkDim }) }}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={lblStyle}>類型</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => set("type", "skill")} style={{ ...typeTabBase, ...(fd.type === "skill" ? { border: `1px solid ${lineStrong}`, background: "rgba(255,255,255,.06)", color: ink } : { border: `1px solid ${line}`, background: "transparent", color: inkFaint }) }}>skill</button>
                      <button onClick={() => set("type", "prompt")} style={{ ...typeTabBase, ...(fd.type === "prompt" ? { border: `1px solid ${lineStrong}`, background: "rgba(255,255,255,.06)", color: ink } : { border: `1px solid ${line}`, background: "transparent", color: inkFaint }) }}>prompt</button>
                    </div>
                  </div>
                  <div style={{ width: 110 }}><label style={lblStyle}>座標</label><input value={fd.coord} onChange={(e) => set("coord", e.target.value)} placeholder="XX-000" style={inputStyle} /></div>
                </div>
                <div><label style={lblStyle}>難度 ({fd.difficulty}★)</label><input type="range" min="1" max="5" value={fd.difficulty} onChange={(e) => set("difficulty", Number(e.target.value))} style={{ width: "100%", accentColor: steel }} /></div>
                <div><label style={lblStyle}>摘要</label><textarea value={fd.summary} onChange={(e) => set("summary", e.target.value)} placeholder="一句話說明這顆行星" style={{ ...inputStyle, height: 70, paddingTop: 10 }} /></div>
                <div><label style={lblStyle}>內容 (prompt / skill 全文)</label><textarea value={fd.body} onChange={(e) => set("body", e.target.value)} placeholder="輸入完整內容…" style={{ ...inputStyle, height: 110, paddingTop: 10 }} /></div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={save} style={{ flex: 1, height: 46, background: "rgba(255,255,255,.08)", color: ink, border: `1px solid ${lineStrong}`, borderRadius: 2, fontFamily: "'Space Mono',monospace", fontWeight: 400, fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }}>{form.isNew ? "✦ 創造" : "✓ 儲存變更"}</button>
              <button onClick={() => setForm(null)} style={{ height: 46, padding: "0 22px", border: `1px solid ${line}`, background: "transparent", color: inkDim, borderRadius: 2, fontFamily: "'Space Mono',monospace", fontSize: 12.5, textTransform: "uppercase", cursor: "pointer" }}>取消</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
