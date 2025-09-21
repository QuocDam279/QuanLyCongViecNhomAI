import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FolderKanban, CheckSquare, Activity, Bot } from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { name: "Overview", icon: <Home size={18} />, path: "/dashboard" },
    { name: "GroupManager", icon: <FolderKanban size={18} />, path: "/groupmanager" },
    { name: "Tasks", icon: <CheckSquare size={18} />, path: "/tasks" },
    { name: "Activity", icon: <Activity size={18} />, path: "/activity" },
    { name: "AI Assistant", icon: <Bot size={18} />, path: "/assistant" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white text-slate-800 flex flex-col justify-between">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b bg-blue-200">
        <span className="text-2xl font-bold text-blue-600">QuestDo</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-2 overflow-y-auto p-4 border-r border-slate-200">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer luôn dính đáy */}
      <div className="px-3 py-4 text-sm text-slate-400 border-t border-r border-slate-200">
        © 2025 QuestDo
      </div>
    </aside>
  );
}
