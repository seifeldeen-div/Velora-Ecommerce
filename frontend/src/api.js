// Small fetch wrapper: adds the JWT token and turns API errors into exceptions.
export async function api(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const money = (n) => `$${Number(n || 0).toFixed(2)}`;

// Must match the backend rule: free shipping from $100
export const shippingFor = (subtotal) => (subtotal === 0 || subtotal >= 100 ? 0 : 10);

export const CATEGORY_EMOJI = { Electronics: "💻", Fashion: "👗", Home: "🏠", Books: "📚", Sports: "⚽" };
