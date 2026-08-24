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

      gsap.set(animatedElements, {
        willChange: 'transform, opacity',
      })

      gsap.set('.footer-badge', { y: -18, opacity: 0 })
      gsap.set('.footer-heading', { y: 35, opacity: 0 })
      gsap.set('.footer-desc', { y: 25, opacity: 0 })
      gsap.set('.footer-col', { y: 45, opacity: 0 })
      gsap.set('.footer-bottom', { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.footer-badge', { y: 0, opacity: 1, duration: 0.6 })
        .to('.footer-heading', { y: 0, opacity: 1, duration: 0.8 }, '-=0.3')
        .to('.footer-desc', { y: 0, opacity: 1, duration: 0.7 }, '-=0.45')
        .to('.footer-col', { y: 0, opacity: 1, duration: 0.75, stagger: { each: 0.12, from: 'start' } }, '-=0.25')
        .to('.footer-bottom', { opacity: 1, duration: 0.6 }, '-=0.3')

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
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* BADGE */}
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Get Connected
        </div>

        {/* HEADING */}
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

        {/* DESCRIPTION */}
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

        {/* FOOTER GRID LINKS */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-5
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
          <div className="footer-col sm:col-span-2 lg:col-span-1 transform-gpu">
            <h3 className="heading text-xl font-bold uppercase tracking-wider mb-4">
              Hopenix
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Empowering the next generation of global leaders through world-class
              education and immersive learning experiences.
            </p>
            <div className="flex gap-3">
              {[
                { name: 'Facebook', icon: 'F' },
                { name: 'Instagram', icon: 'I' },
                { name: 'Twitter', icon: 'T' },
                { name: 'LinkedIn', icon: 'L' },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold hover:bg-white hover:text-slate-900 transition-colors duration-300"
                >
                  {social.icon}
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
              <li><Link to="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors duration-200">Academics</Link></li>
              <li><Link to="/admissions" className="hover:text-white transition-colors duration-200">Admissions</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors duration-200">Events</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors duration-200">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div className="footer-col transform-gpu">
            <h4 className="heading text-sm font-bold uppercase tracking-widest mb-4 text-white/90">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/facilities" className="hover:text-white transition-colors duration-200">Facilities</Link></li>
              <li><Link to="/student-life" className="hover:text-white transition-colors duration-200">Student Life</Link></li>
              <li><Link to="/faculty" className="hover:text-white transition-colors duration-200">Faculty</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors duration-200">Gallery</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors duration-200">News</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-col transform-gpu">
            <h4 className="heading text-sm font-bold uppercase tracking-widest mb-4 text-white/90">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Education Lane, Lahore, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@hopenixschool.edu" className="hover:text-white transition-colors duration-200">info@hopenixschool.edu</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+923001234567" className="hover:text-white transition-colors duration-200">+92 (300) 1234567</a>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="footer-col transform-gpu">
            <h4 className="heading text-sm font-bold uppercase tracking-widest mb-4 text-white/90">
              Stay Updated
            </h4>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              Subscribe for the latest announcements, events, and academic insights.
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

        {/* BOTTOM COPYRIGHT BAR */}
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
          <p>&copy; {new Date().getFullYear()} Hopenix School. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
