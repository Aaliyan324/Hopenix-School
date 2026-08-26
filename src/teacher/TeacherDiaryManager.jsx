import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api-client'
import { uploadAttachment } from '../lib/diary-service'
import { useToast } from '../context/ToastContext'

const TeacherDiaryManager = () => {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [assignments, setAssignments] = useState([])
  const [diaries, setDiaries] = useState([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [editingId, setEditingId] = useState(null)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [homework, setHomework] = useState('')
  const [diaryInstructions, setDiaryInstructions] = useState('')
  const [notes, setNotes] = useState('')
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Load teacher's assignments & diary entries
  const loadData = async () => {
    setLoading(true)
    try {
      const [assignRes, diaryRes] = await Promise.all([
        apiGet('/api/assignments'),
        apiGet('/api/diary', { teacherId: user.teacherId }),
      ])

      if (assignRes.success) {
        setAssignments(assignRes.assignments || [])
        if (assignRes.assignments && assignRes.assignments.length > 0 && !selectedAssignmentId) {
          setSelectedAssignmentId(assignRes.assignments[0].id)
        }
      }

      if (diaryRes.success) {
        setDiaries(diaryRes.data || [])
      }
    } catch (err) {
      showToast(err.message || 'Failed to load teacher data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.teacherId || user?.role === 'ADMIN') {
      loadData()
    }
  }, [user])

  const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId)

  const resetForm = () => {
    setEditingId(null)
    setHomework('')
    setDiaryInstructions('')
    setNotes('')
    setAttachmentFile(null)
    setAttachmentUrl('')
    setDate(new Date().toISOString().split('T')[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedAssignment) {
      showToast('Please select an assigned class & subject', 'error')
      return
    }

    if (!homework.trim()) {
      showToast('Homework field is required', 'error')
      return
    }

    setSubmitting(true)
    try {
      let finalAttachmentUrl = attachmentUrl

      // Handle attachment file upload if selected
      if (attachmentFile) {
        showToast('Uploading attachment file...', 'info')
        finalAttachmentUrl = await uploadAttachment(attachmentFile)
      }

      if (editingId) {
        // Edit entry
        await apiPut('/api/diary', {
          id: editingId,
          date,
          homework,
          diary: diaryInstructions,
          notes,
          attachmentUrl: finalAttachmentUrl,
        })
        showToast('Daily diary entry updated successfully!', 'success')
      } else {
        // Create new entry
        await apiPost('/api/diary', {
          classId: selectedAssignment.classId,
          sectionId: selectedAssignment.sectionId,
          subjectId: selectedAssignment.subjectId,
          date,
          homework,
          diary: diaryInstructions,
          notes,
          attachmentUrl: finalAttachmentUrl,
        })
        showToast('Daily diary published successfully!', 'success')
      }

      resetForm()
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to save diary entry', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (entry) => {
    setEditingId(entry.id)
    setDate(entry.date)
    setHomework(entry.homework || '')
    setDiaryInstructions(entry.diary || '')
    setNotes(entry.notes || '')
    setAttachmentUrl(entry.attachmentUrl || '')
    setAttachmentFile(null)

    // Find matching assignment
    const match = assignments.find(
      (a) =>
        a.classId === entry.classId &&
        a.sectionId === entry.sectionId &&
        a.subjectId === entry.subjectId
    )
    if (match) setSelectedAssignmentId(match.id)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diary entry?')) return

    try {
      await apiDelete('/api/diary', { id })
      showToast('Diary entry deleted successfully', 'success')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to delete entry', 'error')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Daily Diary & Homework Manager
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Publish and update daily homework and announcements for your assigned classes.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            {editingId ? 'Edit Diary Entry' : 'Create Daily Diary'}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {assignments.length === 0 ? (
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center">
            <p className="text-sm font-semibold text-amber-900">You have no assigned classes yet.</p>
            <p className="text-xs text-amber-700 mt-1">
              Contact Admin to assign your classes and subjects before publishing daily diary.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assigned Class & Subject Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Assigned Class & Subject *
                </label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-semibold rounded-xl p-3.5 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  disabled={Boolean(editingId)}
                  required
                >
                  {assignments.map((asgn) => (
                    <option key={asgn.id} value={asgn.id}>
                      {asgn.class?.name} - Section {asgn.section?.name} | {asgn.subject?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Diary Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-semibold rounded-xl p-3.5 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            {/* Homework Text Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Homework Assignment *
              </label>
              <textarea
                rows={3}
                value={homework}
                onChange={(e) => setHomework(e.target.value)}
                placeholder="e.g. Complete Exercise 4.2 Questions 1-10 in notebook."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-medium rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition text-sm"
                required
              />
            </div>

            {/* Diary / Class Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Class Instructions & Daily Diary (Optional)
              </label>
              <textarea
                rows={2}
                value={diaryInstructions}
                onChange={(e) => setDiaryInstructions(e.target.value)}
                placeholder="e.g. Bring geometry box and ruler for tomorrow's lab."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-medium rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition text-sm"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Additional Remarks / Test Announcements (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Chapter test scheduled for next Monday."
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-medium rounded-xl p-3.5 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition text-sm"
              />
            </div>

            {/* File Attachment Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Attachment File (PDF, Image, Doc) - Optional
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setAttachmentFile(e.target.files[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 transition cursor-pointer"
              />
              {attachmentUrl && !attachmentFile && (
                <p className="text-xs text-emerald-600 mt-1 font-semibold">
                  Current attachment exists. (Selecting new file will replace it)
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-emerald-600/30 transition disabled:opacity-50 text-sm"
              >
                {submitting ? 'Publishing...' : editingId ? 'Update Diary' : 'Publish Diary'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Previous Diary Entries List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Your Published Diary History</h2>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading diary entries...</div>
        ) : diaries.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-sm">
            You have not published any diary entries yet.
          </div>
        ) : (
          <div className="space-y-4">
            {diaries.map((entry) => (
              <div
                key={entry.id}
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 hover:border-emerald-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full uppercase">
                      {entry.subject?.name}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {entry.class?.name} - Section {entry.section?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">Date: {entry.date}</span>
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="text-sm font-semibold text-slate-900 mb-1">Homework:</div>
                <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 mb-2">
                  {entry.homework}
                </div>

                {entry.diary && (
                  <div className="text-xs text-slate-600 mt-2">
                    <span className="font-semibold text-slate-800">Diary: </span>
                    {entry.diary}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherDiaryManager
