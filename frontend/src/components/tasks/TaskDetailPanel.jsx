import React from "react";

export default function TaskDetailPanel({ task, onClose, onEdit, onDelete }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* panel trượt từ phải */}
      <div className="relative bg-white w-96 h-full shadow-xl animate-slideIn p-6 overflow-y-auto">
        {/* nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        {/* Tiêu đề nhiệm vụ */}
        <h2 className="text-2xl font-bold mb-4">{task.task}</h2>
        <p className="text-sm text-slate-600 mb-4">{task.description}</p>

        {/* Người tạo */}
        <p className="mb-2">
          <span className="font-semibold">📝 Người tạo:</span>{" "}
          {task.createdBy?.name || "Không xác định"}{" "}
          {task.createdBy?.email && (
            <span className="text-gray-500">({task.createdBy.email})</span>
          )}
        </p>

        {/* Trạng thái */}
        <p className="mb-2">
          <span className="font-semibold">📌 Trạng thái:</span> {task.status}
        </p>

        {/* Deadline */}
        <p className="mb-2">
          <span className="font-semibold">⏰ Deadline:</span>{" "}
          {task.deadline
            ? new Date(task.deadline).toLocaleDateString("vi-VN")
            : "Không có"}
        </p>

        {/* Hoàn thành */}
        {task.completedAt && (
          <p className="mb-2 text-green-600">
            ✅ Hoàn thành:{" "}
            {new Date(task.completedAt).toLocaleDateString("vi-VN")}
          </p>
        )}

        {/* Tags */}
        {task.tags?.length > 0 && (
          <p className="mb-2">
            <span className="font-semibold">🏷 Tags:</span>{" "}
            {task.tags.join(", ")}
          </p>
        )}

        {/* Attachments */}
        {task.attachments?.length > 0 && (
          <div className="mb-2">
            <span className="font-semibold">📎 Tệp đính kèm:</span>
            <ul className="list-disc ml-6">
              {task.attachments.map((file, idx) => (
                <li key={idx}>
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Comment section */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">💬 Bình luận</h3>
          {task.comments?.length > 0 ? (
            <ul className="space-y-2">
              {task.comments.map((c, i) => (
                <li key={i} className="border rounded p-2">
                  <p className="text-sm">{c.message}</p>
                  <p className="text-xs text-slate-500">
                    {c.userId?.name
                      ? `${c.userId.name} (${c.userId.email})`
                      : "Ẩn danh"}{" "}
                    - {new Date(c.createdAt).toLocaleString("vi-VN")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 italic">Chưa có bình luận nào</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onEdit?.(task)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            ✏️ Sửa
          </button>
          <button
            onClick={() => {
              if (window.confirm("Bạn có chắc muốn xóa nhiệm vụ này?")) {
                onDelete?.(task._id);
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            🗑 Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
