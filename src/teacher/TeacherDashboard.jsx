import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import apiClient from '../lib/apiClient'

const TeacherDashboard = () => {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [todaysEntries, setTodaysEntries] = useState([])
  const [recentEntries, setRecentEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const todayStr = new Date().toISOString().split('T')[0]
        const teacherId = user?.teacher?.id

        const [assignRes, todayRes, recentRes] = await Promise.all([
          apiClient.get('/api/assignments'),
          apiClient.get('/api/diary', { date: todayStr, teacherId }),
          apiClient.get('/api/diary', { teacherId, limit: 5 }),
        ])

        if (assignRes.success) setAssignments(assignRes.data || [])
        if (todayRes.success) setTodaysEntries(todayRes.data || [])
        if (recentRes.success) setRecentEntries(recentRes.data || [])
      } catch (err) {
        console.error('Failed to load teacher dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [user])

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-[var(--text-muted)] font-medium">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--secondary)] to-slate-800 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              Faculty Portal
            </span>
            <h1 className="heading text-xl sm:text-2xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-xs sm:text-sm opacity-80 mt-1">
              Employee ID: {user?.teacher?.employeeId || 'N/A'} • Manage daily homework & announcements.
            </p>
          </div>
          <Link
            to="/teacher/diary"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-white/90 transition-colors shadow-sm self-start sm:self-auto"
          >
            <span>✍️</span> Create Daily Diary
          </Link>
        </div>
      </div>

      {/* Assigned Classes Overview */}
      <div>
        <h2 className="heading text-base font-bold text-[var(--text)] mb-3">Your Assigned Classes & Subjects</h2>
        {assignments.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center border border-[var(--neutral-200)]">
            <p className="text-sm text-[var(--text-muted)]">No class assignments found. Contact admin to assign classes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 border border-[var(--neutral-200)] shadow-sm hover:border-[var(--primary)] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-blue-50 px-2.5 py-1 rounded-md">
                    {item.class?.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Section {item.section?.name}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.subject?.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Today's Diary Uploads */}
      <div>
        <h2 className="heading text-base font-bold text-[var(--text)] mb-3 flex items-center justify-between">
          <span>Today's Uploaded Diary</span>
          <span className="text-xs font-semibold text-[var(--text-muted)]">
            {todaysEntries.length} entries published
          </span>
        </h2>

        {todaysEntries.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[var(--neutral-200)]">
            <p className="text-sm text-[var(--text-muted)] mb-3">You haven't uploaded today's diary yet.</p>
            <Link
              to="/teacher/diary"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90"
            >
              Publish Today's Diary
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaysEntries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-xl p-5 border border-emerald-100 bg-emerald-50/20 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-[var(--text)]">
                    {entry.class?.name} - Sec {entry.section?.name} • {entry.subject?.name}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    PUBLISHED
                  </span>
                </div>
                <p className="text-xs text-slate-700 line-clamp-2 font-medium">
                  <strong>Homework:</strong> {entry.homework}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherDashboard
