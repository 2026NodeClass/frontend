import { Link } from "react-router-dom";

/** The 56px HUD top bar shared by every internal page (back link + center label + right slot). */
export default function PageTopBar({
  backHref = "/",
  backLabel = "◂ 星域",
  title,
  borderColor = "rgba(235,236,239,.10)",
  background = "rgba(7,8,10,.72)",
  titleColor = "#e7e8ea",
  dividerColor = "rgba(235,236,239,.16)",
  right,
  overlay = false,
}) {
  return (
    <div
      style={{
        flex: "none", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", borderBottom: `1px solid ${borderColor}`, background,
        ...(overlay
          ? { position: "absolute", top: 0, left: 0, right: 0, zIndex: 5, backdropFilter: "blur(6px)" }
          : {}),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link to={backHref} style={{ fontFamily: "'Chakra Petch',sans-serif", color: "#8f929a", fontSize: 12, letterSpacing: ".14em" }}>
          {backLabel}
        </Link>
        <span style={{ width: 1, height: 18, background: dividerColor }} />
        <span style={{ fontFamily: "'Chakra Petch',sans-serif", color: titleColor, fontWeight: 600, letterSpacing: ".14em", fontSize: 14 }}>
          {title}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#8f929a" }}>
        {right}
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useIdentity } from "../hooks/useIdentity.js";

export function ExplorerBadge() {
  const { identity, clearIdentity } = useIdentity();
  const navigate = useNavigate();

  if (!identity || !identity.token) {
    return <Link to="/login" style={{ color: "#9cadbd", border: "1px solid rgba(235,236,239,.24)", padding: "4px 12px", borderRadius: 2, textDecoration: "none", fontSize: 12 }}>登入 / 註冊</Link>;
  }

  const name = identity.name || "Explorer";

  return (
    <>
      <span style={{ color: "#9cadbd" }}>探索家 · {name}</span>
      <span
        style={{
          width: 28, height: 28, borderRadius: "2px", border: "1px solid rgba(235,236,239,.24)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#9cadbd",
          fontFamily: "'Noto Sans TC',sans-serif",
        }}
      >
        {name.slice(0, 1)}
      </span>
      <button 
        onClick={() => { clearIdentity(); navigate("/login"); }}
        style={{ background: "transparent", border: "1px solid rgba(235,236,239,.24)", color: "#8f929a", padding: "4px 10px", borderRadius: "2px", cursor: "pointer", fontFamily: "'Noto Sans TC',sans-serif", fontSize: 12, marginLeft: "8px" }}
      >
        登出
      </button>
    </>
  );
}

