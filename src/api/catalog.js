const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3010/api';

async function request(path, signal) {
  const response = await fetch(`${API_BASE}${path}`, { signal });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message ?? 'Unable to load catalog data.');
  }

  return payload.data;
}

export async function getCatalog(signal) {
  const [galaxies, planets] = await Promise.all([
    request('/galaxies', signal),
    request('/planets', signal),
  ]);

  return { galaxies, planets };
}

export function getPlanet(id, signal) {
  return request(`/planets/${encodeURIComponent(id)}`, signal);
}
