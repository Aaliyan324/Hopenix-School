import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api-client'
import { useToast } from '../context/ToastContext'

const AdminClasses = () => {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('classes') // 'classes' | 'subjects'

  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Input states
  const [newClassName, setNewClassName] = useState('')
  const [newSectionName, setNewSectionName] = useState('')
  const [selectedClassIdForSection, setSelectedClassIdForSection] = useState('')
  const [newSubjectName, setNewSubjectName] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await apiGet('/api/classes')
      if (res.success) {
        setClasses(res.classes || [])
        setSubjects(res.subjects || [])
        if (res.classes && res.classes.length > 0 && !selectedClassIdForSection) {
          setSelectedClassIdForSection(res.classes[0].id)
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to load class configuration', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddClass = async (e) => {
    e.preventDefault()
    if (!newClassName.trim()) return

    try {
      await apiPost('/api/classes', { type: 'class', name: newClassName })
      showToast('Class created successfully!', 'success')
      setNewClassName('')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to create class', 'error')
    }
  }

  const handleAddSection = async (e) => {
    e.preventDefault()
    if (!newSectionName.trim() || !selectedClassIdForSection) return

    try {
      await apiPost('/api/classes', {
        type: 'section',
        classId: selectedClassIdForSection,
        name: newSectionName,
      })
      showToast('Section added to class!', 'success')
      setNewSectionName('')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to add section', 'error')
    }
  }

  const handleAddSubject = async (e) => {
    e.preventDefault()
    if (!newSubjectName.trim()) return

    try {
      await apiPost('/api/classes', { type: 'subject', name: newSubjectName })
      showToast('Subject created successfully!', 'success')
      setNewSubjectName('')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to create subject', 'error')
    }
  }

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Deleting this class will also delete all associated sections and assignments. Proceed?')) return
    try {
      await apiDelete('/api/classes', { type: 'class', id })
      showToast('Class deleted', 'success')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to delete class', 'error')
    }
  }

  const handleDeleteSection = async (id) => {
    if (!window.confirm('Delete section?')) return
    try {
      await apiDelete('/api/classes', { type: 'section', id })
      showToast('Section deleted', 'success')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to delete section', 'error')
    }
  }

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Delete subject?')) return
    try {
      await apiDelete('/api/classes', { type: 'subject', id })
      showToast('Subject deleted', 'success')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to delete subject', 'error')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Classes, Sections & Subjects
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize school classes, sections, and subject curriculum structure.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition ${
            activeTab === 'classes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Classes & Sections ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition ${
            activeTab === 'subjects'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Subjects Offered ({subjects.length})
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading structures...</div>
      ) : activeTab === 'classes' ? (
        <div className="space-y-8">
          {/* Add Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Class */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-4">Add New Class</h3>
              <form onSubmit={handleAddClass} className="flex gap-3">
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Grade 11, Pre-Nursery..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs"
                >
                  Add Class
                </button>
              </form>
            </div>

            {/* Add Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-4">Add Section to Class</h3>
              <form onSubmit={handleAddSection} className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedClassIdForSection}
                  onChange={(e) => setSelectedClassIdForSection(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Section (e.g. B, Green)"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
                >
                  Add Section
                </button>
              </form>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-slate-900">{cls.name}</h3>
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-700"
                  >
                    Delete Class
                  </button>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sections</div>
                  <div className="flex flex-wrap gap-2">
                    {cls.sections && cls.sections.length > 0 ? (
                      cls.sections.map((sec) => (
                        <span
                          key={sec.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                        >
                          Sec {sec.name}
                          <button
                            onClick={() => handleDeleteSection(sec.id)}
                            className="text-slate-400 hover:text-red-600 font-bold"
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No sections</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Subjects Tab */
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 max-w-xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add New Subject</h3>
            <form onSubmit={handleAddSubject} className="flex gap-3">
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g. Computer Science, Social Studies..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs"
              >
                Add Subject
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl"
                >
                  <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                  <button
                    onClick={() => handleDeleteSubject(sub.id)}
                    className="text-slate-400 hover:text-red-600 text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminClasses
