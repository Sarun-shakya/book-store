import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useCart } from "../context/cartContext";
import esewa from "../assets/images/esewa.png"
export default function Cart() {
  const { cart, updateCartItem, removeFromCart, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = (bookId, qty, stock) => {
    const quantity = Number(qty);
    if (quantity > stock) {
      toast.error(`Only ${stock} items available`);
      return;
    }
    if (quantity < 1) return;
    updateCartItem(bookId, quantity);
  };

  const handleClearCart = async () => {
    try {
      for (const item of cart.items) {
        await removeFromCart(item.book._id);
      }
    } catch (err) {
      toast.error("Failed to clear cart");
    }
  };

  if (!cart)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading your cart…</p>
      </div>
    );

  const itemCount = cart.items.length;

  return (
    <div className=" bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="text-6xl mb-4 opacity-20">📚</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-sm">Start adding books to your collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

            {/* Left — Items */}
            <div>
              {/* Title row */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Shopping Cart{" "}
                  <span className="text-gray-500 font-normal">({itemCount})</span>
                </h1>
                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  {/* trash icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                  Clear All
                </button>
              </div>

              {/* Items */}
              <div className="flex flex-col divide-y divide-gray-100">
                {cart.items.map((item) => (
                  <div key={item.book._id} className="py-6 flex gap-5 items-start">
                    {/* Cover */}
                    <img
                      src={item.book.image?.url}
                      alt={item.book.title}
                      className="w-[100px] h-[140px] object-cover rounded shadow-md flex-shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-base text-gray-900 leading-snug">
                            {item.book.title}
                          </h3>
                          {item.book.author && (
                            <p className="text-sm text-blue-500 mt-0.5">
                              by {item.book.author}
                            </p>
                          )}
                        </div>
                        <span className="font-bold text-lg text-gray-900 flex-shrink-0">
                          Rs. {item.book.price * item.quantity}
                        </span>
                      </div>

                      {/* Qty + Actions */}
                      <div className="flex items-center justify-between mt-6">
                        {/* Stepper */}
                        <div className="flex items-center gap-3 border border-gray-200 rounded px-3 py-1.5">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.book._id, item.quantity - 1, item.book.stock)
                            }
                            disabled={item.quantity <= 1}
                            className="text-gray-500 hover:text-gray-900 disabled:text-gray-200 transition-colors text-lg leading-none"
                          >
                            −
                          </button>
                          <span className="w-5 text-center font-semibold text-gray-900 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.book._id, item.quantity + 1, item.book.stock)
                            }
                            disabled={item.quantity >= item.book.stock}
                            className="text-gray-500 hover:text-gray-900 disabled:text-gray-200 transition-colors text-lg leading-none"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove + Wishlist */}
                        <div className="flex items-center gap-5">
                          <button
                            onClick={() => removeFromCart(item.book._id)}
                            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                            </svg>
                            Remove
                          </button>
                          <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            Add To Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate("/")}
                className="mt-4 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </button>
            </div>

            {/* Right — Order Summary */}
            <div className="sticky top-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Subtotal */}
                <div className="flex justify-between items-center mb-5 pb-5 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Subtotal</span>
                  <span className="font-bold text-gray-900">Rs. {cart.totalPrice}</span>
                </div>

                {/* Gift wrap */}
                <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4m16 0v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7m16 0l-2-5H6l-2 5M9 12V7m6 5V7M9 7a3 3 0 116 0" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Is this a gift ?</p>
                      <p className="text-xs text-gray-400">+ Rs. 15 for gift wrap</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-blue-600 cursor-pointer" />
                </div>

                {/* Discount note */}
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Discounts can be applied at the next window. Shipping costs will be calculated at the checkout page.
                </p>

                {/* Coupon note */}
                <div className="flex items-start gap-2 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-800">
                    Have a discount coupon? Apply it in the next step.
                  </p>
                </div>

                {/* Checkout button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm tracking-widest uppercase rounded-lg transition-all duration-150"
                >
                  Proceed to Checkout
                </button>

                {/* Payment options */}
                <div className="mt-5">
                  <p className="text-xs font-semibold text-gray-700 mb-3">Payment Options:</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Esewa*/}
                    <div className="border border-gray-200 rounded p-2 h-15 w-40 flex items-center justify-center">
                      <img src={esewa} alt="esewa" className="w-full h-full object-contain" />
                    </div>
                    {/* Cash on Delivery */}
                    <div className="border border-gray-200 rounded px-3 py-3 text-xs font-bold text-green-700 text-center leading-tight">
                      Cash on<br />Delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}