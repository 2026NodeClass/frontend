import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Starfield from "../components/Starfield.jsx";
import CornerBrackets from "../components/CornerBrackets.jsx";
import OrbViewport from "../components/OrbViewport.jsx";

const API_BASE = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3010/api"
).replace(/\/$/, "");

const ink = "#e7e8ea";
const inkDim = "#8f929a";
const inkFaint = "#54575e";
const line = "rgba(235,236,239,.10)";
const lineStrong = "rgba(235,236,239,.24)";
const steel = "#9cadbd";

const tabBase = {
  flex: 1,
  height: 40,
  border: "none",
  borderRadius: 2,
  cursor: "pointer",
  fontFamily: "'Space Mono',monospace",
  fontSize: 12,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  transition: "all .2s",
};
const activeTab = {
  ...tabBase,
  background: "rgba(255,255,255,.08)",
  color: ink,
};
const idleTab = { ...tabBase, background: "transparent", color: inkFaint };

const inputStyle = {
  width: "100%",
  height: 46,
  background: "rgba(255,255,255,.03)",
  border: `1px solid ${line}`,
  borderRadius: 2,
  color: ink,
  padding: "0 14px",
  fontSize: 14,
  outline: "none",
  fontFamily: "'Noto Sans TC',sans-serif",
};
const labelStyle = {
  display: "block",
  fontFamily: "'Space Mono',monospace",
  fontSize: 11,
  color: inkDim,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  marginBottom: 8,
};

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  async function submit() {
    setErrorMsg("");
    const payload = { name, email, password };

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "發生錯誤");
        return;
      }

      alert("註冊成功！請登入。");
      navigate("/login");
    } catch (err) {
      setErrorMsg("網路錯誤，請稍後再試");
    }
  }

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#07080a", fontFamily: "'Noto Sans TC',sans-serif" }}>
      <div style={{ position: "relative", flex: 1.15, minWidth: 0, overflow: "hidden", borderRight: `1px solid ${line}` }}>
        <div style={{ position: "absolute", inset: 0, filter: "grayscale(0.85) brightness(.85) contrast(1.05)" }}>
          <Starfield nebula="radial-gradient(900px 700px at 40% 40%,#131416 0%,#0a0b0c 55%,#050506 100%)" twinkleOpacity={0.4} />
        </div>
        <CornerBrackets corners={["tl", "bl"]} />
        <OrbViewport top="46%" />
        <div style={{ position: "absolute", left: 48, bottom: 48, fontFamily: "'Space Mono',monospace", fontSize: 12, color: inkDim, lineHeight: 1.8 }}>
          <div style={{ color: steel, letterSpacing: ".24em", textTransform: "uppercase" }}>AUTH GATEWAY // 認證閘門</div>
          <div>登記你的探索家身分以登艦</div>
          <div style={{ color: inkFaint }}>SECTOR 4C · STARDATE 3407.12</div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, background: "radial-gradient(600px 500px at 70% 0%,#0c0d0f,#050506)" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'Chakra Petch',sans-serif", color: inkDim, fontSize: 12, letterSpacing: ".14em", marginBottom: 34 }}>◂ 返回星域</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ width: 8, height: 8, border: `1px solid ${steel}` }} />
            <span style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontWeight: 700, letterSpacing: ".22em", fontSize: 14 }}>STELLAR ARCHIVE</span>
          </div>
          <h1 style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontSize: 26, margin: "14px 0 4px", fontWeight: 600 }}>登記新的探索家</h1>
          <p style={{ color: inkFaint, fontFamily: "'Space Mono',monospace", fontSize: 12, margin: "0 0 26px", letterSpacing: ".08em" }}>REGISTER NEW EXPLORER</p>

          <div style={{ display: "flex", gap: 4, padding: 4, border: `1px solid ${line}`, borderRadius: 2, marginBottom: 24 }}>
            <button onClick={() => navigate("/login")} style={idleTab}>登入</button>
            <button style={activeTab}>註冊</button>
          </div>

          {errorMsg && <div style={{ padding: 12, marginBottom: 16, border: `1px solid ${errorMsg.includes("成功") ? steel : "#b08585"}`, color: errorMsg.includes("成功") ? steel : "#b08585", fontSize: 13, borderRadius: 2 }}>{errorMsg}</div>}

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>探索家代號</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 林航" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>星際通訊 ID (Email)</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="explorer@stellar.io" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>通行密語</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" style={inputStyle} />
          </div>

          <button onClick={submit} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: 50, background: "rgba(255,255,255,.06)", color: ink, fontFamily: "'Space Mono',monospace", fontWeight: 400, fontSize: 13, border: `1px solid ${lineStrong}`, borderRadius: 2, letterSpacing: ".16em", textTransform: "uppercase", cursor: "pointer" }}>建立帳號並登艦 ▸</button>
        </div>
      </div>
    </div>
  );
}
