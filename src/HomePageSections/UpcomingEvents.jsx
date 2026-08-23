import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEvents } from '../lib/events-service'

gsap.registerPlugin(ScrollTrigger)

const UpcomingEvents = () => {
  const sectionRef = useRef(null)
  const { events: upcomingEvents, loading } = useEvents()

  useLayoutEffect(() => {
    if (loading || upcomingEvents.length === 0) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set(['.uev-badge', '.uev-heading', '.uev-main', '.uev-card'], {
        willChange: 'transform, opacity',
      })

      gsap.set('.uev-badge', { y: -15, opacity: 0 })
      gsap.set('.uev-heading', { y: 25, opacity: 0 })
      gsap.set('.uev-main', { y: 30, opacity: 0 })
      gsap.set('.uev-card', { y: 25, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.uev-badge', { y: 0, opacity: 1, duration: 0.5 })
        .to('.uev-heading', { y: 0, opacity: 1, duration: 0.6 }, '-=0.25')
        .to('.uev-main', { y: 0, opacity: 1, duration: 0.65 }, '-=0.3')
        .to(
          '.uev-card',
          { y: 0, opacity: 1, duration: 0.55, stagger: { each: 0.12, from: 'start' } },
          '-=0.3'
        )

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    }, section)

    return () => ctx.revert()
  }, [loading, upcomingEvents.length])

  // Don't render if loading or no events
  if (loading || upcomingEvents.length === 0) return null

  // First event is the featured/next event, rest are smaller cards
  const featuredEvent = upcomingEvents[0]
  const additionalEvents = upcomingEvents.slice(1)

  return (
    <section
      ref={sectionRef}
      className="
        relative
        m-2
        sm:m-4
        overflow-hidden
        rounded-[2rem]
        sm:rounded-3xl
        bg-[var(--background-alt)]
        p-6
        sm:p-12
        md:p-16
        lg:p-20
      "
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          <div className="uev-badge inline-flex items-center">
            <span
              className="
                paragraph
                text-[var(--secondary)]
                text-xs
                font-bold
                tracking-widest
                uppercase
              "
            >
              Upcoming Events
            </span>
          </div>

          <h2
            className="
              uev-heading
              heading
              text-3xl
              sm:text-5xl
              lg:text-6xl
              font-black
              uppercase
              tracking-tight
              text-[var(--text-primary)]
              leading-none
              mt-3
            "
          >
            Learn • Grow • Celebrate
          </h2>
        </div>

        {/* Featured Event — large card */}
        <div
          className="
            uev-main
            bg-[var(--surface)]
            border
            border-[var(--neutral-200)]
            rounded-2xl
            p-6
            sm:p-8
            lg:p-10
            mb-6
            shadow-sm
            flex
            flex-col
            lg:flex-row
            items-start
            lg:items-center
            justify-between
            gap-6
            group
            hover:border-[var(--secondary)]/40
            transition-colors
            duration-300
            transform-gpu
          "
        >
          <div className="flex items-start gap-5 sm:gap-6">
            {/* Date block */}
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
                {featuredEvent.date.month}
              </span>
              <span className="text-xl sm:text-2xl font-black text-[var(--text)]">
                {featuredEvent.date.day}
              </span>
            </div>

            <div>
              <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-1">
                {featuredEvent.category}
              </span>
              <h3
                className="
                  heading
                  text-xl
                  sm:text-2xl
                  lg:text-3xl
                  font-bold
                  text-[var(--text)]
                  group-hover:text-[var(--secondary)]
                  transition-colors
                  mb-2
                "
              >
                {featuredEvent.title}
              </h3>
              <p className="paragraph text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-lg">
                {featuredEvent.shortDescription || featuredEvent.description}
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-[var(--text-muted)] mt-3">
                <span>🕒 {featuredEvent.time}</span>
                <span>📍 {featuredEvent.location}</span>
              </div>
            </div>
          </div>

          <Link
            to="/events"
            className="
              shrink-0
              px-6
              py-2.5
              rounded-full
              bg-[var(--secondary)]
              text-white
              text-sm
              font-semibold
              hover:bg-[var(--secondary-hover)]
              transition-colors
              duration-300
              active:scale-95
              shadow-sm
              text-center
            "
          >
            View Event →
          </Link>
        </div>

        {/* Additional upcoming events — smaller cards */}
        {additionalEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalEvents.map((event) => (
              <div
                key={event.id}
                className="
                  uev-card
                  bg-[var(--surface)]
                  border
                  border-[var(--neutral-200)]
                  rounded-2xl
                  p-5
                  sm:p-6
                  group
                  hover:border-[var(--secondary)]/40
                  transition-colors
                  duration-300
                  shadow-sm
                  transform-gpu
                "
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center
                      bg-[var(--secondary-light)]
                      border
                      border-[var(--secondary)]/20
                      rounded-lg
                      w-12
                      h-12
                      text-center
                      shrink-0
                    "
                  >
                    <span className="text-[9px] font-bold tracking-widest text-[var(--secondary-hover)] uppercase">
                      {event.date.month}
                    </span>
                    <span className="text-sm font-black text-[var(--text)]">
                      {event.date.day}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                      {event.category}
                    </span>
                    <h4
                      className="
                        heading
                        text-base
                        sm:text-lg
                        font-bold
                        text-[var(--text)]
                        group-hover:text-[var(--secondary)]
                        transition-colors
                        leading-tight
                      "
                    >
                      {event.title}
                    </h4>
                  </div>
                </div>
                <p className="paragraph text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {event.shortDescription || event.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default UpcomingEvents
