import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SectionHeading = ({ badge, title, description, align = 'center', dark = false }) => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set(['.sh-badge', '.sh-heading', '.sh-desc'], { willChange: 'transform, opacity' })
      gsap.set('.sh-badge', { y: -15, opacity: 0 })
      gsap.set('.sh-heading', { y: 25, opacity: 0 })
      gsap.set('.sh-desc', { y: 20, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.sh-badge', { y: 0, opacity: 1, duration: 0.5 })
        .to('.sh-heading', { y: 0, opacity: 1, duration: 0.6 }, '-=0.25')
        .to('.sh-desc', { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')

      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, section)

    return () => ctx.revert()
  }, [])

  const alignClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center'
  const textColor = dark ? 'text-white' : 'text-[var(--text-primary)]'
  const descColor = dark ? 'text-white/80' : 'text-[var(--text-secondary)]'

  return (
    <div ref={sectionRef} className={`flex flex-col gap-4 mb-10 sm:mb-14 ${alignClass}`}>
      {badge && (
        <div className="sh-badge inline-flex items-center self-start">
          <span className={`paragraph text-xs sm:text-sm font-semibold tracking-widest uppercase px-3.5 py-1 rounded-md border ${dark ? 'bg-white/15 text-white border-white/20' : 'bg-[var(--secondary-light)] text-[var(--secondary-hover)] border-[var(--secondary)]/20'}`}>
            {badge}
          </span>
        </div>
      )}
      <h2 className={`sh-heading heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight ${textColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`sh-desc paragraph text-base sm:text-lg leading-relaxed max-w-2xl ${align === 'center' ? 'mx-auto' : ''} ${descColor}`}>
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeading
