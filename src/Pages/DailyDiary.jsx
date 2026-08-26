import { useState, useEffect } from 'react'
import { fetchClassesAndSubjects, fetchDiaryEntries } from '../lib/diary-service'

const DailyDiary = () => {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const [diaries, setDiaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [availableSections, setAvailableSections] = useState([])

  // Load initial classes & subjects
  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await fetchClassesAndSubjects()
        if (res.success) {
          setClasses(res.classes || [])
          setSubjects(res.subjects || [])

          if (res.classes && res.classes.length > 0) {
            // Default to Grade 5 or first class
            const defaultClass = res.classes.find((c) => c.name.toLowerCase().includes('grade 5')) || res.classes[0]
            setSelectedClassId(defaultClass.id)
            setAvailableSections(defaultClass.sections || [])
            if (defaultClass.sections && defaultClass.sections.length > 0) {
              setSelectedSectionId(defaultClass.sections[0].id)
            }
          }
        }
      } catch (err) {
        console.error('Error loading classes & subjects:', err)
      }
    }
    loadMeta()
  }, [])

  // Update sections when class selection changes
  const handleClassChange = (classId) => {
    setSelectedClassId(classId)
    const cls = classes.find((c) => c.id === classId)
    if (cls && cls.sections && cls.sections.length > 0) {
      setAvailableSections(cls.sections)
      setSelectedSectionId(cls.sections[0].id)
    } else {
      setAvailableSections([])
      setSelectedSectionId('')
    }
  }

  // Load diary entries whenever filters change
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const params = {}
        if (selectedClassId) params.classId = selectedClassId
        if (selectedSectionId) params.sectionId = selectedSectionId
        if (selectedSubjectId) params.subjectId = selectedSubjectId
        if (selectedDate) params.date = selectedDate

        const res = await fetchDiaryEntries(params)
        if (res.success) {
          setDiaries(res.data || [])
        }
      } catch (err) {
        console.error('Error fetching diary:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedClassId, selectedSectionId, selectedSubjectId, selectedDate])

  const selectedClass = classes.find((c) => c.id === selectedClassId)
  const selectedSection = availableSections.find((s) => s.id === selectedSectionId)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4 uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Parent Portal & Student Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Daily Class Diary & Homework
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Easily view daily homework, class instructions, and upcoming test schedules published by subject teachers.
          </p>
        </div>
      </section>

      {/* Main Filter & Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Filter Control Bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 sm:p-6 mb-8 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Class Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Section
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                disabled={availableSections.length === 0}
              >
                {availableSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    Section {sec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              >
                <option value="">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Selected Overview Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-blue-50/70 border border-blue-100 rounded-xl px-4 py-3 text-sm font-semibold text-blue-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            Viewing Diary for:{' '}
            <span className="font-bold text-blue-950">
              {selectedClass ? selectedClass.name : 'Class'} {selectedSection ? `- Section ${selectedSection.name}` : ''}
            </span>
          </div>
          <div className="text-slate-600 font-medium text-xs sm:text-sm">
            Date: <span className="font-semibold text-slate-900">{selectedDate}</span>
          </div>
        </div>

        {/* Diary List / Skeleton / Empty State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/4 mb-4" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : diaries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center my-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Diary Entries Found</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              No daily homework or diary entries have been uploaded for {selectedClass?.name || 'this class'}{' '}
              {selectedSection ? `Section ${selectedSection.name}` : ''} on {selectedDate}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {diaries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 transition-all overflow-hidden"
              >
                {/* Header Strip */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-full tracking-wide">
                      {entry.subject?.name || 'Subject'}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {entry.class?.name} - Section {entry.section?.name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Teacher: <span className="text-slate-200 font-semibold">{entry.teacher?.user?.name || 'Assigned Teacher'}</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-6">
                  {/* Homework Box */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 012.828 0L20 7.172a2 2 0 010 2.828l-8.485 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                        Homework Assignment
                      </h4>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-4 text-slate-800 text-sm font-medium whitespace-pre-wrap leading-relaxed">
                      {entry.homework}
                    </div>
                  </div>

                  {/* Diary / Instructions Box */}
                  {entry.diary && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                          Class Diary & Instructions
                        </h4>
                      </div>
                      <div className="bg-blue-50/40 border border-blue-100/80 rounded-xl p-4 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
                        {entry.diary}
                      </div>
                    </div>
                  )}

                  {/* Notes / Remarks */}
                  {entry.notes && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                          Additional Notes & Notices
                        </h4>
                      </div>
                      <div className="bg-amber-50/40 border border-amber-100/80 rounded-xl p-4 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
                        {entry.notes}
                      </div>
                    </div>
                  )}

                  {/* File Attachment */}
                  {entry.attachmentUrl && (
                    <div className="pt-2">
                      <a
                        href={entry.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Attachment File
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyDiary
