import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../api/axios";

export default function Success() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const data = params.get("data");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await API.get(
          `/orders/esewa/success?orderId=${orderId}&data=${data}`
        );
      } catch (error) {
        console.error(error);
      }
    };

    if (orderId && data) {
      verifyPayment();
    }
  }, [orderId, data]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 px-6 py-10 sm:px-10 sm:py-12 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-emerald-50">
            <svg
              className="h-14 w-14 sm:h-16 sm:w-16 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-stone-900">
            Payment successful
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-500">
            Your order has been placed and is now being processed.
          </p>

          {orderId && (
            <p className="mt-4 inline-block rounded-full bg-stone-100 px-4 py-1.5 text-xs sm:text-sm font-medium text-stone-600">
              Order #{orderId.slice(-6).toUpperCase()}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/books"
              className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Browse more books
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
            >
              View my orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}