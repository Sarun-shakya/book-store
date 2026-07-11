import React, { useEffect, useState } from 'react'
import API from '../../api/axios';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get('/analytics/users');
      setUsers(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.fullName}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await API.delete(`/users/${user._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete user.");
    }
  };

  const filtered = users.filter((user) =>
    user.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 text-[15.2px]">
          <svg className="animate-spin w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading users…
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]">

      {/* ── Header ── */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Manage Users</h1>
          <p className="text-[15.2px] text-gray-400 mt-0.5">
            {users.length} {users.length === 1 ? "user" : "users"} registered
          </p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="px-6 py-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 ">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-[15.2px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Clear filters */}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-[15.2px] text-indigo-600 hover:text-indigo-800 font-medium px-3 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto p-6">
        <table className="w-full text-[15.2px]">
          <thead>
            <tr className="bg-gray-100 text-left text-[15.2px] font-semibold text-black-700 uppercase tracking-wider">
              <th className="px-6 py-3 w-8">SN</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  {search ? "No users match your search." : "No users found."}
                </td>
              </tr>
            ) : (
              filtered.map((user, idx) => (
                <tr key={user._id} className="hover:bg-indigo-50/40 transition-colors duration-100 group">
                  <td className="px-6 py-4 text-gray-400 tabular-nums">{idx + 1}</td>

                  {/* User with avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.profile?.url ? (
                        <img
                          src={user.profile.url}
                          alt={user.fullName}
                          className="w-9 h-9 object-cover rounded-full border border-gray-100 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {user.fullName?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-gray-800 leading-snug">{user.fullName}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-500">{user.email}</td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[15.2px] font-medium border ${
                      user.role === "admin"
                        ? "bg-purple-50 text-purple-700 border-purple-100"
                        : "bg-indigo-50 text-indigo-700 border-indigo-100"
                    }`}>
                      {user.role || "user"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(user)}
                        className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-[15.2px] font-medium transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      {filtered.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-50 text-[15.2px] text-gray-400">
          Showing {filtered.length} of {users.length} users
        </div>
      )}
    </div>
  );
}

export default ManageUsers;