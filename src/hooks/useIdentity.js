import { useCallback, useState } from "react";

const STORE_KEY = "stellar_identity";
const DEFAULT_IDENTITY = { name: "林航", role: "member" };

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (raw && raw.name) return raw;
  } catch {
    // ignore
  }
  return null;
}

export function useIdentity() {
  const [identity, setIdentityState] = useState(load);

  const setIdentity = useCallback((next) => {
    setIdentityState(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      // ignore write failures
    }
  }, []);

  const clearIdentity = useCallback(() => {
    setIdentityState(null);
    try { localStorage.removeItem(STORE_KEY); } catch {}
  }, []);
  return { identity, setIdentity, clearIdentity };
}
