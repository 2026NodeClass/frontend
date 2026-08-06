import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Starfield from "../components/Starfield.jsx";
import CornerBrackets from "../components/CornerBrackets.jsx";
import { setGlowColor, resetGlowColor } from "../components/CursorGlow.jsx";
import { GALAXIES, withAlpha } from "../data.js";

gsap.registerPlugin(useGSAP);

const ink = "#e7e8ea";
const inkDim = "#8f929a";
const inkFaint = "#54575e";
const line = "rgba(235,236,239,.10)";
const lineStrong = "rgba(235,236,239,.24)";
const steel = "#9cadbd";

const navLinkStyle = {
  color: inkDim,
  textTransform: "uppercase",
  letterSpacing: ".16em",
  fontSize: 11.5,
  fontFamily: "'Space Mono',monospace",
};

const monoLabel = {
  fontFamily: "'Space Mono',monospace",
  textTransform: "uppercase",
  letterSpacing: ".2em",
};

const galaxyColor = (id) => GALAXIES.find((g) => g.id === id).color;

const archive = [
  {
    galaxy: "words",
    color: galaxyColor("words"),
    index: "01",
    name: "寫作星系",
    designation: "NEBULA OF WORDS",
    desc: "文案、敘事、潤稿類 prompt 的家園。",
    tag: "5 ENTRIES CATALOGUED",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
        <path d="M4 20l3.2-.6L19 7.6a1.5 1.5 0 0 0 0-2.1l-.5-.5a1.5 1.5 0 0 0-2.1 0L4.6 16.8 4 20z" />
        <path d="M14.5 6.5l3 3" />
      </svg>
    ),
  },
  {
    galaxy: "code",
    color: galaxyColor("code"),
    index: "02",
    name: "程式星系",
    designation: "CODE CLUSTER",
    desc: "除錯、重構、架構設計的技能航線。",
    tag: "5 ENTRIES CATALOGUED",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
        <path d="M9 6L3.5 12 9 18" />
        <path d="M15 6l5.5 6-5.5 6" />
      </svg>
    ),
  },
  {
    galaxy: "market",
    color: galaxyColor("market"),
    index: "03",
    name: "行銷星系",
    designation: "MARKET CONSTELLATION",
    desc: "品牌、社群、成長策略的行星群。",
    tag: "4 ENTRIES CATALOGUED",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
        <path d="M4 19V10M11 19V5M18 19v-7" />
        <path d="M3 19h18" />
      </svg>
    ),
  },
];

export default function Home() {
  const pageRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const copyRef = useRef(null);
  const ctaGroupRef = useRef(null);
  const horizonRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from(titleRef.current, { y: 22, opacity: 0, duration: 1.1, ease: "power3.out" })
        .from(subtitleRef.current, { y: 14, opacity: 0, duration: 0.9 }, "-=0.7")
        .from(copyRef.current, { y: 12, opacity: 0, duration: 0.9 }, "-=0.6")
        .from(ctaGroupRef.current, { y: 10, opacity: 0, duration: 0.7 }, "-=0.55")
        .from(
          ".archive-entry",
          { y: 24, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" },
          "-=0.35"
        );

      gsap.to(horizonRef.current, {
        y: -8,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: pageRef }
  );

  return (
    <div
      ref={pageRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#07080a",
        fontFamily: "'Noto Sans TC',sans-serif",
      }}
    >
      <div className="film-grain" />
      <div className="scanlines" />

      <div style={{ position: "absolute", inset: 0, filter: "grayscale(0.85) brightness(.85) contrast(1.05)" }}>
        <Starfield nebula="radial-gradient(1400px 1000px at 50% 130%,#111214 0%,#0a0b0c 48%,#050506 100%)" dotOpacity={0.7} twinkleOpacity={0.3} />
      </div>

      {/* vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 38%, transparent 32%, rgba(0,0,0,.35) 78%, rgba(0,0,0,.72) 100%), linear-gradient(180deg, rgba(0,0,0,.4), rgba(0,0,0,.15) 22%, rgba(0,0,0,.1) 60%, rgba(0,0,0,.82) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* desaturated horizon silhouette */}
      <div
        ref={horizonRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "-58vw",
          width: "130vw",
          height: "130vw",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 14%, #131416 0%, #0c0d0e 42%, #050506 78%)",
          boxShadow: "0 -1px 0 rgba(210,214,220,.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: "130vw",
          height: "22vh",
          transform: "translateX(-50%)",
          background: "linear-gradient(180deg, rgba(255,255,255,.015), rgba(4,5,6,.85))",
        }}
      />

      <CornerBrackets color={line} size={26} offset={18} />

      {/* topbar */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(24px,4vw,64px)",
          borderBottom: `1px solid ${line}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="crt-flicker" style={{ width: 7, height: 7, border: `1px solid ${steel}`, background: "transparent" }} />
          <span style={{ color: ink, fontWeight: 600, letterSpacing: ".26em", fontSize: 14, fontFamily: "'Chakra Petch',sans-serif" }}>
            STELLAR ARCHIVE
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Link to="/explore" className="mono-link" style={navLinkStyle}>星圖</Link>
          <Link to="/galaxy" className="mono-link" style={navLinkStyle}>3D 銀河</Link>
          <Link to="/voyage" className="mono-link" style={navLinkStyle}>我的航線</Link>
          <Link
            to="/login"
            style={{
              border: `1px solid ${lineStrong}`,
              borderRadius: 2,
              padding: "8px 20px",
              color: ink,
              fontFamily: "'Space Mono',monospace",
              fontSize: 11.5,
              letterSpacing: ".16em",
              textTransform: "uppercase",
            }}
          >
            登入艦橋
          </Link>
        </div>
      </div>

      {/* hero */}
      <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "clamp(90px,13vh,160px) 40px 0", maxWidth: 900, margin: "0 auto" }}>
        <h1
          ref={titleRef}
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontWeight: 400,
            color: ink,
            fontSize: "clamp(56px,9vw,124px)",
            lineHeight: 0.96,
            margin: 0,
            letterSpacing: ".045em",
          }}
        >
          STELLAR ARCHIVE
        </h1>
        <div
          ref={subtitleRef}
          style={{
            ...monoLabel,
            fontSize: "clamp(11px,1.2vw,13px)",
            color: inkDim,
            letterSpacing: ".38em",
            marginTop: 14,
          }}
        >
          A STATION FOR CREATIVE COMMAND
        </div>

        <p
          ref={copyRef}
          style={{
            color: inkDim,
            fontSize: "clamp(14px,1.15vw,16px)",
            lineHeight: 2,
            maxWidth: 620,
            margin: "30px auto 0",
            fontWeight: 300,
          }}
        >
          在寂靜的航道深處，典藏每一次技能遠征的紀錄——為偏好氛圍勝於喧嘩的探索者，打造的低語介面。
        </p>

        <div ref={ctaGroupRef} style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
          <Link
            to="/login"
            style={{
              background: "rgba(255,255,255,.06)",
              color: ink,
              fontFamily: "'Space Mono',monospace",
              fontSize: 12.5,
              padding: "16px 36px",
              borderRadius: 2,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              border: `1px solid ${lineStrong}`,
            }}
          >
            進入艙門
          </Link>
          <Link
            to="/explore"
            style={{
              border: `1px solid ${line}`,
              color: inkDim,
              fontFamily: "'Space Mono',monospace",
              fontSize: 12.5,
              padding: "16px 36px",
              borderRadius: 2,
              letterSpacing: ".16em",
              textTransform: "uppercase",
            }}
          >
            檢視星圖
          </Link>
        </div>
      </div>

      {/* archive manifest */}
      <div style={{ position: "relative", zIndex: 5, maxWidth: 1240, margin: "0 auto", padding: "clamp(70px,10vh,120px) clamp(24px,5vw,80px) 90px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 34, borderBottom: `1px solid ${line}`, paddingBottom: 18 }}>
          <span style={{ ...monoLabel, fontSize: 12, color: ink, letterSpacing: ".2em" }}>ARCHIVE MANIFEST</span>
          <span style={{ ...monoLabel, fontSize: 10.5, color: inkFaint }}>03 SYSTEMS CATALOGUED</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 1, background: line }}>
          {archive.map((c) => (
            <Link
              key={c.galaxy}
              to={`/explore?g=${c.galaxy}`}
              className="archive-entry"
              onMouseEnter={() => setGlowColor(withAlpha(c.color, 0.22))}
              onMouseLeave={resetGlowColor}
              style={{
                display: "block",
                background: "#08090a",
                border: `1px solid transparent`,
                padding: 32,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color }} />
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: inkFaint }}>{c.index}</span>
                </span>
                <span style={{ color: c.color, opacity: 0.85 }}>{c.icon}</span>
              </div>
              <div style={{ marginTop: 22 }}>
                <div style={{ color: ink, fontSize: 18, fontWeight: 500 }}>{c.name}</div>
                <div style={{ ...monoLabel, fontSize: 10, color: inkFaint, marginTop: 6 }}>{c.designation}</div>
              </div>
              <p style={{ color: inkDim, fontSize: 13.5, lineHeight: 1.85, margin: "16px 0 0", fontWeight: 300 }}>{c.desc}</p>
              <div style={{ ...monoLabel, fontSize: 10.5, color: inkFaint, marginTop: 22, display: "flex", alignItems: "center", gap: 8 }}>
                {c.tag} <span style={{ color: c.color }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* footer status line */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          borderTop: `1px solid ${line}`,
          padding: "18px clamp(24px,5vw,80px)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span style={{ ...monoLabel, fontSize: 9.5, color: inkFaint }}>SYSTEM STATUS: NOMINAL</span>
        <span style={{ ...monoLabel, fontSize: 9.5, color: inkFaint }}>TRANSMISSION ENCRYPTED · CH.03</span>
      </div>
    </div>
  );
}
