import { useEffect, useRef } from "react";

const DEFAULT_GLOW = "rgba(156,173,189,.16)";
let api = null;

/** Tint the ambient cursor light toward a category color (e.g. on card hover). */
export function setGlowColor(color) {
  api?.setColor(color || DEFAULT_GLOW);
}
/** Return the ambient light to its default cold steel tone. */
export function resetGlowColor() {
  api?.setColor(DEFAULT_GLOW);
}

/** A soft colored light that follows the cursor, like a torch beam in the dark — mounted once at the app root. */
export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    api = { setColor: (c) => el.style.setProperty("--glow-color", c) };

    function onMove(e) {
      el.style.setProperty("--glow-x", e.clientX + "px");
      el.style.setProperty("--glow-y", e.clientY + "px");
      el.style.opacity = "1";
    }
    function onLeave() {
      el.style.opacity = "0";
    }

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      api = null;
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" />;
}
