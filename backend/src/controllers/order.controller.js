import { Order } from '../models/order.model.js';
import { Cart } from '../models/cart.model.js';
import { Book } from '../models/book.model.js';

// place order from cart
export const placeOrder = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

// get oders for users
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.book");
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
            message: "Order data fetched successfully"
        })
    } catch (error) {
        console.log("Error in getMyOrders: ", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// get all orders for admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user").populate("items.book");
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.log("Error in getAllOrders:", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// update order status 
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: "Order status updated successfully"
        });
    } catch (error) {
        console.log("Error in updateOrderStatus:", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}