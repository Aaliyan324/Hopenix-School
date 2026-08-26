import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import apiClient from '../lib/apiClient'
import { useToast } from '../context/ToastContext'

const TeacherDiary = () => {
  const { user } = useAuth()
  const { addToast } = useToast()

  const [assignments, setAssignments] = useState([])
  const [myDiaries, setMyDiaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('')
  const [homework, setHomework] = useState('')
  const [diary, setDiary] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState(null)

  // Edit Modal State
  const [editingEntry, setEditingEntry] = useState(null)
  const [editHomework, setEditHomework] = useState('')
  const [editDiary, setEditDiary] = useState('')
  const [editNotes, setEditNotes] = useState('')

  // Load teacher assignments and existing diary entries
  useEffect(() => {
    async function loadData() {
      try {
        const teacherId = user?.teacher?.id
        const [assignRes, diaryRes] = await Promise.all([
          apiClient.get('/api/assignments'),
          apiClient.get('/api/diary', { teacherId, limit: 50 }),
        ])

        if (assignRes.success && assignRes.data) {
          setAssignments(assignRes.data)
          if (assignRes.data.length > 0) {
            setSelectedAssignmentId(assignRes.data[0].id)
          }
        }

        if (diaryRes.success && diaryRes.data) {
          setMyDiaries(diaryRes.data)
        }
      } catch (err) {
        console.error('Error loading teacher assignments:', err)
        addToast?.('Failed to load class assignments', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user, addToast])

  // Handle File upload conversion
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        addToast?.('File size exceeds 5MB limit', 'error')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedAssignmentId) {
      addToast?.('Please select an assigned class and subject', 'error')
      return
    }
    if (!homework.trim() || !diary.trim()) {
      addToast?.('Please fill in both Homework and Diary fields', 'error')
      return
    }

    setSubmitting(true)
    try {
      const selectedAssign = assignments.find((a) => a.id === selectedAssignmentId)
      if (!selectedAssign) throw new Error('Invalid assignment selected')

      let attachmentUrl = null
      if (file) {
        const reader = new FileReader()
        const filePromise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
        })
        reader.readAsDataURL(file)
        const base64Data = await filePromise

        const uploadRes = await apiClient.post('/api/uploads', {
          filename: file.name,
          fileData: base64Data,
          mimeType: file.type,
        })
        if (uploadRes.success) {
          attachmentUrl = uploadRes.url
        }
      }

      const res = await apiClient.post('/api/diary', {
        date,
        classId: selectedAssign.classId,
        sectionId: selectedAssign.sectionId,
        subjectId: selectedAssign.subjectId,
        homework: homework.trim(),
        diary: diary.trim(),
        notes: notes.trim() || null,
        attachmentUrl,
      })

      if (res.success) {
        addToast?.('Daily Diary published successfully!', 'success')
        setHomework('')
        setDiary('')
        setNotes('')
        setFile(null)
        // Refresh list
        const updatedRes = await apiClient.get('/api/diary', { teacherId: user?.teacher?.id, limit: 50 })
        if (updatedRes.success) setMyDiaries(updatedRes.data)
      }
    } catch (err) {
      console.error('Failed to submit diary:', err)
      addToast?.(err.message || 'Failed to publish diary', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diary entry?')) return
    try {
      const res = await apiClient.delete('/api/diary', { id })
      if (res.success) {
        addToast?.('Diary entry deleted', 'success')
        setMyDiaries((prev) => prev.filter((d) => d.id !== id))
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
        addToast?.('Diary entry updated successfully!', 'success')
        setEditingEntry(null)
        setMyDiaries((prev) => prev.map((d) => (d.id === editingEntry.id ? res.data : d)))
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to update diary', 'error')
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-[var(--text-muted)] font-medium">Loading teacher assignments...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="heading text-xl font-black text-[var(--text)]">Daily Diary & Homework Portal</h1>
        <p className="paragraph text-xs text-[var(--text-muted)] mt-1">
          Publish daily homework instructions and announcements for your assigned classes.
        </p>
      </div>

      {/* Publish Form Card */}
      <div className="bg-white rounded-2xl p-6 border border-[var(--neutral-200)] shadow-sm">
        <h2 className="heading text-base font-bold text-[var(--text)] mb-4 flex items-center gap-2">
          <span>✍️</span> Create New Daily Diary
        </h2>

        {assignments.length === 0 ? (
          <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-sm font-medium border border-amber-200">
            ⚠️ You are not assigned to any classes yet. Please contact the administrator to assign your subjects.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Target Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] text-sm font-medium focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              {/* Class & Subject Dropdown (Restricted strictly to teacher's assignments) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Select Assigned Class & Subject *
                </label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] text-sm font-medium focus:ring-2 focus:ring-[var(--primary)] bg-white"
                >
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.class?.name} - Sec {a.section?.name} ({a.subject?.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Homework Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Homework / Tasks *
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Complete questions 1 to 10 from Exercise 4. Read page 45-48."
                value={homework}
                onChange={(e) => setHomework(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] text-sm font-medium focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Diary Instructions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Daily Diary / Instructions *
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Bring your mathematics notebook and geometry box tomorrow."
                value={diary}
                onChange={(e) => setDiary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] text-sm font-medium focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Additional Notes & File Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class test on Friday."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] text-sm font-medium focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  Attachment (PDF, DOC, Image)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                  className="w-full text-xs text-[var(--text-muted)] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[var(--primary)] hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {submitting ? 'Publishing...' : 'Publish Daily Diary'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Previous Diary Entries */}
      <div>
        <h2 className="heading text-base font-bold text-[var(--text)] mb-4">Your Previously Published Diary Entries</h2>
        {myDiaries.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[var(--neutral-200)]">
            <p className="text-sm text-[var(--text-muted)]">No published diary entries yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myDiaries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)] shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {entry.class?.name} - Section {entry.section?.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[var(--primary)] text-xs font-bold">
                      {entry.subject?.name}
                    </span>
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
            <h3 className="text-base font-bold text-slate-900 mb-4">Edit Daily Diary</h3>
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

export default TeacherDiary
