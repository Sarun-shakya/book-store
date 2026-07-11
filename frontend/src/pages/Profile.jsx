import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authContext";
import API from "../api/axios";

export default function useProfile() {
  const { user, updateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef();

  // Sync user → form
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setAvatarPreview(user.profile?.url || null);
    }
  }, [user]);

  // Fetch orders (includes COD + online)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my-orders", {
          withCredentials: true,
        });

        setMyOrders(res.data.data || []);
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };

    fetchOrders();
  }, []);

  // Image change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);

      if (password.trim()) {
        formData.append("password", password);
      }

      if (profileFile) {
        formData.append("profile", profileFile);
      }

      await updateProfile(formData);

      setPassword("");
      setProfileFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[15.2px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 text-[15.2px]">
          <svg className="animate-spin w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading profile…
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="shrink-0">
            {user.profile?.url ? (
              <img
                src={user.profile.url}
                alt={user.fullName}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-2xl">
                  {user.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight truncate">{user.fullName}</h1>
            <p className="text-[15.2px] text-gray-400 mt-0.5 truncate">{user.email}</p>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-[15.2px] font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931z" />
            </svg>
            Edit Profile
          </button>
        </div>

        {/* ── My Orders ── */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="px-6 py-5 border-b border-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 tracking-tight">My Orders</h2>
            <p className="text-[15.2px] text-gray-400 mt-0.5">
              {myOrders.length} {myOrders.length === 1 ? "order" : "orders"}
            </p>
          </div>

          <div className="p-6 space-y-4 ">
            {myOrders.length === 0 ? (
              <p className="text-center text-gray-400 text-[15.2px] py-8">No orders yet.</p>
            ) : (
              myOrders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-100 shadow-md rounded-xl p-4 hover:bg-indigo-50/30 transition-colors"
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-[15.2px]">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[13px] font-medium border ${order.orderStatus === "delivered"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : order.orderStatus === "cancelled"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : "bg-yellow-50 text-yellow-700 border-yellow-100"
                      }`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-gray-500 ">
                    <span>
                      <span className="font-medium text-gray-700">Date: </span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      <span className="font-medium text-gray-700">Total: </span>
                      Rs. {order.totalPrice}
                    </span>
                    <span>
                      <span className="font-medium text-gray-700">Payment: </span>
                      {order.paymentMethod.toUpperCase()}
                    </span>
                    <span className={`font-medium ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
                      }`}>
                      {order.paymentStatus}
                    </span>
                    <span>
                      <span className="font-medium text-gray-700">City: </span>
                      {order.shippingAddress.city}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.items.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                      >
                        {item.book.title}
                        <span className="text-indigo-400">×{item.quantity}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-[15.2px] px-4 py-2.5 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Avatar picker */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  {avatarPreview || user.profile?.url ? (
                    <img
                      src={avatarPreview || user.profile.url}
                      alt="avatar"
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-xl">
                        {fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow transition-colors"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
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
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="mt-0.5 text-[13px] text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Change photo
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">
                  New Password
                  <span className="ml-1.5 text-[13px] text-gray-400 font-normal">— leave blank to keep current</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Min. 6 characters"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-[15.2px] font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-[15.2px] font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm"
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}