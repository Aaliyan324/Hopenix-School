import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEvents } from '../lib/events-service'

gsap.registerPlugin(ScrollTrigger)

const Events = () => {
  const sectionRef = useRef(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const { events: upcomingEvents, loading } = useEvents()

  // Nearest event countdown target (first event in data)
  const nearestEvent = upcomingEvents[0]

  useEffect(() => {
    if (!nearestEvent?.dateString) return
    const targetTime = new Date(nearestEvent.dateString).getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [nearestEvent?.dateString])

  useLayoutEffect(() => {
    if (loading || upcomingEvents.length === 0) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const animatedElements = [
        '.event-header-group',
        '.event-countdown-card',
        '.event-row',
      ]

      gsap.set(animatedElements, { willChange: 'transform, opacity' })
      gsap.set('.event-header-group', { y: 30, opacity: 0 })
      gsap.set('.event-countdown-card', { y: 35, opacity: 0 })
      gsap.set('.event-row', { y: 40, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.event-header-group', { y: 0, opacity: 1, duration: 0.8 })
        .to('.event-countdown-card', { y: 0, opacity: 1, duration: 0.75 }, '-=0.4')
        .to(
          '.event-row',
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: { each: 0.15, from: 'start' },
          },
          '-=0.4'
        )

      const rows = gsap.utils.toArray('.event-row')

      rows.forEach((row) => {
        const hoverIn = () => {
          gsap.to(row, { x: 8, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
        }
        const hoverOut = () => {
          gsap.to(row, { x: 0, duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
        }

        row.addEventListener('mouseenter', hoverIn)
        row.addEventListener('mouseleave', hoverOut)

        row._eventHoverIn = hoverIn
        row._eventHoverOut = hoverOut
      })

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })

      return () => {
        rows.forEach((row) => {
          row.removeEventListener('mouseenter', row._eventHoverIn)
          row.removeEventListener('mouseleave', row._eventHoverOut)
          delete row._eventHoverIn
          delete row._eventHoverOut
        })
      }
    }, section)

    return () => ctx.revert()
  }, [loading, upcomingEvents.length])

  if (loading) {
    return (
      <section className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 text-[var(--text)]">
        <div className="mt-14 flex flex-col items-center text-center mb-12">
          <div className="w-32 h-4 bg-[var(--neutral-200)] rounded-full animate-pulse mb-4" />
          <div className="w-64 h-8 bg-[var(--neutral-200)] rounded-full animate-pulse mb-3" />
          <div className="w-48 h-4 bg-[var(--neutral-200)] rounded-full animate-pulse" />
        </div>
      </section>
    )
  }

  if (!nearestEvent) {
    return (
      <section className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 text-[var(--text)]">
        <div className="mt-14 flex flex-col items-center text-center">
          <p className="paragraph text-lg text-[var(--text-muted)]">No upcoming events at this time.</p>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="events"
      className="
        relative
        max-w-7xl
        mx-auto
        px-6
        py-16
        sm:py-24
        text-[var(--text)]
      "
    >
      {/* Header Group */}
      <div className="event-header-group mt-14 flex flex-col items-center text-center mb-12 transform-gpu">
        <div
          className="
            inline-flex
            items-center
            gap-2
            bg-[var(--secondary-light)]
            text-[var(--secondary-hover)]
            text-xs
            sm:text-sm
            font-semibold
            tracking-widest
            uppercase
            px-4
            py-1.5
            rounded-full
            border
            border-[var(--secondary)]/20
            mb-6
            shadow-sm
          "
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Campus Events
        </div>

        <h2 className="heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-4 max-w-3xl leading-tight text-[var(--text)]">
          Upcoming Schedule
        </h2>

        <p className="paragraph text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
          Explore upcoming workshops, exhibitions, and seminars happening across our campus.
        </p>
      </div>

      {/* Nearest Event Countdown Spotlight Card */}
      <div
        className="
          event-countdown-card
          bg-[var(--card)]
          border
          border-[var(--secondary)]/30
          rounded-2xl
          p-6
          sm:p-8
          mb-10
          shadow-sm
          flex
          flex-col
          lg:flex-row
          items-center
          justify-between
          gap-8
          transform-gpu
        "
      >
        <div className="flex flex-col text-center lg:text-left">
          <span className="text-xs font-bold tracking-widest text-[var(--secondary)] uppercase mb-1">
            Nearest Upcoming Event
          </span>
          <h3 className="heading text-2xl sm:text-3xl font-black text-[var(--text)] mb-2">
            {nearestEvent.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg">
            {nearestEvent.description}
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-semibold text-[var(--text-muted)] mt-3">
            <span>📅 {nearestEvent.date.month} {nearestEvent.date.day}, {nearestEvent.date.year}</span>
            <span>🕒 {nearestEvent.time}</span>
            <span>📍 {nearestEvent.location}</span>
          </div>
        </div>

        {/* Timer Boxes */}
        <div className="flex items-center gap-3 shrink-0">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Mins', value: timeLeft.minutes },
            { label: 'Secs', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="
                flex
                flex-col
                items-center
                justify-center
                bg-[var(--secondary-light)]
                border
                border-[var(--secondary)]/20
                rounded-xl
                w-16
                h-16
                sm:w-20
                sm:h-20
                text-center
              "
            >
              <span className="text-lg sm:text-2xl font-black text-[var(--text)]">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[var(--secondary-hover)] uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical List Layout */}
      <div className="flex flex-col gap-4">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="
              event-row
              group
              bg-[var(--card)]
              hover:border-[var(--secondary)]
              border
              border-[var(--neutral-200)]
              rounded-2xl
              p-6
              sm:p-8
              flex
              flex-col
              md:flex-row
              items-start
              md:items-center
              justify-between
              gap-6
              transition-colors
              duration-300
              shadow-sm
              hover:shadow-md
              transform-gpu
            "
          >
            {/* Left: Date Block & Category */}
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  bg-[var(--secondary-light)]
                  border
                  border-[var(--secondary)]/20
                  rounded-xl
                  w-16
                  h-16
                  sm:w-20
                  sm:h-20
                  text-center
                  shrink-0
                "
              >
                <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[var(--secondary-hover)] uppercase">
                  {event.date.month}
                </span>
                <span className="text-xl sm:text-2xl font-black text-[var(--text)]">
                  {event.date.day}
                </span>
              </div>

              <div>
                <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                  {event.category}
                </span>
                <h3 className="heading text-xl sm:text-2xl font-bold text-[var(--text)] group-hover:text-[var(--secondary)] transition-colors">
                  {event.title}
                </h3>
              </div>
            </div>

            {/* Right: Details & Location */}
            <div className="flex flex-col md:max-w-md text-sm text-[var(--text-secondary)] gap-1">
              <p className="line-clamp-2 leading-relaxed">{event.description}</p>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-[var(--text-muted)] mt-2">
                <span>🕒 {event.time}</span>
                <span>📍 {event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Events
