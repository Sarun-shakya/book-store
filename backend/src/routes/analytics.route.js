import express from 'express';
import {
    getDashboardStats,
    getTopSellingBooks,
    getRecentOrders
}
from '../controllers/analytics.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

// for admin
router.get('/', protectRoute, isAdmin, getDashboardStats);
router.get('/top-selling', protectRoute, isAdmin, getTopSellingBooks);
router.get('/recent-orders', protectRoute, isAdmin, getRecentOrders);

export default router;