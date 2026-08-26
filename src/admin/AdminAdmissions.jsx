import { useState, useEffect } from 'react'
import apiClient from '../lib/apiClient'
import { useToast } from '../context/ToastContext'

const AdminAdmissions = () => {
  const { addToast } = useToast()
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  // View modal
  const [viewItem, setViewItem] = useState(null)

  const loadAdmissions = async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter !== 'ALL') params.status = statusFilter
      if (search) params.search = search

      const res = await apiClient.get('/api/admissions', params)
      if (res.success) {
        setAdmissions(res.data || [])
      }
    } catch (err) {
      console.error('Failed to load admissions:', err)
      addToast?.('Error loading admissions from database', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdmissions()
  }, [statusFilter, search])

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await apiClient.put('/api/admissions', { id, status: newStatus })
      if (res.success) {
        addToast?.(`Application status changed to ${newStatus}`, 'success')
        if (viewItem?.id === id) {
          setViewItem({ ...viewItem, status: newStatus })
        }
        loadAdmissions()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to update status', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admission application?')) return
    try {
      const res = await apiClient.delete('/api/admissions', { id })
      if (res.success) {
        addToast?.('Application deleted', 'success')
        setViewItem(null)
        loadAdmissions()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to delete application', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading text-2xl font-black text-[var(--text)]">Admissions Management</h1>
        <p className="paragraph text-xs text-[var(--text-muted)] mt-1">
          Review, track, and update student admission applications stored in SQL.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by student, parent, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border text-xs bg-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border text-xs bg-white font-bold"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="REVIEWING">REVIEWING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs text-[var(--text-muted)] font-medium">Loading admission requests...</p>
          </div>
        ) : admissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No admission applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Parent Name</th>
                  <th className="p-4">Class Applying For</th>
                  <th className="p-4">Contact Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{adm.studentName}</td>
                    <td className="p-4 text-slate-700">{adm.parentName}</td>
                    <td className="p-4 font-bold text-[var(--primary)]">{adm.classApplyingFor}</td>
                    <td className="p-4">
                      <div>{adm.phone}</div>
                      <div className="text-slate-400 text-[11px]">{adm.email}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={adm.status}
                        onChange={(e) => handleStatusChange(adm.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border-0 cursor-pointer ${
                          adm.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : adm.status === 'REVIEWING'
                            ? 'bg-blue-100 text-blue-800'
                            : adm.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="REVIEWING">REVIEWING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setViewItem(adm)}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(adm.id)}
                        className="px-2 py-1 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Admission Application Details</h3>
              <button onClick={() => setViewItem(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{viewItem.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Parent Name:</span>
                <span className="font-bold text-slate-900">{viewItem.parentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Class Applying For:</span>
                <span className="font-bold text-[var(--primary)]">{viewItem.classApplyingFor}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Phone Number:</span>
                <span className="font-bold text-slate-900">{viewItem.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Email Address:</span>
                <span className="font-bold text-slate-900">{viewItem.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Submitted Date:</span>
                <span className="text-slate-700">{new Date(viewItem.createdAt).toLocaleString()}</span>
              </div>
              {viewItem.message && (
                <div className="pt-2">
                  <span className="text-slate-500 block font-bold mb-1">Additional Message / Query:</span>
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed whitespace-pre-line">
                    {viewItem.message}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => handleDelete(viewItem.id)}
                className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold"
              >
                Delete Application
              </button>
              <button
                onClick={() => setViewItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAdmissions
