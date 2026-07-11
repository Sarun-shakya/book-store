import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";

export default function AdminLayout() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <TopBar />

      {/* Main Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SideBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}