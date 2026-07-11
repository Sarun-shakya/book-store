import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useCart } from '../context/cartContext'
import { useAuth } from '../context/authContext'
import { toast } from 'react-toastify'

export default function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [book, setBook] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedMsg, setAddedMsg] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await API.get(`/books/${id}`)
        setBook(res.data.data)
      } catch (err) {
        console.error('Error fetching book details:', err)
        setError('Failed to load book details.')
      } finally {
        setLoading(false)
      }
    }
    fetchBookDetails()
  }, [id])

  const handleBuyNow = async () => {
    try {
      await addToCart(id, quantity);
      navigate("/checkout");
    } catch (err) {
      console.log(err);
    }
  };

  const discountedPrice = book
    ? Math.round(book.price * 0.8)
    : null

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <svg className="w-10 h-10 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        <p className="text-sm">Loading book details...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-red-500">
        <p className="text-lg font-medium">{error}</p>
        <Link to="/books" className="mt-4 inline-block text-sm text-orange-700 underline">
          Back to books
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-orange-700 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/books" className="hover:text-orange-700 transition-colors">Books</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{book.title}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Book Image */}
          <div className="  flex items-center justify-center w-100 aspect-[3/4] mx-auto">
            {book.image?.url ? (
              <img
                src={book.image.url}
                alt={book.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-300">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex flex-col gap-5">

            {/* Category badge */}
            {/* <span className="inline-flex items-center bg-amber-50 text-amber-800 text-xs font-medium px-3 py-1 rounded-full w-fit">
              {book.category?.name}
            </span> */}

            {/* Title & Author */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {book.title}
              </h1>
              <p className="mt-1.5 text-sm text-gray-500">
                by <span className="text-gray-700 font-medium">{book.author}</span>
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-orange-700">
                Rs. {discountedPrice}
              </span>
              <span className="text-base text-gray-400 line-through">
                Rs. {book.price}
              </span>
              <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-md">
                20% OFF
              </span>
            </div>

            <hr className="border-gray-100" />

            {/* Meta info */}
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] uppercase tracking-wide text-gray-400">Pages</span>
                <span className="text-sm font-medium text-gray-700">{book.pages}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] uppercase tracking-wide text-gray-400">Category</span>
                <span className="text-sm font-medium text-gray-700">{book.category?.name}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] uppercase tracking-wide text-gray-400">Availability</span>
                <span className="text-sm font-medium text-green-600">In Stock</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-4">
              {book.description}
            </p>

            {/* Quantity */}
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Quantity</p>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 border border-gray-200 rounded-l-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg"
                >
                  −
                </button>
                <div className="w-11 h-9 border-t border-b border-gray-200 flex items-center justify-center text-gray-900 font-medium text-sm">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-9 h-9 border border-gray-200 rounded-r-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Added to cart message */}
            {addedMsg && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Added to cart successfully!
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                // onClick={handleAddToCart}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-5 border-2 border-orange-700 text-orange-700 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors"
                onClick={
                  (e) => {
                    e.stopPropagation();
                    if (!user) {
                      toast.error("Please login first");
                      navigate("/login");
                      return;
                    }
                    addToCart(id, quantity);
                  }
                }
              >
                Add to Cart
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {/* {isInCart(book._id) ? 'Add more' : 'Add to cart'} */}
              </button>

              <button
                // onClick={handleBuyNow}
                className="flex-1 min-w-[140px] py-3 px-5 bg-orange-700 hover:bg-orange-800 text-white rounded-lg font-semibold text-sm transition-colors"
                onClick={handleBuyNow}
              >
                Buy now
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}