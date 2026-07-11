import Wishlist from "../models/wishlist.model.js";

export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { bookId } = req.body;

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: userId },
            { $addToSet: { books: bookId } },
            { new: true, upsert: true }
        ).populate("books");

        res.status(200).json({
            success: true,
            date: wishlist,
            message: "Book added to wishlist",
        })
    } catch (error) {
        console.log("Error in addToWishList Controller", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ user: userId })
            .populate({
                path: "books",
                populate: {
                    path: "category",
                    select: "name",
                },
            });

        if (!wishlist) {
            return res.status(200).json({
                books: []
            });
        }

        res.status(200).json({
            success: true,
            books: wishlist.books,
            message: "Wishlist fetched"
        });
    } catch (error) {
        console.log("Error in addToWishList Controller", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.params;

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: userId },
            { $pull: { books: bookId } },
            { new: true }
        ).populate("books");

        res.status(200).json({
            success: true,
            data: wishlist,
            message: "Book removed from wishlist"
        })
    } catch (error) {
        console.log("Error in addToWishList Controller", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};