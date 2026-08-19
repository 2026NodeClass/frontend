import { useCallback, useEffect, useState } from "react";
import { getFavorites, addFavorite, removeFavorite as removeFavoriteApi } from "../api/favorites.js";

export function useFavorites(token) {
  const [favorites, setFavorites] = useState([]);

  const refresh = useCallback(() => {
    if (!token) {
      setFavorites([]);
      return;
    }
    getFavorites(token)
      .then(setFavorites)
      .catch(() => setFavorites([]));
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const favIds = favorites.map((f) => f.id);
  const isFavorite = useCallback((id) => favIds.includes(id), [favIds]);

  const toggleFavorite = useCallback(async (id) => {
    if (!token) return;
    try {
      if (favIds.includes(id)) {
        await removeFavoriteApi(id, token);
      } else {
        await addFavorite(id, token);
      }
    } catch {
      // ignore — e.g. already (un)favorited on the server
    }
    refresh();
  }, [token, favIds, refresh]);

  const removeFavorite = useCallback(async (id) => {
    if (!token) return;
    try {
      await removeFavoriteApi(id, token);
    } catch {
      // ignore
    }
    setFavorites((cur) => cur.filter((f) => f.id !== id));
  }, [token]);

  return { favorites, favIds, isFavorite, toggleFavorite, removeFavorite };
}
