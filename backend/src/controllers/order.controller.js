import { Order } from '../models/order.model.js';
import { Cart } from '../models/cart.model.js';
import { Book } from '../models/book.model.js';

// place order from cart
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { paymentMethod, shippingAddress } = req.body;

        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city
        ) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.book");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        const orderItems = cart.items.map(item => ({
            book: item.book._id,
            quantity: item.quantity,
            price: item.book.price
        }));

        const totalPrice = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalPrice,
            shippingAddress,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: "processing"
        });

        if (paymentMethod === "cod") {
            for (const item of cart.items) {
                const book = await Book.findById(item.book._id);
                if (book) {
                    book.stock -= item.quantity;
                    if (book.stock < 0) {
                        book.stock = 0;
                    }
                    await book.save();
                }
            }
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();

            return res.status(201).json({
                success: true,
                data: order,
                message: "Order placed successfully (Cash on Delivery)"
            });
        }

        if(paymentMethod === "esewa"){
            const esewaURL = "https://uat.esewa.com.np/epay/main";

            const paymentData = {
                amt: totalPrice,
                psc: 0,
                pdc: 0,
                txAmt: 0,
                tAmt: 0,
                tAmt: totalPrice,
                pid: order._id.toString(),
                scd: process.env.ESEWA_MERCHANT_ID,
                su: `http://localhost:5000/api/v1/orders/esewa-success`,
                fu: `http://localhost:5000/api/v1/orders/esewa-failure`
            }

            return res.status(200).json({
                success: true,
                payment_url: esewaURL,
                payment_data: paymentData,
                orderId: order._id
            });
        }

    } catch (error) {
        console.error("Error in placeOrder:", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
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
        if (!order) {
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

// delete order
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        await Order.findByIdAndDelete(orderId);

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.log("Error in deleteOrder: ", error.message);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const esewaSuccess = async (req, res) => {
    try {
        const { oid, refId } = req.query; 

        const order = await Order.findById(oid);
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.paymentStatus = "paid";
        order.paymentRef = refId;
        order.orderStatus = "processing";
        await order.save();

        for (const item of order.items) {
            const book = await Book.findById(item.book);
            if (book) {
                book.stock -= item.quantity;
                if (book.stock < 0) book.stock = 0;
                await book.save();
            }
        }

        const cart = await Cart.findOne({ user: order.user });
        if (cart) {
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();
        }

        res.redirect("http://localhost:5173/success");

    } catch (error) {
        console.error("Error in esewaSuccess:", error.message);
        res.status(500).json({
            message: "Payment verification failed"
        });
    }
}

export const esewaFailure = async (req, res) => {
    try {
        const { oid } = req.query;

        const order = await Order.findById(oid);
        if (order) {
            order.paymentStatus = "failed";
            await order.save();
        }

        res.redirect("http://localhost:5173/failure");

    } catch (error) {
        console.error("Error in esewaFailure:", error.message);
        res.status(500).json({
            message: "Payment failed"
        });
    }
}