import { useState, useEffect, useCallback } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from './api-client'
import staticAdmissions from '../data/admissions'

const ADMISSIONS_KEY = 'hopenix_admissions'

function readAdmissions() {
  try {
    const raw = localStorage.getItem(ADMISSIONS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { ...staticAdmissions }
}

function writeAdmissions(data) {
  try {
    data.updatedAt = new Date().toISOString()
    localStorage.setItem(ADMISSIONS_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

export function getAdmissions() {
  return readAdmissions()
}

export function saveAdmissions(data) {
  writeAdmissions(data)
  return data
}

export function updateAdmissionSection(section, value) {
  const data = readAdmissions()
  data[section] = typeof value === 'object' && !Array.isArray(value)
    ? { ...data[section], ...value }
    : value
  writeAdmissions(data)
  return data
}

export function addArrayItem(section, item) {
  const data = readAdmissions()
  const arr = Array.isArray(data[section]) ? data[section] : []
  const newItem = { ...item, id: item.id || 'item_' + Date.now(), order: arr.length }
  arr.push(newItem)
  data[section] = arr
  writeAdmissions(data)
  return data
}

export function updateArrayItem(section, id, updates) {
  const data = readAdmissions()
  const arr = Array.isArray(data[section]) ? data[section] : []
  const idx = arr.findIndex((i) => i.id === id)
  if (idx !== -1) {
    arr[idx] = { ...arr[idx], ...updates }
    data[section] = arr
    writeAdmissions(data)
  }
  return data
}

export function deleteArrayItem(section, id) {
  const data = readAdmissions()
  const arr = Array.isArray(data[section]) ? data[section] : []
  data[section] = arr.filter((i) => i.id !== id)
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

export function addFeeItem(item) {
  const data = readAdmissions()
  if (!data.fees) data.fees = { enabled: false, items: [] }
  const items = Array.isArray(data.fees.items) ? data.fees.items : []
  items.push({ ...item, id: item.id || 'fee_' + Date.now(), order: items.length })
  data.fees.items = items
  writeAdmissions(data)
  return data
}

export function updateFeeItem(id, updates) {
  const data = readAdmissions()
  if (!data.fees) data.fees = { enabled: false, items: [] }
  const items = Array.isArray(data.fees.items) ? data.fees.items : []
  const idx = items.findIndex((i) => i.id === id)
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...updates }
    data.fees.items = items
    writeAdmissions(data)
  }
  return data
}

export function deleteFeeItem(id) {
  const data = readAdmissions()
  if (!data.fees) data.fees = { enabled: false, items: [] }
  data.fees.items = (data.fees.items || []).filter((i) => i.id !== id)
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

export function toggleAdmissionPublished(published) {
  return updateAdmissionSection('published', published)
}

export function toggleAdmissionEnabled(enabled) {
  return updateAdmissionSection('enabled', enabled)
}

// ── Admissions Information (Public Info) ────────────────────

export function fetchPublicAdmissions() {
  return readAdmissions()
}

export function useAdmissions() {
  const [admissions, setAdmissions] = useState(readAdmissions())
  const [loading, setLoading] = useState(false)

  return { admissions, loading, refresh: () => setAdmissions(readAdmissions()) }
}

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

// ── Application Submissions (SQL API) ───────────────────────

export async function submitApplication(formData) {
  const res = await apiPost('/api/admissions', {
    studentName: formData.studentName || formData.name,
    parentName: formData.parentName || formData.guardianName || formData.name,
    phone: formData.phone || formData.contactNumber,
    email: formData.email,
    classApplyingFor: formData.grade || formData.classApplyingFor || formData.applyingClass,
    message: formData.message || formData.notes || '',
  })
  return res
}

export async function getAllApplications(params = {}) {
  try {
    const res = await apiGet('/api/admissions', params)
    if (res.success && Array.isArray(res.applications)) {
      return res.applications
    }
  } catch (err) {
    console.warn('API admissions fetch fallback:', err.message)
  }
  return []
}

export async function updateApplicationStatus(id, status) {
  const res = await apiPut('/api/admissions', { id, status })
  return res.application
}

export async function deleteApplication(id) {
  return apiDelete('/api/admissions', { id })
}

export function useApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getAllApplications()
    setApplications(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { applications, loading, refresh }
}
