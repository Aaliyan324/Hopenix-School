import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllEvents } from '../lib/events-service'
import { parseEventDate, getEventStatus } from '../lib/events-service'

const AdminDashboard = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const data = getAllEvents()
      if (!cancelled) {
        setEvents(data.sort((a, b) => new Date(a.date) - new Date(b.date)))
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Compute stats
  const stats = {
    total: events.length,
    published: events.filter((e) => e.published).length,
    drafts: events.filter((e) => !e.published).length,
    upcoming: events.filter((e) => getEventStatus(e.date) === 'upcoming').length,
    past: events.filter((e) => getEventStatus(e.date) === 'past').length,
  }

  const nextEvent = events.find((e) => getEventStatus(e.date) === 'upcoming' && e.published)
  const nextEventDate = nextEvent ? parseEventDate(nextEvent.date) : null

  const statCards = [
    { label: 'Total Events', value: stats.total, color: 'var(--text)' },
    { label: 'Published', value: stats.published, color: 'var(--success)' },
    { label: 'Drafts', value: stats.drafts, color: 'var(--warning)' },
    { label: 'Upcoming', value: stats.upcoming, color: 'var(--primary)' },
    { label: 'Past', value: stats.past, color: 'var(--text-muted)' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="heading text-2xl font-bold text-[var(--text)]">Dashboard</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[var(--neutral-100)] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="heading text-2xl font-bold text-[var(--text)]">Dashboard</h1>
        <Link
          to="/admin/events"
          className="
            px-5 py-2.5 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold
            hover:bg-[var(--secondary-hover)] transition-colors active:scale-95
          "
        >
          Manage Events
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-5 shadow-sm"
          >
            <p className="paragraph text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              {s.label}
            </p>
            <p className="heading text-3xl font-black" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Next event card */}
      <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 shadow-sm">
        <h2 className="heading text-lg font-bold text-[var(--text)] mb-4">Next Upcoming Event</h2>
        {nextEvent ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              className="
                flex flex-col items-center justify-center
                bg-[var(--secondary-light)] border border-[var(--secondary)]/20
                rounded-xl w-16 h-16 text-center shrink-0
              "
            >
              <span className="text-[10px] font-bold tracking-widest text-[var(--secondary-hover)] uppercase">
                {nextEventDate.month}
              </span>
              <span className="text-xl font-black text-[var(--text)]">{nextEventDate.day}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="heading text-xl font-bold text-[var(--text)] truncate">
                {nextEvent.title}
              </h3>
              <p className="paragraph text-sm text-[var(--text-secondary)] mt-0.5">
                {nextEvent.time} &middot; {nextEvent.location}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--success-light)] text-[var(--success)] text-xs font-semibold shrink-0">
              Published
            </span>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="paragraph text-[var(--text-muted)] mb-4">
              No upcoming published events.
            </p>
            <Link
              to="/admin/events"
              className="text-sm font-semibold text-[var(--secondary)] hover:text-[var(--secondary-hover)] transition-colors"
            >
              Create an event &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Recent events */}
      {events.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 shadow-sm">
          <h2 className="heading text-lg font-bold text-[var(--text)] mb-4">Recent Events</h2>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => {
              const d = parseEventDate(event.date)
              const status = getEventStatus(event.date)
              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-4 py-2 border-b border-[var(--neutral-100)] last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-bold text-[var(--text)] truncate">
                      {event.title}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] shrink-0 hidden sm:inline">
                      {d.month} {d.day}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
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
                      {event.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
