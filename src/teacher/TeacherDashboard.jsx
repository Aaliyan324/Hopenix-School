import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGet } from '../lib/api-client'

const TeacherDashboard = () => {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [recentUploads, setRecentUploads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTeacherData() {
      setLoading(true)
      try {
        const [assignRes, diaryRes] = await Promise.all([
          apiGet('/api/assignments'),
          apiGet('/api/diary', { teacherId: user.teacherId, limit: 5 }),
        ])

        if (assignRes.success) setAssignments(assignRes.assignments || [])
        if (diaryRes.success) setRecentUploads(diaryRes.data || [])
      } catch (err) {
        console.error('Error loading teacher dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user?.teacherId || user?.role === 'ADMIN') {
      loadTeacherData()
    }
  }, [user])

  const todayISO = new Date().toISOString().split('T')[0]
  const todayCount = recentUploads.filter((d) => d.date === todayISO).length

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Teacher Workspace
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Teacher'}! 👋
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
            Manage your daily homework assignments, publish class instructions, and view your assigned subject rosters.
          </p>
        </div>

        <Link
          to="/teacher/diary"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition transform active:scale-95 text-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Publish Daily Diary
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Assigned Subjects / Classes
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{assignments.length}</div>
          <p className="text-xs text-slate-400 mt-1">Class & Section allocations</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Today's Uploads
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{todayCount}</div>
          <p className="text-xs text-slate-400 mt-1">Published for {todayISO}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Total Diary Submissions
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{recentUploads.length}</div>
          <p className="text-xs text-slate-400 mt-1">Recent entries logged</p>
        </div>
      </div>

      {/* Assigned Classes & Subjects Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Assigned Classes & Subjects</h2>
            <p className="text-xs text-slate-500">
              You are authorized to publish daily diary entries for these specific classes and subjects.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading assigned classes...</div>
        ) : assignments.length === 0 ? (
          <div className="p-8 bg-amber-50/50 border border-amber-200 rounded-xl text-center">
            <p className="text-sm font-semibold text-amber-900">No classes assigned yet.</p>
            <p className="text-xs text-amber-700 mt-1">
              Please contact the school admin to assign your class, section, and subject duties.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((asgn) => (
              <div
                key={asgn.id}
                className="bg-slate-50 hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                    {asgn.subject?.name}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Sec {asgn.section?.name}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition">
                  {asgn.class?.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Section {asgn.section?.name}</p>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Ready for upload</span>
                  <Link
                    to="/teacher/diary"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    Post Diary &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Your Recent Diary Uploads</h2>
        {recentUploads.length === 0 ? (
          <p className="text-sm text-slate-500">No diary uploads logged yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentUploads.map((entry) => (
              <div key={entry.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{entry.subject?.name}</span>
                    <span className="text-xs font-medium text-slate-500">
                      ({entry.class?.name} - Sec {entry.section?.name})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{entry.homework}</p>
                </div>
                <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
                  Date: {entry.date}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherDashboard
