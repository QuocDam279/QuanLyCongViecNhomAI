// components/tasks/GroupTaskList.jsx
import React from "react";

export default function GroupTaskList({ tasks, onUpdateStatus, onDelete }) {
  if (!tasks) return <p>Không có dữ liệu nhiệm vụ</p>;

  return (
    <div className="space-y-4">
      {Object.values(tasks).map(({ user, tasks }) => (
        <div key={user?._id || Math.random()} className="border p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg">{user?.name || "Ẩn danh"}</h3>
          <ul className="mt-2 space-y-2">
            {tasks.map((t) => (
              <li
                key={t._id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <div>
                  <p className="font-medium">{t.task}</p>
                  <p className="text-sm text-gray-500">Trạng thái: {t.status}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={t.status}
                    onChange={(e) => onUpdateStatus(t._id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="pending">Chờ</option>
                    <option value="in_progress">Đang làm</option>
                    <option value="reviewing">Review</option>
                    <option value="done">Xong</option>
                  </select>
                  <button
                    onClick={() => onDelete(t._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
