import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { createEvent, updateEvent } from '../lib/events-service'

const CATEGORIES = ['Sports', 'Academic', 'Cultural', 'Exhibition', 'Seminar', 'Featured', 'Other']

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  category: 'Other',
  image: '',
  shortDescription: '',
  featured: false,
  published: false,
}

const EventForm = ({ event, onSuccess, onCancel }) => {
  const isEditing = Boolean(event)
  const { addToast } = useToast()

  const [form, setForm] = useState(() => {
    if (event) {
      return {
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        category: event.category || 'Other',
        image: event.image || '',
        shortDescription: event.shortDescription || '',
        featured: event.featured || false,
        published: event.published || false,
      }
    }
    return { ...emptyForm }
  })

  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (form.title.length > 120) errs.title = 'Title must be 120 characters or less'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (form.description.length > 1000) errs.description = 'Description must be 1000 characters or less'
    if (!form.date) errs.date = 'Date is required'
    if (!form.location.trim()) errs.location = 'Location is required'
    return errs
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSaving(true)
    try {
      if (isEditing) {
        await updateEvent(event.id, form)
        addToast(`"${form.title}" updated successfully`, 'success')
      } else {
        await createEvent(form)
        addToast(`"${form.title}" created successfully`, 'success')
      }
      onSuccess()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm paragraph text-[var(--text)]
     bg-[var(--background)] placeholder-[var(--text-light)]
     focus:outline-none focus:ring-1 transition-colors
     ${errors[field]
       ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/30'
       : 'border-[var(--neutral-200)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)]/30'
     }`

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">
          Event Title <span className="text-[var(--error)]">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Annual Sports Day"
          maxLength={120}
          className={inputClass('title')}
        />
        {errors.title && <p className="text-xs text-[var(--error)] mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">
          Description <span className="text-[var(--error)]">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="A day filled with sports, teamwork and school spirit."
          rows={3}
          maxLength={1000}
          className={inputClass('description')}
        />
        <div className="flex justify-between mt-1">
          {errors.description && <p className="text-xs text-[var(--error)]">{errors.description}</p>}
          <p className="text-xs text-[var(--text-muted)] ml-auto">{form.description.length}/1000</p>
        </div>
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">
          Short Description
        </label>
        <input
          type="text"
          value={form.shortDescription}
          onChange={(e) => handleChange('shortDescription', e.target.value)}
          placeholder="Brief summary for cards and banners (optional)"
          maxLength={200}
          className={inputClass('shortDescription')}
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">
            Date <span className="text-[var(--error)]">*</span>
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={inputClass('date')}
          />
          {errors.date && <p className="text-xs text-[var(--error)] mt-1">{errors.date}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Time</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => handleChange('time', e.target.value)}
            className={inputClass('time')}
          />
        </div>
      </div>

      {/* Location & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">
            Location <span className="text-[var(--error)]">*</span>
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="School Sports Ground"
            className={inputClass('location')}
          />
          {errors.location && <p className="text-xs text-[var(--error)] mt-1">{errors.location}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={inputClass('category')}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Image URL</label>
        <input
          type="text"
          value={form.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="/images/events/sports-day.jpg"
          className={inputClass('image')}
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Provide a URL or path to the event image.
        </p>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => handleChange('featured', e.target.checked)}
            className="w-4 h-4 rounded border-[var(--neutral-300)] text-[var(--secondary)] focus:ring-[var(--secondary)]/30"
          />
          <span className="text-sm font-medium text-[var(--text)]">Featured Event</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => handleChange('published', e.target.checked)}
            className="w-4 h-4 rounded border-[var(--neutral-300)] text-[var(--secondary)] focus:ring-[var(--secondary)]/30"
          />
          <span className="text-sm font-medium text-[var(--text)]">Published</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2 border-t border-[var(--neutral-200)]">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--neutral-100)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--secondary-hover)] transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  )
}

export default EventForm
