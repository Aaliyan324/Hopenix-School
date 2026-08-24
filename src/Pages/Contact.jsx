import { useState, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
  const sectionRef = useRef(null)
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set(['.contact-info-card', '.contact-form-wrap'], { y: 35, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 80%', once: true, invalidateOnRefresh: true },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.contact-info-card', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 })
        .to('.contact-form-wrap', { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')

      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, section)

    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setFormState({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    }, 1500)
  }

  const contactInfo = [
    {
      title: 'Email Us',
      detail: 'info@hopenixschool.edu',
      subdetail: 'We respond within 24 hours',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
      href: 'mailto:info@hopenixschool.edu',
    },
    {
      title: 'Call Us',
      detail: '+92 (300) 1234567',
      subdetail: 'Mon–Fri, 8 AM – 4 PM',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
      href: 'tel:+923001234567',
    },
    {
      title: 'Visit Us',
      detail: '123 Education Lane, Lahore',
      subdetail: 'Punjab, Pakistan',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
      href: '#map',
    },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Contact' }]} />

      <section ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <SectionHeading
          badge="Contact"
          title="Get in Touch"
          description="Have a question or want to learn more? We'd love to hear from you. Reach out through any of the channels below or fill out the contact form."
        />

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, idx) => (
            <a
              key={idx}
              href={info.href}
              className="contact-info-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 text-center shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300 transform-gpu"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--secondary-light)] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {info.icon}
                </svg>
              </div>
              <h3 className="heading text-lg font-bold text-[var(--text)] mb-1">{info.title}</h3>
              <p className="paragraph text-sm text-[var(--secondary)] font-semibold">{info.detail}</p>
              <p className="paragraph text-xs text-[var(--text-muted)] mt-1">{info.subdetail}</p>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="contact-form-wrap bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto transform-gpu">
          <h3 className="heading text-2xl font-bold text-[var(--text)] text-center mb-6">Send Us a Message</h3>
          
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[var(--success-light)] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="heading text-xl font-bold text-[var(--text)] mb-2">Message Sent!</h4>
              <p className="paragraph text-sm text-[var(--text-secondary)]">Thank you for reaching out. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="paragraph text-sm font-medium text-[var(--text)] block mb-1.5">Name *</label>
                  <input
                    id="name" name="name" type="text" required value={formState.name} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--neutral-200)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="paragraph text-sm font-medium text-[var(--text)] block mb-1.5">Email *</label>
                  <input
                    id="email" name="email" type="email" required value={formState.email} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--neutral-200)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="paragraph text-sm font-medium text-[var(--text)] block mb-1.5">Phone</label>
                  <input
                    id="phone" name="phone" type="tel" value={formState.phone} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--neutral-200)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition-colors"
                    placeholder="+92 300 1234567"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="paragraph text-sm font-medium text-[var(--text)] block mb-1.5">Subject *</label>
                  <input
                    id="subject" name="subject" type="text" required value={formState.subject} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--neutral-200)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="paragraph text-sm font-medium text-[var(--text)] block mb-1.5">Message *</label>
                <textarea
                  id="message" name="message" rows="5" required value={formState.message} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--neutral-200)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition-colors resize-none"
                  placeholder="Tell us more..."
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 rounded-full bg-[var(--secondary)] text-white font-bold text-sm hover:bg-[var(--secondary-hover)] transition-colors duration-300 active:scale-95 disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Map Section */}
        <div id="map" className="mt-12 rounded-2xl overflow-hidden border border-[var(--neutral-200)] h-[300px] bg-[var(--neutral-200)]">
          <iframe
            title="Hopenix School Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217886.47901948872!2d74.1551368!3d31.4503564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1690000000000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  )
}

export default Contact
