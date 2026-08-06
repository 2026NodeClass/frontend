/** Slowly spinning rings around a drifting glowing planet — the recurring "viewport" visual. */
export default function OrbViewport({
  top = "50%",
  ring1Size = 420,
  ring2Size = 500,
  ring1Color = "rgba(235,236,239,.14)",
  ring2Color = "rgba(235,236,239,.10)",
  planetSize = 280,
  planetBg = "radial-gradient(circle at 34% 30%, #dfe2e6 0%, #6d7580 34%, #2a2d32 62%, #0a0b0d 100%)",
  glow = "rgba(200,206,214,.16)",
}) {
  return (
    <>
      <div
        style={{
          position: "absolute", left: "50%", top, transform: "translate(-50%,-50%)",
          width: ring1Size, height: ring1Size, border: `1px solid ${ring1Color}`, borderRadius: "50%",
          animation: "spinSlow 60s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute", left: "50%", top, transform: "translate(-50%,-50%)",
          width: ring2Size, height: ring2Size, border: `1px dashed ${ring2Color}`, borderRadius: "50%",
          animation: "spinRev 90s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute", left: "50%", top,
          width: planetSize, height: planetSize, borderRadius: "50%", background: planetBg,
          boxShadow: `0 0 90px ${glow}, inset -34px -26px 80px rgba(0,0,0,.6)`,
          animation: "drift 12s ease-in-out infinite",
        }}
      />
    </>
  );
}
