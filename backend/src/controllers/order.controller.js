import { Order } from '../models/order.model.js';
import { Cart } from '../models/cart.model.js';
import { Book } from '../models/book.model.js';
import { getEsewaPaymentHash, verifyEsewaPayment } from '../config/esewa.js';

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

        if (paymentMethod === "esewa") {
            const transaction_uuid = order._id.toString();

            // 🔥 GENERATE SIGNATURE HERE
            const { signature, signed_field_names } =
                getEsewaPaymentHash(totalPrice, transaction_uuid);

            const paymentData = {
                amount: totalPrice,
                tax_amount: 0,
                total_amount: totalPrice,
                transaction_uuid: transaction_uuid,
                product_code: process.env.ESEWA_PRODUCT_CODE,

                product_service_charge: 0,
                product_delivery_charge: 0,

                success_url: `${process.env.BASE_URL}/api/v1/orders/esewa-success`,
                failure_url: `${process.env.BASE_URL}/api/v1/orders/esewa-failure`,

                signed_field_names,
                signature,
            };

            return res.status(200).json({
                success: true,
                payment_url: `${process.env.ESEWA_GATEWAY_URL}/api/epay/main/v2/form`,
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

        order.orderStatus = status;
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

// esewa success
export const esewaSuccess = async (req, res) => {
    try {
        console.log("🔥 eSewa Query:", req.query);

        const { data } = req.query;

        if (!data) {
            return res.redirect(`${process.env.CLIENT_URL}/failure`);
        }

        const result = await verifyEsewaPayment(data);

        if (!result?.decodedData) {
            return res.redirect(`${process.env.CLIENT_URL}/failure`);
        }

        const decodedData = result.decodedData;

        const status = decodedData.status?.toUpperCase();

        const orderId = decodedData.transaction_uuid;

        if (!orderId) {
            return res.redirect(`${process.env.CLIENT_URL}/failure`);
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.redirect(`${process.env.CLIENT_URL}/failure`);
        }

        if (order.paymentStatus === "paid") {
            return res.redirect(
                `${process.env.CLIENT_URL}/success?orderId=${orderId}`
            );
        }

        if (status !== "COMPLETE") {
            console.log("❌ Payment not complete");
            return res.redirect(
                `${process.env.CLIENT_URL}/failure?orderId=${orderId}`
            );
        }

        order.paymentStatus = "paid";
        order.paymentRef = decodedData.transaction_code;
        order.orderStatus = "processing";
        order.paidAt = new Date();
        order.paymentData = decodedData;

        await order.save();

        for (const item of order.items) {
            await Book.findByIdAndUpdate(
                item.book,
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
        }

        await Cart.findOneAndUpdate(
            { user: order.user },
            { $set: { items: [], totalPrice: 0 } }
        );

        return res.redirect(
            `${process.env.CLIENT_URL}/success?orderId=${orderId}`
        );

    } catch (error) {
        return res.redirect(`${process.env.CLIENT_URL}/failure`);
    }
};
// esewa failue
export const esewaFailure = async (req, res) => {
    try {
        const { orderId } = req.query;

        if (orderId) {
            const order = await Order.findById(orderId);

            if (order && order.paymentStatus !== "paid") {
                order.paymentStatus = "failed";
                order.orderStatus = "cancelled";
                await order.save();
            }
        }

        return res.redirect(`${process.env.CLIENT_URL}/failure?orderId=${orderId}`);

    } catch (error) {
        console.error("eSewa Failure Error:", error.message);
        return res.redirect(`${process.env.CLIENT_URL}/failure`);
    }
};