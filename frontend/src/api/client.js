const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const API_KEY = import.meta.env.VITE_API_KEY || "";

function authHeaders() {
  const token = localStorage.getItem("spool_token");
  const headers = { "X-API-Key": API_KEY, "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  if (res.status === 401 && !path.startsWith("/auth/login")) {
    localStorage.removeItem("spool_token");
    localStorage.removeItem("spool_member");
    if (location.pathname !== "/login") location.href = "/login";
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  login: (username, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  me: () => request("/auth/me"),
  config: () => request("/config"),

  members: () => request("/members"),
  creditMember: (member_id, grams, note) =>
    request("/members/credit", { method: "POST", body: JSON.stringify({ member_id, grams, note }) }),
  markPaid: (debtor_id, creditor_id) =>
    request("/members/mark-paid", { method: "POST", body: JSON.stringify({ debtor_id, creditor_id }) }),

  filaments: () => request("/filaments"),
  createFilament: (data) => request("/filaments", { method: "POST", body: JSON.stringify(data) }),

  logPrint: (member_id, filament_id, grams) =>
    request("/transactions/print", {
      method: "POST",
      body: JSON.stringify({ member_id, filament_id, grams }),
    }),
  ledger: () => request("/transactions/ledger"),

  dashboard: () => request("/dashboard"),
  tracking: (days = 7) => request(`/tracking?days=${days}`),
};
