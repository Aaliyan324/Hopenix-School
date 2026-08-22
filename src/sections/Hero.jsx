import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

const Hero = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    // gsap.context ensures all animations inside it are scoped to the containerRef 
    // and makes cleanup simple when the component unmounts.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.school-bg', { scale: 1.15, opacity: 0, duration: 1.5 })
        .from('.badge', { y: -20, opacity: 0, duration: 0.8 }, '-=1')
        .from('.hero-title', { y: 50, opacity: 0, duration: 1 }, '-=0.6')
        .from('.student-overlay', { y: 120, opacity: 0, duration: 1 }, '-=0.8')
        .from('.bottom-text', { x: -30, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.action-btn', { y: 20, opacity: 0, duration: 0.6, stagger: 0.15 }, '-=0.5')
    }, containerRef)

    // Cleanup function to revert all animations when component unmounts
    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef} 
      className="relative m-4 overflow-hidden rounded-3xl bg-[var(--secondary)] min-h-[95vh] flex flex-col justify-between p-8 md:p-14 lg:p-20 invisible-scrollbar"
    >
      
      {/* Background School Image (Anchored to the bottom) */}
      <img
        src="/Hero/School.png"
        alt="School Campus"
        className="school-bg absolute bottom-0 left-0 w-full h-[75%] object-cover object-center z-0"
      />

      {/* Subtle Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/60 z-10 pointer-events-none" />

      {/* Top Bar / Badge */}
      <div className="relative z-20 flex items-center gap-3">
        <span className="badge bg-white/20 backdrop-blur-md text-white text-xs md:text-sm font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full border border-white/30">
          Admissions Open 2026–2027
        </span>
      </div>

      {/* Centered Large Behind-the-Head Typography */}
      <div className="absolute inset-x-0 top-16 md:top-24 z-20 flex items-center justify-center pointer-events-none select-none">
        <h1 className="hero-title text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[11rem] font-black uppercase tracking-tight text-white/90 drop-shadow-2xl text-center leading-none">
          Hopenix School
        </h1>
      </div>

      {/* Foreground Student Cutout Overlay */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-full max-w-4xl flex justify-center">
        <img
          src="/Hero/Student Overlay.png"
          alt="Hopenix Students"
          className="student-overlay w-auto h-[45vh] md:h-[55vh] object-contain drop-shadow-2xl"
        />
      </div>

      {/* Bottom Content & Call to Actions */}
      <div className="relative z-40 flex flex-col md:flex-row items-end justify-between gap-6 pt-24">
        <div className="max-w-md text-white">
          <p className="bottom-text text-lg md:text-xl font-medium drop-shadow-md">
            Empowering the leaders, creators, and thinkers of tomorrow.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Primary Button */}
          <button className="action-btn relative overflow-hidden group flex-1 md:flex-none px-8 py-3.5 rounded-full bg-white text-slate-900 font-bold transition-colors duration-300 hover:text-white shadow-lg active:scale-95">
            <span className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[150%] h-[250%] rounded-[50%] bg-[var(--secondary-hover)] transition-all duration-500 ease-in-out group-hover:top-[-50%] z-0" />
            <span className="relative z-10">Apply Now</span>
          </button>
          
          {/* Secondary Button */}
          <button className="action-btn relative overflow-hidden group flex-1 md:flex-none px-8 py-3.5 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold border border-white/40 transition-colors duration-300 hover:text-[var(--text)] active:scale-95">
            <span className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[150%] h-[250%] rounded-[50%] bg-[var(--surface)] transition-all duration-500 ease-in-out group-hover:top-[-50%] z-0" />
            <span className="relative z-10">Explore Campus</span>
          </button>
        </div>
      </div>

    </section>
  )
}

export default Hero