/**
 * Unified admissions data service.
 *
 * - Public site: reads from localStorage, falls back to static data.
 * - Admin panel: full CRUD via localStorage.
 *
 * All public components should import `useAdmissions` from this file.
 */

import { useState, useEffect, useCallback } from 'react'
import staticAdmissions from '../data/admissions'

const ADMISSIONS_KEY = 'hopenix_admissions'

// ── Helpers ─────────────────────────────────────────────────

function generateId(prefix = 'adm') {
  return prefix + '_' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
}

// ── localStorage CRUD ───────────────────────────────────────

function readAdmissions() {
  try {
    const raw = localStorage.getItem(ADMISSIONS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }

  // Seed from static data on first access
  localStorage.setItem(ADMISSIONS_KEY, JSON.stringify(staticAdmissions))
  return { ...staticAdmissions }
}

function writeAdmissions(data) {
  data.updatedAt = new Date().toISOString()
  localStorage.setItem(ADMISSIONS_KEY, JSON.stringify(data))
}

/**
 * Get full admissions data (admin use).
 */
export function getAdmissions() {
  return readAdmissions()
}

/**
 * Update the entire admissions object (admin use).
 */
export function saveAdmissions(data) {
  writeAdmissions(data)
  return data
}

/**
 * Update a partial section of admissions (admin use).
 */
export function updateAdmissionSection(section, value) {
  const data = readAdmissions()
  data[section] = typeof value === 'object' && !Array.isArray(value)
    ? { ...data[section], ...value }
    : value
  writeAdmissions(data)
  return data
}

// ── Array item CRUD (classes, process, documents, etc.) ─────

export function addArrayItem(section, item) {
  const data = readAdmissions()
  const arr = Array.isArray(data[section]) ? data[section] : []
  const newItem = { ...item, id: item.id || generateId(section.slice(0, 3)), order: arr.length }
  arr.push(newItem)
  data[section] = arr
  writeAdmissions(data)
  return data
}

export function updateArrayItem(section, id, updates) {
  const data = readAdmissions()
  const arr = Array.isArray(data[section]) ? data[section] : []
  const idx = arr.findIndex((i) => i.id === id)
  if (idx === -1) throw new Error('Item not found')
  arr[idx] = { ...arr[idx], ...updates }
  data[section] = arr
  writeAdmissions(data)
  return data
}

export function deleteArrayItem(section, id) {
  const data = readAdmissions()
  const arr = Array.isArray(data[section]) ? data[section] : []
  const filtered = arr.filter((i) => i.id !== id)
  if (filtered.length === arr.length) throw new Error('Item not found')
  // Re-order
  filtered.forEach((item, idx) => { item.order = idx })
  data[section] = filtered
  writeAdmissions(data)
  return data
}

export function reorderArray(section, fromIndex, toIndex) {
  const data = readAdmissions()
  const arr = Array.isArray(data[section]) ? [...data[section]] : []
  const [moved] = arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, moved)
  arr.forEach((item, idx) => { item.order = idx })
  data[section] = arr
  writeAdmissions(data)
  return data
}

// ── Fees (nested structure) ─────────────────────────────────

export function addFeeItem(item) {
  const data = readAdmissions()
  const items = Array.isArray(data.fees?.items) ? data.fees.items : []
  const newItem = { ...item, id: item.id || generateId('fee'), order: items.length }
  items.push(newItem)
  if (!data.fees) data.fees = { enabled: false, items: [] }
  data.fees.items = items
  writeAdmissions(data)
  return data
}

export function updateFeeItem(id, updates) {
  const data = readAdmissions()
  const items = Array.isArray(data.fees?.items) ? data.fees.items : []
  const idx = items.findIndex((i) => i.id === id)
  if (idx === -1) throw new Error('Fee item not found')
  items[idx] = { ...items[idx], ...updates }
  data.fees.items = items
  writeAdmissions(data)
  return data
}

export function deleteFeeItem(id) {
  const data = readAdmissions()
  const items = Array.isArray(data.fees?.items) ? data.fees.items : []
  data.fees.items = items.filter((i) => i.id !== id)
  writeAdmissions(data)
  return data
}

export function toggleFeesEnabled(enabled) {
  const data = readAdmissions()
  if (!data.fees) data.fees = { enabled: false, items: [] }
  data.fees.enabled = enabled
  writeAdmissions(data)
  return data
}

// ── Publish / Enable toggles ────────────────────────────────

export function toggleAdmissionPublished(published) {
  return updateAdmissionSection('published', published)
}

export function toggleAdmissionEnabled(enabled) {
  return updateAdmissionSection('enabled', enabled)
}

// ── Public fetch ────────────────────────────────────────────

/**
 * Fetch admissions data for the public website.
 * Returns null if admissions are disabled or unpublished.
 */
export function fetchPublicAdmissions() {
  const data = readAdmissions()
  if (!data.enabled || !data.published) return null

  // Filter to only published/enabled items
  return {
    ...data,
    classes: (data.classes || [])
      .filter((c) => c.published)
      .sort((a, b) => a.order - b.order),
    process: (data.process || [])
      .filter((p) => p.enabled)
      .sort((a, b) => a.order - b.order),
    documents: (data.documents || [])
      .filter((d) => d.enabled)
      .sort((a, b) => a.order - b.order),
    requirements: (data.requirements || [])
      .filter((r) => r.enabled)
      .sort((a, b) => a.order - b.order),
    timeline: (data.timeline || [])
      .sort((a, b) => a.order - b.order),
    fees: data.fees?.enabled
      ? { ...data.fees, items: (data.fees.items || []).sort((a, b) => a.order - b.order) }
      : { enabled: false, items: [] },
  }
}

// ── Date formatting ─────────────────────────────────────────

export function formatAdmissionDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

// ── React hook ──────────────────────────────────────────────

/**
 * React hook: fetch public admissions data.
 * Returns { admissions, loading, refresh }.
 */
export function useAdmissions() {
  const [admissions, setAdmissions] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    const data = fetchPublicAdmissions()
    setAdmissions(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    const data = fetchPublicAdmissions()
    setAdmissions(data)
    setLoading(false)

    // Re-sync when another tab modifies admissions
    const onStorage = (e) => {
      if (e.key === ADMISSIONS_KEY) {
        const fresh = fetchPublicAdmissions()
        setAdmissions(fresh)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { admissions, loading, refresh }
}
