import React, { useState, useRef } from "react";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";

export default function AdminProfile() {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.profile?.url || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {

    if (!form.fullName || !form.email) {
      toast.error("Full name and email are required.");
      return;
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (form.newPassword && form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("email", form.email);

      if (form.newPassword) {
        formData.append("password", form.newPassword);
      }

      if (avatarFile) {
        formData.append("profile", avatarFile);
      }

      await updateProfile(formData);
      setAvatarPreview(null);

      setForm((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));

      setAvatarFile(null);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[15.2px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";

  const labelClass = "block text-[15.2px] font-medium text-gray-700 mb-1.5";

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]">

      {/* ── Header ── */}
      <div className="px-6 py-5">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Profile</h1>
        <p className="text-[15.2px] text-gray-400 mt-0.5">Update your account information</p>
      </div>

      <div className="px-6 pb-6 space-y-6">

        {/* ── Avatar ── */}
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-2xl">
                  {form.fullName?.charAt(0)?.toUpperCase() || "A"}
                </span>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow transition-colors"
              title="Change photo"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="text-[15.2px] font-medium text-gray-700">Profile Photo</p>
            <p className="text-[13px] text-gray-400 mt-0.5">JPG, PNG or WEBP. Max 2MB.</p>
            <button
              onClick={() => fileInputRef.current.click()}
              className="mt-1.5 text-[13px] text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Change photo
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100" />


        {/* ── Basic Info ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email <span className="text-red-400">*</span></label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* ── Password Section ── */}
        <div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={form.newPassword}
                onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={form.confirmPassword}
                onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-[15.2px] font-medium px-6 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            {loading && (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}