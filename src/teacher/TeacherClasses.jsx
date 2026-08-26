import { useState, useEffect } from 'react'
import apiClient from '../lib/apiClient'

const TeacherClasses = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await apiClient.get('/api/assignments')
        if (res.success) {
          setAssignments(res.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch assigned classes:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-[var(--text-muted)] font-medium">Loading classes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="heading text-xl font-black text-[var(--text)]">My Assigned Classes</h1>
        <p className="paragraph text-xs text-[var(--text-muted)] mt-1">
          Below are the class sections and subjects assigned to your faculty profile by the administrator.
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[var(--neutral-200)]">
          <p className="text-sm text-[var(--text-muted)]">No active class assignments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assignments.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-[var(--neutral-200)] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-blue-50 px-3 py-1 rounded-md">
                  {item.class?.name}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                  Section {item.section?.name}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{item.subject?.name}</h3>
              <p className="text-xs text-slate-500">Authorized for Daily Diary publishing & homework uploads.</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TeacherClasses
