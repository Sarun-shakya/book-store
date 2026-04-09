import React, { useEffect, useState, useCallback } from 'react'
import Card from '../components/Card'
import API from '../utils/axios'

const PRICE_RANGES = [
  { label: 'All Prices', min: null, max: null },
  { label: 'Under Rs. 200', min: 0, max: 200 },
  { label: 'Rs. 200 – Rs.500', min: 200, max: 500 },
  { label: 'Rs. 500 – Rs.1000', min: 500, max: 1000 },
  { label: 'Over Rs. 1000', min: 1000, max: null },
]

export default function Books() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPrice, setSelectedPrice] = useState(0) 

  // Fetch categories 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories')
        setCategories(res.data.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    };
    fetchCategories();
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.append('q', search.trim())
      if (selectedCategory) params.append('category', selectedCategory)

      const priceRange = PRICE_RANGES[selectedPrice]
      if (priceRange.min !== null) params.append('minPrice', priceRange.min)
      if (priceRange.max !== null) params.append('maxPrice', priceRange.max)

      const query = params.toString()
      const url = query ? `/books/search?${query}` : '/books'
      const res = await API.get(url)
      setBooks(res.data.data)
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }, [search, selectedCategory, selectedPrice])

  // Debounce search input, instant for filter changes
  useEffect(() => {
    const delay = search ? 400 : 0
    const timer = setTimeout(() => fetchBooks(), delay)
    return () => clearTimeout(timer)
  }, [fetchBooks, search])

  const handleSearchChange = (e) => setSearch(e.target.value)

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setSelectedPrice(0)
  }

  const hasActiveFilters = search || selectedCategory || selectedPrice !== 0

  return (
    <div className="max-w-7xl mx-auto px-0 py-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search books by title, author..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar — Filters */}
        <aside className="w-56 shrink-0">
          <div className="sticky top-6 border border-gray-200 rounded-lg p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-gray-700">Filters</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Category
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                      selectedCategory === ''
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      onClick={() => setSelectedCategory(cat._id)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                        selectedCategory === cat._id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Price Range
              </h3>
              <ul className="space-y-1">
                {PRICE_RANGES.map((range, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => setSelectedPrice(idx)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                        selectedPrice === idx
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {range.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Books</h1>
            {!loading && (
              <p className="text-sm text-gray-500">{books.length} result{books.length !== 1 ? 's' : ''}</p>
            )}
          </div>

          {loading ? (
            <p className="text-gray-500">Loading books...</p>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <Card
                  key={book._id}
                  id={book._id}
                  title={book.title}
                  author={book.author}
                  genre={book.category.name}
                  price={book.price}
                  originalPrice={book.price + book.price*(10/100)}
                  badge="Sale"
                  image={book.image.url}
                  onAddToCart={(book) => console.log(book)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No books found.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-2 text-blue-500 hover:underline text-sm">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}