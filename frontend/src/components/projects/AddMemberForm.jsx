import { useState } from "react";

export default function AddMemberForm({ groups, onAdd }) {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedGroup || !email.trim()) return;

    setLoading(true);
    await onAdd(selectedGroup, email.trim());
    setEmail("");
    setSelectedGroup("");
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-4 border border-gray-100"
    >
      <h2 className="text-lg font-medium text-gray-700 mb-3">👥 Thêm thành viên</h2>

      <div className="flex flex-col gap-3">
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">-- Chọn nhóm --</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email thành viên"
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium px-3 py-1.5 rounded-md shadow hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 transition"
        >
          {loading ? "⏳ Đang thêm..." : "👤 Thêm thành viên"}
        </button>
      </div>
    </form>
  );
}
