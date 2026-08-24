import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import facultyData from '../data/faculty'

gsap.registerPlugin(ScrollTrigger)

const Faculty = () => {
  const sectionRef = useRef(null)
  const [selectedDept, setSelectedDept] = useState('All')

  const departments = ['All', ...new Set(facultyData.map((f) => f.department))]
  const filtered = selectedDept === 'All' ? facultyData : facultyData.filter((f) => f.department === selectedDept)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set('.faculty-card', { y: 35, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 80%', once: true, invalidateOnRefresh: true },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.faculty-card', { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 })

      const cards = gsap.utils.toArray('.faculty-card')
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
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Faculty' }]} />

      <section ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <SectionHeading
          badge="Our Faculty"
          title="Meet Our Dedicated Teachers"
          description="Our experienced and passionate faculty members are committed to providing the highest quality education and nurturing every student's potential."
        />

        {/* Department Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`paragraph px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                selectedDept === dept
                  ? 'bg-[var(--secondary)] text-white'
                  : 'bg-[var(--surface)] border border-[var(--neutral-200)] text-[var(--text-secondary)] hover:border-[var(--secondary)]/40 hover:text-[var(--secondary)]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="faculty-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300 text-center transform-gpu"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[var(--neutral-200)] mx-auto mb-4">
                <img
                  src={member.image || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  }}
                />
              </div>
              <h3 className="heading text-lg font-bold text-[var(--text)] mb-0.5">{member.name}</h3>
              <p className="paragraph text-sm text-[var(--secondary)] font-semibold mb-1">{member.position}</p>
              <p className="paragraph text-xs text-[var(--text-muted)] mb-3">{member.department}</p>
              <p className="paragraph text-xs text-[var(--text-secondary)] leading-relaxed mb-3">{member.qualifications}</p>
              <p className="paragraph text-xs text-[var(--text-muted)] leading-relaxed">{member.expertise}</p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="paragraph text-lg text-[var(--text-muted)]">No faculty members found for this department.</p>
          </div>
        )}
      </section>
    </>
  )
}

export default Faculty
