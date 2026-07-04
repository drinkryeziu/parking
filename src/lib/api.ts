const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = {
  async post(path: string, body: unknown, token?: string) {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `Request failed (HTTP ${res.status})` }));
      throw new Error(err.error || `Request failed (HTTP ${res.status})`);
    }
    return res.json();
  },

  async put(path: string, body: unknown, token?: string) {
    const res = await fetch(`${BASE}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `Request failed (HTTP ${res.status})` }));
      throw new Error(err.error || `Request failed (HTTP ${res.status})`);
    }
    return res.json();
  },

  async get(path: string, token?: string) {
    const res = await fetch(`${BASE}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `Request failed (HTTP ${res.status})` }));
      throw new Error(err.error || `Request failed (HTTP ${res.status})`);
    }
    return res.json();
  },
};
