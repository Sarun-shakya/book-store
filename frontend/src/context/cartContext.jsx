import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "./authContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(false);

    // 🔹 Fetch cart
    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await API.get("/cart");
            setCart(res.data.data);
        } catch (err) {
            console.error("Fetch cart error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Add to cart
    const addToCart = async (bookId, quantity = 1) => {
        try {
            if (!user) {
                toast.error("Please login to add items to cart");
                return false; 
            }

            const res = await API.post("/cart/add", {
                bookId,
                quantity,
            });

            setCart(res.data.data);
            toast.success("Added to cart");
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add");
            return false;
        }
    };

    // Update quantity
    const updateCartItem = async (bookId, quantity) => {
        try {
            const res = await API.put("/cart/update", {
                bookId,
                quantity,
            });

            setCart(res.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    // Remove item
    const removeFromCart = async (bookId) => {
        try {
            const res = await API.delete("/cart/remove", {
                data: { bookId },
            });

            setCart(res.data.data);
            toast.success("Item removed");
        } catch (err) {
            toast.error(err.response?.data?.message || "Remove failed");
        }
    };

    // Clear cart (optional)
    const clearCart = () => {
        setCart({ items: [], totalPrice: 0 });
    };

    // Load cart on mount
    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                fetchCart,
                addToCart,
                updateCartItem,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// 🔹 Custom hook
export const useCart = () => useContext(CartContext);