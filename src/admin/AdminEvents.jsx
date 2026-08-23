import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import {
  getAllEvents,
  deleteEvent as deleteEventService,
  togglePublish,
  toggleFeatured,
  parseEventDate,
  getEventStatus,
} from '../lib/events-service'
import Modal from './Modal'
import EventForm from './EventForm'

const AdminEvents = () => {
  const { addToast } = useToast()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all | upcoming | past | today
  const [filterPublish, setFilterPublish] = useState('all') // all | published | draft

  // Modals
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadEvents = () => {
    const data = getAllEvents()
    setEvents(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
    setLoading(false)
  }

  useEffect(() => {
    function load() {
      const data = getAllEvents()
      setEvents(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
      setLoading(false)
    }
    load()
  }, [])

  // Filtered events
  const filtered = events.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || getEventStatus(e.date) === filterStatus
    const matchPublish = filterPublish === 'all' ||
      (filterPublish === 'published' && e.published) ||
      (filterPublish === 'draft' && !e.published)
    return matchSearch && matchStatus && matchPublish
  })

  // Handlers
  const handleTogglePublish = async (event) => {
    try {
      await togglePublish(event.id, !event.published)
      addToast(`Event ${event.published ? 'unpublished' : 'published'}`, 'success')
      loadEvents()
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const handleToggleFeatured = async (event) => {
    try {
      await toggleFeatured(event.id, !event.featured)
      addToast(`Event ${event.featured ? 'unfeatured' : 'featured'}`, 'success')
      loadEvents()
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteEventService(deleteTarget.id)
      addToast(`"${deleteTarget.title}" deleted`, 'success')
      setDeleteTarget(null)
      loadEvents()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingEvent(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    loadEvents()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="heading text-2xl font-bold text-[var(--text)]">Events</h1>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-[var(--neutral-100)] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="heading text-2xl font-bold text-[var(--text)]">Events</h1>
        <button
          onClick={() => { setEditingEvent(null); setFormOpen(true) }}
          className="
            px-5 py-2.5 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold
            hover:bg-[var(--secondary-hover)] transition-colors active:scale-95
            flex items-center gap-2 shrink-0
          "
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Event
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--neutral-200)]
              bg-[var(--surface)] text-sm paragraph text-[var(--text)]
              placeholder-[var(--text-light)]
              focus:outline-none focus:border-[var(--secondary)] transition-colors
            "
          />
        </div>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="
            px-4 py-2.5 rounded-xl border border-[var(--neutral-200)]
            bg-[var(--surface)] text-sm paragraph text-[var(--text)]
            focus:outline-none focus:border-[var(--secondary)] transition-colors
          "
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="today">Today</option>
          <option value="past">Past</option>
        </select>

        {/* Publish filter */}
        <select
          value={filterPublish}
          onChange={(e) => setFilterPublish(e.target.value)}
          className="
            px-4 py-2.5 rounded-xl border border-[var(--neutral-200)]
            bg-[var(--surface)] text-sm paragraph text-[var(--text)]
            focus:outline-none focus:border-[var(--secondary)] transition-colors
          "
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* Events list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl">
          {events.length === 0 ? (
            <>
              <div className="text-4xl mb-3">📅</div>
              <p className="heading text-lg font-bold text-[var(--text)] mb-1">No events yet</p>
              <p className="paragraph text-sm text-[var(--text-muted)] mb-4">
                Create your first school event to get started.
              </p>
              <button
                onClick={() => { setEditingEvent(null); setFormOpen(true) }}
                className="px-5 py-2.5 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--secondary-hover)] transition-colors"
              >
                + Create Event
              </button>
            </>
          ) : (
            <p className="paragraph text-sm text-[var(--text-muted)]">No events match your filters.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => {
            const d = parseEventDate(event.date)
            const status = getEventStatus(event.date)
            return (
              <div
                key={event.id}
                className="
                  bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl
                  p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow
                "
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Date block */}
                  <div
                    className="
                      flex flex-col items-center justify-center
                      bg-[var(--secondary-light)] border border-[var(--secondary)]/20
                      rounded-xl w-14 h-14 text-center shrink-0
                    "
                  >
                    <span className="text-[9px] font-bold tracking-widest text-[var(--secondary-hover)] uppercase">
                      {d.month}
                    </span>
                    <span className="text-lg font-black text-[var(--text)]">{d.day}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="heading text-base font-bold text-[var(--text)] truncate">
                        {event.title}
                      </h3>
                      {event.featured && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[var(--secondary-light)] text-[var(--secondary)]">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="paragraph text-xs text-[var(--text-secondary)] mt-0.5">
                      {event.time} &middot; {event.location}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          status === 'upcoming'
                            ? 'bg-[var(--primary-light)] text-[var(--tertiary)]'
                            : status === 'today'
                              ? 'bg-[var(--success-light)] text-[var(--success)]'
                              : 'bg-[var(--neutral-100)] text-[var(--text-muted)]'
                        }`}
                      >
                        {status}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          event.published
                            ? 'bg-[var(--success-light)] text-[var(--success)]'
                            : 'bg-[var(--warning-light)] text-[var(--warning)]'
                        }`}
                      >
                        {event.published ? 'Published' : 'Draft'}
                      </span>
                      {event.category && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[var(--neutral-100)] text-[var(--text-muted)]">
                          {event.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleTogglePublish(event)}
                      aria-label={event.published ? 'Unpublish event' : 'Publish event'}
                      title={event.published ? 'Unpublish' : 'Publish'}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--neutral-100)] hover:text-[var(--text)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {event.published ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(event)}
                      aria-label={event.featured ? 'Remove featured' : 'Make featured'}
                      title={event.featured ? 'Unfeature' : 'Feature'}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        event.featured
                          ? 'text-[var(--secondary)] hover:bg-[var(--secondary-light)]'
                          : 'text-[var(--text-muted)] hover:bg-[var(--neutral-100)] hover:text-[var(--text)]'
                      }`}
                    >
                      <svg className="w-4 h-4" fill={event.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(event)}
                      aria-label="Edit event"
                      title="Edit"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--neutral-100)] hover:text-[var(--text)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(event)}
                      aria-label="Delete event"
                      title="Delete"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--error-light)] hover:text-[var(--error)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Event form modal */}
      <Modal
        isOpen={formOpen}
        onClose={handleFormClose}
        title={editingEvent ? 'Edit Event' : 'Create Event'}
        size="lg"
      >
        <EventForm
          event={editingEvent}
          onSuccess={handleFormSuccess}
          onCancel={handleFormClose}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Event"
        size="sm"
      >
        <div className="text-center">
          <div className="text-4xl mb-3">🗑️</div>
          <p className="paragraph text-sm text-[var(--text-secondary)] mb-1">
            Are you sure you want to delete
          </p>
          <p className="heading text-lg font-bold text-[var(--text)] mb-2">
            &ldquo;{deleteTarget?.title}&rdquo;?
          </p>
          <p className="paragraph text-xs text-[var(--text-muted)] mb-6">
            This action cannot be undone. The event will be permanently removed.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-5 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--neutral-100)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-5 py-2.5 rounded-xl bg-[var(--error)] text-white text-sm font-semibold hover:bg-[var(--error)]/90 transition-colors disabled:opacity-60"
            >
              {deleting ? 'Deleting...' : 'Delete Event'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminEvents
