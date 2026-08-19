const API_BASE = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3010/api"
).replace(/\/$/, "");

async function request(path, { method = "GET", token } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(payload.message ?? "收藏功能發生錯誤");
  }

  return payload.data;
}

export function getFavorites(token) {
  return request("/favorites", { token });
}

export function addFavorite(planetId, token) {
  return request(`/favorites/${encodeURIComponent(planetId)}`, { method: "POST", token });
}

export function removeFavorite(planetId, token) {
  return request(`/favorites/${encodeURIComponent(planetId)}`, { method: "DELETE", token });
}
