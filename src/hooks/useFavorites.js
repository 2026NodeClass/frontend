import { useCallback, useEffect, useState } from "react";

const STORE_KEY = "stellar_favorites";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favIds, setFavIds] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(favIds));
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [favIds]);

  const isFavorite = useCallback((id) => favIds.includes(id), [favIds]);

  const toggleFavorite = useCallback((id) => {
    setFavIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavIds((cur) => cur.filter((x) => x !== id));
  }, []);

  return { favIds, isFavorite, toggleFavorite, removeFavorite };
}
