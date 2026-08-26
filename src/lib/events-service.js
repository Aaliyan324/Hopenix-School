import { useState, useEffect, useCallback } from 'react'
import staticEvents from '../data/events'
import apiClient from './apiClient'

const EVENTS_KEY = 'hopenix_events'

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

function normalizeEvent(event) {
  const dateValue = event.eventDate || event.date || ''
  const parsed = parseEventDate(dateValue)
  return {
    ...event,
    dateString: dateValue,
    date: { month: parsed.month, day: parsed.day, year: parsed.year },
    shortDescription: event.shortDescription || event.description?.slice(0, 120) || '',
    image: event.imageUrl || event.image || '',
    time: event.time || '09:00 AM',
    category: event.category || 'General',
  }
}

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/api/events')
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setEvents(res.data.map(normalizeEvent))
        setLoading(false)
        return
      }
    } catch {
      // Fallback
    }

    // Fallback to static events
    setEvents(staticEvents.map((e) => normalizeEvent({ ...e, eventDate: e.dateString })))
    setLoading(false)
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  return { events, loading, refresh: loadEvents }
}
