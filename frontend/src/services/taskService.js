// services/taskService.js
import { API_URL } from "./fetchJSON";

export const taskService = {
  /** 📊 Lấy danh sách nhiệm vụ theo nhóm */
  getGroupTasks: (groupId) =>
    fetch(`${API_URL}/mcp/group/${groupId}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  /** 📝 Tạo nhiệm vụ mới */
  createTask: (data) =>
    fetch(`${API_URL}/mcp/task`, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  /** ✏️ Cập nhật toàn bộ thông tin nhiệm vụ */
  updateTask: (taskId, data) =>
    fetch(`${API_URL}/mcp/task/${taskId}`, {
      method: "PUT",
      headers: getJsonHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  /** 🔄 Cập nhật trạng thái nhiệm vụ */
  updateTaskStatus: (taskId, status) =>
    fetch(`${API_URL}/mcp/task/${taskId}/status`, {
      method: "PATCH",
      headers: getJsonHeaders(),
      body: JSON.stringify({ status }),
    }).then(handleResponse),

  /** 💬 Thêm bình luận vào nhiệm vụ */
  addComment: (taskId, message) =>
    fetch(`${API_URL}/mcp/task/${taskId}/comment`, {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify({ message }),
    }).then(handleResponse),

  /** 📋 Lấy danh sách nhiệm vụ theo user */
  getUserTasks: (userId) =>
    fetch(`${API_URL}/mcp/user/${userId}/tasks`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  /** 🔍 Lấy chi tiết 1 nhiệm vụ */
  getTaskDetail: (taskId) =>
    fetch(`${API_URL}/mcp/task/${taskId}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  /** ❌ Xóa nhiệm vụ */
  deleteTask: (taskId) =>
    fetch(`${API_URL}/mcp/task/${taskId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(handleResponse),

  /** 📅 Lấy các nhiệm vụ sắp đến hạn */
  getUpcomingDeadlines: () =>
    fetch(`${API_URL}/mcp/upcoming-deadlines`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),
};

//
// 🔧 Helpers
//
function getToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders() {
  return {
    Authorization: getToken() ? `Bearer ${getToken()}` : "",
  };
}

function getJsonHeaders() {
  return {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}
