import React from "react";
import Menu from "../components/Menu";
import OverviewCards from "../components/overviewCards";
import Header from "../components/header";
import ProjectList from "../components/projects/projectList";
import ActivityLog from "../components/activityLog";
import Calendar from "../components/calendar";
import Trangthai from "../components/TrangThai"; // 👈 import thêm

export default function Dashboard() {
  return (
    <div className="bg-white min-h-screen">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-50">
        <Menu />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-64 right-0 z-40 ">
        <Header />
      </div>

      {/* Main */}
      <div className="ml-64 pt-20 px-6">
        <div className="space-y-8">
          {/* Title + Cards */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
            <OverviewCards />
          </div>

          {/* Projects + Activity + Trangthai */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects chiếm 2/3 */}
            <div className="lg:col-span-2 p-6 rounded-2xl shadow">
              <ProjectList />
            </div>

            {/* ActivityLog + Trangthai */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow">
                <ActivityLog />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <Trangthai />
              </div>
            </div>
          </div>

          {/* Calendar giữ nguyên bên dưới */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}
