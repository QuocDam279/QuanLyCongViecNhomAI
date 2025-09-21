import React, { useState, useEffect } from "react";
import { taskService } from "../../services/taskService";
import { groupService } from "../../services/groupService";

export default function CreateTaskForm({
  groups = [],
  onCreated,
  onUpdated,
  initialData,
}) {
  const [form, setForm] = useState({
    groupId: "",
    userId: "",
    task: "",
    description: "",
    deadline: "",
    status: "pending",
    tags: [],
  });

  const [members, setMembers] = useState([]);
  const [tagsInput, setTagsInput] = useState("");

  // 🔄 Khi có initialData (chỉnh sửa) → fill vào form
  useEffect(() => {
    if (initialData) {
      setForm({
        groupId: initialData.groupId?._id || initialData.groupId || "",
        userId: initialData.userId?._id || initialData.userId || "",
        task: initialData.task || "",
        description: initialData.description || "",
        deadline: initialData.deadline
          ? new Date(initialData.deadline).toISOString().slice(0, 10)
          : "",
        status: initialData.status || "pending",
        tags: initialData.tags || [],
      });
      setTagsInput((initialData.tags || []).join(", "));
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔄 Load danh sách thành viên khi chọn group
  useEffect(() => {
    async function fetchMembers() {
      if (!form.groupId) {
        setMembers([]);
        return;
      }
      try {
        const data = await groupService.getMembers(form.groupId);
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Không load được thành viên:", err.message);
        setMembers([]);
      }
    }

    fetchMembers();
  }, [form.groupId]);

  const handleTagsChange = (e) => {
    setTagsInput(e.target.value);
    setForm({
      ...form,
      tags: e.target.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.deadline) {
      alert("⛔ Vui lòng chọn deadline cho nhiệm vụ!");
      return;
    }

    try {
      if (initialData?._id) {
        // 🔧 Chỉnh sửa
        await taskService.updateTask(initialData._id, form);
        alert("✅ Cập nhật nhiệm vụ thành công!");
        onUpdated?.();
      } else {
        // 🆕 Tạo mới
        await taskService.createTask(form);
        alert("🎉 Tạo nhiệm vụ thành công!");
        onCreated?.();
      }

      // Reset form sau khi xử lý xong (chỉ reset khi tạo mới)
      if (!initialData?._id) {
        setForm({
          groupId: "",
          userId: "",
          task: "",
          description: "",
          deadline: "",
          status: "pending",
          tags: [],
        });
        setTagsInput("");
        setMembers([]);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 border p-4 rounded bg-slate-50 mb-6"
    >
      {/* Chọn nhóm */}
      <select
        name="groupId"
        value={form.groupId}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="">-- Chọn nhóm --</option>
        {groups.map((g) => (
          <option key={g._id} value={g._id}>
            {g.name}
          </option>
        ))}
      </select>

      {/* Chọn thành viên */}
      <select
        name="userId"
        value={form.userId}
        onChange={handleChange}
        className="border p-2 w-full"
        required
        disabled={!form.groupId}
      >
        <option value="">
          {form.groupId ? "-- Chọn thành viên --" : "Chọn nhóm trước"}
        </option>
        {members.map((m) => (
          <option key={m._id} value={m.user?._id || m.userId || m.user}>
            {m.user?.name || m.user?.email || "Ẩn danh"}
          </option>
        ))}
      </select>

      {/* Tên nhiệm vụ */}
      <input
        name="task"
        placeholder="Tên nhiệm vụ"
        value={form.task}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      {/* Mô tả */}
      <textarea
        name="description"
        placeholder="Mô tả"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      {/* Deadline */}
      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      {/* Trạng thái */}
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      >
        <option value="pending">Chờ thực hiện</option>
        <option value="in_progress">Đang thực hiện</option>
        <option value="reviewing">Đang xem xét</option>
        <option value="done">Hoàn thành</option>
      </select>

      {/* Tags */}
      <input
        name="tags"
        placeholder="Nhập tags, cách nhau bằng dấu phẩy"
        value={tagsInput}
        onChange={handleTagsChange}
        className="border p-2 w-full"
      />

      {/* Submit */}
      <button
        type="submit"
        className={`px-4 py-2 rounded text-white ${
          initialData?._id
            ? "bg-yellow-600 hover:bg-yellow-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {initialData?._id ? "Cập nhật nhiệm vụ" : "Tạo nhiệm vụ"}
      </button>
    </form>
  );
}
