import express from 'express';
import {
    getDashboardStats,
    getTopSellingBooks,
    getRecentOrders,
    getAllUsers
}
from '../controllers/analytics.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();


// for admin
router.get('/', protectRoute, isAdmin, getDashboardStats);
router.get('/top-selling', getTopSellingBooks);
router.get('/recent-orders', protectRoute, isAdmin, getRecentOrders);
router.get('/recent-orders', protectRoute, isAdmin, getRecentOrders);
router.get('/users', protectRoute, isAdmin, getAllUsers);
export default router;