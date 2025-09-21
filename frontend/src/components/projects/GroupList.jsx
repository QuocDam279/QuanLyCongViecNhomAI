import React from "react";
import GroupCard from "./GroupCard";

export default function GroupList({
  groups,
  currentUserId,
  onDelete,
  onRemoveMember,
  onAssignLeader,
  onEdit, // ✅ thêm prop onEdit
}) {
  if (groups.length === 0)
    return (
      <p className="text-gray-500 text-center col-span-full">
        Chưa có nhóm nào.
      </p>
    );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((g) => (
        <GroupCard
          key={g._id}
          group={g}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onRemoveMember={onRemoveMember}
          onAssignLeader={onAssignLeader}
          onEdit={onEdit} // ✅ truyền xuống GroupCard
        />
      ))}
    </div>
  );
}
