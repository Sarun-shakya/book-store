import React, { useEffect, useState } from 'react'
import API from '../../api/axios'
import { useAuth } from "../../context/authContext";

// Icons as simple SVG components
const BookIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const UsersIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const OrdersIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

const RevenueIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
    processing: { label: 'Processing', bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    shipped: { label: 'Shipped', bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
    delivered: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
};

function StatusBadge({ status }) {
    const cfg = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[15.2px] font-medium ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

const statCards = [
    {
        key: 'totalBooks',
        label: 'Total Books',
        icon: BookIcon,
        bg: "bg-[#4F46E5]",
        iconBg: 'bg-[#6C63FF]', 
    },
    {
        key: 'totalUsers',
        label: 'Total Users',
        icon: UsersIcon,
        bg: 'bg-[#06B6D4]',
        iconBg: 'bg-[#22D3EE]',
    },
    {
        key: 'totalOrders',
        label: 'Total Orders',
        icon: OrdersIcon,
        bg: 'bg-[#10B981]',
        iconBg: 'bg-[#34D399]', 
    },
    {
        key: 'totalRevenue',
        label: 'Total Revenue',
        icon: RevenueIcon,
        bg: "bg-[#F59E0B]",
        iconBg: 'bg-[#FBBF24]', 
        prefix: 'Rs. ',
    },
];
export default function Dashboard() {
    const [analytics, setAnalytics] = useState({});
    const [topSellingBook, setTopSellingBook] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const { user } = useAuth();

    const fetchAnalytics = async () => {
        try {
            const res = await API.get('/analytics/'); setAnalytics(res.data.data);
        } catch (e) { console.error(e); }
    };
    const fetchTopSellingBook = async () => {
        try {
            const res = await API.get('/analytics/top-selling');
            setTopSellingBook(res.data.data);
        } catch (e) { console.error(e); }
    };
    const fetchRecentOrders = async () => {
        try {
            const res = await API.get('/analytics/recent-orders'); setRecentOrders(res.data.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchAnalytics();
        fetchTopSellingBook();
        fetchRecentOrders();
    }, []);

    return (
        <div className="min-h-screen space-y-8">

            {/* ── Header ── */}
            <div>
                <h1 className="text-3xl font-bold text-violet-700 text-center">
                    Welcome Back, {user?.fullName}!
                </h1>
                <p className=" text-slate-500 text-[15.2px] text-center">
                    Here's what's happening in your bookstore today.
                </p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(({ key, label, icon: Icon, bg, iconBg, prefix }) => (
                    <div
                        key={key}
                        className={`${bg} rounded-2xl p-5 text-white shadow-sm`}
                    >
                        <div className={`${iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                            <Icon />
                        </div>
                        <p className="text-3xl font-bold tracking-tight">
                            {prefix || ''}{analytics[key] ?? '—'}
                        </p>
                        <p className="mt-1 text-white/80 text-[15.2px] font-medium">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Bottom Two Panels ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Top Selling Books */}
                <div className="bg-white rounded-2xl shadow-[0_3px_6px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h2 className="text-base font-semibold text-slate-800">Top Selling Books</h2>
                        <span className="text-[15.2px] font-medium text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                            This Month
                        </span>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {topSellingBook.length === 0 && (
                            <p className="text-center text-slate-400 text-[15.2px] py-10">No data yet.</p>
                        )}
                        {topSellingBook.map((book, idx) => (
                            <div key={book._id ?? idx} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors">
                                {/* Rank */}
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[15.2px] font-bold flex-shrink-0
                  ${idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {idx + 1}
                                </span>

                                {/* Cover */}
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-10 h-14 object-cover rounded-md shadow-sm flex-shrink-0"
                                    onError={e => { e.target.style.display = 'none'; }}
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[15.2px] font-medium text-slate-800 truncate">{book.title}</p>
                                    <p className="text-[15.2px] text-slate-400 mt-0.5">{book.totalSold} sold</p>
                                </div>

                                {/* Price */}
                                <p className="text-[15.2px] font-semibold text-violet-600 flex-shrink-0">
                                    Rs. {book.price}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-[0_3px_6px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h2 className="text-base font-semibold text-slate-800">Recent Orders</h2>
                        <span className="text-[15.2px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                            Latest
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        {recentOrders.length === 0 && (
                            <p className="text-center text-slate-400 text-[15.2px] py-10">No orders yet.</p>
                        )}
                        {recentOrders.length > 0 && (
                            <table className="w-full text-[15.2px]">
                                <thead>
                                    <tr className="bg-slate-50 text-left">
                                        <th className="px-4 py-3 text-[15.2px] font-semibold text-slate-400 uppercase tracking-wider">Order</th>
                                        <th className="px-4 py-3 text-[15.2px] font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                                        <th className="px-4 py-3 text-[15.2px] font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                                        <th className="px-4 py-3 text-[15.2px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-[15.2px] font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentOrders.map((order, idx) => (
                                        <tr key={order._id ?? idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-mono text-[15.2px] text-slate-500">
                                                #{order._id?.slice(-6)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-700 font-medium max-w-[100px]">
                                                        {order.user?.fullName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-800">
                                                Rs. {order.totalPrice}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <StatusBadge status={order.orderStatus} />
                                            </td>
                                            <td className="px-4 py-3 text-slate-400 text-[15.2px] whitespace-nowrap">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}