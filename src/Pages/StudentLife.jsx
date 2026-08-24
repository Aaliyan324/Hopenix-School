import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import Breadcrumbs from '../components/Breadcrumbs'

gsap.registerPlugin(ScrollTrigger)

const StudentLife = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set(['.sl-activity-card', '.sl-achievement-card'], { willChange: 'transform, opacity' })
      gsap.set('.sl-activity-card', { y: 35, opacity: 0 })
      gsap.set('.sl-achievement-card', { y: 30, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 80%', once: true, invalidateOnRefresh: true },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.sl-activity-card', { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 })
        .to('.sl-achievement-card', { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 }, '-=0.3')

      const cards = gsap.utils.toArray('.sl-activity-card')
      cards.forEach((card) => {
        const hoverIn = () => gsap.to(card, { y: -5, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
        const hoverOut = () => gsap.to(card, { y: 0, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
        card.addEventListener('mouseenter', hoverIn)
        card.addEventListener('mouseleave', hoverOut)
        card._slHoverIn = hoverIn
        card._slHoverOut = hoverOut
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        cards.forEach((card) => {
          card.removeEventListener('mouseenter', card._slHoverIn)
          card.removeEventListener('mouseleave', card._slHoverOut)
          delete card._slHoverIn
          delete card._slHoverOut
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  const activities = [
    {
      title: 'Clubs & Societies',
      description: 'Debate club, science club, art society, book club, coding club, and more — students find their passion and community.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    },
    {
      title: 'Sports & Athletics',
      description: 'Football, basketball, cricket, track & field, swimming — competitive and recreational sports for all skill levels.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      title: 'Cultural Activities',
      description: 'Annual cultural day, drama productions, music performances, and art exhibitions celebrating diversity and creativity.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2.2 2.2 0 012.828 0L16 16m-2-2l1.586-1.586a2.2 2.2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
    {
      title: 'Competitions',
      description: 'Inter-school academic competitions, science fairs, math olympiads, and debate tournaments.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
    },
    {
      title: 'Educational Trips',
      description: 'Museum visits, nature excursions, industry tours, and international educational exchanges.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      title: 'Community Service',
      description: 'Volunteer programs, charity drives, environmental projects, and community outreach initiatives.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    },
  ]

  const achievements = [
    { title: 'Regional Science Fair Champions', year: '2026' },
    { title: 'Inter-School Debate Tournament Winners', year: '2025' },
    { title: 'National Mathematics Olympiad — 3 Gold Medals', year: '2025' },
    { title: 'Annual Art Exhibition — 200+ Student Works', year: '2026' },
    { title: 'Sports Day — 15 School Records Broken', year: '2025' },
    { title: 'Community Service — 1000+ Volunteer Hours', year: '2026' },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Student Life' }]} />

      <section ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <SectionHeading
          badge="Student Life"
          title="More Than Just Academics"
          description="At Hopenix, we believe school life is about discovering passions, building friendships, and developing character. Our vibrant extracurricular program ensures every student finds their place."
        />

        {/* Activities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 sm:mb-20">
          {activities.map((activity, idx) => (
            <div
              key={idx}
              className="sl-activity-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300 transform-gpu"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--secondary-light)] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {activity.icon}
                </svg>
              </div>
              <h3 className="heading text-lg font-bold text-[var(--text)] mb-2">{activity.title}</h3>
              <p className="paragraph text-sm text-[var(--text-secondary)] leading-relaxed">{activity.description}</p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="mb-16 sm:mb-20">
          <SectionHeading
            badge="Achievements"
            title="Student Achievements"
            description="Our students consistently excel in academics, sports, arts, and community service."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((item, idx) => (
              <div
                key={idx}
                className="sl-achievement-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-xl p-5 shadow-sm flex items-start gap-4 transform-gpu"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--secondary-light)] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h4 className="heading text-base font-bold text-[var(--text)]">{item.title}</h4>
                  <p className="paragraph text-xs text-[var(--text-muted)] mt-0.5">{item.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-8 sm:p-10 shadow-sm text-center">
          <h3 className="heading text-2xl font-bold text-[var(--text)] mb-4">Leadership Opportunities</h3>
          <p className="paragraph text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-6">
            Students develop leadership skills through student council, prefect programs, club leadership, peer mentoring, and organizing school events. We believe every student has the potential to lead.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Student Council', 'Prefect Body', 'Club Presidents', 'Peer Mentors', 'Event Organizers', 'Team Captains'].map((role) => (
              <span key={role} className="paragraph px-4 py-2 rounded-full bg-[var(--secondary-light)] text-[var(--secondary-hover)] text-sm font-semibold">
                {role}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Experience the Hopenix Difference"
        description="Discover how our vibrant school life shapes well-rounded individuals."
        buttonText="Apply for Admission"
        buttonLink="/admissions"
        variant="secondary"
      />
    </>
  )
}

export default StudentLife
