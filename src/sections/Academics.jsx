import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Academics = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom', // Fires immediately as the top of the section hits the bottom of the screen
          toggleActions: 'play none none none',
          once: true, // Plays once to ensure it never glitches on scroll up/down
        },
        defaults: { ease: 'power3.out', duration: 0.8, immediateRender: false }
      })

      tl.from('.acad-badge', { y: -20, opacity: 0, immediateRender: true })
        .from('.acad-heading', { y: 30, opacity: 0 }, '-=0.4')
        .from('.acad-desc', { y: 20, opacity: 0 }, '-=0.4')
        .from('.acad-card', { y: 50, opacity: 0, stagger: 0.15 }, '-=0.3')

    }, sectionRef)

    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef} 
      className="relative m-2 sm:m-4 overflow-hidden rounded-[2rem] sm:rounded-3xl bg-[var(--secondary)] text-white p-6 sm:p-12 md:p-16 lg:p-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="acad-badge inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-white/20 mb-6 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          Academic
        </div>

        {/* Heading & Subtitle */}
        <h2 className="acad-heading heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-4 max-w-4xl leading-tight">
          Future-Ready Learning Pathways
        </h2>
        <p className="acad-desc paragraph text-base sm:text-lg text-white/80 max-w-2xl mb-12 sm:mb-16 leading-relaxed">
          Our High School program combines rigorous academics with personalized learning pathways, preparing students for top universities worldwide.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* Card 1: Science & Technology */}
          <div className="acad-card bg-black/20 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-white/10 flex flex-col items-center text-center group hover:bg-black/30 transition-all duration-300 shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="heading text-2xl font-bold mb-3">Science & Technology</h3>
            <p className="paragraph text-sm text-white/70 leading-relaxed mb-8">
              Focused on scientific exploration, technology innovation, and analytical problem solving through STEM learning.
            </p>
            <button className="mt-auto px-6 py-2.5 rounded-full border border-white/30 text-sm font-semibold hover:bg-white hover:text-slate-900 transition-colors duration-300 active:scale-95">
              Read more
            </button>
          </div>

          {/* Card 2: Business & Innovation */}
          <div className="acad-card bg-black/20 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-white/10 flex flex-col items-center text-center group hover:bg-black/30 transition-all duration-300 shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="heading text-2xl font-bold mb-3">Business & Innovation</h3>
            <p className="paragraph text-sm text-white/70 leading-relaxed mb-8">
              Develops entrepreneurial mindset, leadership skills, and real world business understanding in a global economy.
            </p>
            <button className="mt-auto px-6 py-2.5 rounded-full border border-white/30 text-sm font-semibold hover:bg-white hover:text-slate-900 transition-colors duration-300 active:scale-95">
              Read more
            </button>
          </div>

          {/* Card 3: Arts & Digital Media */}
          <div className="acad-card bg-black/20 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-white/10 flex flex-col items-center text-center group hover:bg-black/30 transition-all duration-300 shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2.2 2.2 0 012.828 0L16 16m-2-2l1.586-1.586a2.2 2.2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="heading text-2xl font-bold mb-3">Arts & Digital Media</h3>
            <p className="paragraph text-sm text-white/70 leading-relaxed mb-8">
              Encourages creativity through visual arts, design, and digital media production to prepare students for creative industries.
            </p>
            <button className="mt-auto px-6 py-2.5 rounded-full border border-white/30 text-sm font-semibold hover:bg-white hover:text-slate-900 transition-colors duration-300 active:scale-95">
              Read more
            </button>
          </div>

        </div>

      </div>
    </section>
  )
}

export default Academics