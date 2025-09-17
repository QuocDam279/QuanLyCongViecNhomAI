import React from "react";
import { Users, CheckSquare, Clock, Bell } from "lucide-react";

export default function OverviewCards() {
  const cards = [
    { title: "Groups", value: 3, icon: <Users size={20} />, color: "bg-blue-500" },
    { title: "Tasks", value: 12, icon: <CheckSquare size={20} />, color: "bg-green-500" },
    { title: "Due Soon", value: 5, icon: <Clock size={20} />, color: "bg-orange-500" },
    { title: "Notifications", value: 8, icon: <Bell size={20} />, color: "bg-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className="bg-white p-4 rounded-xl shadow flex items-center gap-3 hover:shadow-md transition"
        >
          <div className={`${c.color} text-white p-2 rounded-lg`}>
            {c.icon}
          </div>
          <div>
            <div className="text-lg font-bold text-slate-800">{c.value}</div>
            <div className="text-sm text-slate-500">{c.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
