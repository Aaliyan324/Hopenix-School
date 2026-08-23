import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const ctx = gsap.context(() => {
      const animatedElements = [
        '.footer-badge',
        '.footer-heading',
        '.footer-desc',
        '.footer-col',
        '.footer-bottom',
      ]

      // Establish initial states before ScrollTrigger measures the section
      gsap.set(animatedElements, {
        willChange: 'transform, opacity',
      })

      gsap.set('.footer-badge', {
        y: -18,
        opacity: 0,
      })

      gsap.set('.footer-heading', {
        y: 35,
        opacity: 0,
      })

      gsap.set('.footer-desc', {
        y: 25,
        opacity: 0,
      })

      gsap.set('.footer-col', {
        y: 45,
        opacity: 0,
      })

      gsap.set('.footer-bottom', {
        opacity: 0,
      })

      // Main entrance timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: {
          ease: 'power3.out',
        },
      })

      tl.to('.footer-badge', {
        y: 0,
        opacity: 1,
        duration: 0.6,
      })

        .to(
          '.footer-heading',
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          '-=0.3'
        )

        .to(
          '.footer-desc',
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          '-=0.45'
        )

        .to(
          '.footer-col',
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: {
              each: 0.12,
              from: 'start',
            },
          },
          '-=0.25'
        )

        .to(
          '.footer-bottom',
          {
            opacity: 1,
            duration: 0.6,
          },
          '-=0.3'
        )

      // Allow the browser to finish layout before refreshing ScrollTrigger
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <footer
      ref={sectionRef}
      className="
        relative
        m-2
        sm:m-4
        overflow-hidden
        rounded-[2rem]
        sm:rounded-3xl
        bg-[var(--secondary)]
        text-white
        p-6
        sm:p-12
        md:p-16
        lg:p-20
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          flex
          flex-col
          items-center
          text-center
        "
      >
        {/* =========================================
            BADGE
            ========================================= */}
        <div
          className="
            footer-badge
            inline-flex
            items-center
            gap-2
            bg-white/15
            backdrop-blur-md
            text-white
            text-xs
            sm:text-sm
            font-semibold
            tracking-widest
            uppercase
            px-4
            py-1.5
            rounded-full
            border
            border-white/20
            mb-6
            shadow-sm
            transform-gpu
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Get Connected
        </div>

        {/* =========================================
            HEADING
            ========================================= */}
        <h2
          className="
            footer-heading
            heading
            text-3xl
            sm:text-5xl
            lg:text-6xl
            font-black
            uppercase
            tracking-tight
            mb-4
            max-w-4xl
            leading-tight
            transform-gpu
          "
        >
          Shape Your Future With Us
        </h2>

        {/* =========================================
            DESCRIPTION
            ========================================= */}
        <p
          className="
            footer-desc
            paragraph
            text-base
            sm:text-lg
            text-white/80
            max-w-2xl
            mb-12
            sm:mb-16
            leading-relaxed
            transform-gpu
          "
        >
          Join our community of forward-thinkers, creators, and innovators.
          Explore our programs and take the next step toward excellence.
        </p>

        {/* =========================================
            FOOTER GRID LINKS
            ========================================= */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-10
            w-full
            text-left
            mb-16
            border-b
            border-white/10
            pb-12
          "
        >
          {/* Column 1: Brand Info */}
          <div className="footer-col md:col-span-1 transform-gpu">
            <h3 className="heading text-xl font-bold uppercase tracking-wider mb-4">
              Pathway
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Empowering the next generation of global leaders through world-class
              education and immersive learning experiences.
            </p>
            <div className="flex gap-3">
              {['Twitter', 'LinkedIn', 'Instagram', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href={`#${social.toLowerCase()}`}
                  aria-label={social}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold hover:bg-white hover:text-slate-900 transition-colors duration-300"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col transform-gpu">
            <h4 className="heading text-sm font-bold uppercase tracking-widest mb-4 text-white/90">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a
                  href="#about"
                  className="hover:text-white transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#academics"
                  className="hover:text-white transition-colors duration-200"
                >
                  Academics
                </a>
              </li>
              <li>
                <a
                  href="#admissions"
                  className="hover:text-white transition-colors duration-200"
                >
                  Admissions
                </a>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover:text-white transition-colors duration-200"
                >
                  Events
                </Link>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Programs */}
          <div className="footer-col transform-gpu">
            <h4 className="heading text-sm font-bold uppercase tracking-widest mb-4 text-white/90">
              Programs
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              {[
                'Science & Technology',
                'Business & Innovation',
                'Arts & Digital Media',
                'Global Leadership',
                'STEM Research',
              ].map((prog) => (
                <li key={prog}>
                  <a
                    href="#programs"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {prog}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col transform-gpu">
            <h4 className="heading text-sm font-bold uppercase tracking-widest mb-4 text-white/90">
              Stay Updated
            </h4>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              Subscribe to our newsletter for the latest announcements, events,
              and academic insights.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-black/20 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-white/90 transition-colors duration-300 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* =========================================
            BOTTOM COPYRIGHT BAR
            ========================================= */}
        <div
          className="
            footer-bottom
            w-full
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            text-xs
            text-white/60
            gap-4
            transform-gpu
          "
        >
          <p>© {new Date().getFullYear()} Muhammad Aaliyan. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-white transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer