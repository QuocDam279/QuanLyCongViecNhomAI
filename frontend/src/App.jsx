import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GroupManager from "./pages/GroupManager";
import TaskManager from "./pages/PTask";

// Component bảo vệ route cần đăng nhập
function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      {/* Trang mặc định chuyển về login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/groupmanager"
        element={
          <RequireAuth>
            <GroupManager />
          </RequireAuth>
        }
      />
      <Route
        path="/tasks"
        element={
          <RequireAuth>
            <TaskManager />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;