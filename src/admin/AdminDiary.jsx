import { useState, useEffect } from 'react'
import { apiGet, apiDelete, apiPut } from '../lib/api-client'
import { useToast } from '../context/ToastContext'

const AdminDiary = () => {
  const { showToast } = useToast()

  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])

  // Filter state
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [selectedTeacherId, setSelectedTeacherId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  const [diaries, setDiaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [availableSections, setAvailableSections] = useState([])

  // Load metadata dropdowns
  useEffect(() => {
    async function loadMeta() {
      try {
        const [cRes, tRes] = await Promise.all([
          apiGet('/api/classes'),
          apiGet('/api/teachers'),
        ])
        if (cRes.success) {
          setClasses(cRes.classes || [])
          setSubjects(cRes.subjects || [])
        }
        if (tRes.success) {
          setTeachers(tRes.teachers || [])
        }
      } catch (err) {
        console.error('Error loading metadata:', err)
      }
    }
    loadMeta()
  }, [])

  const handleClassChange = (classId) => {
    setSelectedClassId(classId)
    const cls = classes.find((c) => c.id === classId)
    if (cls && cls.sections) {
      setAvailableSections(cls.sections)
    } else {
      setAvailableSections([])
    }
    setSelectedSectionId('')
  }

  const loadDiaries = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedClassId) params.classId = selectedClassId
      if (selectedSectionId) params.sectionId = selectedSectionId
      if (selectedSubjectId) params.subjectId = selectedSubjectId
      if (selectedTeacherId) params.teacherId = selectedTeacherId
      if (selectedDate) params.date = selectedDate

      const res = await apiGet('/api/diary', params)
      if (res.success) {
        setDiaries(res.data || [])
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch diary entries', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDiaries()
  }, [selectedClassId, selectedSectionId, selectedSubjectId, selectedTeacherId, selectedDate])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diary entry?')) return
    try {
      await apiDelete('/api/diary', { id })
      showToast('Diary entry deleted', 'success')
      loadDiaries()
    } catch (err) {
      showToast(err.message || 'Failed to delete diary', 'error')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          School-Wide Daily Diary & Homework
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor and review all published homework assignments and diary logs across every class and teacher.
        </p>
      </div>

      {/* Filter Control Box */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Filter Diary Entries
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Class */}
          <select
            value={selectedClassId}
            onChange={(e) => handleClassChange(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Section */}
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600"
            disabled={!selectedClassId}
          >
            <option value="">All Sections</option>
            {availableSections.map((s) => (
              <option key={s.id} value={s.id}>
                Section {s.name}
              </option>
            ))}
          </select>

          {/* Subject */}
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          {/* Teacher */}
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Teachers</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.user?.name}
              </option>
            ))}
          </select>

          {/* Date */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {(selectedClassId || selectedSubjectId || selectedTeacherId || selectedDate) && (
          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedClassId('')
                setSelectedSectionId('')
                setSelectedSubjectId('')
                setSelectedTeacherId('')
                setSelectedDate('')
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Diary Entries List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading entries...</div>
        ) : diaries.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No daily diary entries match the selected filters.
          </div>
        ) : (
          <div className="space-y-4">
            {diaries.map((entry) => (
              <div
                key={entry.id}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:border-blue-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase">
                      {entry.subject?.name}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {entry.class?.name} - Section {entry.section?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">
                      Teacher: <span className="font-semibold text-slate-800">{entry.teacher?.user?.name}</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Date: {entry.date}</span>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-700 uppercase mb-1">Homework Assignment:</div>
                <div className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200/60 mb-2">
                  {entry.homework}
                </div>

                {entry.diary && (
                  <div className="text-xs text-slate-600 mt-2">
                    <span className="font-semibold text-slate-800">Diary Instructions: </span>
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

export default AdminDiary
