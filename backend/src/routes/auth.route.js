import express from 'express';
import { signup,
        login,
        logout,
        profile,
        updateProfile
} from '../controllers/auth.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup",upload.single("profile"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile",protectRoute, profile);
router.put("/update-profile", protectRoute, upload.single("profile"), updateProfile);

export default router;