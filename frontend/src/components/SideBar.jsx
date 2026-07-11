import React from "react";
import { useAuth } from "../context/authContext";
import { NavLink } from "react-router-dom";

// Icons
import {
  FaPersonBooth,
  FaTachometerAlt,
  FaBook,
  FaPlus,
  FaClipboardList,
  FaTags,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

export default function SideBar() {
  const { isLoggedIn, isAdmin, logout } = useAuth();

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="p-4 text-red-500 font-medium">
        Not authorized
      </div>
    );
  }

  const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl
   transition-all duration-300 ease-in-out 
   ${
     isActive
       ? "bg-indigo-600 text-white shadow-lg"
       : "text-gray-300 hover:bg-indigo-900 hover:text-white hover:translate-x-2 hover:scale-[1.02]"
   }`;

  return (
    <aside className="w-70 bg-slate-900 shadow-[6px_0_15px_rgba(0,0,0,0.25)] text-white h-full flex flex-col justify-between">
      {/* Menu */}
      <div className="p-4 space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <FaTachometerAlt />
          Dashboard
        </NavLink>

        <NavLink to="/admin/add-book" className={linkClass}>
          <FaPlus />
          Add Book
        </NavLink>

        <NavLink to="/admin/manage-books" className={linkClass}>
          <FaBook />
          Manage Books
        </NavLink>

        <NavLink to="/admin/manage-orders" className={linkClass}>
          <FaClipboardList />
          Manage Orders
        </NavLink>

        <NavLink to="/admin/manage-categories" className={linkClass}>
          <FaTags />
          Categories
        </NavLink>

        <NavLink to="/admin/manage-users" className={linkClass}>
          <FaPersonBooth />
          Manage Users
        </NavLink>

        <NavLink to="/admin/profile" className={linkClass}>
          <FaUser />
          Profile
        </NavLink>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}