import { useState, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import galleryData from '../data/gallery'

gsap.registerPlugin(ScrollTrigger)

const Gallery = () => {
  const sectionRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...new Set(galleryData.map((g) => g.category))]
  const filtered = selectedCategory === 'All' ? galleryData : galleryData.filter((g) => g.category === selectedCategory)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set('.gallery-item', { scale: 0.95, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 80%', once: true, invalidateOnRefresh: true },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.gallery-item', { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05 })

      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Gallery' }]} />

      <section ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <SectionHeading
          badge="Gallery"
          title="Life at Hopenix"
          description="Explore moments from our campus, events, sports, classrooms, and student activities through our photo gallery."
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`paragraph px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                selectedCategory === cat
                  ? 'bg-[var(--secondary)] text-white'
                  : 'bg-[var(--surface)] border border-[var(--neutral-200)] text-[var(--text-secondary)] hover:border-[var(--secondary)]/40 hover:text-[var(--secondary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="gallery-item group relative rounded-2xl overflow-hidden bg-[var(--neutral-200)] aspect-[4/3] shadow-sm transform-gpu"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--secondary-light)] to-[var(--primary-light)] flex flex-col items-center justify-center p-4">
                    <svg className="w-10 h-10 text-[var(--secondary)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2.2 2.2 0 012.828 0L16 16m-2-2l1.586-1.586a2.2 2.2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="paragraph text-xs text-[var(--text-muted)] text-center">{item.title}</span>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <h3 className="heading text-base font-bold text-white">{item.title}</h3>
                    <p className="paragraph text-xs text-white/80">{item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="paragraph text-lg text-[var(--text-muted)]">No photos found in this category.</p>
          </div>
        )}
      </section>
    </>
  )
}

export default Gallery
