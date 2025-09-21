import { useState, useEffect } from "react";
import { Users, PlusCircle, Pencil } from "lucide-react";

export default function CreateGroupForm({
  onCreate,       // dùng cho cả create và update
  initialData,    // dữ liệu nhóm khi edit
  mode = "create",
  onCancel,       // hủy sửa
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  // Khi initialData thay đổi → đổ vào form
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDesc(initialData.description || "");
    }
  }, [initialData]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    await onCreate(name.trim(), desc.trim());
    if (mode === "create") {
      setName("");
      setDesc("");
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-4 border border-gray-100"
    >
      <h2 className="text-lg font-medium text-gray-700 flex items-center gap-2 mb-3">
        {mode === "edit" ? (
          <>
            <Pencil className="text-blue-500 w-5 h-5" /> Sửa nhóm
          </>
        ) : (
          <>
            <PlusCircle className="text-green-500 w-5 h-5" /> Tạo nhóm mới
          </>
        )}
      </h2>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên nhóm"
            className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <Users className="absolute left-2.5 top-2 text-gray-400 w-4 h-4" />
        </div>

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Mô tả nhóm (tùy chọn)"
          rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-md shadow hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition"
          >
            {loading
              ? mode === "edit"
                ? "⏳ Đang lưu..."
                : "⏳ Đang tạo..."
              : mode === "edit"
              ? "💾 Lưu thay đổi"
              : "➕ Tạo nhóm"}
          </button>

          {mode === "edit" && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-300 transition"
            >
              Hủy
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
