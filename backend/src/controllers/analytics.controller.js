import { Book } from '../models/book.model.js';
import { User } from '../models/user.model.js';
import { Order } from '../models/order.model.js';

import mongoose from 'mongoose';

export const getDashboardStats = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            {
                $match: {
                    orderStatus: "delivered"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        res.status(201).json({
            success: true,
            data: {
                totalBooks,
                totalUsers,
                totalOrders,
                totalRevenue
            },
            message: "Analytics fetched successfully"
        });

    } catch (error) {
        console.log("Error in get dashboard stats controller", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getTopSellingBooks = async (req, res) => {
    try {
        const topSellingBooks = await Order.aggregate([
            {
                $match: {
                    orderStatus: "delivered"
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.book",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            {
                $match: {
                    _id: { $ne: null }
                }
            },
            {
                $sort: {
                    totalSold: -1
                }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            },
            {
                $project: {
                    _id: 1,
                    totalSold: 1,
                    title: "$book.title",
                    price: "$book.price",
                    image: "$book.image.url"
                }
            }
        ]);
        res.status(201).json({
            success: true,
            data: topSellingBooks,
            message: "Book fetched successfully"
        });
    } catch (error) {
        console.log("Error in get top selling books controller", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getRecentOrders = async (req, res) => {
    try {
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate("user");
        res.status(201).json({
            success: true,
            data: recentOrders,
            message: "Order fetched successfully"
        });
    } catch (error) {
        console.log("Error in get recent orders controller", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}