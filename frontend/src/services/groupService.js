// services/groupService.js
import { API_URL, fetchJSON } from "./fetchJSON";

export const groupService = {
  // Lấy danh sách nhóm của user hiện tại
  getMyGroups: () => fetchJSON(`${API_URL}/group/my-groups`),

  // Lấy danh sách thành viên của nhóm
  getMembers: (groupId) => fetchJSON(`${API_URL}/group/${groupId}/members`),

  // Tạo nhóm mới
  createGroup: (name, description) =>
    fetchJSON(`${API_URL}/group`, {
      method: "POST",
      body: JSON.stringify({ name, description }),
    }),

  // Cập nhật nhóm
  updateGroup: (groupId, { name, description }) =>
    fetchJSON(`${API_URL}/group/${groupId}`, {
      method: "PATCH",
      body: JSON.stringify({ name, description }),
    }),

  // Thêm thành viên vào nhóm
  addMember: (groupId, email, role = "member") =>
    fetchJSON(`${API_URL}/group/${groupId}/add-member`, {
      method: "POST",
      body: JSON.stringify({ email, role }),
    }),

  // Xóa nhóm
  deleteGroup: (groupId) =>
    fetchJSON(`${API_URL}/group/${groupId}`, { method: "DELETE" }),

  // Xóa thành viên
  removeMember: (groupId, userId) =>
    fetchJSON(`${API_URL}/group/${groupId}/members/${userId}`, {
      method: "DELETE",
    }),

  // Chuyển quyền leader
  assignLeader: (groupId, userId) =>
    fetchJSON(`${API_URL}/group/${groupId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ userId, role: "leader" }),
    }),
};
