import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Starfield from "../components/Starfield.jsx";
import CornerBrackets from "../components/CornerBrackets.jsx";
import OrbViewport from "../components/OrbViewport.jsx";
import { useIdentity } from "../hooks/useIdentity.js";

const ink = "#e7e8ea";
const inkDim = "#8f929a";
const inkFaint = "#54575e";
const line = "rgba(235,236,239,.10)";
const lineStrong = "rgba(235,236,239,.24)";
const steel = "#9cadbd";

const tabBase = { flex: 1, height: 40, border: "none", borderRadius: 2, cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", transition: "all .2s" };
const activeTab = { ...tabBase, background: "rgba(255,255,255,.08)", color: ink };
const idleTab = { ...tabBase, background: "transparent", color: inkFaint };

const roleBase = { flex: 1, padding: "14px 14px", borderRadius: 2, cursor: "pointer", textAlign: "left", transition: "all .2s", background: "transparent" };
const roleActive = { ...roleBase, border: `1px solid ${lineStrong}`, background: "rgba(255,255,255,.04)", color: ink };
const roleIdle = { ...roleBase, border: `1px solid ${line}`, color: inkFaint };

const inputStyle = { width: "100%", height: 46, background: "rgba(255,255,255,.03)", border: `1px solid ${line}`, borderRadius: 2, color: ink, padding: "0 14px", fontSize: 14, outline: "none", fontFamily: "'Noto Sans TC',sans-serif" };
const labelStyle = { display: "block", fontFamily: "'Space Mono',monospace", fontSize: 11, color: inkDim, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 };

export default function Login() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("member");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { setIdentity } = useIdentity();

  const isRegister = mode === "register";
  const isCreator = role === "creator";

  function submit() {
    setIdentity({ name: (isRegister && name.trim()) || "林航", role });
    navigate(isCreator ? "/admin" : "/explore");
  }

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", background: "#07080a", fontFamily: "'Noto Sans TC',sans-serif" }}>
      {/* LEFT viewport */}
      <div style={{ position: "relative", flex: 1.15, minWidth: 0, overflow: "hidden", borderRight: `1px solid ${line}` }}>
        <div style={{ position: "absolute", inset: 0, filter: "grayscale(0.85) brightness(.85) contrast(1.05)" }}>
          <Starfield nebula="radial-gradient(900px 700px at 40% 40%,#131416 0%,#0a0b0c 55%,#050506 100%)" twinkleOpacity={0.4} />
        </div>
        <CornerBrackets corners={["tl", "bl"]} />
        <OrbViewport top="46%" />
        <div style={{ position: "absolute", left: 48, bottom: 48, fontFamily: "'Space Mono',monospace", fontSize: 12, color: inkDim, lineHeight: 1.8 }}>
          <div style={{ color: steel, letterSpacing: ".24em", textTransform: "uppercase" }}>AUTH GATEWAY // 認證閘門</div>
          <div>驗證你的探索家身分以登艦</div>
          <div style={{ color: inkFaint }}>SECTOR 4C · STARDATE 3407.12</div>
        </div>
      </div>

      {/* RIGHT form */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, background: "radial-gradient(600px 500px at 70% 0%,#0c0d0f,#050506)" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "'Chakra Petch',sans-serif", color: inkDim, fontSize: 12, letterSpacing: ".14em", marginBottom: 34 }}>◂ 返回星域</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ width: 8, height: 8, border: `1px solid ${steel}` }} />
            <span style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontWeight: 700, letterSpacing: ".22em", fontSize: 14 }}>STELLAR ARCHIVE</span>
          </div>
          <h1 style={{ fontFamily: "'Chakra Petch',sans-serif", color: ink, fontSize: 26, margin: "14px 0 4px", fontWeight: 600 }}>{isRegister ? "登記新的探索家" : "歡迎回到艦橋"}</h1>
          <p style={{ color: inkFaint, fontFamily: "'Space Mono',monospace", fontSize: 12, margin: "0 0 26px", letterSpacing: ".08em" }}>{isRegister ? "REGISTER NEW EXPLORER" : "AUTHENTICATE TO BOARD"}</p>

          <div style={{ display: "flex", gap: 4, padding: 4, border: `1px solid ${line}`, borderRadius: 2, marginBottom: 24 }}>
            <button onClick={() => setMode("login")} style={isRegister ? idleTab : activeTab}>登入</button>
            <button onClick={() => setMode("register")} style={isRegister ? activeTab : idleTab}>註冊</button>
          </div>

          {isRegister && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>探索家代號</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 林航" style={inputStyle} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>星際通訊 ID (Email)</label>
            <input placeholder="explorer@stellar.io" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>通行密語</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ ...labelStyle, marginBottom: 10 }}>登艦身分</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setRole("member")} style={isCreator ? roleIdle : roleActive}>
                <span style={{ fontFamily: "'Chakra Petch',sans-serif", fontSize: 14 }}>探索家</span>
                <span style={{ display: "block", fontFamily: "'Space Mono',monospace", fontSize: 10, opacity: 0.7, marginTop: 3, letterSpacing: ".06em" }}>MEMBER · 瀏覽收藏</span>
              </button>
              <button onClick={() => setRole("creator")} style={isCreator ? roleActive : roleIdle}>
                <span style={{ fontFamily: "'Chakra Petch',sans-serif", fontSize: 14 }}>造物者</span>
                <span style={{ display: "block", fontFamily: "'Space Mono',monospace", fontSize: 10, opacity: 0.7, marginTop: 3, letterSpacing: ".06em" }}>CREATOR · 管理星系</span>
              </button>
            </div>
          </div>

          <button
            onClick={submit}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: 50, background: "rgba(255,255,255,.06)", color: ink, fontFamily: "'Space Mono',monospace", fontWeight: 400, fontSize: 13, border: `1px solid ${lineStrong}`, borderRadius: 2, letterSpacing: ".16em", textTransform: "uppercase", cursor: "pointer" }}
          >
            {isRegister ? "建立帳號並登艦" : "登入艦橋"} ▸
          </button>
          <p style={{ textAlign: "center", color: inkFaint, fontSize: 11.5, marginTop: 18, fontFamily: "'Space Mono',monospace", letterSpacing: ".04em" }}>
            {isCreator ? "造物者將進入控制台 · CREATOR CONSOLE" : "探索家將進入星圖 · STAR CHART"}
          </p>
        </div>
      </div>
    </div>
  );
}
