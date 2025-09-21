import { useState, useRef, useEffect } from "react";
import {
  Users,
  Trash2,
  ChevronDown,
  ChevronUp,
  XCircle,
  Crown,
} from "lucide-react";

export default function GroupCard({
  group,
  onDelete,
  onRemoveMember,
  onAssignLeader,
  onEdit, // gọi khi bấm nút Sửa
  currentUserId,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Kiểm tra nếu current user là leader trong group
  const isCurrentUserLeader = group.members?.some(
    (m) =>
      String(m.user?._id || m.userId || m.user) === String(currentUserId) &&
      m.role === "leader"
  );

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      className="relative bg-white rounded-xl shadow-md border border-transparent 
                 bg-gradient-to-br from-blue-50 to-purple-50 p-[1.5px] 
                 hover:shadow-lg hover:-translate-y-0.5 transition-transform duration-300"
    >
      <div className="bg-white rounded-xl p-4 h-full flex flex-col relative">
        {/* Icon nhóm + nút sửa (nếu là leader) */}
        <div className="flex items-center justify-between mb-2">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
            <Users className="w-4 h-4" />
          </div>
          {isCurrentUserLeader && (
            <button
              onClick={() => onEdit(group)}
              className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded px-2 py-0.5 transition"
            >
              Sửa
            </button>
          )}
        </div>

        {/* Tên và mô tả nhóm */}
        <h3 className="text-lg font-semibold text-blue-700 mb-1">
          {group.name}
        </h3>
        {group.description && (
          <p className="text-gray-600 italic text-sm mb-2">
            {group.description}
          </p>
        )}

        {/* Toggle danh sách thành viên */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-2"
          >
            {open ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" /> Ẩn thành viên
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" /> Xem thành viên
              </>
            )}
          </button>

          <div
            className={`absolute top-full left-0 w-full mt-1 
                        bg-white border rounded shadow-lg z-10 
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
          >
            {group.members && group.members.length > 0 ? (
              <ul className="space-y-1 p-2">
                {group.members.map((m) => {
                  const memberUserId = String(
                    m.user?._id || m.userId || m.user
                  );
                  const isSelf = memberUserId === String(currentUserId);
                  const isLeader = m.role === "leader";

                  const canRemove =
                    isSelf || (isCurrentUserLeader && !isLeader && !isSelf);
                  const canAssignLeader =
                    isCurrentUserLeader && !isLeader && !isSelf;

                  return (
                    <li
                      key={m._id}
                      className="flex items-center justify-between text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded"
                    >
                      <span className="flex items-center gap-1">
                        {m.user?.name || m.user?.email || "Ẩn danh"}{" "}
                        <span className="text-gray-400">({m.role})</span>
                        {isLeader && (
                          <Crown className="w-3 h-3 text-yellow-500" />
                        )}
                      </span>
                      <div className="flex items-center">
                        {canAssignLeader && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm("Gán thành viên này làm leader?")
                              ) {
                                onAssignLeader(group._id, memberUserId);
                              }
                            }}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                            title="Gán làm leader"
                          >
                            <Crown className="w-4 h-4" />
                          </button>
                        )}
                        {canRemove && (
                          <button
                            onClick={() => {
                              const confirmMsg = isSelf
                                ? "Bạn có chắc muốn rời nhóm?"
                                : "Bạn có chắc muốn xóa thành viên này?";
                              if (!window.confirm(confirmMsg)) return;
                              onRemoveMember(group._id, memberUserId);
                            }}
                            className="text-red-500 hover:text-red-700"
                            title={isSelf ? "Rời nhóm" : "Xóa thành viên"}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic p-2">
                Chưa có thành viên nào.
              </p>
            )}
          </div>
        </div>

        {/* Nút xóa nhóm (chỉ leader) */}
        <div className="mt-auto flex justify-end">
          {isCurrentUserLeader && (
            <button
              onClick={() => {
                if (window.confirm("Bạn có chắc muốn xóa nhóm này?")) {
                  onDelete(group._id);
                }
              }}
              className="inline-flex items-center gap-1.5 bg-red-500 text-white px-2.5 py-1.5 rounded-md shadow 
                         hover:bg-red-600 transition text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa nhóm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
