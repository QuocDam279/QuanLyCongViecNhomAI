import React from "react";
import Menu from "../components/menu";
import OverviewCards from "../components/overviewCards";
import Header from "../components/header"; // ✅ import header

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header - full width trên cùng (chừa sidebar 64px) */}
      <div className="ml-64">
        <Header />
      </div>

      {/* Phần dưới: Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar Menu (cố định) */}
        <Menu />

        {/* Main Content (chừa sidebar 64px) */}
        <div className="flex-1 p-6 overflow-y-auto bg-white ml-64">
          <div className="bg-slate-100 p-6 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
            <OverviewCards />
            <div className="my-8" />

            {/* Placeholder content */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow">Overview cards</div>
              <div className="bg-white p-6 rounded-2xl shadow">Recent Activity</div>
              <div className="bg-white p-6 rounded-2xl shadow">AI Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
