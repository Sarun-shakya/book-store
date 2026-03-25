import express from 'express';
import { 
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,

} from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router();

router.use(protectRoute);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeFromCart);

router.use(protectRoute);

export default router;