import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link } from "react-router";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")
  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, catsRes] = await Promise.all([
          API.get("/books"),
          API.get("/categories"),
        ]);
        setBooks(booksRes.data.data || []);
        setCategories(catsRes.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (book) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await API.delete(`/books/${book._id}`);
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete book.");
    }
  };

  const filtered = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || book.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openEditModal = (book) => {
    setSelectedBook(book)
    setEditForm({
      title: book.title,
      author: book.author,
      price: book.price,
      pages: book.pages,
      stock: book.stock,
      category: book.category?._id || "",
      description: book.description || "",
    })
    setEditError("")
    setShowEditModal(true)
  }

  const handleEdit = async () => {
    if (!editForm.title || !editForm.author || !editForm.price) {
      setEditError("Title, author, and price are required.")
      return
    }
    setEditLoading(true)
    try {
      const res = await API.put(`/books/${selectedBook._id}`, editForm)
      setBooks((prev) =>
        prev.map((b) => (b._id === selectedBook._id ? res.data.data : b))
      )
      setShowEditModal(false)
    } catch (err) {
      setEditError(err?.response?.data?.message || "Failed to update book.")
    } finally {
      setEditLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 text-[15.2px]">
          <svg className="animate-spin w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading books…
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]">

      {/* ── Header ── */}
      <div className=" px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Manage Books</h1>
          <p className="text-[15.2px] text-gray-400 mt-0.5">
            {books.length} {books.length === 1 ? "book" : "books"} in catalog
          </p>
        </div>
        <Link
          to="/admin/add-book"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-[15.2px] font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Book
        </Link>
      </div>

      {/* ── Filters ── */}
      <div className="px-6 py-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by title or author…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-[15.2px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative sm:w-52">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-[15.2px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition cursor-pointer"
          >
            <option value="">All Categories</option>
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

        {/* Clear filters */}
        {(search || selectedCategory) && (
          <button
            onClick={() => { setSearch(""); setSelectedCategory(""); }}
            className="text-[15.2px] text-indigo-600 hover:text-indigo-800 font-medium px-3 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto p-6">
        <table className="w-full text-[15.2px]">
          <thead>
            <tr className="bg-gray-100 text-left text-[15.2px] font-semibold text-black-700 uppercase tracking-wider">
              <th className="px-6 py-3 w-8">SN</th>
              <th className="px-6 py-3">Book</th>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  {search || selectedCategory
                    ? "No books match your filters."
                    : "No books yet. Add one to get started."}
                </td>
              </tr>
            ) : (
              filtered.map((book, idx) => (
                <tr key={book._id} className="hover:bg-indigo-50/40 transition-colors duration-100 group">
                  <td className="px-6 py-4 text-gray-400 tabular-nums">{idx + 1}</td>

                  {/* Book with image */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {book.image ? (
                        <img
                          src={book.image.url}
                          alt={book.title}
                          className="w-9 h-12 object-cover rounded-lg border border-gray-100 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                        </div>
                      )}
                      <span className="font-medium text-gray-800 leading-snug">{book.title}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-500">{book.author}</td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[15.2px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {book.category?.name || "Uncategorized"}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold text-emerald-600 tabular-nums">
                    Rs. {book.price}
                  </td>

                  <td className="px-6 py-4 text-gray-500 tabular-nums">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[15.2px] font-medium ${book.stock > 10
                      ? "bg-green-50 text-green-700"
                      : book.stock > 0
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-600"
                      }`}>
                      {book.stock ?? "—"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(book)}
                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-[15.2px] font-medium transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book)}
                        className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-[15.2px] font-medium transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      {filtered.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-50 text-[15.2px] text-gray-400">
          Showing {filtered.length} of {books.length} books
        </div>
      )}


      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Edit Book</h2>
              <button onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Error */}
            {editError && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-[15.2px] px-4 py-2.5 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                </svg>
                {editError}
              </div>
            )}

            {/* Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">Title <span className="text-red-400">*</span></label>
                  <input type="text" value={editForm.title}
                    onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[15.2px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition" />
                </div>
                <div>
                  <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">Author <span className="text-red-400">*</span></label>
                  <input type="text" value={editForm.author}
                    onChange={(e) => setEditForm((p) => ({ ...p, author: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[15.2px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition" />
                </div>
              </div>

              <div>
                <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">Description</label>
                <textarea rows={3} value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[15.2px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition resize-none" />
              </div>

              <div>
                <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">Category</label>
                <div className="relative">
                  <select value={editForm.category}
                    onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 pr-9 py-2.5 text-[15.2px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition cursor-pointer">
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">Price <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[15.2px] pointer-events-none">Rs.</span>
                    <input type="number" value={editForm.price} min="0"
                      onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-[15.2px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">Pages</label>
                  <input type="number" value={editForm.pages} min="1"
                    onChange={(e) => setEditForm((p) => ({ ...p, pages: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[15.2px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition" />
                </div>
                <div>
                  <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">Stock</label>
                  <input type="number" value={editForm.stock} min="0"
                    onChange={(e) => setEditForm((p) => ({ ...p, stock: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[15.2px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)}
                className="px-4 py-2.5 text-[15.2px] font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleEdit} disabled={editLoading}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-[15.2px] font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm">
                {editLoading && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {editLoading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}