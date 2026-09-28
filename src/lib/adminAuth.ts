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
    const customMessage = body?.detail || body?.message || body?.reason || body?.error;
    if (customMessage) return customMessage;
  } catch {}

  if (text && !text.startsWith("<!DOCTYPE") && !text.startsWith("<html")) {
    return text;
  }

  switch (response.status) {
    case 400: return "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại.";
    case 401: return "Email hoặc mật khẩu không chính xác hoặc phiên đăng nhập đã hết hạn.";
    case 403: return "Tài khoản của bạn không có quyền thực hiện thao tác này.";
    case 404: return "Không tìm thấy dữ liệu yêu cầu trên hệ thống.";
    case 409: return "Dữ liệu đã tồn tại hoặc xảy ra xung đột hệ thống.";
    case 500: return "Máy chủ gặp sự cố nội bộ. Vui lòng thử lại sau.";
    case 502: case 503: case 504: return "Không thể kết nối tới máy chủ API. Vui lòng kiểm tra lại hệ thống.";
    default: return `Đã xảy ra lỗi hệ thống (${response.status}). Vui lòng thử lại.`;
  }
}
