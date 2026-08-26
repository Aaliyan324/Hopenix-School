import { useState, useEffect } from 'react'
import apiClient from '../lib/apiClient'
import Breadcrumbs from '../components/Breadcrumbs'
import SectionHeading from '../components/SectionHeading'

const DailyDiary = () => {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [diaries, setDiaries] = useState([])
  const [loading, setLoading] = useState(false)
  const [availableSections, setAvailableSections] = useState([])

  // Fetch initial classes and subjects list
  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await apiClient.get('/api/classes')
        if (res.success && res.data) {
          const clsList = res.data.classes || []
          setClasses(clsList)
          setSubjects(res.data.subjects || [])

          if (clsList.length > 0) {
            setSelectedClassId(clsList[0].id)
            setAvailableSections(clsList[0].sections || [])
            if (clsList[0].sections?.length > 0) {
              setSelectedSectionId(clsList[0].sections[0].id)
            }
          }
        }
      } catch (err) {
        console.error('Failed to load class metadata:', err)
      }
    }
    loadMeta()
  }, [])

  // Update sections when class selection changes
  const handleClassChange = (e) => {
    const classId = e.target.value
    setSelectedClassId(classId)
    const cls = classes.find((c) => c.id === classId)
    const secs = cls?.sections || []
    setAvailableSections(secs)
    if (secs.length > 0) {
      setSelectedSectionId(secs[0].id)
    } else {
      setSelectedSectionId('')
    }
  }

  // Fetch diary entries when filters change
  useEffect(() => {
    async function fetchDiary() {
      if (!selectedClassId || !selectedSectionId || !selectedDate) return
      setLoading(true)
      try {
        const res = await apiClient.get('/api/diary', {
          date: selectedDate,
          classId: selectedClassId,
          sectionId: selectedSectionId,
          ...(selectedSubjectId && { subjectId: selectedSubjectId }),
        })
        if (res.success) {
          setDiaries(res.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch diary entries:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDiary()
  }, [selectedClassId, selectedSectionId, selectedSubjectId, selectedDate])

  const selectedClassName = classes.find((c) => c.id === selectedClassId)?.name || ''
  const selectedSectionName = availableSections.find((s) => s.id === selectedSectionId)?.name || ''

  return (
    <div className="pt-24 sm:pt-28 pb-16 min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Daily Diary' }]} />

        <div className="mt-6">
          <SectionHeading
            subtitle="Parent & Student Portal"
            title="Daily Homework & Class Diary"
            description="Select your child's class, section, and date to view today's homework instructions and daily announcements."
          />
        </div>

        {/* Filter Card */}
        <div className="mt-8 bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-[var(--neutral-200)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm font-medium text-[var(--text)] bg-[var(--surface)]"
              />
            </div>

            {/* Class Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Select Class
              </label>
              <select
                value={selectedClassId}
                onChange={handleClassChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm font-medium text-[var(--text)] bg-[var(--surface)]"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Select Section
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm font-medium text-[var(--text)] bg-[var(--surface)]"
              >
                {availableSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    Section {sec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Filter Subject (Optional)
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm font-medium text-[var(--text)] bg-[var(--surface)]"
              >
                <option value="">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Header Badge */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 bg-[var(--secondary)] text-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="font-bold text-base sm:text-lg">
              {selectedClassName ? `${selectedClassName} — Section ${selectedSectionName}` : 'Select Class'}
            </h2>
          </div>
          <div className="text-xs sm:text-sm font-medium opacity-90">
            📅 {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Entries View */}
        <div className="mt-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-semibold text-[var(--text-muted)]">Loading daily diary...</p>
            </div>
          ) : diaries.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[var(--neutral-200)] shadow-sm">
              <div className="w-16 h-16 bg-blue-50 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                📘
              </div>
              <h3 className="text-lg font-bold text-[var(--text)] mb-1">No Diary Uploaded Yet</h3>
              <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
                No homework or diary entry has been uploaded for {selectedClassName} Section {selectedSectionName} on this date.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diaries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl p-6 border border-[var(--neutral-200)] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[var(--neutral-100)]">
                      <span className="px-3 py-1 rounded-full bg-[var(--primary)] text-white text-xs font-bold uppercase tracking-wider">
                        {entry.subject?.name || 'Subject'}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-medium">
                        Teacher: <strong className="text-[var(--text)]">{entry.teacher?.user?.name || 'Assigned Teacher'}</strong>
                      </span>
                    </div>

                    {/* Homework Section */}
                    <div className="mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1.5 flex items-center gap-1.5">
                        <span>✏️</span> Homework / Task
                      </h4>
                      <div className="p-3.5 bg-blue-50/60 rounded-xl text-sm font-semibold text-slate-800 whitespace-pre-line leading-relaxed">
                        {entry.homework}
                      </div>
                    </div>

                    {/* Diary / Instructions Section */}
                    <div className="mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1.5 flex items-center gap-1.5">
                        <span>📌</span> Daily Instructions
                      </h4>
                      <div className="p-3.5 bg-emerald-50/60 rounded-xl text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {entry.diary}
                      </div>
                    </div>

                    {/* Additional Notes if any */}
                    {entry.notes && (
                      <div className="mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1 flex items-center gap-1.5">
                          <span>💡</span> Additional Note
                        </h4>
                        <p className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                          {entry.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Attachment if any */}
                  {entry.attachmentUrl && (
                    <div className="mt-4 pt-3 border-t border-[var(--neutral-100)]">
                      <a
                        href={entry.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline bg-blue-50 px-3 py-2 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Attached Worksheet / Document
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DailyDiary
