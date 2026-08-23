import { useState, useLayoutEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const Navbar = () => {
  const navRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

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
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/80">
          <a
            href="#about"
            className="hover:text-white transition-colors duration-200"
          >
            About
          </a>
          <a
            href="#academics"
            className="hover:text-white transition-colors duration-200"
          >
            Academics
          </a>
          <a
            href="#programs"
            className="hover:text-white transition-colors duration-200"
          >
            Programs
          </a>
          <Link
            to="/events"
            className={`hover:text-white transition-colors duration-200 ${
              location.pathname === '/events' ? 'text-white' : ''
            }`}
          >
            Events
          </Link>
          <a
            href="#contact"
            className="hover:text-white transition-colors duration-200"
          >
            Contact
          </a>
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <a
            href="#admissions"
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
          </a>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
          className="
            md:hidden
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
            md:hidden
            flex
            flex-col
            gap-4
            shadow-xl
            backdrop-blur-md
          "
        >
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-white/80 hover:text-white transition-colors py-1 border-b border-white/5"
          >
            About
          </a>
          <a
            href="#academics"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-white/80 hover:text-white transition-colors py-1 border-b border-white/5"
          >
            Academics
          </a>
          <a
            href="#programs"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-white/80 hover:text-white transition-colors py-1 border-b border-white/5"
          >
            Programs
          </a>
          <Link
            to="/events"
            onClick={() => setIsOpen(false)}
            className={`text-base font-medium transition-colors py-1 border-b border-white/5 ${
              location.pathname === '/events' ? 'text-white' : 'text-white/80 hover:text-white'
            }`}
          >
            Events
          </Link>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-white/80 hover:text-white transition-colors py-1"
          >
            Contact
          </a>
          <a
            href="#admissions"
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
              mt-2
              active:scale-98
            "
          >
            Apply Now
          </a>
        </div>
      )}
    </header>
  )
}

export default Navbar