import React from "react";
import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-blue-200 px-4 py-2 flex items-center justify-between shadow-sm h-12">
      {/* Logo */}
      <div></div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search box */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs w-48"
          />
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
        </div>

        {/* Notification */}
        <button className="relative p-1.5 rounded-full hover:bg-slate-100 transition-colors">
          <Bell size={16} className="text-slate-600" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/32"
          alt="User Avatar"
          className="w-7 h-7 rounded-full border border-slate-200"
        />
      </div>
    </header>
  );
}
