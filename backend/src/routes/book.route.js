import express from 'express';
import { addBook,
        updateBook,
        deleteBook,
        getAllBooks,
        getAllBooksAdmin,
        getBookById,
        searchBook
 } from '../controllers/book.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js'
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();

// for admin
router.post("/", protectRoute, isAdmin,upload.single("image"), addBook);
router.put("/:id", protectRoute, isAdmin, upload.single("image"), updateBook);
router.delete("/:id", protectRoute, isAdmin, deleteBook);
router.get("/admin/all", protectRoute, isAdmin, getAllBooksAdmin);

// for user
router.get("/", getAllBooks);
router.get("/search", searchBook);
router.get("/:id", getBookById);

export default router;