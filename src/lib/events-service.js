import { useState, useEffect, useCallback } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from './api-client'
import staticEvents from '../data/events'

// ── Helpers ─────────────────────────────────────────────────

export function parseEventDate(dateStr) {
  if (!dateStr) return { month: '', day: '', year: '', dateObj: new Date(null) }
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return { month: '', day: '', year: '', dateObj: new Date(null) }
  return {
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    year: d.getFullYear(),
    dateObj: d,
  }
}

export function getEventStatus(dateStr) {
  if (!dateStr) return 'upcoming'
  const now = new Date()
  const eventDate = new Date(dateStr)
  if (isNaN(eventDate.getTime())) return 'upcoming'

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())

  if (eventDay.getTime() === today.getTime()) return 'today'
  if (eventDay > today) return 'upcoming'
  return 'past'
}

function normalizeEvent(e) {
  const dateStr = e.eventDate || e.date || ''
  const parsed = parseEventDate(dateStr)
  return {
    id: e.id,
    title: e.title,
    description: e.description || '',
    shortDescription: e.description ? e.description.slice(0, 120) : '',
    dateString: dateStr,
    date: { month: parsed.month, day: parsed.day, year: parsed.year },
    eventDate: dateStr,
    location: e.location || '',
    image: e.imageUrl || e.image || '',
    imageUrl: e.imageUrl || e.image || '',
    published: e.published !== undefined ? e.published : true,
    featured: e.featured || false,
    createdAt: e.createdAt,
  }
}

// ── API Operations (SQL) ────────────────────────────────────

export async function getAllEvents() {
  try {
    const res = await apiGet('/api/events')
    if (res.success && Array.isArray(res.events)) {
      return res.events.map(normalizeEvent)
    }
  } catch (err) {
    console.warn('API events fetch fallback:', err.message)
  }

  // Static fallback if API is not yet seeded/connected
  return staticEvents.map((e) => normalizeEvent({
    id: e.id,
    title: e.title,
    description: e.description,
    eventDate: e.dateString ? e.dateString.split('T')[0] : '2026-09-15',
    location: e.location,
    imageUrl: e.image,
    published: true,
  }))
}

export async function createEvent(event) {
  const res = await apiPost('/api/events', {
    title: event.title,
    description: event.description,
    eventDate: event.date || event.eventDate,
    location: event.location,
    imageUrl: event.image || event.imageUrl,
    published: event.published !== undefined ? event.published : true,
  })
  return normalizeEvent(res.event)
}

export async function updateEvent(id, updates) {
  const payload = {
    id,
    ...(updates.title && { title: updates.title }),
    ...(updates.description && { description: updates.description }),
    ...((updates.date || updates.eventDate) && { eventDate: updates.date || updates.eventDate }),
    ...(updates.location !== undefined && { location: updates.location }),
    ...((updates.image || updates.imageUrl) !== undefined && { imageUrl: updates.image || updates.imageUrl }),
    ...(updates.published !== undefined && { published: updates.published }),
  }
  const res = await apiPut('/api/events', payload)
  return normalizeEvent(res.event)
}

export async function deleteEvent(id) {
  return apiDelete('/api/events', { id })
}

export async function togglePublish(id, published) {
  return updateEvent(id, { published })
}

export async function toggleFeatured(id, featured) {
  return updateEvent(id, { featured })
}

// ── React Hook ──────────────────────────────────────────────

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getAllEvents()
    setEvents(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { events, loading, refresh }
}
