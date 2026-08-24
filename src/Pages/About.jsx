import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import Breadcrumbs from '../components/Breadcrumbs'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const elements = ['.about-hero-img', '.about-stat', '.about-value-card', '.about-team-card']
      
      gsap.set(elements, { willChange: 'transform, opacity' })
      gsap.set('.about-hero-img', { y: 30, opacity: 0 })
      gsap.set('.about-stat', { y: 25, opacity: 0 })
      gsap.set('.about-value-card', { y: 35, opacity: 0 })
      gsap.set('.about-team-card', { y: 30, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.about-hero-img', { y: 0, opacity: 1, duration: 0.7 })
        .to('.about-stat', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.3')
        .to('.about-value-card', { y: 0, opacity: 1, duration: 0.65, stagger: 0.1 }, '-=0.3')
        .to('.about-team-card', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.3')

      const cards = gsap.utils.toArray(['.about-value-card', '.about-team-card'])
      cards.forEach((card) => {
        const hoverIn = () => {
          gsap.to(card, { y: -5, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
        }
        const hoverOut = () => {
          gsap.to(card, { y: 0, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
        }
        card.addEventListener('mouseenter', hoverIn)
        card.addEventListener('mouseleave', hoverOut)
        card._aboutHoverIn = hoverIn
        card._aboutHoverOut = hoverOut
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        cards.forEach((card) => {
          card.removeEventListener('mouseenter', card._aboutHoverIn)
          card.removeEventListener('mouseleave', card._aboutHoverOut)
          delete card._aboutHoverIn
          delete card._aboutHoverOut
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  const stats = [
    { value: '20+', label: 'Years of Excellence' },
    { value: '1500+', label: 'Students Enrolled' },
    { value: '100+', label: 'Qualified Teachers' },
    { value: '95%', label: 'University Acceptance' },
  ]

  const values = [
    {
      title: 'Academic Excellence',
      description: 'We strive for the highest standards in education, fostering critical thinking and intellectual curiosity.',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      ),
    },
    {
      title: 'Character Development',
      description: 'We nurture integrity, respect, responsibility, and empathy in every student.',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      ),
    },
    {
      title: 'Inclusive Community',
      description: 'We celebrate diversity and create a welcoming environment for all students and families.',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
    },
    {
      title: 'Innovation & Creativity',
      description: 'We encourage creative thinking, problem-solving, and embracing new ideas and technologies.',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      ),
    },
  ]

  const team = [
    {
      name: 'Dr. Sarah Ahmed',
      position: 'Principal',
      bio: 'Over 20 years of experience in educational leadership, committed to academic excellence and student welfare.',
    },
    {
      name: 'Mr. Omar Khan',
      position: 'Vice Principal',
      bio: 'Dedicated to creating a supportive school culture and fostering student development.',
    },
    {
      name: 'Ms. Fatima Ali',
      position: 'Head of Science',
      bio: 'Passionate about making complex scientific concepts accessible and engaging for all students.',
    },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'About Us' }]} />
      
      <section ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 sm:mb-20">
          <div>
            <SectionHeading
              badge="About Us"
              title="Where Education Meets Global Excellence"
              description="Our school nurtures curious minds, strong character, and lifelong learners through an internationally focused education. We believe every student deserves an environment that inspires growth, creativity, and confidence."
              align="left"
            />
          </div>
          <div className="about-hero-img relative rounded-2xl overflow-hidden shadow-lg h-[320px] sm:h-[400px] bg-[var(--neutral-200)] transform-gpu">
            <img
              src="/About Us/1.jpg"
              alt="Hopenix School Campus"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="about-stat bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 text-center shadow-sm transform-gpu"
            >
              <p className="heading text-3xl sm:text-4xl font-black text-[var(--secondary)] mb-2">
                {stat.value}
              </p>
              <p className="paragraph text-sm text-[var(--text-secondary)] font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="mb-16 sm:mb-20">
          <SectionHeading
            badge="Our Story"
            title="Two Decades of Shaping Futures"
            description="Founded in 2004, Hopenix School has grown from a small community institution to a leading educational center. Our journey has been marked by a commitment to providing world-class education while maintaining our core values of integrity, compassion, and excellence."
          />
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 sm:mb-20">
          <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[var(--secondary-light)] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="heading text-2xl font-bold text-[var(--text)] mb-3">Our Vision</h3>
            <p className="paragraph text-base text-[var(--text-secondary)] leading-relaxed">
              To be a leading educational institution that inspires globally minded students to grow with knowledge, integrity, and compassion in a supportive learning environment.
            </p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[var(--secondary-light)] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="heading text-2xl font-bold text-[var(--text)] mb-3">Our Mission</h3>
            <p className="paragraph text-base text-[var(--text-secondary)] leading-relaxed">
              To provide high-quality education that develops critical thinking, creativity, leadership, and holistic student growth through innovative teaching and personalized learning.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16 sm:mb-20">
          <SectionHeading
            badge="Core Values"
            title="What We Stand For"
            description="Our core values guide everything we do and shape the character of our students."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="about-value-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300 transform-gpu"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--secondary-light)] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {value.icon}
                  </svg>
                </div>
                <h3 className="heading text-lg font-bold text-[var(--text)] mb-2">{value.title}</h3>
                <p className="paragraph text-sm text-[var(--text-secondary)] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Principal's Message */}
        <div className="mb-16 sm:mb-20">
          <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-8 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-[var(--neutral-200)] mx-auto md:mx-0">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                    alt="Dr. Sarah Ahmed - Principal"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="heading text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4">
                  Principal's Message
                </h3>
                <p className="paragraph text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                  "At Hopenix School, we believe that education is not just about academic achievement, but about developing well-rounded individuals who are prepared to make a positive impact on the world."
                </p>
                <p className="paragraph text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                  "Our dedicated team of educators works tirelessly to create a nurturing environment where every student can thrive academically, socially, and emotionally."
                </p>
                <div>
                  <p className="heading text-lg font-bold text-[var(--text)]">Dr. Sarah Ahmed</p>
                  <p className="paragraph text-sm text-[var(--secondary)] font-semibold">Principal, Hopenix School</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16 sm:mb-20">
          <SectionHeading
            badge="Leadership"
            title="Meet Our Team"
            description="Our experienced leadership team is dedicated to providing the best educational experience for every student."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="about-team-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300 transform-gpu"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--neutral-200)] mb-4 mx-auto">
                  <img
                    src={`https://images.unsplash.com/photo-${idx === 0 ? '1573496359142-b8d87734a5a2' : idx === 1 ? '1472099645785-565842c74378' : '1580489944761-15a19d654956'}?auto=format&fit=crop&w=200&q=80`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    }}
                  />
                </div>
                <h3 className="heading text-lg font-bold text-[var(--text)] text-center mb-1">{member.name}</h3>
                <p className="paragraph text-sm text-[var(--secondary)] font-semibold text-center mb-3">{member.position}</p>
                <p className="paragraph text-sm text-[var(--text-secondary)] text-center leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Join Our Community?"
        description="Take the first step toward an exciting educational journey for your child."
        buttonText="Apply for Admission"
        buttonLink="/admissions"
        variant="primary"
      />
    </>
  )
}

export default About
