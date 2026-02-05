const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  try {
    const stored = localStorage.getItem('healthtrack-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      const t = parsed?.state?.token;
      if (t) return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` };
    }
  } catch {}
  return { 'Content-Type': 'application/json' };
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; message?: string }> {
  const headers = { ...getAuthHeaders(), ...options.headers };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
