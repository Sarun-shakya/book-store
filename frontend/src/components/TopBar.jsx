import React from "react";
import Logo from "./Logo";
import { useAuth } from "../context/authContext";

export default function TopBar() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-between px-6">
      <Logo />

      <div className="flex items-center gap-4">
        <p className="hidden sm:block text-gray-700 font-medium">
          {user?.fullName}
        </p>

        <img
          src={user?.profile?.url || "https://via.placeholder.com/40"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border"
        />
      </div>
    </header>
  );
}