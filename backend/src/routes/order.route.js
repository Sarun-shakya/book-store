import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} from '../controllers/order.controller.js'

const router = express.Router();

router.use(protectRoute);

// for users
router.post("/", placeOrder);
router.get("/my-orders", getMyOrders);

// for admin
router.get("/admin", isAdmin, getAllOrders);
router.put("/admin/:orderId", isAdmin, updateOrderStatus);

export default router;