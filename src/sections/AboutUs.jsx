import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const AboutUs = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%', // Triggers right as the section hits the viewport from the bottom
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out', duration: 1 }
      })

      tl.from('.about-img-1', { y: 60, opacity: 0, duration: 1.2 })
        .from('.about-badge', { y: -20, opacity: 0, duration: 0.8 }, '-=0.9')
        .from('.about-heading', { y: 50, opacity: 0 }, '-=0.7')
        .from('.about-desc', { y: 30, opacity: 0 }, '-=0.7')
        .from('.about-img-2', { y: 60, opacity: 0 }, '-=0.8')

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative m-2 sm:m-4 overflow-hidden rounded-[2rem] sm:rounded-3xl bg-[var(--background)] p-6 sm:p-12 md:p-16 lg:p-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column (Shorter Image + Vision & Mission Cards) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Primary About Image (Reduced Height) */}
          <div className="about-img-1 relative rounded-2xl overflow-hidden shadow-md h-[280px] sm:h-[340px] bg-[var(--neutral-200)] group">
            <img 
              src="/About Us/1.jpg" 
              alt="Students jumping in hallway" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Vision & Mission Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Vision Card */}
            <div className="vision-card bg-[var(--surface)] p-6 rounded-2xl border border-[var(--neutral-200)] shadow-xs transition-all hover:border-[var(--secondary)]/40">
              <div className="w-8 h-1 bg-[var(--secondary)] rounded-full mb-4" />
              <h3 className="heading text-xl font-bold text-[var(--text-primary)] mb-2">
                Our Vision
              </h3>
              <p className="paragraph text-sm text-[var(--text-secondary)] leading-relaxed">
                We inspire globally minded students to grow with knowledge, integrity, and compassion in a supportive learning environment.
              </p>
            </div>

            {/* Mission Card */}
            <div className="mission-card bg-[var(--surface)] p-6 rounded-2xl border border-[var(--neutral-200)] shadow-xs transition-all hover:border-[var(--secondary)]/40">
              <div className="w-8 h-1 bg-[var(--secondary)] rounded-full mb-4" />
              <h3 className="heading text-xl font-bold text-[var(--text-primary)] mb-2">
                Our Mission
              </h3>
              <p className="paragraph text-sm text-[var(--text-secondary)] leading-relaxed">
                We provide high-quality education that develops critical thinking, creativity, leadership, and holistic student growth.
              </p>
            </div>

          </div>
        </div>

        {/* Right Column (Badge, Heading, Description, Secondary Image) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Text Content */}
          <div className="flex flex-col gap-4">
            <div className="about-badge inline-flex items-center">
              <span className="paragraph bg-[var(--secondary-light)] text-[var(--secondary-hover)] text-xs font-semibold tracking-widest uppercase px-3.5 py-1 rounded-md border border-[var(--secondary)]/20">
                About Us
              </span>
            </div>

            <h2 className="about-heading heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
              Where Education Meets <span className="text-[var(--secondary)]">Global Excellence</span>
            </h2>

            <p className="about-desc paragraph text-base text-[var(--text-secondary)] leading-relaxed">
              Our school nurtures curious minds, strong character, and lifelong learners through an internationally focused education. We believe every student deserves an environment that inspires growth, creativity, and confidence.
            </p>
          </div>

          {/* Secondary Classroom Image (Reduced Height) */}
          <div className="about-img-2 relative rounded-2xl overflow-hidden shadow-md h-[240px] sm:h-[280px] bg-[var(--neutral-200)] group">
            <img 
              src="/About Us/2.jpg" 
              alt="Students studying in classroom" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>

      </div>
    </section>
  )
}

export default AboutUs