import React, { useRef, useState } from "react";
import { Users } from "lucide-react";
import jwt_decode from "jwt-decode";
import CreateGroupForm from "../components/projects/CreateGroupForm";
import AddMemberForm from "../components/projects/AddMemberForm";
import GroupList from "../components/projects/GroupList";
import { useGroups } from "../hooks/useGroup";
import { groupService } from "../services/groupService";

export default function Group() {
  const { groups, loading, err, success, setErr, setSuccess, fetchGroups } =
    useGroups();

  // Ref guard để thông báo chỉ hiện 1 lần
  const successRef = useRef("");
  const errRef = useRef("");

  const [editingGroup, setEditingGroup] = useState(null); // 👈 nhóm đang sửa

  const safeSetSuccess = (msg) => {
    if (successRef.current !== msg) {
      successRef.current = msg;
      setSuccess(msg);
    }
  };

  const safeSetErr = (msg) => {
    if (errRef.current !== msg) {
      errRef.current = msg;
      setErr(msg);
    }
  };

  // decode token
  const token = localStorage.getItem("token");
  let currentUserId = "";
  try {
    currentUserId = jwt_decode(token).userId;
  } catch {}

  // === Handlers ===
  const handleCreate = async (name, description) => {
    try {
      await groupService.createGroup(name, description);
      safeSetSuccess("🎉 Nhóm đã được tạo!");
      fetchGroups();
    } catch (e) {
      safeSetErr(e.message);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await groupService.updateGroup(id, data); // ✅ đã thêm trong service
      safeSetSuccess("✏️ Nhóm đã được cập nhật!");
      fetchGroups();
      setEditingGroup(null); // đóng form
    } catch (e) {
      safeSetErr(e.message);
    }
  };

  const handleAdd = async (groupId, email, role) => {
    try {
      await groupService.addMember(groupId, email, role);
      safeSetSuccess("✅ Đã thêm thành viên!");
      fetchGroups();
    } catch (e) {
      safeSetErr(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhóm này?")) return;
    try {
      await groupService.deleteGroup(id);
      safeSetSuccess("🗑️ Nhóm đã được xóa.");
      fetchGroups();
    } catch (e) {
      safeSetErr(e.message);
    }
  };

  const handleRemoveMember = async (groupId, userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa thành viên này?")) return;
    try {
      await groupService.removeMember(groupId, userId);
      safeSetSuccess("🗑️ Thành viên đã bị xóa.");
      fetchGroups();
    } catch (e) {
      safeSetErr(e.message);
    }
  };

  const handleAssignLeader = async (groupId, newLeaderId) => {
    try {
      await groupService.assignLeader(groupId, newLeaderId);
      safeSetSuccess("👑 Đã chuyển quyền leader!");
      fetchGroups();
    } catch (e) {
      safeSetErr(e.message);
    }
  };

  // === Render ===
  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1 flex justify-center items-center gap-2">
          <Users className="w-7 h-7 text-blue-600" />
          Quản lý Nhóm
        </h1>
        <p className="text-sm text-gray-500">
          Tạo, quản lý và tổ chức nhóm làm việc dễ dàng
        </p>
      </div>

      {/* Form tạo / sửa nhóm và thêm thành viên */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
        {editingGroup ? (
          <CreateGroupForm
            key={editingGroup._id} // reset form khi đổi nhóm
            mode="edit"
            initialData={editingGroup}
            onCreate={(name, description) =>
              handleUpdate(editingGroup._id, { name, description })
            }
            onCancel={() => setEditingGroup(null)}
          />
        ) : (
          <CreateGroupForm onCreate={handleCreate} />
        )}
        <AddMemberForm groups={groups} onAdd={handleAdd} />
      </div>

      {/* Thông báo lỗi / thành công */}
      {err && (
        <div className="max-w-xl mx-auto bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center">
          {err}
        </div>
      )}
      {success && (
        <div className="max-w-xl mx-auto bg-green-100 text-green-700 p-3 rounded-lg mb-6 text-center">
          {success}
        </div>
      )}

      {/* Danh sách nhóm */}
      {loading ? (
        <p className="text-gray-500 text-center">⏳ Đang tải nhóm...</p>
      ) : (
        <GroupList
          groups={groups}
          currentUserId={currentUserId}
          onDelete={handleDelete}
          onRemoveMember={handleRemoveMember}
          onAssignLeader={handleAssignLeader}
          onEdit={(group) => setEditingGroup(group)} // 👈 mở form sửa
        />
      )}
    </div>
  );
}
