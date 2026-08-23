import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Admissions = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const ctx = gsap.context(() => {
      // Set initial states before ScrollTrigger starts calculating positions
      gsap.set(
        [
          '.adm-badge',
          '.adm-heading',
          '.adm-desc',
          '.adm-card',
          '.adm-process',
          '.adm-step',
        ],
        {
          willChange: 'transform, opacity',
        }
      )

      gsap.set('.adm-badge', {
        y: -18,
        opacity: 0,
      })

      gsap.set('.adm-heading', {
        y: 35,
        opacity: 0,
      })

      gsap.set('.adm-desc', {
        y: 25,
        opacity: 0,
      })

      gsap.set('.adm-card', {
        y: 45,
        opacity: 0,
      })

      gsap.set('.adm-process', {
        y: 35,
        opacity: 0,
      })

      gsap.set('.adm-step', {
        y: 25,
        opacity: 0,
      })

      // Main section entrance timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: {
          ease: 'power3.out',
        },
      })

      tl.to('.adm-badge', {
        y: 0,
        opacity: 1,
        duration: 0.65,
      })

        .to(
          '.adm-heading',
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          '-=0.35'
        )

        .to(
          '.adm-desc',
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          '-=0.5'
        )

        // Cards enter one after another
        .to(
          '.adm-card',
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: {
              each: 0.15,
              from: 'start',
            },
          },
          '-=0.25'
        )

        // Process container
        .to(
          '.adm-process',
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
          },
          '-=0.3'
        )

        // Steps
        .to(
          '.adm-step',
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: {
              each: 0.12,
              from: 'start',
            },
          },
          '-=0.4'
        )

      // Small hover animation for cards
      const cards = gsap.utils.toArray('.adm-card')

      cards.forEach((card) => {
        const icon = card.querySelector('.adm-icon')
        const button = card.querySelector('.adm-button')

        const hoverIn = () => {
          gsap.to(card, {
            y: -6,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          })

          if (icon) {
            gsap.to(icon, {
              scale: 1.08,
              rotate: 2,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }

          if (button) {
            gsap.to(button, {
              scale: 1.02,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }
        }

        const hoverOut = () => {
          gsap.to(card, {
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: 'auto',
          })

          if (icon) {
            gsap.to(icon, {
              scale: 1,
              rotate: 0,
              duration: 0.4,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          }

          if (button) {
            gsap.to(button, {
              scale: 1,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }
        }

        card.addEventListener('mouseenter', hoverIn)
        card.addEventListener('mouseleave', hoverOut)

        // Cleanup listeners
        card._admHoverIn = hoverIn
        card._admHoverOut = hoverOut
      })

      // Refresh after everything has been registered
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })

      return () => {
        cards.forEach((card) => {
          card.removeEventListener('mouseenter', card._admHoverIn)
          card.removeEventListener('mouseleave', card._admHoverOut)

          delete card._admHoverIn
          delete card._admHoverOut
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
        bg-[var(--background)]
        p-6
        sm:p-12
        md:p-16
        lg:p-20
      "
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center max-w-3xl mb-12 sm:mb-16">

          <div
            className="
              adm-badge
              inline-flex
              items-center
              gap-2
              bg-[var(--secondary-light)]
              text-[var(--secondary-hover)]
              text-xs
              sm:text-sm
              font-semibold
              tracking-widest
              uppercase
              px-4
              py-1.5
              rounded-full
              border
              border-[var(--secondary)]/20
              mb-6
              shadow-sm
            "
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>

            Admissions 2026–2027
          </div>

          <h2
            className="
              adm-heading
              heading
              text-3xl
              sm:text-5xl
              lg:text-6xl
              font-black
              uppercase
              tracking-tight
              text-[var(--text-primary)]
              mb-4
              leading-tight
            "
          >
            Take the First Step Toward{' '}
            <span className="text-[var(--secondary)]">
              Excellence
            </span>
          </h2>

          <p
            className="
              adm-desc
              paragraph
              text-base
              sm:text-lg
              text-[var(--text-secondary)]
              leading-relaxed
            "
          >
            Begin your journey with Hopenix School. Explore our admission
            requirements, review guidelines, or submit your application
            online in minutes.
          </p>
        </div>

        {/* Dual Action Cards */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
            w-full
            mb-16
          "
        >

          {/* Online Admission */}
          <div
            className="
              adm-card
              bg-[var(--surface)]
              p-8
              sm:p-10
              rounded-3xl
              border
              border-[var(--neutral-200)]
              shadow-sm
              flex
              flex-col
              justify-between
              group
              hover:border-[var(--secondary)]/50
              transition-colors
              duration-300
            "
          >
            <div>

              <div
                className="
                  adm-icon
                  w-14
                  h-14
                  rounded-2xl
                  bg-[var(--secondary-light)]
                  text-[var(--secondary)]
                  flex
                  items-center
                  justify-center
                  mb-6
                  transform-gpu
                "
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>

              <h3
                className="
                  heading
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-[var(--text-primary)]
                  mb-3
                "
              >
                Online Admission Portal
              </h3>

              <p
                className="
                  paragraph
                  text-sm
                  sm:text-base
                  text-[var(--text-secondary)]
                  leading-relaxed
                  mb-8
                "
              >
                Ready to join us? Fill out our secure digital application
                form, upload necessary documents, and track your admission
                status instantly online.
              </p>
            </div>

            <button
              className="
                adm-button
                w-full
                sm:w-auto
                px-8
                py-3.5
                rounded-full
                bg-[var(--secondary)]
                text-white
                font-bold
                text-sm
                sm:text-base
                hover:bg-[var(--secondary-hover)]
                transition-colors
                duration-300
                shadow-md
                active:scale-95
                text-center
              "
            >
              Apply Online Now
            </button>
          </div>

          {/* Admission Guide */}
          <div
            className="
              adm-card
              bg-[var(--surface)]
              p-8
              sm:p-10
              rounded-3xl
              border
              border-[var(--neutral-200)]
              shadow-sm
              flex
              flex-col
              justify-between
              group
              hover:border-[var(--secondary)]/50
              transition-colors
              duration-300
            "
          >
            <div>

              <div
                className="
                  adm-icon
                  w-14
                  h-14
                  rounded-2xl
                  bg-[var(--secondary-light)]
                  text-[var(--secondary)]
                  flex
                  items-center
                  justify-center
                  mb-6
                  transform-gpu
                "
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <h3
                className="
                  heading
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-[var(--text-primary)]
                  mb-3
                "
              >
                Admission Details & Guide
              </h3>

              <p
                className="
                  paragraph
                  text-sm
                  sm:text-base
                  text-[var(--text-secondary)]
                  leading-relaxed
                  mb-8
                "
              >
                Download our comprehensive school prospectus, review
                grade-wise fee structures, eligibility criteria, and key
                academic dates.
              </p>
            </div>

            <button
              className="
                adm-button
                w-full
                sm:w-auto
                px-8
                py-3.5
                rounded-full
                border-2
                border-[var(--secondary)]
                text-[var(--secondary)]
                font-bold
                text-sm
                sm:text-base
                hover:bg-[var(--secondary)]
                hover:text-white
                transition-colors
                duration-300
                active:scale-95
                text-center
              "
            >
              Download Prospectus
            </button>
          </div>
        </div>

        {/* Admission Process */}
        <div
          className="
            adm-process
            w-full
            bg-[var(--surface)]
            p-8
            sm:p-10
            rounded-3xl
            border
            border-[var(--neutral-200)]
            shadow-sm
          "
        >

          <h4
            className="
              heading
              text-xl
              font-bold
              text-[var(--text-primary)]
              mb-6
              text-center
              uppercase
              tracking-wide
            "
          >
            Admission Process in 3 Simple Steps
          </h4>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
            "
          >

            {/* Step 1 */}
            <div
              className="
                adm-step
                flex
                flex-col
                items-center
                text-center
                p-4
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-[var(--secondary)]
                  text-white
                  font-bold
                  flex
                  items-center
                  justify-center
                  mb-4
                  text-sm
                  shadow-sm
                "
              >
                01
              </div>

              <h5
                className="
                  heading
                  text-lg
                  font-bold
                  text-[var(--text-primary)]
                  mb-2
                "
              >
                Submit Application
              </h5>

              <p
                className="
                  paragraph
                  text-xs
                  sm:text-sm
                  text-[var(--text-secondary)]
                "
              >
                Complete our online application form with student details
                and previous academic records.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="
                adm-step
                flex
                flex-col
                items-center
                text-center
                p-4
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-[var(--secondary)]
                  text-white
                  font-bold
                  flex
                  items-center
                  justify-center
                  mb-4
                  text-sm
                  shadow-sm
                "
              >
                02
              </div>

              <h5
                className="
                  heading
                  text-lg
                  font-bold
                  text-[var(--text-primary)]
                  mb-2
                "
              >
                Assessment & Interview
              </h5>

              <p
                className="
                  paragraph
                  text-xs
                  sm:text-sm
                  text-[var(--text-secondary)]
                "
              >
                Participate in an interactive assessment session and a
                friendly family interview.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="
                adm-step
                flex
                flex-col
                items-center
                text-center
                p-4
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-[var(--secondary)]
                  text-white
                  font-bold
                  flex
                  items-center
                  justify-center
                  mb-4
                  text-sm
                  shadow-sm
                "
              >
                03
              </div>

              <h5
                className="
                  heading
                  text-lg
                  font-bold
                  text-[var(--text-primary)]
                  mb-2
                "
              >
                Enrollment & Welcome
              </h5>

              <p
                className="
                  paragraph
                  text-xs
                  sm:text-sm
                  text-[var(--text-secondary)]
                "
              >
                Receive your official acceptance letter, complete fee
                formalities, and join the family.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default Admissions