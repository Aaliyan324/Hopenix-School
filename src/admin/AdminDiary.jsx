import { useState, useEffect } from 'react'
import apiClient from '../lib/apiClient'
import { useToast } from '../context/ToastContext'

const AdminDiary = () => {
  const { addToast } = useToast()
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [diaries, setDiaries] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [filterClassId, setFilterClassId] = useState('')
  const [filterSectionId, setFilterSectionId] = useState('')
  const [filterSubjectId, setFilterSubjectId] = useState('')
  const [filterTeacherId, setFilterTeacherId] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [availableSections, setAvailableSections] = useState([])

  // Edit Modal State
  const [editingEntry, setEditingEntry] = useState(null)
  const [editHomework, setEditHomework] = useState('')
  const [editDiary, setEditDiary] = useState('')
  const [editNotes, setEditNotes] = useState('')

  useEffect(() => {
    async function loadMeta() {
      try {
        const [cRes, tRes] = await Promise.all([
          apiClient.get('/api/classes'),
          apiClient.get('/api/teachers'),
        ])
        if (cRes.success && cRes.data) {
          setClasses(cRes.data.classes || [])
          setSubjects(cRes.data.subjects || [])
        }
        if (tRes.success) {
          setTeachers(tRes.data || [])
        }
      } catch (err) {
        console.error('Failed to load filter metadata:', err)
      }
    }
    loadMeta()
  }, [])

  const handleClassFilterChange = (e) => {
    const cid = e.target.value
    setFilterClassId(cid)
    setFilterSectionId('')
    const cls = classes.find((c) => c.id === cid)
    setAvailableSections(cls?.sections || [])
  }

  const fetchDiaries = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterClassId) params.classId = filterClassId
      if (filterSectionId) params.sectionId = filterSectionId
      if (filterSubjectId) params.subjectId = filterSubjectId
      if (filterTeacherId) params.teacherId = filterTeacherId
      if (filterDate) params.date = filterDate

      const res = await apiClient.get('/api/diary', params)
      if (res.success) {
        setDiaries(res.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch diary entries:', err)
      addToast?.('Error loading diary entries', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiaries()
  }, [filterClassId, filterSectionId, filterSubjectId, filterTeacherId, filterDate])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diary entry?')) return
    try {
      const res = await apiClient.delete('/api/diary', { id })
      if (res.success) {
        addToast?.('Diary entry deleted', 'success')
        fetchDiaries()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to delete entry', 'error')
    }
  }

  const handleEditOpen = (entry) => {
    setEditingEntry(entry)
    setEditHomework(entry.homework)
    setEditDiary(entry.diary)
    setEditNotes(entry.notes || '')
  }

  const handleEditSave = async (e) => {
    e.preventDefault()
    if (!editingEntry) return
    try {
      const res = await apiClient.put('/api/diary', {
        id: editingEntry.id,
        homework: editHomework.trim(),
        diary: editDiary.trim(),
        notes: editNotes.trim() || null,
      })
      if (res.success) {
        addToast?.('Diary updated', 'success')
        setEditingEntry(null)
        fetchDiaries()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to update diary', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading text-2xl font-black text-[var(--text)]">Daily Diary Oversight</h1>
        <p className="paragraph text-xs text-[var(--text-muted)] mt-1">
          Review, filter, edit, or delete any daily diary entry across all school grades.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[var(--neutral-200)] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-2.5 py-2 border rounded-xl text-xs bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Class</label>
            <select
              value={filterClassId}
              onChange={handleClassFilterChange}
              className="w-full px-2.5 py-2 border rounded-xl text-xs bg-slate-50"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Section</label>
            <select
              value={filterSectionId}
              onChange={(e) => setFilterSectionId(e.target.value)}
              className="w-full px-2.5 py-2 border rounded-xl text-xs bg-slate-50"
              disabled={!filterClassId}
            >
              <option value="">All Sections</option>
              {availableSections.map((s) => (
                <option key={s.id} value={s.id}>
                  Section {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Subject</label>
            <select
              value={filterSubjectId}
              onChange={(e) => setFilterSubjectId(e.target.value)}
              className="w-full px-2.5 py-2 border rounded-xl text-xs bg-slate-50"
            >
              <option value="">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Teacher</label>
            <select
              value={filterTeacherId}
              onChange={(e) => setFilterTeacherId(e.target.value)}
              className="w-full px-2.5 py-2 border rounded-xl text-xs bg-slate-50"
            >
              <option value="">All Teachers</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.user?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Diary Entries Feed */}
      <div>
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs text-[var(--text-muted)] font-medium">Loading entries...</p>
          </div>
        ) : diaries.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[var(--neutral-200)]">
            <p className="text-sm text-[var(--text-muted)]">No diary records match the selected filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {diaries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)] shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {entry.class?.name} - Section {entry.section?.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[var(--primary)] text-xs font-bold">
                      {entry.subject?.name}
                    </span>
                    <span className="text-xs text-slate-400">by {entry.teacher?.user?.name || 'Teacher'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">📅 {entry.date}</span>
                    <button
                      onClick={() => handleEditOpen(entry)}
                      className="text-xs font-bold text-[var(--primary)] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <strong className="text-slate-900 block mb-1">Homework:</strong>
                    <p className="text-slate-700 whitespace-pre-line">{entry.homework}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <strong className="text-slate-900 block mb-1">Instructions:</strong>
                    <p className="text-slate-700 whitespace-pre-line">{entry.diary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">Edit Daily Diary Entry</h3>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Homework</label>
                <textarea
                  required
                  rows={3}
                  value={editHomework}
                  onChange={(e) => setEditHomework(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions / Diary</label>
                <textarea
                  required
                  rows={3}
                  value={editDiary}
                  onChange={(e) => setEditDiary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDiary
