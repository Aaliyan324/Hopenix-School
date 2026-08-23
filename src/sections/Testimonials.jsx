import React, { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonialsData = [
  {
    id: 1,
    quote: "I WOULD LIKE TO THANK THE SCHOOL ADMINISTRATION FOR GIVING US THE CHANCE TO SHARE OUR EXPERIENCE. I HAVE SEEN HUGE IMPROVEMENT IN ENGLISH AND ARABIC LANGUAGE WITH MY CHILDREN. MOST IMPORTANT ASPECTS FOR ME AS A PARENT THAT I LIKE ARE ACTIVITIES, TEACHERS' COMMUNICATION & COOPERATIVE ADMINISTRATION.",
    name: "MS. ASMAA AL DUBAIS",
    role: "PARENTS",
    avatar: "/Testimonials/1.jpg",
  },
  {
    id: 2,
    quote: "THE DEDICATION OF THE TEACHERS AND THE HOLISTIC LEARNING ENVIRONMENT HAVE TRULY TRANSFORMED MY CHILD'S CONFIDENCE. WE COULD NOT BE HAPPIER WITH THE PROGRESS AND THE WARM COMMUNITY HERE.",
    name: "MR. & MRS. JOHNSON",
    role: "PARENTS",
    avatar: "/Testimonials/2.jpg",
  },
  {
    id: 3,
    quote: "STUDYING AT THIS INSTITUTION HAS GIVEN ME AN INTERNATIONAL PERSPECTIVE AND PREPARED ME EXCEPTIONALLY WELL FOR HIGHER EDUCATION. THE MENTORSHIP IS UNMATCHED.",
    name: "AHMED RAZA",
    role: "ALUMNUS",
    avatar: "/Testimonials/3.jpg",
  },
]

const Testimonials = () => {
  const sectionRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const activeTestimonial = testimonialsData[currentIndex]

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set(['.testi-badge', '.testi-heading', '.testi-content'], {
        willChange: 'transform, opacity',
      })

      gsap.set('.testi-badge', { y: -15, opacity: 0 })
      gsap.set('.testi-heading', { y: 25, opacity: 0 })
      gsap.set('.testi-content', { y: 30, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.testi-badge', { y: 0, opacity: 1, duration: 0.4 })
        .to('.testi-heading', { y: 0, opacity: 1, duration: 0.5 }, '-=0.25')
        .to('.testi-content', { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length)
  }

  return (
    <section
      ref={sectionRef}
      className="
        relative
        m-2
        sm:m-4
        overflow-hidden
        rounded-[2rem]
        sm:rounded-3xl
        bg-[var(--background-alt, var(--background))]
        p-6
        sm:p-12
        md:p-16
        lg:p-20
      "
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <div className="testi-badge inline-flex items-center mb-3">
            <span
              className="
                paragraph
                text-[var(--secondary)]
                text-xs
                font-bold
                tracking-widest
                uppercase
              "
            >
              Testimonial
            </span>
          </div>

          <h2
            className="
              testi-heading
              heading
              text-3xl
              sm:text-5xl
              lg:text-6xl
              font-black
              uppercase
              tracking-tight
              text-[var(--text-primary)]
              leading-none
            "
          >
            What Parents Say <br />
            <span className="text-[var(--text-primary)]">About Us</span>
          </h2>
        </div>

        {/* Main Testimonial Layout with Side Navigation */}
        <div className="testi-content relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          
          {/* Quote & Author Content Area */}
          <div className="flex-1 max-w-4xl">
            
            {/* Quote Block */}
            <div className="relative mb-8">
              {/* Giant Quotation Icon */}
              <div className="text-[var(--secondary)] mb-4 inline-block">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 fill-current" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.999v10h-9.999z"/>
                </svg>
              </div>

              <p className="paragraph text-xs sm:text-base md:text-lg font-semibold uppercase tracking-wide text-[var(--text-primary)] leading-relaxed">
                {activeTestimonial.quote}
              </p>
            </div>

            {/* Video Preview Pill & Author Info Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              
              {/* Pill Video Thumbnail */}
              <div 
                className="
                  relative 
                  w-full 
                  sm:w-72 
                  h-20 
                  rounded-full 
                  overflow-hidden 
                  bg-[var(--neutral-900)] 
                  shadow-md 
                  flex 
                  items-center 
                  justify-center 
                  group 
                  cursor-pointer
                "
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center z-10 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Author Details */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm bg-[var(--neutral-200)] flex-shrink-0">
                  <img 
                    src={activeTestimonial.avatar} 
                    alt={activeTestimonial.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    }}
                  />
                </div>
                <div>
                  <h4 className="heading font-black text-sm sm:text-base uppercase text-[var(--text-primary)] tracking-tight">
                    {activeTestimonial.name}
                  </h4>
                  <p className="paragraph text-xs font-bold uppercase tracking-widest text-[var(--secondary)]">
                    {activeTestimonial.role}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Vertical Pagination Controls (Desktop) / Horizontal (Mobile) */}
          <div className="flex lg:flex-col items-center justify-center gap-4 self-center lg:self-center w-full lg:w-auto py-4">
            
            {/* Up Arrow */}
            <button 
              onClick={handlePrev}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex lg:flex-col gap-2.5 items-center">
              {testimonialsData.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? 'w-3 h-3 bg-[var(--secondary)] scale-125'
                      : 'w-2 h-2 bg-[var(--neutral-400, #cbd5e1)] hover:bg-[var(--text-secondary)]'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Down Arrow */}
            <button 
              onClick={handleNext}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              aria-label="Next Testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

          </div>

        </div>

      </div>
    </section>
  )
}

export default Testimonials