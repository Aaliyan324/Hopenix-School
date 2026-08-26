import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../lib/api-client'

const AdminDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true)
      try {
        const res = await apiGet('/api/admin')
        if (res.success) {
          setData(res)
        }
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadMetrics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Admin Dashboard</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const stats = data?.stats || {}
  const recentDiary = data?.recentActivity?.recentDiary || []
  const recentAdmissions = data?.recentActivity?.recentAdmissions || []

  const statCards = [
    { label: 'Total Teachers', value: stats.totalTeachers || 0, color: 'text-blue-600', link: '/admin/teachers' },
    { label: 'Total Classes', value: stats.totalClasses || 0, color: 'text-indigo-600', link: '/admin/classes' },
    { label: "Today's Diary Uploads", value: stats.todayDiaryEntries || 0, color: 'text-emerald-600', link: '/admin/diary' },
    { label: 'Total Diary Entries', value: stats.totalDiaryEntries || 0, color: 'text-teal-600', link: '/admin/diary' },
    { label: 'Pending Admissions', value: stats.pendingAdmissions || 0, color: 'text-amber-600', link: '/admin/admissions' },
    { label: 'Total Events', value: stats.totalEvents || 0, color: 'text-purple-600', link: '/admin/events' },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Admin Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time school database analytics and administrative monitoring.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/teacher/diary"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
          >
            + Post Diary
          </Link>
          <Link
            to="/admin/teachers"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
          >
            Manage Teachers
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <Link
            key={s.label}
            to={s.link}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {s.label}
            </p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Activity Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Daily Diary Activity */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Recent Diary Submissions</h2>
            <Link to="/admin/diary" className="text-xs font-bold text-blue-600 hover:text-blue-800">
              View All &rarr;
            </Link>
          </div>

          {recentDiary.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No recent diary uploads.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentDiary.map((d) => (
                <div key={d.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{d.subject?.name}</span>
                    <span className="text-slate-500 font-medium ml-2">
                      ({d.class?.name} - Sec {d.section?.name})
                    </span>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      Teacher: {d.teacher?.user?.name}
                    </div>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px] shrink-0">{d.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Admission Submissions */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Recent Admission Applications</h2>
            <Link to="/admin/admissions" className="text-xs font-bold text-blue-600 hover:text-blue-800">
              Manage Applications &rarr;
            </Link>
          </div>

          {recentAdmissions.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No recent admission applications.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentAdmissions.map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{app.studentName}</span>
                    <span className="text-slate-500 font-medium ml-2">
                      Applying for {app.classApplyingFor}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-0.5">Parent: {app.parentName} ({app.phone})</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      app.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
