import { useState, useEffect, useCallback } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from './api-client'

export async function fetchClassesAndSubjects() {
  const res = await apiGet('/api/classes')
  return res
}

export async function fetchDiaryEntries(params = {}) {
  const res = await apiGet('/api/diary', params)
  return res
}

export async function createDiaryEntry(diaryData) {
  const res = await apiPost('/api/diary', diaryData)
  return res.diary
}

export async function updateDiaryEntry(id, updates) {
  const res = await apiPut('/api/diary', { id, ...updates })
  return res.diary
}

export async function deleteDiaryEntry(id) {
  const res = await apiDelete('/api/diary', { id })
  return res
}

export async function uploadAttachment(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const fileData = e.target.result
        const res = await apiPost('/api/uploads', {
          filename: file.name,
          fileData,
          contentType: file.type,
        })
        resolve(res.url)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function useDailyDiary(initialFilters = {}) {
  const [diaries, setDiaries] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(initialFilters)

  const loadDiary = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchDiaryEntries(filters)
      if (res.success) {
        setDiaries(res.data || [])
        setPagination(res.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 })
      }
    } catch (err) {
      console.error('Error loading diary entries:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadDiary()
  }, [loadDiary])

  return {
    diaries,
    pagination,
    loading,
    filters,
    setFilters,
    refresh: loadDiary,
  }
}
