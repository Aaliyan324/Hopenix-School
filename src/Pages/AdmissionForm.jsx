import { useState, useLayoutEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAdmissions, submitApplication } from '../lib/admissions-service'
import apiClient from '../lib/apiClient'

gsap.registerPlugin(ScrollTrigger)

const emptyForm = {
  studentFirstName: '',
  studentLastName: '',
  studentDOB: '',
  studentGender: '',
  applyingForClass: '',
  previousSchool: '',
  parentFirstName: '',
  parentLastName: '',
  relationship: 'Father',
  parentPhone: '',
  parentEmail: '',
  parentCnic: '',
  address: '',
  city: '',
  message: '',
}

const AdmissionForm = () => {
  const sectionRef = useRef(null)
  const { admissions, loading } = useAdmissions()
  const navigate = useNavigate()

  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState('')

  const openClasses = (admissions?.classes || []).filter((c) => c.status === 'open')

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.set('.form-badge', { y: -18, opacity: 0 })
      gsap.set('.form-title', { y: 35, opacity: 0 })
      gsap.set('.form-desc', { y: 25, opacity: 0 })
      gsap.set('.form-card', { y: 40, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          once: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.form-badge', { y: 0, opacity: 1, duration: 0.65 })
        .to('.form-title', { y: 0, opacity: 1, duration: 0.8 }, '-=0.35')
        .to('.form-desc', { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
        .to('.form-card', { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')

      requestAnimationFrame(() => { ScrollTrigger.refresh() })
    }, section)

    return () => ctx.revert()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.studentFirstName.trim()) errs.studentFirstName = 'First name is required'
    if (!form.studentLastName.trim()) errs.studentLastName = 'Last name is required'
    if (!form.studentDOB) errs.studentDOB = 'Date of birth is required'
    if (!form.studentGender) errs.studentGender = 'Gender is required'
    if (!form.applyingForClass) errs.applyingForClass = 'Please select a class'
    if (!form.parentFirstName.trim()) errs.parentFirstName = 'Guardian first name is required'
    if (!form.parentLastName.trim()) errs.parentLastName = 'Guardian last name is required'
    if (!form.parentPhone.trim()) errs.parentPhone = 'Phone number is required'
    if (!form.parentEmail.trim()) errs.parentEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) errs.parentEmail = 'Invalid email address'
    if (!form.parentCnic.trim()) errs.parentCnic = 'CNIC / B-Form number is required'
    if (!form.address.trim()) errs.address = 'Address is required'
    if (!form.city.trim()) errs.city = 'City is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)
    try {
      const studentFullName = `${form.studentFirstName} ${form.studentLastName}`.trim()
      const parentFullName = `${form.parentFirstName} ${form.parentLastName}`.trim()

      const res = await apiClient.post('/api/admissions', {
        studentName: studentFullName,
        parentName: parentFullName,
        phone: form.parentPhone,
        email: form.parentEmail,
        classApplyingFor: form.applyingForClass,
        message: form.message ? `${form.message} (City: ${form.city})` : `CNIC: ${form.parentCnic}, City: ${form.city}`,
      })

      if (res.success && res.data) {
        setApplicationId(res.data.id || 'ADM-' + Math.floor(1000 + Math.random() * 9000))
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      setErrors({ _form: err.message || 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  // Redirect if internal form is not enabled
  if (!loading && admissions?.application?.type !== 'internal') {
    navigate('/admissions', { replace: true })
    return null
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm paragraph text-[var(--text)]
     bg-[var(--background)] placeholder-[var(--text-light)]
     focus:outline-none focus:ring-1 transition-colors
     ${errors[field]
       ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/30'
       : 'border-[var(--neutral-200)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)]/30'
     }`

  return (
    <section ref={sectionRef} className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-[var(--text)]">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10 sm:mb-12 transform-gpu">
        <div className="form-badge inline-flex items-center gap-2 bg-[var(--secondary-light)] text-[var(--secondary-hover)] text-xs sm:text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-[var(--secondary)]/20 mb-6 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Application Form
        </div>

        <h1 className="form-title heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-4 leading-tight">
          Apply for Admission
        </h1>

        <p className="form-desc paragraph text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          {admissions?.status?.session
            ? `Academic Session ${admissions.status.session}`
            : 'Fill out the form below to begin the admission process.'}
        </p>
      </div>

      {/* Success State */}
      {submitted ? (
        <div className="form-card bg-[var(--surface)] border border-[var(--success)]/30 rounded-2xl p-8 sm:p-12 shadow-sm text-center transform-gpu">
          <div className="w-16 h-16 rounded-full bg-[var(--success-light)] text-[var(--success)] flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="heading text-2xl sm:text-3xl font-bold text-[var(--text)] mb-3">
            Application Submitted!
          </h2>
          <p className="paragraph text-base text-[var(--text-secondary)] mb-4 max-w-lg mx-auto">
            Thank you for applying to Hopenix School. Your application has been received and our admissions team will review it shortly.
          </p>
          <p className="paragraph text-sm text-[var(--text-muted)] mb-8">
            Reference ID: <span className="font-mono font-bold text-[var(--text)]">{applicationId}</span>
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/admissions"
              className="px-6 py-3 rounded-full bg-[var(--secondary)] text-white font-semibold text-sm hover:bg-[var(--secondary-hover)] transition-colors active:scale-95"
            >
              Back to Admissions
            </Link>
            <Link
              to="/"
              className="px-6 py-3 rounded-full border-2 border-[var(--neutral-200)] text-[var(--text)] font-semibold text-sm hover:bg-[var(--neutral-100)] transition-colors active:scale-95"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      ) : (
        /* Form Card */
        <div className="form-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm transform-gpu">
          {errors._form && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--error-light)] border border-[var(--error)]/20 text-sm text-[var(--error)] font-medium paragraph">
              {errors._form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Information */}
            <div>
              <h3 className="heading text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--secondary)] text-white text-xs font-bold flex items-center justify-center">1</span>
                Student Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">First Name <span className="text-[var(--error)]">*</span></label>
                  <input type="text" value={form.studentFirstName} onChange={(e) => handleChange('studentFirstName', e.target.value)} placeholder="Student's first name" className={inputClass('studentFirstName')} />
                  {errors.studentFirstName && <p className="text-xs text-[var(--error)] mt-1">{errors.studentFirstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Last Name <span className="text-[var(--error)]">*</span></label>
                  <input type="text" value={form.studentLastName} onChange={(e) => handleChange('studentLastName', e.target.value)} placeholder="Student's last name" className={inputClass('studentLastName')} />
                  {errors.studentLastName && <p className="text-xs text-[var(--error)] mt-1">{errors.studentLastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Date of Birth <span className="text-[var(--error)]">*</span></label>
                  <input type="date" value={form.studentDOB} onChange={(e) => handleChange('studentDOB', e.target.value)} className={inputClass('studentDOB')} />
                  {errors.studentDOB && <p className="text-xs text-[var(--error)] mt-1">{errors.studentDOB}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Gender <span className="text-[var(--error)]">*</span></label>
                  <select value={form.studentGender} onChange={(e) => handleChange('studentGender', e.target.value)} className={inputClass('studentGender')}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.studentGender && <p className="text-xs text-[var(--error)] mt-1">{errors.studentGender}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Applying for Class <span className="text-[var(--error)]">*</span></label>
                  <select value={form.applyingForClass} onChange={(e) => handleChange('applyingForClass', e.target.value)} className={inputClass('applyingForClass')}>
                    <option value="">Select class</option>
                    {openClasses.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {errors.applyingForClass && <p className="text-xs text-[var(--error)] mt-1">{errors.applyingForClass}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Previous School</label>
                  <input type="text" value={form.previousSchool} onChange={(e) => handleChange('previousSchool', e.target.value)} placeholder="Previous school name (if any)" className={inputClass('previousSchool')} />
                </div>
              </div>
            </div>

            {/* Parent / Guardian Information */}
            <div>
              <h3 className="heading text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--secondary)] text-white text-xs font-bold flex items-center justify-center">2</span>
                Parent / Guardian Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">First Name <span className="text-[var(--error)]">*</span></label>
                  <input type="text" value={form.parentFirstName} onChange={(e) => handleChange('parentFirstName', e.target.value)} placeholder="Guardian's first name" className={inputClass('parentFirstName')} />
                  {errors.parentFirstName && <p className="text-xs text-[var(--error)] mt-1">{errors.parentFirstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Last Name <span className="text-[var(--error)]">*</span></label>
                  <input type="text" value={form.parentLastName} onChange={(e) => handleChange('parentLastName', e.target.value)} placeholder="Guardian's last name" className={inputClass('parentLastName')} />
                  {errors.parentLastName && <p className="text-xs text-[var(--error)] mt-1">{errors.parentLastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Relationship</label>
                  <select value={form.relationship} onChange={(e) => handleChange('relationship', e.target.value)} className={inputClass('relationship')}>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">CNIC / B-Form Number <span className="text-[var(--error)]">*</span></label>
                  <input type="text" value={form.parentCnic} onChange={(e) => handleChange('parentCnic', e.target.value)} placeholder="XXXXX-XXXXXXX-X" className={inputClass('parentCnic')} />
                  {errors.parentCnic && <p className="text-xs text-[var(--error)] mt-1">{errors.parentCnic}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Phone Number <span className="text-[var(--error)]">*</span></label>
                  <input type="tel" value={form.parentPhone} onChange={(e) => handleChange('parentPhone', e.target.value)} placeholder="+92 XXX XXXXXXX" className={inputClass('parentPhone')} />
                  {errors.parentPhone && <p className="text-xs text-[var(--error)] mt-1">{errors.parentPhone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Email Address <span className="text-[var(--error)]">*</span></label>
                  <input type="email" value={form.parentEmail} onChange={(e) => handleChange('parentEmail', e.target.value)} placeholder="parent@example.com" className={inputClass('parentEmail')} />
                  {errors.parentEmail && <p className="text-xs text-[var(--error)] mt-1">{errors.parentEmail}</p>}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="heading text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--secondary)] text-white text-xs font-bold flex items-center justify-center">3</span>
                Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Full Address <span className="text-[var(--error)]">*</span></label>
                  <textarea value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="House #, Street, Area" rows={2} className={inputClass('address')} />
                  {errors.address && <p className="text-xs text-[var(--error)] mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">City <span className="text-[var(--error)]">*</span></label>
                  <input type="text" value={form.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="City" className={inputClass('city')} />
                  {errors.city && <p className="text-xs text-[var(--error)] mt-1">{errors.city}</p>}
                </div>
              </div>
            </div>

            {/* Additional Message */}
            <div>
              <h3 className="heading text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--secondary)] text-white text-xs font-bold flex items-center justify-center">4</span>
                Additional Information
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Message (Optional)</label>
                <textarea value={form.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="Any additional information you'd like to share..." rows={3} className={inputClass('message')} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-[var(--neutral-200)]">
              <Link
                to="/admissions"
                className="px-6 py-3 rounded-xl border border-[var(--neutral-200)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--neutral-100)] transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-[var(--secondary)] text-white text-sm font-bold hover:bg-[var(--secondary-hover)] transition-colors disabled:opacity-60 active:scale-95"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}

export default AdmissionForm
