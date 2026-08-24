import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import ConfirmButton from "../../components/ConfirmButton";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const orderStatusStyle = {
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  processing: "bg-blue-50 text-blue-700 border border-blue-100",
  shipped: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  cancelled: "bg-red-50 text-red-600 border border-red-100",
};

const paymentStatusStyle = {
  Paid: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Unpaid: "bg-red-50 text-red-600 border border-red-100",
  Refunded: "bg-gray-100 text-gray-500 border border-gray-200",
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/orders/admin");
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/admin/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;

    try {
      await API.delete(`/orders/admin/delete/${confirmId}`);

      setOrders((prev) =>
        prev.filter((o) => o._id !== confirmId)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o.user?.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 text-[15.2px]">
          <svg className="animate-spin w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading orders…
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]">

      <ConfirmButton
        open={!!confirmId}
        loading={false}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />

      {/* ── Header ── */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Manage Orders</h1>
          <p className="text-[15.2px] text-gray-400 mt-0.5">
            {orders.length} {orders.length === 1 ? "order" : "orders"} total
          </p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="px-6 py-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by customer name…"
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

        {/* Status Filter */}
        <div className="relative sm:w-52">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-[15.2px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition cursor-pointer"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        {/* Clear filters */}
        {(search || filterStatus) && (
          <button
            onClick={() => { setSearch(""); setFilterStatus(""); }}
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
            <tr className="bg-gray-100 text-left text-[15.2px] font-semibold text-gray-700 uppercase tracking-wider">
              <th className="px-6 py-3 w-8">ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3">Payment Method</th>
              <th className="px-6 py-3">Payment Status</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Order Status</th>
              <th className="px-6 py-3">Shipping</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                  {search || filterStatus
                    ? "No orders match your filters."
                    : "No orders yet."}
                </td>
              </tr>
            ) : (
              filtered.map((order, idx) => (
                <tr key={order._id} className="hover:bg-indigo-50/40 transition-colors duration-100 group">

                  {/* SN */}
                  <td className="px-6 py-4 text-gray-400 tabular-nums">#{order._id.slice(-6).toUpperCase()}</td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800 leading-snug">{order.user?.fullName}</p>
                  </td>

                  {/* Items */}
                  <td className="px-6 py-4 max-w-[160px]">
                    {order.items?.map((item) => (
                      <div key={item._id} className="text-gray-600 whitespace-normal wrap-break-word">
                        <span className="font-medium text-gray-700">{item.book?.title}</span>
                        <span className="text-gray-400"> × {item.quantity}</span>
                      </div>
                    ))}
                  </td>

                  {/* Payment Method */}
                  <td className="px-6 py-4 text-gray-500">{order.paymentMethod}</td>

                  {/* Payment Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[15.2px] font-medium ${paymentStatusStyle[order.paymentStatus] ?? "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 font-semibold text-emerald-600 tabular-nums">
                    Rs. {order.totalPrice?.toLocaleString()}
                  </td>

                  {/* Order Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[15.2px] font-medium ${orderStatusStyle[order.orderStatus] ?? "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Shipping */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-700 leading-snug">{order.shippingAddress?.fullName}</p>
                    <p className="text-[15.2px] text-gray-400">{order.shippingAddress?.phone}</p>
                    <p className="text-[15.2px] text-gray-400">{order.shippingAddress?.city}</p>
                    <p className="text-[15.2px] text-gray-400 wrap-break-word max-w-[120px]">{order.shippingAddress?.address}</p>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-end gap-1.5">

                      {/* Status dropdown */}
                      <div className="relative w-full">
                        <select
                          disabled={updatingId === order._id}
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="w-full appearance-none bg-white border border-indigo-200 text-indigo-700 rounded-lg pl-3 pr-7 py-1.5 text-[15.2px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 cursor-pointer disabled:opacity-50 transition"
                        >
                          {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        {updatingId === order._id ? (
                          <svg className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin w-3 h-3 text-indigo-400 pointer-events-none" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                        ) : (
                          <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-indigo-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        )}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => setConfirmId(order._id)}
                        className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-[15.2px] font-medium transition-colors w-full justify-center"
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
          Showing {filtered.length} of {orders.length} orders
        </div>
      )}

    </div>
  );
}