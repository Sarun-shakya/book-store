import { Cart } from '../models/cart.model.js';
import { Book } from '../models/book.model.js';

// get cart
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id}).populate("items.book");

        if(!cart){
            return res.status(200).json({
                success: true,
                data: { items: []},
                message: "Cart is empty"
            });
        }

        res.status(200).json({
            success: true,
            data: cart,
            message: "Cart fetched successfully"
        });
    } catch (error) {
        console.log("Error in getCart: ", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// add book to cart
export const addToCart = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;
        const qty = Number(quantity);

        if (!bookId || isNaN(qty) || qty < 1) {
            return res.status(400).json({
                message: "Book ID and valid quantity are required"
            });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [{ book: bookId, quantity: qty }]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.book.toString() === bookId
            );
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += qty;
            } else {
                cart.items.push({ book: bookId, quantity: qty });
            }
        }

        const bookIds = cart.items.map(item => item.book);
        const books = await Book.find({ _id: { $in: bookIds } });

        const bookMap = {};
        books.forEach(b => {
            bookMap[b._id.toString()] = b;
        });

        let total = 0;
        cart.items.forEach(item => {
            const bookData = bookMap[item.book.toString()];
            if (bookData) {
                total += bookData.price * item.quantity;
            }
        });

        cart.totalPrice = total;

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart,
            message: "Book added to cart successfully"
        });
    } catch (error) {
        console.error("Error in addToCart:", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;
        const qty = Number(quantity);

        if(!bookId || isNaN(qty) || qty < 1){
            return res.status(400).json({
                message: "Book Id and valid quantity required"
            });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");
        if(!cart){
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(item => item.book._id.toString() === bookId);
        if(itemIndex === -1){
            return res.status(404).json({
                message: "Book not in a cart"
            });
        }

        cart.items[itemIndex].quantity = qty;

        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart,
            message: "Cart updated successfully"
        });
    } catch (error) {
        console.log("Error in updateCartIndex: ", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

// remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { bookId } = req.body;

        if(!bookId){
            return res.status(400).json({
                message: "Book ID is required"
            });
        }

        const cart = await Cart.findOne({ user: req.user._id});
        if(!cart){
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const initialLength = cart.items.length;

        cart.items = cart.items.filter(item => item.book.toString() !== bookId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({
                message: "Book not found in cart"
            });
        }

        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart,
            message: "Book removed from cart successfully"
        });
    } catch (error) {
        console.log("Error in removeFromCart: ", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}