import React from "react";
import Menu from "../components/Menu";
import Header from "../components/header";
import Group from "../components/group";

export default function GroupManager() {
  return (
    <div className="bg-white min-h-screen">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-50">
        <Menu />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-64 right-0 z-40">
        <Header />
      </div>

      {/* Main */}
      <div className="ml-64 pt-20 px-6">
        <div className="space-y-8">
            <Group />
        </div>
      </div>
    </div>
  );
}
