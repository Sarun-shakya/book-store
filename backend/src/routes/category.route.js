import express from 'express';
import {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategoryById
} from '../controllers/category.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';

const router = express.Router();

// for public
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// for admin
router.post("/", protectRoute, isAdmin, createCategory);
router.put("/:id", protectRoute, isAdmin, updateCategory);
router.delete("/:id", protectRoute, isAdmin, deleteCategory);

export default router;