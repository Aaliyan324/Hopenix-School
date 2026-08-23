import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const contactData = [
  {
    id: 'email',
    title: 'Email Us',
    description: 'Drop us a line anytime and we’ll get back to you within 24 hours.',
    actionText: 'hello@example.com',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
  {
    id: 'phone',
    title: 'Call Us',
    description: 'Speak directly with our team for urgent inquiries and project consultations.',
    actionText: '+1 (555) 234-5678',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    ),
  },
  {
    id: 'office',
    title: 'Visit Our Office',
    description: 'Stop by our studio for a coffee and a face-to-face chat about your vision.',
    actionText: 'Get Directions',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
  },
]

const Contact = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const ctx = gsap.context(() => {
      const animatedElements = [
        '.contact-badge',
        '.contact-heading',
        '.contact-desc',
        '.contact-card',
      ]

      // Establish initial states before ScrollTrigger measures the section
      gsap.set(animatedElements, {
        willChange: 'transform, opacity',
      })

      gsap.set('.contact-badge', {
        y: -18,
        opacity: 0,
      })

      gsap.set('.contact-heading', {
        y: 35,
        opacity: 0,
      })

      gsap.set('.contact-desc', {
        y: 25,
        opacity: 0,
      })

      gsap.set('.contact-card', {
        y: 45,
        opacity: 0,
      })

      // Main entrance timeline
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

      tl.to('.contact-badge', {
        y: 0,
        opacity: 1,
        duration: 0.6,
      })

        .to(
          '.contact-heading',
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          '-=0.3'
        )

        .to(
          '.contact-desc',
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          '-=0.45'
        )

        .to(
          '.contact-card',
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: {
              each: 0.14,
              from: 'start',
            },
          },
          '-=0.25'
        )

      // Smooth card hover animations
      const cards = gsap.utils.toArray('.contact-card')

      cards.forEach((card) => {
        const icon = card.querySelector('.contact-icon')

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
        }

        card.addEventListener('mouseenter', hoverIn)
        card.addEventListener('mouseleave', hoverOut)

        card._contactHoverIn = hoverIn
        card._contactHoverOut = hoverOut
      })

      // Allow the browser to finish layout before refreshing ScrollTrigger
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })

      return () => {
        cards.forEach((card) => {
          card.removeEventListener('mouseenter', card._contactHoverIn)
          card.removeEventListener('mouseleave', card._contactHoverOut)

          delete card._contactHoverIn
          delete card._contactHoverOut
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
        sm:m-6
        md:m-12
        lg:m-16
        overflow-hidden
        rounded-[2rem]
        sm:rounded-3xl
        bg-[var(--secondary)]
        text-white
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
          flex
          flex-col
          items-center
          text-center
        "
      >
        {/* =========================================
            BADGE
            ========================================= */}
        <div
          className="
            contact-badge
            inline-flex
            items-center
            gap-2
            bg-white/15
            backdrop-blur-md
            text-white
            text-xs
            sm:text-sm
            font-semibold
            tracking-widest
            uppercase
            px-4
            py-1.5
            rounded-full
            border
            border-white/20
            mb-6
            shadow-sm
            transform-gpu
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Contact Us
        </div>

        {/* =========================================
            HEADING
            ========================================= */}
        <h2
          className="
            contact-heading
            heading
            text-3xl
            sm:text-5xl
            lg:text-6xl
            font-black
            uppercase
            tracking-tight
            mb-4
            max-w-4xl
            leading-tight
            transform-gpu
          "
        >
          Let's Start a Conversation
        </h2>

        {/* =========================================
            DESCRIPTION
            ========================================= */}
        <p
          className="
            contact-desc
            paragraph
            text-base
            sm:text-lg
            text-white/80
            max-w-2xl
            mb-12
            sm:mb-16
            leading-relaxed
            transform-gpu
          "
        >
          Have a project in mind or want to learn more about our programs? Get in
          touch with our team and we'll respond as quickly as possible.
        </p>

        {/* =========================================
            CONTACT CARDS GRID
            ========================================= */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
            w-full
          "
        >
          {contactData.map((card) => (
            <div
              key={card.id}
              className="
                contact-card
                bg-black/20
                backdrop-blur-sm
                p-8
                sm:p-10
                rounded-2xl
                border
                border-white/10
                flex
                flex-col
                items-center
                text-center
                group
                hover:bg-black/30
                transition-colors
                duration-300
                shadow-lg
                transform-gpu
              "
            >
              <div
                className="
                  contact-icon
                  w-16
                  h-16
                  rounded-2xl
                  bg-white/10
                  flex
                  items-center
                  justify-center
                  mb-6
                  text-white
                  transform-gpu
                "
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {card.icon}
                </svg>
              </div>

              <h3
                className="
                  heading
                  text-2xl
                  font-bold
                  mb-3
                "
              >
                {card.title}
              </h3>

              <p
                className="
                  paragraph
                  text-sm
                  text-white/70
                  leading-relaxed
                  mb-8
                "
              >
                {card.description}
              </p>

              <button
                aria-label={`${card.actionText} for ${card.title}`}
                className="
                  mt-auto
                  px-6
                  py-2.5
                  rounded-full
                  border
                  border-white/30
                  text-sm
                  font-semibold
                  hover:bg-white
                  hover:text-slate-900
                  transition-colors
                  duration-300
                  active:scale-95
                "
              >
                {card.actionText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contact