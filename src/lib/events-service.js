/**
 * Unified event data service.
 *
 * - Public site: reads from localStorage, falls back to static data.
 * - Admin panel: full CRUD via localStorage.
 *
 * All public components should import `useEvents` from this file.
 */

import { useState, useEffect, useCallback } from 'react'
import staticEvents from '../data/events'

const EVENTS_KEY = 'hopenix_events'

// ── Helpers ─────────────────────────────────────────────────

function generateId() {
  return 'evt_' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
}

function buildSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── localStorage CRUD ───────────────────────────────────────

function readEvents() {
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }

  // Seed from static data on first access
  const seeded = staticEvents.map((e) => ({
    id: e.id,
    title: e.title,
    slug: buildSlug(e.title),
    description: e.description || '',
    shortDescription: e.shortDescription || '',
    date: e.dateString ? e.dateString.split('T')[0] : '',
    time: e.time || '',
    location: e.location || '',
    category: e.category || 'Other',
    image: e.image || '',
    featured: false,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
  localStorage.setItem(EVENTS_KEY, JSON.stringify(seeded))
  return seeded
}

function writeEvents(events) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

export function getAllEvents() {
  return readEvents()
}

export async function createEvent(event) {
  const events = readEvents()
  const now = new Date().toISOString()
  const newEvent = {
    id: generateId(),
    slug: buildSlug(event.title),
    createdAt: now,
    updatedAt: now,
    featured: false,
    published: false,
    ...event,
  }
  events.push(newEvent)
  writeEvents(events)
  return newEvent
}

export async function updateEvent(id, updates) {
  const events = readEvents()
  const idx = events.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error('Event not found')
  events[idx] = { ...events[idx], ...updates, updatedAt: new Date().toISOString() }
  writeEvents(events)
  return events[idx]
}

export async function deleteEvent(id) {
  const events = readEvents()
  const filtered = events.filter((e) => e.id !== id)
  if (filtered.length === events.length) throw new Error('Event not found')
  writeEvents(filtered)
}

export async function togglePublish(id, published) {
  return updateEvent(id, { published })
}

export async function toggleFeatured(id, featured) {
  return updateEvent(id, { featured })
}

// ── Date utilities ──────────────────────────────────────────

/**
 * Parse an ISO date string into display parts.
 */
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

/**
 * Compute event status based on date.
 */
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

/**
 * Normalize an event to the display format used by existing components.
 */
function normalizeEvent(event) {
  const parsed = parseEventDate(event.date)
  return {
    ...event,
    dateString: event.date,
    date: { month: parsed.month, day: parsed.day, year: parsed.year },
    shortDescription: event.shortDescription || event.description?.slice(0, 120) || '',
  }
}

// ── Public fetch ────────────────────────────────────────────

/**
 * Fetch published events for the public website.
 */
export function fetchPublicEvents() {
  const events = readEvents()
  return events
    .filter((e) => e.published)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(normalizeEvent)
}

// ── React hook ──────────────────────────────────────────────

/**
 * React hook: fetch published events for the public site.
 * Returns { events, loading, refresh }.
 */
export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    const data = fetchPublicEvents()
    setEvents(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    function load() {
      const data = fetchPublicEvents()
      setEvents(data)
      setLoading(false)
    }
    load()

    // Re-sync when another tab modifies events
    const onStorage = (e) => {
      if (e.key === EVENTS_KEY) {
        const fresh = fetchPublicEvents()
        setEvents(fresh)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { events, loading, refresh }
}
