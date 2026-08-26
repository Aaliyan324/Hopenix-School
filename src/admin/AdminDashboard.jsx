import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../lib/apiClient'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiClient.get('/api/admin')
        if (res.success) {
          setStats(res.data)
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-[var(--text-muted)] font-medium">Loading system metrics...</p>
      </div>
    )
  }

  const statCards = [
    { title: 'Total Teachers', count: stats?.totalTeachers || 0, icon: '👨‍🏫', color: 'bg-blue-500', link: '/admin/teachers' },
    { title: 'Classes & Sections', count: stats?.totalClasses || 0, icon: '🏫', color: 'bg-emerald-500', link: '/admin/classes' },
    { title: 'Total Diary Entries', count: stats?.totalDiaryEntries || 0, icon: '📚', color: 'bg-indigo-500', link: '/admin/diary' },
    { title: "Today's Diary Uploads", count: stats?.todaysDiaryCount || 0, icon: '✍️', color: 'bg-purple-500', link: '/admin/diary' },
    { title: 'Pending Admissions', count: stats?.pendingAdmissionsCount || 0, icon: '📋', color: 'bg-amber-500', link: '/admin/admissions' },
    { title: 'Upcoming Events', count: stats?.upcomingEventsCount || 0, icon: '🎉', color: 'bg-rose-500', link: '/admin/events' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading text-2xl font-black text-[var(--text)]">School Administration Dashboard</h1>
        <p className="paragraph text-xs text-[var(--text-muted)] mt-1">
          Overview of faculty, classes, daily homework records, admission requests, and campus events.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)] shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{card.title}</p>
              <h3 className="heading text-2xl font-black text-[var(--text)] mt-1">{card.count}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${card.color} text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform`}>
              {card.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Diary Uploads & Admissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Diary */}
        <div className="bg-white rounded-2xl p-6 border border-[var(--neutral-200)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading text-base font-bold text-[var(--text)]">Recent Daily Diary Uploads</h2>
            <Link to="/admin/diary" className="text-xs font-bold text-[var(--primary)] hover:underline">
              View All
            </Link>
          </div>
          {!stats?.recentDiary?.length ? (
            <p className="text-xs text-[var(--text-muted)]">No diary entries found.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentDiary.map((item) => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>
                      {item.class?.name} ({item.section?.name}) - {item.subject?.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">📅 {item.date}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-1">
                    <strong>Homework:</strong> {item.homework}
                  </p>
                  <p className="text-slate-400 text-[10px] mt-1">Teacher: {item.teacher?.user?.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Admissions */}
        <div className="bg-white rounded-2xl p-6 border border-[var(--neutral-200)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading text-base font-bold text-[var(--text)]">Recent Admission Submissions</h2>
            <Link to="/admin/admissions" className="text-xs font-bold text-[var(--primary)] hover:underline">
              View All
            </Link>
          </div>
          {!stats?.recentAdmissions?.length ? (
            <p className="text-xs text-[var(--text-muted)]">No admission submissions found.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentAdmissions.map((adm) => (
                <div key={adm.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{adm.studentName}</h4>
                    <p className="text-slate-500 text-[11px]">
                      Parent: {adm.parentName} • {adm.classApplyingFor}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                      adm.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : adm.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {adm.status}
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
