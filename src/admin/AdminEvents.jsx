import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import apiClient from '../lib/apiClient'
import Modal from './Modal'

const AdminEvents = () => {
  const { addToast } = useToast()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [filterPublish, setFilterPublish] = useState('all')

  // Form Modal
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Form Fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [published, setPublished] = useState(true)

  const loadEvents = async () => {
    try {
      const res = await apiClient.get('/api/events', { all: 'true' })
      if (res.success) {
        setEvents(res.data || [])
      }
    } catch (err) {
      console.error('Failed to load events:', err)
      addToast?.('Error loading events from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleOpenForm = (evt = null) => {
    if (evt) {
      setEditingEvent(evt)
      setTitle(evt.title)
      setDescription(evt.description)
      setEventDate(evt.eventDate)
      setLocation(evt.location)
      setImageUrl(evt.imageUrl || '')
      setPublished(evt.published)
    } else {
      setEditingEvent(null)
      setTitle('')
      setDescription('')
      setEventDate(new Date().toISOString().split('T')[0])
      setLocation('Main Campus')
      setImageUrl('')
      setPublished(true)
    }
    setFormOpen(true)
  }

  const handleSaveEvent = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingEvent) {
        const res = await apiClient.put('/api/events', {
          id: editingEvent.id,
          title,
          description,
          eventDate,
          location,
          imageUrl,
          published,
        })
        if (res.success) {
          addToast?.('Event updated successfully!', 'success')
          setFormOpen(false)
          loadEvents()
        }
      } else {
        const res = await apiClient.post('/api/events', {
          title,
          description,
          eventDate,
          location,
          imageUrl,
          published,
        })
        if (res.success) {
          addToast?.('Event created successfully!', 'success')
          setFormOpen(false)
          loadEvents()
        }
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to save event', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleTogglePublish = async (evt) => {
    try {
      const res = await apiClient.put('/api/events', { id: evt.id, published: !evt.published })
      if (res.success) {
        addToast?.(`Event ${!evt.published ? 'published' : 'unpublished'}`, 'success')
        loadEvents()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to update event', 'error')
    }
  }

  const handleDeleteEvent = async () => {
    if (!deleteTarget) return
    try {
      const res = await apiClient.delete('/api/events', { id: deleteTarget.id })
      if (res.success) {
        addToast?.('Event deleted', 'success')
        setDeleteTarget(null)
        loadEvents()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to delete event', 'error')
    }
  }

  const filtered = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase())
    const matchPublish =
      filterPublish === 'all' ||
      (filterPublish === 'published' && e.published) ||
      (filterPublish === 'draft' && !e.published)
    return matchSearch && matchPublish
  })

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-[var(--text-muted)] font-medium">Loading SQL events database...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading text-2xl font-black text-[var(--text)]">Events Management</h1>
          <p className="paragraph text-xs text-[var(--text-muted)] mt-1">
            Manage school events stored in PostgreSQL database.
          </p>
        </div>
        <button
          onClick={() => handleOpenForm(null)}
          className="px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 shadow-sm self-start sm:self-auto"
        >
          ➕ Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border text-xs bg-white"
        />
        <select
          value={filterPublish}
          onChange={(e) => setFilterPublish(e.target.value)}
          className="px-4 py-2 rounded-xl border text-xs bg-white"
        >
          <option value="all">All Events</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((evt) => (
          <div key={evt.id} className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-base text-slate-900">{evt.title}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    evt.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {evt.published ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-1">{evt.description}</p>
              <div className="text-[11px] text-slate-400 font-medium">
                📅 {evt.eventDate} • 📍 {evt.location}
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleTogglePublish(evt)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                {evt.published ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => handleOpenForm(evt)}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-xs font-bold text-[var(--primary)] hover:bg-blue-100"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteTarget(evt)}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Form */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
            <form onSubmit={handleSaveEvent} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pub"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                <label htmlFor="pub" className="font-bold text-slate-700">
                  Publish Immediately
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-bold"
                >
                  {submitting ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <Modal isOpen={true} onClose={() => setDeleteTarget(null)} title="Delete Event" size="sm">
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900 mb-4">Delete "{deleteTarget.title}"?</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminEvents
