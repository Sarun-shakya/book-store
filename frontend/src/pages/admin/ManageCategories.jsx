import React, { useState, useEffect } from 'react'
import API from '../../api/axios'

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories')
      setCategories(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description?.toLowerCase().includes(search.toLowerCase())
  )

  // Add 
  const openAddModal = () => {
    setForm({ name: '', description: '' })
    setError('')
    setShowAddModal(true)
  }

  const handleAdd = async () => {
    if (!form.name.trim()) { setError('Name is required.'); return }
    setLoading(true)
    try {
      const res = await API.post('/categories', form)
      setCategories((prev) => [...prev, res.data.data])
      setShowAddModal(false)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add category.')
    } finally {
      setLoading(false)
    }
  }

  // Edit
  const openEditModal = (cat) => {
    setSelectedCategory(cat)
    setForm({ name: cat.name, description: cat.description || '' })
    setError('')
    setShowEditModal(true)
  }

  const handleEdit = async () => {
    if (!form.name.trim()) { setError('Name is required.'); return }
    setLoading(true)
    try {
      const res = await API.put(`/categories/${selectedCategory._id}`, form)
      setCategories((prev) =>
        prev.map((c) => (c._id === selectedCategory._id ? res.data.data : c))
      )
      setShowEditModal(false)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update category.')
    } finally {
      setLoading(false)
    }
  }

  // Delete 
  const handleDelete = async (cat) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${cat.name}"? This action cannot be undone.`
    )
    if (!confirmed) return
    try {
      await API.delete(`/categories/${cat._id}`)
      setCategories((prev) => prev.filter((c) => c._id !== cat._id))
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete category.')
    }
  }

  // Shared form input handler
  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  return (
    <div className=" bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]">

        {/* ── Header ── */}
        <div className="px-6 py-5  flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
              Manage Categories
            </h1>
            <p className="text-[15.2px] text-gray-400 mt-0.5">
              {categories.length} {categories.length === 1 ? 'category' : 'categories'} total
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-[15.2px] font-medium px-4 py-2.5 rounded-xl transition-colors duration-150 shadow-sm whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Category
          </button>
        </div>

        {/* ── Search ── */}
        <div className="px-6 py-4 ">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-[15.2px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-[15.2px] ">
            <thead>
              <tr className="bg-gray-100 text-left text-[15.2px] font-semibold text-black-700 uppercase tracking-wider">
                <th className="px-6 py-3 w-8">SN</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    {search ? `No results for "${search}"` : 'No categories yet. Add one to get started.'}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-indigo-50/40 transition-colors duration-100 group"
                  >
                    <td className="px-6 py-4 text-gray-400 tabular-nums">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {cat.description || <span className="italic text-gray-300">No description</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-[15.2px] font-medium transition-colors duration-150"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-[15.2px] font-medium transition-colors duration-150"
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

        {/* ── Footer count ── */}
        {filteredCategories.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-50 text-[15.2px] text-gray-400">
            Showing {filteredCategories.length} of {categories.length} categories
          </div>
        )}
      {/* </div> */}

      {/* ── Add Modal ─────────────────────────────────────────────────────── */}
      {showAddModal && (
        <Modal
          title="Add Category"
          onClose={() => setShowAddModal(false)}
          onConfirm={handleAdd}
          confirmLabel="Add Category"
          loading={loading}
          error={error}
          form={form}
          onChange={handleFormChange}
        />
      )}

      {/* ── Edit Modal ────────────────────────────────────────────────────── */}
      {showEditModal && (
        <Modal
          title="Edit Category"
          onClose={() => setShowEditModal(false)}
          onConfirm={handleEdit}
          confirmLabel="Save Changes"
          loading={loading}
          error={error}
          form={form}
          onChange={handleFormChange}
        />
      )}
    </div>
  )
}

/* ── Reusable Modal ──────────────────────────────────────────────────────── */
function Modal({ title, onClose, onConfirm, confirmLabel, loading, error, form, onChange }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-[15.2px] px-4 py-2.5 rounded-xl">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
            {error}
          </div>
        )}

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g. Electronics"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[15.2px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
            />
          </div>
          <div>
            <label className="block text-[15.2px] font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Brief description (optional)"
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[15.2px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-[15.2px] font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-[15.2px] font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            {loading && (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {loading ? 'Saving…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}