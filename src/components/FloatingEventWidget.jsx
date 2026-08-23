import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import upcomingEvents from '../data/events'

const FloatingEventWidget = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const nextEvent = upcomingEvents[0]

  useEffect(() => {
    // Delay entrance so it doesn't compete with page-load animations
    const timer = setTimeout(() => {
      if (!isDismissed) setIsVisible(true)
    }, 2500)
    return () => clearTimeout(timer)
  }, [isDismissed])

  if (isDismissed || !nextEvent) return null

  return (
    <div
      role="complementary"
      aria-label="Upcoming event notification"
      className={`
        fixed
        bottom-4
        right-4
        sm:bottom-6
        sm:right-6
        z-40
        w-[calc(100%-2rem)]
        max-w-xs
        sm:max-w-sm
        transition-all
        duration-500
        ease-out
        transform-gpu
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}
      `}
    >
      <div
        className="
          bg-[var(--surface)]
          border
          border-[var(--neutral-200)]
          rounded-2xl
          shadow-lg
          p-4
          sm:p-5
        "
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base" aria-hidden="true">📅</span>
            <span className="heading text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
              Upcoming Event
            </span>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => setIsDismissed(true), 400)
            }}
            aria-label="Dismiss upcoming event notification"
            className="
              w-7
              h-7
              rounded-lg
              flex
              items-center
              justify-center
              text-[var(--text-muted)]
              hover:text-[var(--text)]
              hover:bg-[var(--neutral-100)]
              transition-colors
              duration-200
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Event info */}
        <h3 className="heading text-base sm:text-lg font-bold text-[var(--text)] mb-1 leading-snug">
          {nextEvent.title}
        </h3>
        <p className="paragraph text-xs sm:text-sm text-[var(--text-secondary)] mb-3">
          {nextEvent.date.month} {nextEvent.date.day}, {nextEvent.date.year} · {nextEvent.time}
        </p>

        {/* CTA */}
        <Link
          to="/events"
          className="
            inline-flex
            items-center
            gap-1
            text-sm
            font-semibold
            text-[var(--secondary)]
            hover:text-[var(--secondary-hover)]
            transition-colors
            duration-200
          "
        >
          View Events
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default FloatingEventWidget
