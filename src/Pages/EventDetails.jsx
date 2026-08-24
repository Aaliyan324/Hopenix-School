import { useParams, Link } from 'react-router-dom'
import { useEvents, parseEventDate } from '../lib/events-service'
import Breadcrumbs from '../components/Breadcrumbs'

const EventDetails = () => {
  const { id } = useParams()
  const { events, loading } = useEvents()

  if (loading) {
    return (
      <section className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-32 h-4 bg-[var(--neutral-200)] rounded-full animate-pulse mb-4" />
          <div className="w-64 h-8 bg-[var(--neutral-200)] rounded-full animate-pulse mb-3" />
          <div className="w-48 h-4 bg-[var(--neutral-200)] rounded-full animate-pulse" />
        </div>
      </section>
    )
  }

  const event = events.find((e) => e.id === id)

  if (!event) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Events', link: '/events' }, { label: 'Event Not Found' }]} />
        <section className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--error-light)] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="heading text-2xl sm:text-3xl font-bold text-[var(--text)] mb-3">Event Not Found</h2>
          <p className="paragraph text-base text-[var(--text-secondary)] mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="inline-block px-8 py-3 rounded-full bg-[var(--secondary)] text-white font-semibold hover:bg-[var(--secondary-hover)] transition-colors">
            Back to Events
          </Link>
        </section>
      </>
    )
  }

  const parsed = parseEventDate(event.dateString || event.date)
  const relatedEvents = events.filter((e) => e.id !== event.id).slice(0, 3)

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Events', link: '/events' }, { label: event.title }]} />

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Event Header */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-3 mb-4">
            {event.category && (
              <span className="paragraph bg-[var(--secondary-light)] text-[var(--secondary-hover)] text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-md border border-[var(--secondary)]/20">
                {event.category}
              </span>
            )}
            <span className="paragraph text-sm text-[var(--text-muted)]">
              {parsed.month} {parsed.day}, {parsed.year}
            </span>
          </div>
          <h1 className="heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text)] mb-4 leading-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
            {event.time && <span>🕒 {event.time}</span>}
            {event.location && <span>📍 {event.location}</span>}
          </div>
        </div>

        {/* Event Image */}
        {event.image && (
          <div className="rounded-2xl overflow-hidden mb-10 h-[300px] sm:h-[400px] bg-[var(--neutral-200)]">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Event Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-4">About This Event</h2>
              <p className="paragraph text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {event.description || event.shortDescription}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="heading text-lg font-bold text-[var(--text)] mb-4">Event Details</h3>
              <div className="space-y-4">
                {event.date && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--secondary)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="paragraph text-xs font-semibold text-[var(--text-muted)] uppercase">Date</p>
                      <p className="paragraph text-sm text-[var(--text)]">{parsed.month} {parsed.day}, {parsed.year}</p>
                    </div>
                  </div>
                )}
                {event.time && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--secondary)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="paragraph text-xs font-semibold text-[var(--text-muted)] uppercase">Time</p>
                      <p className="paragraph text-sm text-[var(--text)]">{event.time}</p>
                    </div>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--secondary)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="paragraph text-xs font-semibold text-[var(--text-muted)] uppercase">Location</p>
                      <p className="paragraph text-sm text-[var(--text)]">{event.location}</p>
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/events"
                className="mt-6 w-full text-center block px-6 py-3 rounded-full bg-[var(--secondary)] text-white font-semibold hover:bg-[var(--secondary-hover)] transition-colors"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-16">
            <h2 className="heading text-2xl font-bold text-[var(--text)] mb-6">Related Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relEvent) => {
                const relParsed = parseEventDate(relEvent.dateString || relEvent.date)
                return (
                  <Link
                    key={relEvent.id}
                    to={`/events/${relEvent.id}`}
                    className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300"
                  >
                    <span className="paragraph text-xs font-semibold text-[var(--text-muted)] uppercase">{relParsed.month} {relParsed.day}, {relParsed.year}</span>
                    <h3 className="heading text-lg font-bold text-[var(--text)] mt-1 mb-2">{relEvent.title}</h3>
                    <p className="paragraph text-sm text-[var(--text-secondary)] line-clamp-2">{relEvent.shortDescription || relEvent.description?.slice(0, 100)}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default EventDetails
