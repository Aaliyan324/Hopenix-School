import { useState, useLayoutEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const navDropdowns = [
  {
    label: 'About',
    items: [
      { label: 'Our Story', to: '/about' },
      { label: 'Mission & Vision', to: '/about' },
      { label: 'Principal\'s Message', to: '/about' },
      { label: 'Faculty', to: '/faculty' },
    ],
  },
  {
    label: 'Academics',
    items: [
      { label: 'Overview', to: '/academics' },
      { label: 'Curriculum', to: '/academics' },
      { label: 'Subjects Offered', to: '/academics' },
    ],
  },
  {
    label: 'Student Life',
    items: [
      { label: 'Overview', to: '/student-life' },
      { label: 'Clubs & Societies', to: '/student-life' },
      { label: 'Sports', to: '/student-life' },
    ],
  },
]

const navLinks = [
  { label: 'Daily Diary', to: '/daily-diary' },
  { label: 'Facilities', to: '/facilities' },
  { label: 'Events', to: '/events' },
  { label: 'News', to: '/news' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Contact', to: '/contact' },
  { label: 'Portal Sign In', to: '/admin/login' },
]

const Navbar = () => {
  const navRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [openMobileGroup, setOpenMobileGroup] = useState(null)
  const location = useLocation()
  const dropdownTimeout = useRef(null)

  // Close mobile menu on route change
  useState(() => {
    setIsOpen(false)
    setOpenMobileGroup(null)
  }, [location.pathname])

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const ctx = gsap.context(() => {
      gsap.set(nav, { y: -20, opacity: 0 })
      gsap.to(nav, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.1,
      })
    }, nav)

    return () => ctx.revert()
  }, [])

  // Close dropdowns on route change
  useLayoutEffect(() => {
    setOpenDropdown(null)
  }, [location.pathname])

  const handleDropdownEnter = (label) => {
    clearTimeout(dropdownTimeout.current)
    setOpenDropdown(label)
  }

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const linkClass = (path) =>
    `hover:text-white transition-colors duration-200 ${isActive(path) ? 'text-white' : ''}`

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 pt-2">
      <nav
        ref={navRef}
        className="
          max-w-7xl
          mx-auto
          rounded-2xl
          sm:rounded-3xl
          bg-[var(--secondary)]
          text-white
          px-6
          py-4
          flex
          items-center
          justify-between
          shadow-lg
          border
          border-white/10
          backdrop-blur-md
          transform-gpu
        "
      >
        {/* Logo */}
        <Link
          to="/"
          className="heading font-black text-xl tracking-wider uppercase text-white"
        >
          Hopenix School
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-white/80">
          {/* Dropdown items */}
          {navDropdowns.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => handleDropdownEnter(group.label)}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={`flex items-center gap-1 hover:text-white transition-colors duration-200 ${
                  group.items.some((i) => isActive(i.to)) ? 'text-white' : ''
                }`}
              >
                {group.label}
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === group.label ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {openDropdown === group.label && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
                  onMouseEnter={() => handleDropdownEnter(group.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="bg-white rounded-xl shadow-xl border border-neutral-200 py-2 min-w-[200px] overflow-hidden">
                    {group.items.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.to}
                        className="block px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-[var(--primary)] hover:text-white transition-colors duration-150"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Direct link items */}
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={linkClass(link.to)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden lg:block">
          <Link
            to="/admissions/apply"
            className="
              px-5
              py-2.5
              rounded-full
              bg-white
              text-slate-900
              text-sm
              font-semibold
              hover:bg-white/90
              transition-colors
              duration-300
              active:scale-95
              shadow-sm
            "
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
          className="
            lg:hidden
            w-10
            h-10
            rounded-xl
            bg-white/10
            flex
            items-center
            justify-center
            text-white
            focus:outline-none
            transition-colors
            hover:bg-white/20
          "
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          className="
            max-w-7xl
            mx-auto
            mt-2
            bg-[var(--secondary)]
            text-white
            rounded-2xl
            p-6
            border
            border-white/10
            lg:hidden
            flex
            flex-col
            gap-1
            shadow-xl
            backdrop-blur-md
            max-h-[70vh]
            overflow-y-auto
          "
        >
          {/* Dropdown groups */}
          {navDropdowns.map((group) => (
            <div key={group.label} className="border-b border-white/5">
              <button
                onClick={() =>
                  setOpenMobileGroup(openMobileGroup === group.label ? null : group.label)
                }
                className="flex items-center justify-between w-full py-3 text-base font-medium text-white/80 hover:text-white transition-colors"
              >
                {group.label}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openMobileGroup === group.label ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openMobileGroup === group.label && (
                <div className="pb-2 pl-3 flex flex-col gap-1">
                  {group.items.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.to}
                      onClick={() => {
                        setIsOpen(false)
                        setOpenMobileGroup(null)
                      }}
                      className="text-sm font-medium text-white/60 hover:text-white transition-colors py-2 border-l-2 border-white/10 pl-3"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Direct links */}
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`text-base font-medium transition-colors py-3 border-b border-white/5 ${
                isActive(link.to) ? 'text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/admissions/apply"
            onClick={() => setIsOpen(false)}
            className="
              w-full
              text-center
              py-3
              rounded-xl
              bg-white
              text-slate-900
              font-semibold
              text-sm
              hover:bg-white/90
              transition-colors
              mt-3
              active:scale-98
            "
          >
            Apply Now
          </Link>
        </div>
      )}
    </header>
  )
}

export default Navbar
