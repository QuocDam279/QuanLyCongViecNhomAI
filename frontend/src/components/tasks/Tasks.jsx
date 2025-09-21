import React, { useState } from "react";
import { useGroupTasks } from "../../hooks/useGroupTasks";
import CreateTaskForm from "./CreateTaskForm";
import { taskService } from "../../services/taskService";
import TaskDetailPanel from "./TaskDetailPanel";

export default function Tasks() {
  const { groups, loading, err } = useGroupTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  if (loading) return <p>⏳ Đang tải nhóm và nhiệm vụ...</p>;
  if (err) return <p className="text-red-600">❌ {err}</p>;

  const handleTaskCreated = () => window.location.reload();

  const handleOpenDetail = async (taskId) => {
    try {
      const detail = await taskService.getTaskDetail(taskId);
      setSelectedTask(detail);
    } catch (err) {
      alert("Không lấy được chi tiết task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      alert("✅ Đã xóa nhiệm vụ");
      window.location.reload();
    } catch (err) {
      alert("❌ Không thể xóa: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form tạo hoặc sửa task */}
      <CreateTaskForm
        groups={groups}
        onCreated={handleTaskCreated}
        initialData={editingTask}
        onUpdated={() => {
          setEditingTask(null);
          handleTaskCreated();
        }}
      />

      {/* Danh sách nhóm */}
      {groups.map((group) => (
        <div
          key={group._id}
          className="bg-white rounded-xl shadow-md p-4 border"
        >
          <h2 className="text-xl font-bold text-slate-700 mb-2">
            📌 {group.name}
          </h2>
          <p className="text-sm text-slate-500 mb-4">{group.description}</p>

          {Object.entries(group.tasks).length === 0 ? (
            <p className="text-slate-400 italic mt-2">Chưa có nhiệm vụ nào</p>
          ) : (
            Object.entries(group.tasks).map(([userId, { user, tasks }]) => (
              <div key={userId} className="mb-4 mt-4">
                <h3 className="font-semibold text-slate-600">
                  👤 {user ? user.name : "Không xác định"}
                </h3>
                <ul className="list-disc ml-6 text-slate-700">
                  {tasks.map((t) => (
                    <li
                      key={t._id}
                      onClick={() => handleOpenDetail(t._id)}
                      className="cursor-pointer hover:underline text-blue-600"
                    >
                      {t.task} -{" "}
                      <span className="italic text-slate-500">{t.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      ))}

      {/* Panel chi tiết */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={(task) => {
            setEditingTask(task);
            setSelectedTask(null); // đóng panel khi bấm sửa
          }}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}
