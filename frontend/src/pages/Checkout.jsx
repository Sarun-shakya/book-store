import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import esewaIcon from "../assets/images/esewaIcon.png";
import cod from "../assets/images/cod.png";
import { MdOutlinePayment } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      toast.error("Please login to continue");
      navigate("/login");
    }
  }, [authLoading, isLoggedIn, navigate]);



  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchCart = async () => {
      try {
        const res = await API.get("/cart", {
          withCredentials: true,
        });
        setCart(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, [isLoggedIn]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const placeOrder = async () => {
    if (!form.fullName || !form.phone || !form.address || !form.city) {
      toast.error("Please fill all shipping details");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post(
        "/orders/",
        { paymentMethod, shippingAddress: form },
        { withCredentials: true }
      );

      if (paymentMethod === "cod") {
        toast.success("Order placed successfully");
        navigate("/success");
        return;
      }

      if (paymentMethod === "esewa") {
        const { payment_url, payment_data } = res.data;
        const formElement = document.createElement("form");
        formElement.method = "POST";
        formElement.action = payment_url;
        Object.keys(payment_data).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = payment_data[key];
          formElement.appendChild(input);
        });
        document.body.appendChild(formElement);
        formElement.submit();
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !cart)
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-stone-500 text-sm tracking-wide">Loading your cart…</p>
        </div>
      </div>
    );

  const shippingFee = 0;
  const total = cart.totalPrice + shippingFee;

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Main Layout */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* ── LEFT: Shipping + Payment ── */}
          <div className="space-y-6">

            {/* Shipping Details Card */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold"><FaRegAddressCard /></span>
                <h2 className="text-base font-semibold text-stone-800">Shipping Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Full Name</label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      placeholder="John Doe"
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Phone Number</label>
                    <input
                      name="phone"
                      value={form.phone}
                      placeholder="98XXXXXXXX"
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Street Address</label>
                  <input
                    name="address"
                    value={form.address}
                    placeholder="Thamel, Near XXX"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">City</label>
                  <input
                    name="city"
                    value={form.city}
                    placeholder="Kathmandu"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold"><MdOutlinePayment /></span>
                <h2 className="text-base font-semibold text-stone-800">Payment Method</h2>
              </div>
              <div className="p-6 space-y-3">
                {[
                  {
                    value: "cod",
                    label: "Cash on Delivery",
                    desc: "Pay when your order arrives",
                    icon: cod,
                  },
                  {
                    value: "esewa",
                    label: "eSewa",
                    desc: "Pay securely via eSewa wallet",
                    icon: esewaIcon,
                  },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.value
                      ? "border-stone-800 bg-stone-50"
                      : "border-stone-200 hover:border-stone-300"
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl h-10 w-10"><img src={method.icon} alt="icon" /></span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-stone-800">{method.label}</p>
                      <p className="text-xs text-stone-500">{method.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === method.value
                        ? "border-stone-800"
                        : "border-stone-300"
                        }`}
                    >
                      {paymentMethod === method.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-stone-800" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="lg:sticky lg:top-6 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100">
                <h2 className="text-base font-semibold text-stone-800">Order Summary</h2>
                <p className="text-xs text-stone-400 mt-0.5">{cart.items.length} item{cart.items.length !== 1 ? "s" : ""}</p>
              </div>

              {/* Items */}
              <ul className="divide-y divide-stone-100">
                {cart.items.map((item) => (
                  <li key={item.book._id} className="px-6 py-4 flex items-start gap-3">
                    <div className="w-10 h-14 bg-stone-100 rounded-md flex items-center justify-center text-stone-400 text-xs shrink-0 overflow-hidden">
                      {item.book.image.url ? (
                        <img src={item.book.image.url} alt={item.book.title} className="w-full h-full object-cover" />
                      ) : (
                        "📖"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{item.book.title}</p>
                      <p className="text-xs text-stone-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-stone-800 shrink-0">
                      Rs. {(item.book.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="px-6 py-4 border-t border-stone-100 space-y-3">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>Rs. {cart.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Shipping</span>
                  <span>Rs. {shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-800 pt-3 border-t border-stone-200">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-semibold tracking-wide hover:bg-stone-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      {paymentMethod === "esewa" ? "Pay with eSewa →" : "Place Order →"}
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}