import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAdmissions, formatAdmissionDate } from '../lib/admissions-service'

gsap.registerPlugin(ScrollTrigger)

const Admissions = () => {
  const sectionRef = useRef(null)
  const { admissions, loading } = useAdmissions()

  useLayoutEffect(() => {
    if (loading || !admissions) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const elements = [
        '.adm-hero-badge',
        '.adm-hero-title',
        '.adm-hero-desc',
        '.adm-hero-cta',
        '.adm-status-card',
        '.adm-class-card',
        '.adm-process-section',
        '.adm-process-step',
        '.adm-doc-section',
        '.adm-doc-item',
        '.adm-req-section',
        '.adm-req-item',
        '.adm-timeline-section',
        '.adm-timeline-item',
        '.adm-fees-section',
        '.adm-fee-item',
        '.adm-contact-section',
        '.adm-final-cta',
      ]

      gsap.set(elements, { willChange: 'transform, opacity' })
      gsap.set('.adm-hero-badge', { y: -18, opacity: 0 })
      gsap.set('.adm-hero-title', { y: 35, opacity: 0 })
      gsap.set('.adm-hero-desc', { y: 25, opacity: 0 })
      gsap.set('.adm-hero-cta', { y: 20, opacity: 0 })
      gsap.set('.adm-status-card', { y: 30, opacity: 0 })
      gsap.set('.adm-class-card', { y: 40, opacity: 0 })
      gsap.set('.adm-process-section', { y: 30, opacity: 0 })
      gsap.set('.adm-process-step', { y: 25, opacity: 0 })
      gsap.set('.adm-doc-section', { y: 30, opacity: 0 })
      gsap.set('.adm-doc-item', { x: -20, opacity: 0 })
      gsap.set('.adm-req-section', { y: 30, opacity: 0 })
      gsap.set('.adm-req-item', { x: -20, opacity: 0 })
      gsap.set('.adm-timeline-section', { y: 30, opacity: 0 })
      gsap.set('.adm-timeline-item', { y: 20, opacity: 0 })
      gsap.set('.adm-fees-section', { y: 30, opacity: 0 })
      gsap.set('.adm-fee-item', { y: 20, opacity: 0 })
      gsap.set('.adm-contact-section', { y: 30, opacity: 0 })
      gsap.set('.adm-final-cta', { y: 35, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.adm-hero-badge', { y: 0, opacity: 1, duration: 0.65 })
        .to('.adm-hero-title', { y: 0, opacity: 1, duration: 0.8 }, '-=0.35')
        .to('.adm-hero-desc', { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
        .to('.adm-hero-cta', { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .to('.adm-status-card', { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
        .to('.adm-class-card', {
          y: 0, opacity: 1, duration: 0.7,
          stagger: { each: 0.12, from: 'start' },
        }, '-=0.3')
        .to('.adm-process-section', { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
        .to('.adm-process-step', {
          y: 0, opacity: 1, duration: 0.6,
          stagger: { each: 0.1, from: 'start' },
        }, '-=0.3')
        .to('.adm-doc-section', { y: 0, opacity: 1, duration: 0.7 }, '-=0.2')
        .to('.adm-doc-item', {
          x: 0, opacity: 1, duration: 0.5,
          stagger: { each: 0.08, from: 'start' },
        }, '-=0.3')
        .to('.adm-req-section', { y: 0, opacity: 1, duration: 0.7 }, '-=0.2')
        .to('.adm-req-item', {
          x: 0, opacity: 1, duration: 0.5,
          stagger: { each: 0.08, from: 'start' },
        }, '-=0.3')
        .to('.adm-timeline-section', { y: 0, opacity: 1, duration: 0.7 }, '-=0.2')
        .to('.adm-timeline-item', {
          y: 0, opacity: 1, duration: 0.5,
          stagger: { each: 0.1, from: 'start' },
        }, '-=0.3')

      // Hover animations for class cards
      const cards = gsap.utils.toArray('.adm-class-card')
      cards.forEach((card) => {
        const hoverIn = () => {
          gsap.to(card, { y: -6, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
        }
        const hoverOut = () => {
          gsap.to(card, { y: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
        }
        card.addEventListener('mouseenter', hoverIn)
        card.addEventListener('mouseleave', hoverOut)
        card._admHoverIn = hoverIn
        card._admHoverOut = hoverOut
      })

      requestAnimationFrame(() => { ScrollTrigger.refresh() })

      return () => {
        cards.forEach((card) => {
          card.removeEventListener('mouseenter', card._admHoverIn)
          card.removeEventListener('mouseleave', card._admHoverOut)
          delete card._admHoverIn
          delete card._admHoverOut
        })
      }
    }, section)

    return () => ctx.revert()
  }, [loading, admissions])

  if (loading) {
    return (
      <section className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-32 h-4 bg-[var(--neutral-200)] rounded-full animate-pulse mb-4" />
          <div className="w-64 h-8 bg-[var(--neutral-200)] rounded-full animate-pulse mb-3" />
          <div className="w-48 h-4 bg-[var(--neutral-200)] rounded-full animate-pulse" />
        </div>
      </section>
    )
  }

  if (!admissions) {
    return (
      <section className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 text-center">
        <p className="paragraph text-lg text-[var(--text-muted)]">
          Admissions information is currently unavailable. Please check back later.
        </p>
      </section>
    )
  }

  const { hero, status, application, classes, process, documents, requirements, timeline, fees, contact } = admissions
  const isOpen = status?.label?.toLowerCase().includes('open')
  const isInternal = (application?.type || 'internal') === 'internal'
  const applicationUrl = isInternal
    ? '/admissions/apply'
    : (application?.url || (contact?.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : contact?.email ? `mailto:${contact.email}` : '/admissions/apply'))

  return (
    <section
      ref={sectionRef}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-[var(--text)]"
    >
      {/* ─── Hero ──────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16 transform-gpu">
        <div className="adm-hero-badge inline-flex items-center gap-2 bg-[var(--secondary-light)] text-[var(--secondary-hover)] text-xs sm:text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-[var(--secondary)]/20 mb-6 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {hero?.title || 'Admissions'} {status?.session ? `${status.session}` : ''}
        </div>

        <h1 className="adm-hero-title heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-4 leading-tight max-w-4xl">
          {hero?.subtitle || 'Begin Your Journey With Us'}
        </h1>

        <p className="adm-hero-desc paragraph text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-8">
          {hero?.description || 'Give your child a place to learn, grow, discover, and thrive.'}
        </p>

        <div className="adm-hero-cta flex flex-wrap gap-4 justify-center">
          {application?.enabled && (
            <Link
              to={applicationUrl}
              className="px-8 py-3.5 rounded-full bg-[var(--secondary)] text-white font-bold text-sm sm:text-base hover:bg-[var(--secondary-hover)] transition-colors duration-300 shadow-md active:scale-95"
            >
              {application?.label || 'Apply Now'}
            </Link>
          )}
          <a
            href="#admission-process"
            className="px-8 py-3.5 rounded-full border-2 border-[var(--secondary)] text-[var(--secondary)] font-bold text-sm sm:text-base hover:bg-[var(--secondary)] hover:text-white transition-colors duration-300 active:scale-95"
          >
            Admission Process ↓
          </a>
        </div>
      </div>

      {/* ─── Admission Status ──────────────────────────────── */}
      {status && (
        <div className="adm-status-card mb-12 sm:mb-16 bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm text-center transform-gpu">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 ${isOpen ? 'bg-[var(--success-light)] text-[var(--success)]' : 'bg-[var(--error-light)] text-[var(--error)]'}`}>
            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-[var(--success)]' : 'bg-[var(--error)]'}`} />
            {status.label || 'Status Unavailable'}
          </div>
          {status.session && (
            <h3 className="heading text-xl sm:text-2xl font-bold text-[var(--text)] mb-2">
              Academic Session {status.session}
            </h3>
          )}
          {status.description && (
            <p className="paragraph text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto">
              {status.description}
            </p>
          )}
        </div>
      )}

      {/* ─── Classes / Grades ──────────────────────────────── */}
      {classes && classes.length > 0 && (
        <div className="mb-12 sm:mb-16">
          <h2 className="heading text-2xl sm:text-3xl font-bold text-[var(--text)] text-center mb-8">
            Admissions Open For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="adm-class-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 shadow-sm hover:border-[var(--secondary)]/50 transition-colors duration-300 flex flex-col transform-gpu"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="heading text-lg font-bold text-[var(--text)]">{cls.name}</h3>
                  <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${cls.status === 'open' ? 'bg-[var(--success-light)] text-[var(--success)]' : 'bg-[var(--neutral-100)] text-[var(--text-muted)]'}`}>
                    {cls.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </div>
                {cls.description && (
                  <p className="paragraph text-sm text-[var(--text-secondary)] mb-4 flex-1">{cls.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-[var(--text-muted)] mb-4">
                  {cls.ageRequirement && <span>Age: {cls.ageRequirement}</span>}
                  {cls.seatsAvailable && <span>Seats: {cls.seatsAvailable}</span>}
                </div>
                {cls.status === 'open' && application?.enabled && (
                  <Link
                    to={cls.applicationUrl || applicationUrl}
                    className="w-full text-center px-5 py-2.5 rounded-full bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--secondary-hover)] transition-colors active:scale-95"
                  >
                    Apply Now
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Admission Process ─────────────────────────────── */}
      {process && process.length > 0 && (
        <div id="admission-process" className="mb-12 sm:mb-16">
          <div className="adm-process-section bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-10 shadow-sm transform-gpu">
            <h2 className="heading text-xl sm:text-2xl font-bold text-[var(--text)] text-center mb-8 uppercase tracking-wide">
              Admission Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {process.map((step, idx) => (
                <div key={step.id} className="adm-process-step flex flex-col items-center text-center transform-gpu">
                  <div className="w-10 h-10 rounded-full bg-[var(--secondary)] text-white font-bold flex items-center justify-center mb-4 text-sm shadow-sm">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <h4 className="heading text-base font-bold text-[var(--text)] mb-2">{step.title}</h4>
                  {step.description && (
                    <p className="paragraph text-xs sm:text-sm text-[var(--text-secondary)]">{step.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Documents Required ────────────────────────────── */}
      {documents && documents.length > 0 && (
        <div className="adm-doc-section mb-12 sm:mb-16 transform-gpu">
          <h2 className="heading text-2xl sm:text-3xl font-bold text-[var(--text)] text-center mb-8">
            Documents Required
          </h2>
          <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc) => (
                <div key={doc.id} className="adm-doc-item flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--neutral-50)] transition-colors transform-gpu">
                  <div className="w-6 h-6 rounded-full bg-[var(--success-light)] text-[var(--success)] flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="paragraph text-sm text-[var(--text)]">{doc.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Requirements ──────────────────────────────────── */}
      {requirements && requirements.length > 0 && (
        <div className="adm-req-section mb-12 sm:mb-16 transform-gpu">
          <h2 className="heading text-2xl sm:text-3xl font-bold text-[var(--text)] text-center mb-8">
            Admission Requirements
          </h2>
          <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm">
            <ul className="space-y-3">
              {requirements.map((req) => (
                <li key={req.id} className="adm-req-item flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--neutral-50)] transition-colors transform-gpu">
                  <div className="w-5 h-5 rounded-full bg-[var(--secondary-light)] text-[var(--secondary)] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="paragraph text-sm text-[var(--text)]">{req.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ─── Timeline ──────────────────────────────────────── */}
      {timeline && timeline.length > 0 && (
        <div className="adm-timeline-section mb-12 sm:mb-16 transform-gpu">
          <h2 className="heading text-2xl sm:text-3xl font-bold text-[var(--text)] text-center mb-8">
            Admission Timeline
          </h2>
          <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="space-y-0">
              {timeline.map((item, idx) => (
                <div key={item.id} className="adm-timeline-item flex gap-4 sm:gap-6 transform-gpu">
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-[var(--secondary)] border-2 border-[var(--secondary-light)]" />
                    {idx < timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-[var(--neutral-200)] min-h-[2rem]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-6">
                    <p className="paragraph text-xs font-semibold text-[var(--secondary)] uppercase tracking-wider mb-0.5">
                      {formatAdmissionDate(item.date)}
                    </p>
                    <h4 className="heading text-base font-bold text-[var(--text)]">{item.title}</h4>
                    {item.description && (
                      <p className="paragraph text-sm text-[var(--text-secondary)] mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Fees ──────────────────────────────────────────── */}
      {fees?.enabled && fees.items?.length > 0 && (
        <div className="adm-fees-section mb-12 sm:mb-16 transform-gpu">
          <h2 className="heading text-2xl sm:text-3xl font-bold text-[var(--text)] text-center mb-8">
            Fee Information
          </h2>
          <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fees.items.map((fee) => (
                <div key={fee.id} className="adm-fee-item bg-[var(--background)] border border-[var(--neutral-200)] rounded-xl p-5 text-center transform-gpu">
                  <p className="paragraph text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    {fee.name}
                  </p>
                  <p className="heading text-2xl font-black text-[var(--secondary)]">
                    PKR {fee.amount}
                  </p>
                  {fee.description && (
                    <p className="paragraph text-xs text-[var(--text-secondary)] mt-1">{fee.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Contact Admissions ────────────────────────────── */}
      {(contact?.phone || contact?.email || contact?.address || contact?.whatsapp) && (
        <div className="adm-contact-section mb-12 sm:mb-16 transform-gpu">
          <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-10 shadow-sm text-center">
            <h2 className="heading text-2xl sm:text-3xl font-bold text-[var(--text)] mb-3">
              Have Questions?
            </h2>
            <p className="paragraph text-base text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
              Our admissions team is here to help. Reach out to us through any of the channels below.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--secondary)] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--secondary)] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {contact.email}
                </a>
              )}
              {contact.whatsapp && (
                <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--secondary)] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.482-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.414.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  WhatsApp
                </a>
              )}
              {contact.address && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {contact.address}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Final CTA ─────────────────────────────────────── */}
      {application?.enabled && (
        <div className="adm-final-cta bg-[var(--secondary)] rounded-2xl p-8 sm:p-12 text-center text-white transform-gpu">
          <h2 className="heading text-2xl sm:text-4xl font-black uppercase tracking-tight mb-4">
            Ready to Join Us?
          </h2>
          <p className="paragraph text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-8">
            Take the first step toward an exciting educational journey.
          </p>
          <Link
            to={applicationUrl}
            className="inline-block px-10 py-4 rounded-full bg-white text-[var(--secondary)] font-bold text-base sm:text-lg hover:bg-white/90 transition-colors duration-300 shadow-lg active:scale-95"
          >
            Start Your Application
          </Link>
        </div>
      )}
    </section>
  )
}

export default Admissions
