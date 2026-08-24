import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import facilitiesData from '../data/facilities'

gsap.registerPlugin(ScrollTrigger)

const facilityIcons = {
  science: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
  computer: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  library: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
  sports: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  auditorium: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
  cafeteria: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
  playground: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  transportation: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
  security: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  art: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2.2 2.2 0 012.828 0L16 16m-2-2l1.586-1.586a2.2 2.2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
}

const Facilities = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set('.facility-card', { y: 35, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 80%', once: true, invalidateOnRefresh: true },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.facility-card', { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 })

      const cards = gsap.utils.toArray('.facility-card')
      cards.forEach((card) => {
        const hoverIn = () => gsap.to(card, { y: -5, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
        const hoverOut = () => gsap.to(card, { y: 0, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
        card.addEventListener('mouseenter', hoverIn)
        card.addEventListener('mouseleave', hoverOut)
        card._facHoverIn = hoverIn
        card._facHoverOut = hoverOut
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        cards.forEach((card) => {
          card.removeEventListener('mouseenter', card._facHoverIn)
          card.removeEventListener('mouseleave', card._facHoverOut)
          delete card._facHoverIn
          delete card._facHoverOut
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Facilities' }]} />

      <section ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <SectionHeading
          badge="Facilities"
          title="World-Class Campus Facilities"
          description="Our campus is designed to provide students with the best possible learning environment, featuring modern facilities that support academic, creative, and physical development."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilitiesData.map((facility, idx) => (
            <div
              key={facility.id}
              className="facility-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300 flex flex-col transform-gpu"
            >
              <div className="w-14 h-14 rounded-xl bg-[var(--secondary-light)] flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {facilityIcons[facility.icon] || facilityIcons.science}
                </svg>
              </div>
              <h3 className="heading text-xl font-bold text-[var(--text)] mb-2">{facility.name}</h3>
              <p className="paragraph text-sm text-[var(--text-secondary)] leading-relaxed mb-4 flex-1">{facility.description}</p>
              {facility.features && (
                <ul className="space-y-1.5">
                  {facility.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Facilities
