import React, { useEffect, useState } from 'react'
import API from '../../api/axios'
import { toast } from "react-toastify";
import { useNavigate } from 'react-router';


export default function AddBook() {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [pages, setPages] = useState("")
  const [stock, setStock] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories")
        setCategories(res.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCategories()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description || !author || !price || !pages || !category || !stock || !image) {
      setError("Please fill all required fields")
      return
    }

    setError("")
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("author", author)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("pages", pages)
      formData.append("stock", stock)
      formData.append("category", category)
      formData.append("image", image)

      const res = await API.post("/books", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      toast.success(res.data.message || "Book added!");

      setTitle("");
      setAuthor("");
      setDescription("");
      setPrice("");
      setPages("");
      setStock("");
      setCategory("");
      setImage(null);
      setImagePreview(null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"

  const labelClass = "block text-sm font-medium text-black-700 mb-1.5"

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-6">

      {/* Page Header */}
      <div className="mb-6 px-6">
        <h1 className="text-3xl font-semibold text-black-800 tracking-tight">Add New Book</h1>
        <p className="text-sm text-gray-400 mt-0.5">Fill in the details below to add a book to the catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className=" overflow-hidden">

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-6 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
            {error}
          </div>
        )}

        <div className="p-6 space-y-6">

          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="title" className={labelClass}>
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title of the book"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="author" className={labelClass}>
                Author <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author of the book"
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter the description"
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className={labelClass}>
              Category <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${inputClass} appearance-none pr-10 cursor-pointer`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

          {/* Price, Pages, Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label htmlFor="price" className={labelClass}>
                Price <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`${inputClass} pl-7`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="pages" className={labelClass}>
                Pages <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="pages"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="e.g. 320"
                min="1"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="stock" className={labelClass}>
                Stock <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g. 50"
                min="0"
                className={inputClass}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass}>
              Cover Image <span className="text-red-400">*</span>
            </label>

            <div className="flex items-start gap-4">
              {/* Preview */}
              {imagePreview ? (
                <div className="relative shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => { setImage(null); setImagePreview(null) }}
                    className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-0.5 text-gray-500 hover:text-red-500 hover:border-red-300 transition shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="shrink-0 w-24 h-32 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008v.008H13.5V12zm0 0H12m1.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                </div>
              )}

              {/* Drop zone */}
              <label
                htmlFor="image"
                className="flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 rounded-xl px-4 py-6 cursor-pointer transition-colors"
              >
                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <div className="text-center">
                  <p className="text-sm font-medium text-indigo-600">Click to upload</p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                </div>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            Fields marked <span className="text-red-400">*</span> are required
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? "Adding…" : "Add Book"}
            </button>
          </div>
        </div>
      </form>
      {/* </div> */}
    </div>
  )
}