import { useState, useEffect } from 'react'
import apiClient from '../lib/apiClient'
import { useToast } from '../context/ToastContext'

const AdminClasses = () => {
  const { addToast } = useToast()
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Forms
  const [newClassName, setNewClassName] = useState('')
  const [newSubjectName, setNewSubjectName] = useState('')
  const [addingSectionForClassId, setAddingSectionForClassId] = useState(null)
  const [newSectionName, setNewSectionName] = useState('')

  const loadData = async () => {
    try {
      const res = await apiClient.get('/api/classes')
      if (res.success && res.data) {
        setClasses(res.data.classes || [])
        setSubjects(res.data.subjects || [])
      }
    } catch (err) {
      console.error('Failed to load class configuration:', err)
      addToast?.('Error loading classes & subjects', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Create Class
  const handleAddClass = async (e) => {
    e.preventDefault()
    if (!newClassName.trim()) return
    try {
      const res = await apiClient.post('/api/classes', { type: 'class', name: newClassName.trim() })
      if (res.success) {
        addToast?.('Class created successfully!', 'success')
        setNewClassName('')
        loadData()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to add class', 'error')
    }
  }

  // Delete Class
  const handleDeleteClass = async (id) => {
    if (!window.confirm('Delete this class and all associated sections?')) return
    try {
      const res = await apiClient.delete('/api/classes', { type: 'class', id })
      if (res.success) {
        addToast?.('Class deleted', 'success')
        loadData()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to delete class', 'error')
    }
  }

  // Create Section
  const handleAddSection = async (classId) => {
    if (!newSectionName.trim()) return
    try {
      const res = await apiClient.post('/api/classes', {
        type: 'section',
        classId,
        name: newSectionName.trim().toUpperCase(),
      })
      if (res.success) {
        addToast?.('Section added!', 'success')
        setNewSectionName('')
        setAddingSectionForClassId(null)
        loadData()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to add section', 'error')
    }
  }

  // Delete Section
  const handleDeleteSection = async (id) => {
    try {
      const res = await apiClient.delete('/api/classes', { type: 'section', id })
      if (res.success) {
        addToast?.('Section deleted', 'success')
        loadData()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to delete section', 'error')
    }
  }

  // Create Subject
  const handleAddSubject = async (e) => {
    e.preventDefault()
    if (!newSubjectName.trim()) return
    try {
      const res = await apiClient.post('/api/classes', { type: 'subject', name: newSubjectName.trim() })
      if (res.success) {
        addToast?.('Subject added successfully!', 'success')
        setNewSubjectName('')
        loadData()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to add subject', 'error')
    }
  }

  // Delete Subject
  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Delete this subject?')) return
    try {
      const res = await apiClient.delete('/api/classes', { type: 'subject', id })
      if (res.success) {
        addToast?.('Subject deleted', 'success')
        loadData()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to delete subject', 'error')
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-[var(--text-muted)] font-medium">Loading configuration...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading text-2xl font-black text-[var(--text)]">Classes, Sections & Subjects</h1>
        <p className="paragraph text-xs text-[var(--text-muted)] mt-1">
          Customize school classes, sections, and subjects stored in SQL database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Classes & Sections */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[var(--neutral-200)] shadow-sm">
            <h2 className="heading text-base font-bold text-[var(--text)] mb-4">Add Custom Class</h2>
            <form onSubmit={handleAddClass} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. Grade 11 / O-Levels"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-bold text-xs"
              >
                Add Class
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--neutral-200)] shadow-sm">
            <h2 className="heading text-base font-bold text-[var(--text)] mb-4">Configured Classes ({classes.length})</h2>
            <div className="space-y-4">
              {classes.map((cls) => (
                <div key={cls.id} className="p-4 border rounded-xl bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">{cls.name}</span>
                    <button
                      onClick={() => handleDeleteClass(cls.id)}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Delete Class
                    </button>
                  </div>

                  {/* Sections list */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold">Sections:</span>
                    {cls.sections?.map((sec) => (
                      <span
                        key={sec.id}
                        className="inline-flex items-center gap-1 bg-white text-slate-800 text-xs font-bold px-2.5 py-1 rounded-md border"
                      >
                        Section {sec.name}
                        <button
                          onClick={() => handleDeleteSection(sec.id)}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {addingSectionForClassId === cls.id ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          maxLength={3}
                          placeholder="E"
                          value={newSectionName}
                          onChange={(e) => setNewSectionName(e.target.value)}
                          className="w-12 px-2 py-0.5 text-xs border rounded uppercase"
                        />
                        <button
                          onClick={() => handleAddSection(cls.id)}
                          className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-xs rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setAddingSectionForClassId(null)}
                          className="px-1.5 py-0.5 text-slate-500 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAddingSectionForClassId(cls.id)
                          setNewSectionName('')
                        }}
                        className="text-xs font-bold text-[var(--primary)] hover:underline"
                      >
                        + Add Section
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Subjects */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[var(--neutral-200)] shadow-sm">
            <h2 className="heading text-base font-bold text-[var(--text)] mb-4">Add Custom Subject</h2>
            <form onSubmit={handleAddSubject} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. Biology"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border text-xs"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-bold text-xs">
                Add Subject
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--neutral-200)] shadow-sm">
            <h2 className="heading text-base font-bold text-[var(--text)] mb-3">Configured Subjects ({subjects.length})</h2>
            <div className="divide-y divide-slate-100">
              {subjects.map((sub) => (
                <div key={sub.id} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{sub.name}</span>
                  <button
                    onClick={() => handleDeleteSubject(sub.id)}
                    className="text-red-500 font-bold hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminClasses
