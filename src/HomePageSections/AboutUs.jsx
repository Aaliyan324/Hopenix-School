import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const AboutUs = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const ctx = gsap.context(() => {
      const elements = [
        '.about-badge',
        '.about-heading',
        '.about-desc',
        '.about-img-1',
        '.vision-card',
        '.mission-card',
        '.about-img-2',
      ]

      // Set initial states before ScrollTrigger calculates positions
      gsap.set(elements, {
        willChange: 'transform, opacity',
      })

      gsap.set('.about-badge', {
        y: -15,
        opacity: 0,
      })

      gsap.set('.about-heading', {
        y: 25,
        opacity: 0,
      })

      gsap.set('.about-desc', {
        y: 20,
        opacity: 0,
      })

      gsap.set('.about-img-1', {
        y: 35,
        opacity: 0,
      })

      gsap.set('.vision-card', {
        y: 25,
        opacity: 0,
      })

      gsap.set('.mission-card', {
        y: 25,
        opacity: 0,
      })

      gsap.set('.about-img-2', {
        y: 35,
        opacity: 0,
      })

      // Main entrance animation (faster durations and earlier start trigger)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 90%', // Triggers sooner as the section enters the screen
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: {
          ease: 'power3.out',
        },
      })

      tl.to('.about-badge', {
        y: 0,
        opacity: 1,
        duration: 0.4,
      })

        .to(
          '.about-heading',
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          },
          '-=0.25'
        )

        .to(
          '.about-desc',
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
          },
          '-=0.3'
        )

        .to(
          '.about-img-1',
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          },
          '-=0.2'
        )

        .to(
          ['.vision-card', '.mission-card'],
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08, // Quicker stagger between cards
          },
          '-=0.25'
        )

        .to(
          '.about-img-2',
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          },
          '-=0.2'
        )

      // Smooth card hover animations
      const cards = gsap.utils.toArray([
        '.vision-card',
        '.mission-card',
      ])

      cards.forEach((card) => {
        const line = card.querySelector('.about-card-line')

        const hoverIn = () => {
          gsap.to(card, {
            y: -5,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          })

          if (line) {
            gsap.to(line, {
              width: '2.5rem',
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }
        }

        const hoverOut = () => {
          gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto',
          })

          if (line) {
            gsap.to(line, {
              width: '2rem',
              duration: 0.3,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          }
        }

        card.addEventListener('mouseenter', hoverIn)
        card.addEventListener('mouseleave', hoverOut)

        card._aboutHoverIn = hoverIn
        card._aboutHoverOut = hoverOut
      })

      // Refresh after layout has settled
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })

      return () => {
        cards.forEach((card) => {
          card.removeEventListener(
            'mouseenter',
            card._aboutHoverIn
          )

          card.removeEventListener(
            'mouseleave',
            card._aboutHoverOut
          )

          delete card._aboutHoverIn
          delete card._aboutHoverOut
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
      id="about"
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
      <div
        className="
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          lg:grid-cols-12
          gap-12
          lg:gap-16
          items-center
        "
      >

        {/* About Content */}
        <div
          className="
            lg:col-span-6
            lg:col-start-7
            flex
            flex-col
            gap-6
            order-1
            lg:order-2
          "
        >

          {/* Badge */}
          <div className="flex flex-col gap-4">

            <div className="about-badge inline-flex items-center">
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
                About Us
              </span>
            </div>

            {/* Heading */}
            <h2
              className="
                about-heading
                heading
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-black
                uppercase
                tracking-tight
                text-[var(--text-primary)]
                leading-tight
              "
            >
              Where Education Meets{' '}
              <span className="text-[var(--secondary)]">
                Global Excellence
              </span>
            </h2>

            {/* Description */}
            <p
              className="
                about-desc
                paragraph
                text-base
                text-[var(--text-secondary)]
                leading-relaxed
              "
            >
              Our school nurtures curious minds, strong character,
              and lifelong learners through an internationally
              focused education. We believe every student deserves
              an environment that inspires growth, creativity, and
              confidence.
            </p>
          </div>

          {/* Secondary Image */}
          <div
            className="
              about-img-2
              relative
              rounded-2xl
              overflow-hidden
              shadow-md
              h-[240px]
              sm:h-[280px]
              bg-[var(--neutral-200)]
              group
              transform-gpu
            "
          >
            <img
              src="/About Us/2.jpg"
              alt="Students studying in classroom"
              className="
                w-full
                h-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-105
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/30
                via-transparent
                to-transparent
                pointer-events-none
              "
            />
          </div>
        </div>

        {/* Images + Vision / Mission */}
        <div
          className="
            lg:col-span-6
            flex
            flex-col
            gap-6
            order-2
            lg:order-1
          "
        >

          {/* Primary Image */}
          <div
            className="
              about-img-1
              relative
              rounded-2xl
              overflow-hidden
              shadow-md
              h-[280px]
              sm:h-[340px]
              bg-[var(--neutral-200)]
              group
              transform-gpu
            "
          >
            <img
              src="/About Us/1.jpg"
              alt="Students jumping in hallway"
              className="
                w-full
                h-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-105
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/30
                via-transparent
                to-transparent
                pointer-events-none
              "
            />
          </div>

          {/* Vision & Mission */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-5
            "
          >

            {/* Vision */}
            <div
              className="
                vision-card
                bg-[var(--surface)]
                p-6
                rounded-2xl
                border
                border-[var(--neutral-200)]
                shadow-sm
                transition-colors
                duration-300
                hover:border-[var(--secondary)]/40
                transform-gpu
              "
            >
              <div
                className="
                  about-card-line
                  w-8
                  h-1
                  bg-[var(--secondary)]
                  rounded-full
                  mb-4
                "
              />

              <h3
                className="
                  heading
                  text-xl
                  font-bold
                  text-[var(--text-primary)]
                  mb-2
                "
              >
                Our Vision
              </h3>

              <p
                className="
                  paragraph
                  text-sm
                  text-[var(--text-secondary)]
                  leading-relaxed
                "
              >
                We inspire globally minded students to grow with
                knowledge, integrity, and compassion in a supportive
                learning environment.
              </p>
            </div>

            {/* Mission */}
            <div
              className="
                mission-card
                bg-[var(--surface)]
                p-6
                rounded-2xl
                border
                border-[var(--neutral-200)]
                shadow-sm
                transition-colors
                duration-300
                hover:border-[var(--secondary)]/40
                transform-gpu
              "
            >
              <div
                className="
                  about-card-line
                  w-8
                  h-1
                  bg-[var(--secondary)]
                  rounded-full
                  mb-4
                "
              />

              <h3
                className="
                  heading
                  text-xl
                  font-bold
                  text-[var(--text-primary)]
                  mb-2
                "
              >
                Our Mission
              </h3>

              <p
                className="
                  paragraph
                  text-sm
                  text-[var(--text-secondary)]
                  leading-relaxed
                "
              >
                We provide high-quality education that develops
                critical thinking, creativity, leadership, and
                holistic student growth.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default AboutUs