const API_URL = import.meta.env.VITE_API_URL;

export async function fetchJSON(url, options = {}) {
  const token = localStorage.getItem("token"); // ✅ lấy token runtime
  const headers = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  // 🛑 Trường hợp 204 (No Content) hoặc 304 (Not Modified) => không có body
  if (res.status === 204 || res.status === 304) {
    return null;
  }

  let data = {};
  try {
    data = await res.json();
  } catch (err) {
    // nếu không phải JSON thì bỏ qua (ví dụ plain text)
  }

  if (!res.ok) {
    const message = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export { API_URL };
