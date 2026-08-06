const DOTS =
  "radial-gradient(1.5px 1.5px at 14% 20%,#fff,transparent)," +
  "radial-gradient(1px 1px at 30% 60%,#c7c9cd,transparent)," +
  "radial-gradient(1.5px 1.5px at 60% 16%,#fff,transparent)," +
  "radial-gradient(1px 1px at 82% 44%,#a7a9ad,transparent)," +
  "radial-gradient(1px 1px at 44% 78%,#fff,transparent)," +
  "radial-gradient(1.5px 1.5px at 72% 86%,#cdced1,transparent)," +
  "radial-gradient(1px 1px at 92% 20%,#fff,transparent)," +
  "radial-gradient(1px 1px at 20% 88%,#fff,transparent)," +
  "radial-gradient(1.5px 1.5px at 90% 70%,#fff,transparent)";

const TWINKLE_DOTS =
  "radial-gradient(1px 1px at 36% 32%,#fff,transparent)," +
  "radial-gradient(1px 1px at 56% 68%,#fff,transparent)," +
  "radial-gradient(1px 1px at 80% 30%,#fff,transparent)";

/** Layered nebula + starfield backdrop shared by every deep-space page. */
export default function Starfield({ nebula, twinkleOpacity = 0.55, dotOpacity = 1 }) {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: nebula }} />
      <div style={{ position: "absolute", inset: 0, opacity: dotOpacity, backgroundImage: DOTS }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: twinkleOpacity,
          animation: "twinkle 4.5s ease-in-out infinite",
          backgroundImage: TWINKLE_DOTS,
        }}
      />
    </>
  );
}
