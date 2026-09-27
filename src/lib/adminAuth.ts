export interface AdminSession {
  id: string;
  name: string;
  email: string;
  roles: string[];
  accessToken: string;
  expiresAt: string;
}

const STORAGE_KEY = "pulsetech_admin_session";

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (!session.accessToken || !session.roles?.includes("ADMIN") || new Date(session.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveAdminSession(session: AdminSession) { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); }
export function clearAdminSession() { localStorage.removeItem(STORAGE_KEY); }

export async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const session = getAdminSession();
  const response = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers,
      ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}) },
  });
  if (response.status === 401 || response.status === 403) {
    clearAdminSession();
    if (typeof window !== "undefined") window.location.href = "/login";
  }
  return response;
}

export async function readApiError(response: Response) {
  const text = await response.text().catch(() => "");
  try {
    const body = text ? JSON.parse(text) : null;
    return body?.detail || body?.message || body?.reason || body?.error || (response.status === 401 ? "Email hoặc mật khẩu không đúng" : `API trả về lỗi ${response.status}`);
  } catch {
    return text || (response.status === 401 ? "Email hoặc mật khẩu không đúng" : `API trả về lỗi ${response.status}`);
  }
}
