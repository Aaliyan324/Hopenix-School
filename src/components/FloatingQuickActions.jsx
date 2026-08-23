import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const quickActions = [
  {
    id: 'events',
    label: 'Events',
    ariaLabel: 'Go to Events page',
    to: '/events',
    isLink: true,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    ariaLabel: 'Go to Contact section',
    to: '/#contact',
    isLink: true,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    ),
  },
  {
    id: 'admissions',
    label: 'Admissions',
    ariaLabel: 'Go to Admissions section',
    to: '/#admissions',
    isLink: true,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    ),
  },
  {
    id: 'location',
    label: 'Location',
    ariaLabel: 'Go to Contact section for location',
    to: '/#contact',
    isLink: true,
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </>
    ),
  },
]

const FloatingQuickActions = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const location = useLocation()

  const handleActionClick = () => {
    setIsExpanded(false)
  }

  return (
    <div
      className="
        fixed
        bottom-4
        left-4
        sm:bottom-6
        sm:left-6
        z-40
        flex
        flex-col-reverse
        items-center
        gap-2.5
      "
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isExpanded}
        className={`
          w-12
          h-12
          rounded-full
          bg-[var(--secondary)]
          text-white
          flex
          items-center
          justify-center
          shadow-lg
          hover:bg-[var(--secondary-hover)]
          transition-all
          duration-300
          active:scale-95
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isExpanded ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          )}
        </svg>
      </button>

      {/* Action icons */}
      <div
        className={`
          flex
          flex-col
          items-center
          gap-2.5
          transition-all
          duration-300
          transform-gpu
          ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        {quickActions.map((action, index) => {
          const isActive =
            action.to === '/events'
              ? location.pathname === '/events'
              : false

          if (action.isLink) {
            return (
              <Link
                key={action.id}
                to={action.to}
                onClick={handleActionClick}
                aria-label={action.ariaLabel}
                className={`
                  group
                  relative
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shadow-md
                  transition-all
                  duration-300
                  hover:scale-110
                  active:scale-95
                  ${isActive ? 'bg-[var(--secondary)] text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--neutral-200)] hover:border-[var(--secondary)]/40 hover:text-[var(--secondary)]'}
                `}
                style={{ transitionDelay: isExpanded ? `${index * 50}ms` : '0ms' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {action.icon}
                </svg>

                {/* Tooltip */}
                <span
                  className="
                    absolute
                    left-full
                    ml-3
                    px-2.5
                    py-1
                    rounded-lg
                    bg-[var(--text)]
                    text-white
                    text-xs
                    font-semibold
                    whitespace-nowrap
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-200
                    pointer-events-none
                    hidden
                    sm:block
                  "
                >
                  {action.label}
                </span>
              </Link>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}

export default FloatingQuickActions
