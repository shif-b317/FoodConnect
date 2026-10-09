const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const API_BASE = configuredApiUrl
  ? (configuredApiUrl.endsWith('/api/v1') ? configuredApiUrl : `${configuredApiUrl}/api/v1`)
  : 'http://localhost:4000/api/v1';
const TOKEN_KEY = 'food-connect-token';

export const getToken = () => window.localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => window.localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => window.localStorage.removeItem(TOKEN_KEY);

export async function apiRequest(path, { method = 'GET', body, token = getToken() } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new Error('Cannot reach the FOOD CONNECT API. Make sure the backend is running.');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error?.message || 'The request failed.');
    error.code = payload.error?.code;
    error.status = response.status;
    throw error;
  }
  return payload;
}

export function normalizeDonation(donation) {
  if (!donation) return donation;
  return { ...donation, id: donation.id || donation._id };
}

export function normalizeUser(user) {
  if (!user) return user;
  return { ...user, uid: user.uid || user.id || user._id };
}
