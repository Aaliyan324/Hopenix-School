import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Testimonials = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const ctx = gsap.context(() => {
      const elements = [
        '.testi-badge',
        '.testi-heading',
        '.testi-desc',
        '.testi-card',
      ]

      // Set initial states before ScrollTrigger calculates positions
      gsap.set(elements, {
        willChange: 'transform, opacity',
      })

      gsap.set('.testi-badge', {
        y: -15,
        opacity: 0,
      })

      gsap.set('.testi-heading', {
        y: 25,
        opacity: 0,
      })

      gsap.set('.testi-desc', {
        y: 20,
        opacity: 0,
      })

      gsap.set('.testi-card', {
        y: 35,
        opacity: 0,
      })

      // Main entrance animation with fast, snappy timing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: {
          ease: 'power3.out',
        },
      })

      tl.to('.testi-badge', {
        y: 0,
        opacity: 1,
        duration: 0.4,
      })

        .to(
          '.testi-heading',
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          },
          '-=0.25'
        )

        .to(
          '.testi-desc',
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
          },
          '-=0.3'
        )

        .to(
          '.testi-card',
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1, // Quick, smooth cascade across cards
          },
          '-=0.25'
        )

      // Smooth card hover animations
      const cards = gsap.utils.toArray('.testi-card')

      cards.forEach((card) => {
        const hoverIn = () => {
          gsap.to(card, {
            y: -6,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }

        const hoverOut = () => {
          gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }

        card.addEventListener('mouseenter', hoverIn)
        card.addEventListener('mouseleave', hoverOut)

        card._testiHoverIn = hoverIn
        card._testiHoverOut = hoverOut
      })

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })

      return () => {
        cards.forEach((card) => {
          card.removeEventListener('mouseenter', card._testiHoverIn)
          card.removeEventListener('mouseleave', card._testiHoverOut)
          delete card._testiHoverIn
          delete card._testiHoverOut
        })
      }
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

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
      <div className="max-w-7xl mx-auto flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center max-w-3xl mb-12 sm:mb-16">
          <div className="testi-badge inline-flex items-center mb-4">
            <span
              className="
                paragraph
                bg-[var(--secondary-light)]
                text-[var(--secondary-hover)]
                text-xs
                font-semibold
                tracking-widest
                uppercase
                px-3.5
                py-1
                rounded-md
                border
                border-[var(--secondary)]/20
              "
            >
              Testimonials
            </span>
          </div>

          <h2
            className="
              testi-heading
              heading
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-black
              uppercase
              tracking-tight
              text-[var(--text-primary)]
              mb-4
              leading-tight
            "
          >
            What Our Community{' '}
            <span className="text-[var(--secondary)]">Says</span>
          </h2>

          <p
            className="
              testi-desc
              paragraph
              text-base
              sm:text-lg
              text-[var(--text-secondary)]
              leading-relaxed
            "
          >
            Hear firsthand from parents, students, and alumni about their transformative experiences and journey with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
          
          {/* Card 1 */}
          <div
            className="
              testi-card
              bg-[var(--surface)]
              p-8
              rounded-2xl
              border
              border-[var(--neutral-200)]
              shadow-sm
              flex
              flex-col
              justify-between
              transition-colors
              duration-300
              hover:border-[var(--secondary)]/40
              transform-gpu
            "
          >
            <div>
              {/* Star Rating */}
              <div className="flex gap-1 text-[var(--secondary)] mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="paragraph text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-8">
                &ldquo;The faculty’s dedication to holistic learning is incredible. My child has grown not just academically, but in confidence and leadership skills.&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[var(--neutral-200)]/60">
              <div className="w-12 h-12 rounded-full bg-[var(--secondary-light)] text-[var(--secondary)] font-bold flex items-center justify-center text-base">
                SA
              </div>
              <div>
                <h4 className="heading font-bold text-[var(--text-primary)] text-sm sm:text-base">Sarah Ahmed</h4>
                <p className="paragraph text-xs text-[var(--text-secondary)]">Parent of Grade 6 Student</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="
              testi-card
              bg-[var(--surface)]
              p-8
              rounded-2xl
              border
              border-[var(--neutral-200)]
              shadow-sm
              flex
              flex-col
              justify-between
              transition-colors
              duration-300
              hover:border-[var(--secondary)]/40
              transform-gpu
            "
          >
            <div>
              {/* Star Rating */}
              <div className="flex gap-1 text-[var(--secondary)] mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="paragraph text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-8">
                &ldquo;Studying here gave me an international perspective. The interactive classrooms and supportive mentors truly prepared me for university life.&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[var(--neutral-200)]/60">
              <div className="w-12 h-12 rounded-full bg-[var(--secondary-light)] text-[var(--secondary)] font-bold flex items-center justify-center text-base">
                MK
              </div>
              <div>
                <h4 className="heading font-bold text-[var(--text-primary)] text-sm sm:text-base">Michael Khan</h4>
                <p className="paragraph text-xs text-[var(--text-secondary)]">Alumnus (Class of ’24)</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="
              testi-card
              bg-[var(--surface)]
              p-8
              rounded-2xl
              border
              border-[var(--neutral-200)]
              shadow-sm
              flex
              flex-col
              justify-between
              transition-colors
              duration-300
              hover:border-[var(--secondary)]/40
              transform-gpu
            "
          >
            <div>
              {/* Star Rating */}
              <div className="flex gap-1 text-[var(--secondary)] mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="paragraph text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-8">
                &ldquo;The admission process was smooth, and the administration has been extremely responsive. We couldn’t have asked for a better school environment.&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[var(--neutral-200)]/60">
              <div className="w-12 h-12 rounded-full bg-[var(--secondary-light)] text-[var(--secondary)] font-bold flex items-center justify-center text-base">
                DR
              </div>
              <div>
                <h4 className="heading font-bold text-[var(--text-primary)] text-sm sm:text-base">David & Rachel</h4>
                <p className="paragraph text-xs text-[var(--text-secondary)]">Parents of Grade 3 Student</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default Testimonials