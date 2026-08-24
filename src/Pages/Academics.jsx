import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import CTASection from '../components/CTASection'
import Breadcrumbs from '../components/Breadcrumbs'

gsap.registerPlugin(ScrollTrigger)

const Academics = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set(['.acad-level-card', '.acad-method-card', '.acad-subject-tag'], { willChange: 'transform, opacity' })
      gsap.set('.acad-level-card', { y: 35, opacity: 0 })
      gsap.set('.acad-method-card', { y: 30, opacity: 0 })
      gsap.set('.acad-subject-tag', { scale: 0.9, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 80%', once: true, invalidateOnRefresh: true },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.acad-level-card', { y: 0, opacity: 1, duration: 0.65, stagger: 0.1 })
        .to('.acad-method-card', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.3')
        .to('.acad-subject-tag', { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05 }, '-=0.3')

      const cards = gsap.utils.toArray('.acad-level-card')
      cards.forEach((card) => {
        const hoverIn = () => gsap.to(card, { y: -5, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
        const hoverOut = () => gsap.to(card, { y: 0, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
        card.addEventListener('mouseenter', hoverIn)
        card.addEventListener('mouseleave', hoverOut)
        card._acadHoverIn = hoverIn
        card._acadHoverOut = hoverOut
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        cards.forEach((card) => {
          card.removeEventListener('mouseenter', card._acadHoverIn)
          card.removeEventListener('mouseleave', card._acadHoverOut)
          delete card._acadHoverIn
          delete card._acadHoverOut
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  const levels = [
    {
      name: 'Early Years',
      grades: 'Playgroup – Kindergarten',
      ages: '2–5 years',
      description: 'A nurturing introduction to structured learning. We build foundational social, cognitive, and motor skills through play-based exploration.',
      highlights: ['Play-based learning', 'Phonics & numeracy', 'Creative arts', 'Social skills'],
    },
    {
      name: 'Primary School',
      grades: 'Grade 1 – Grade 5',
      ages: '5–10 years',
      description: 'Structured academic curriculum with emphasis on core subjects, critical thinking, and character development.',
      highlights: ['Core subjects', 'Project-based learning', 'Language arts', 'Physical education'],
    },
    {
      name: 'Middle School',
      grades: 'Grade 6 – Grade 8',
      ages: '10–13 years',
      description: 'Expanding academic horizons with specialized subjects, research skills, and leadership opportunities.',
      highlights: ['Advanced subjects', 'Research projects', 'Leadership programs', 'Competitions'],
    },
    {
      name: 'High School',
      grades: 'Grade 9 – Grade 12',
      ages: '13–18 years',
      description: 'Rigorous academic preparation for university and beyond, with personalized learning pathways and career guidance.',
      highlights: ['University prep', 'Career counseling', 'Advanced placement', 'Internships'],
    },
  ]

  const methods = [
    {
      title: 'Inquiry-Based Learning',
      description: 'Students explore concepts through questions, research, and discovery, developing critical thinking skills.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      title: 'Collaborative Learning',
      description: 'Group projects and discussions that build teamwork, communication, and social skills.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    },
    {
      title: 'Technology Integration',
      description: 'Smart classrooms, digital tools, and coding programs that prepare students for the future.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    },
    {
      title: 'Assessment & Feedback',
      description: 'Continuous assessment through projects, presentations, portfolios, and traditional examinations.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    },
  ]

  const subjects = [
    'Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology',
    'Computer Science', 'History', 'Geography', 'Urdu', 'Islamic Studies',
    'Art & Design', 'Physical Education', 'Economics', 'Business Studies',
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Academics' }]} />

      <section ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Hero */}
        <SectionHeading
          badge="Academics"
          title="Future-Ready Learning Pathways"
          description="Our comprehensive academic program combines rigorous education with personalized learning, preparing students for top universities and successful careers worldwide."
        />

        {/* Academic Levels */}
        <div className="mb-16 sm:mb-20">
          <h3 className="heading text-2xl sm:text-3xl font-bold text-[var(--text)] text-center mb-8">
            Our Academic Levels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {levels.map((level, idx) => (
              <div
                key={idx}
                className="acad-level-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300 flex flex-col transform-gpu"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--secondary)] text-white font-bold flex items-center justify-center mb-4 text-sm shadow-sm">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h4 className="heading text-lg font-bold text-[var(--text)] mb-1">{level.name}</h4>
                <p className="paragraph text-xs font-semibold text-[var(--secondary)] uppercase tracking-wider mb-2">{level.grades}</p>
                <p className="paragraph text-xs text-[var(--text-muted)] mb-3">Ages: {level.ages}</p>
                <p className="paragraph text-sm text-[var(--text-secondary)] leading-relaxed mb-4 flex-1">{level.description}</p>
                <ul className="space-y-1.5">
                  {level.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects */}
        <div className="mb-16 sm:mb-20">
          <SectionHeading
            badge="Subjects"
            title="What Students Learn"
            description="Our diverse curriculum covers core academic subjects and elective courses to provide a well-rounded education."
          />
          <div className="flex flex-wrap justify-center gap-3">
            {subjects.map((subject, idx) => (
              <span
                key={idx}
                className="acad-subject-tag paragraph px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--neutral-200)] text-sm font-medium text-[var(--text)] hover:border-[var(--secondary)]/40 hover:text-[var(--secondary)] transition-colors duration-200 transform-gpu"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* Teaching Methodology */}
        <div className="mb-16 sm:mb-20">
          <SectionHeading
            badge="Methodology"
            title="How We Teach"
            description="Our teaching methodology emphasizes active learning, critical thinking, and real-world application."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {methods.map((method, idx) => (
              <div
                key={idx}
                className="acad-method-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300 transform-gpu"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--secondary-light)] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {method.icon}
                  </svg>
                </div>
                <h4 className="heading text-lg font-bold text-[var(--text)] mb-2">{method.title}</h4>
                <p className="paragraph text-sm text-[var(--text-secondary)] leading-relaxed">{method.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment */}
        <div className="mb-16 sm:mb-20">
          <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-8 sm:p-10 shadow-sm">
            <h3 className="heading text-2xl font-bold text-[var(--text)] text-center mb-6">Assessment System</h3>
            <p className="paragraph text-base text-[var(--text-secondary)] text-center max-w-2xl mx-auto mb-8 leading-relaxed">
              We believe assessment is not just about testing — it's about understanding each student's learning journey. Our multi-faceted approach ensures comprehensive evaluation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--secondary-light)] flex items-center justify-center mx-auto mb-3">
                  <span className="heading text-sm font-bold text-[var(--secondary)]">01</span>
                </div>
                <h4 className="heading text-base font-bold text-[var(--text)] mb-1">Formative</h4>
                <p className="paragraph text-xs text-[var(--text-secondary)]">Class activities, quizzes, and ongoing observation</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--secondary-light)] flex items-center justify-center mx-auto mb-3">
                  <span className="heading text-sm font-bold text-[var(--secondary)]">02</span>
                </div>
                <h4 className="heading text-base font-bold text-[var(--text)] mb-1">Portfolio</h4>
                <p className="paragraph text-xs text-[var(--text-secondary)]">Collection of student work showcasing growth</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--secondary-light)] flex items-center justify-center mx-auto mb-3">
                  <span className="heading text-sm font-bold text-[var(--secondary)]">03</span>
                </div>
                <h4 className="heading text-base font-bold text-[var(--text)] mb-1">Summative</h4>
                <p className="paragraph text-xs text-[var(--text-secondary)]">Term exams and annual examinations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Join Hopenix?"
        description="Explore our admission process and give your child the gift of world-class education."
        buttonText="Learn About Admissions"
        buttonLink="/admissions"
        variant="primary"
      />
    </>
  )
}

export default Academics
