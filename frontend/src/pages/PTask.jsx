import React from "react";
import Menu from "../components/Menu";
import Header from "../components/header";
import Tasks from "../components/tasks/Tasks";

export default function PTask() {
  return (
    <div className="bg-white min-h-screen">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-50">
        <Menu />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-64 right-0 z-40 bg-white shadow">
        <Header />
      </div>

      {/* Main */}
      <div className="ml-64 pt-20 px-6">
        <div className="space-y-8">
          <div className="bg-slate-100 p-6 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Quản lý Công việc</h1>
            <Tasks />
          </div>
        </div>
      </div>
    </div>
  );
}
