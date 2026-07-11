import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { RiH1 } from "react-icons/ri";

const Wishlist = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await API.get("/wishlist");
            setBooks(res.data.books || []);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch wishlist");
        } finally {
            setLoading(false);
        }
    };

    const removeWishlist = async (bookId) => {
        try {
            await API.delete(`/wishlist/remove/${bookId}`);

            setBooks((prev) =>
                prev.filter((book) => book._id !== bookId)
            );

            toast.success("Removed from wishlist");
        } catch (error) {
            console.log(error);
            toast.error("Failed to remove book");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-stone-500 text-lg">
                    Loading wishlist...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf7f2] py-6 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-serif font-bold text-gray-900 mb-5">
                    My Wishlist
                </h1>

                {books.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-stone-200">
                        <h2 className="text-2xl font-serif text-stone-800 mb-3">
                            Your wishlist is empty
                        </h2>

                        <p className="text-stone-500">
                            Save your favourite books here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {books.map((book) => (
                            <div
                                key={book._id}
                                className="bg-white rounded-2xl border border-stone-200 shadow-md hover:transition p-5 flex flex-col sm:flex-row items-center gap-6"
                            >
                                {/* Image */}
                                <div className="w-26 h-38 shrink-0 bg-white rounded-lg overflow-hidden">
                                    <img
                                        src={book.image?.url}
                                        alt={book.title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Book Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">
                                        {book.category?.name}
                                    </p>

                                    <h1 className="font-serif text-2xl font-bold text-gray-900 mb-1">
                                        {book.title}
                                    </h1>

                                    <p className="text-stone-500 mb-3">
                                        by {book.author}
                                    </p>

                                    <p className="text-xl font-semibold text-[#b87333]">
                                        Rs. {book.price.toFixed(2)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3 w-full sm:w-auto">
                                    <Link
                                        to={`/books/${book._id}`}
                                        className="px-6 py-2.5 bg-[#b87333] text-white rounded-lg text-center font-medium hover:bg-[#925925] transition"
                                    >
                                        View Details
                                    </Link>

                                    <button
                                        onClick={() => removeWishlist(book._id)}
                                        className="px-6 py-2.5 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;