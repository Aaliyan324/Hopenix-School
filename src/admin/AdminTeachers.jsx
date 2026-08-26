import { useState, useEffect } from 'react'
import apiClient from '../lib/apiClient'
import { useToast } from '../context/ToastContext'

const AdminTeachers = () => {
  const { addToast } = useToast()
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(null) // teacher object
  const [editingTeacher, setEditingTeacher] = useState(null)

  // Add Form
  const [addName, setAddName] = useState('')
  const [addEmail, setAddEmail] = useState('')
  const [addPassword, setAddPassword] = useState('')
  const [addEmployeeId, setAddEmployeeId] = useState('')
  const [addPhone, setAddPhone] = useState('')

  // Edit Form
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editStatus, setEditStatus] = useState('ACTIVE')
  const [resetPassword, setResetPassword] = useState('')

  // Assign Form
  const [assignClassId, setAssignClassId] = useState('')
  const [assignSectionId, setAssignSectionId] = useState('')
  const [assignSubjectId, setAssignSubjectId] = useState('')
  const [availableSections, setAvailableSections] = useState([])

  const loadData = async () => {
    try {
      const [tRes, cRes] = await Promise.all([
        apiClient.get('/api/teachers'),
        apiClient.get('/api/classes'),
      ])

      if (tRes.success) setTeachers(tRes.data || [])
      if (cRes.success && cRes.data) {
        const clsList = cRes.data.classes || []
        setClasses(clsList)
        setSubjects(cRes.data.subjects || [])
        if (clsList.length > 0) {
          setAssignClassId(clsList[0].id)
          setAvailableSections(clsList[0].sections || [])
          if (clsList[0].sections?.length > 0) {
            setAssignSectionId(clsList[0].sections[0].id)
          }
        }
      }
    } catch (err) {
      console.error('Failed to load teachers data:', err)
      addToast?.('Error loading teacher profiles', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleClassSelectChange = (e) => {
    const cid = e.target.value
    setAssignClassId(cid)
    const cls = classes.find((c) => c.id === cid)
    const secs = cls?.sections || []
    setAvailableSections(secs)
    if (secs.length > 0) setAssignSectionId(secs[0].id)
    else setAssignSectionId('')
  }

  // 1. Add Teacher
  const handleAddTeacher = async (e) => {
    e.preventDefault()
    try {
      const res = await apiClient.post('/api/teachers', {
        name: addName,
        email: addEmail,
        password: addPassword,
        employeeId: addEmployeeId,
        phone: addPhone,
      })

      if (res.success) {
        addToast?.('Teacher account created successfully!', 'success')
        setShowAddModal(false)
        setAddName('')
        setAddEmail('')
        setAddPassword('')
        setAddEmployeeId('')
        setAddPhone('')
        loadData()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to create teacher', 'error')
    }
  }

  // 2. Edit Teacher
  const handleOpenEdit = (t) => {
    setEditingTeacher(t)
    setEditName(t.user?.name || '')
    setEditPhone(t.phone || '')
    setEditStatus(t.user?.status || 'ACTIVE')
    setResetPassword('')
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingTeacher) return
    try {
      const res = await apiClient.put('/api/teachers', {
        id: editingTeacher.id,
        name: editName,
        phone: editPhone,
        status: editStatus,
        ...(resetPassword && { password: resetPassword }),
      })
      if (res.success) {
        addToast?.('Teacher updated successfully!', 'success')
        setEditingTeacher(null)
        loadData()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to update teacher', 'error')
    }
  }

  // 3. Delete Teacher
  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher account?')) return
    try {
      const res = await apiClient.delete('/api/teachers', { id })
      if (res.success) {
        addToast?.('Teacher deleted', 'success')
        loadData()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to delete teacher', 'error')
    }
  }

  // 4. Assign Class
  const handleAssignClass = async (e) => {
    e.preventDefault()
    if (!showAssignModal || !assignClassId || !assignSectionId || !assignSubjectId) return
    try {
      const res = await apiClient.post('/api/assignments', {
        teacherId: showAssignModal.id,
        classId: assignClassId,
        sectionId: assignSectionId,
        subjectId: assignSubjectId,
      })
      if (res.success) {
        addToast?.('Class assigned to teacher successfully!', 'success')
        loadData()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to assign class', 'error')
    }
  }

  // 5. Remove Assignment
  const handleRemoveAssignment = async (assignmentId) => {
    try {
      const res = await apiClient.delete('/api/assignments', { id: assignmentId })
      if (res.success) {
        addToast?.('Assignment removed', 'success')
        loadData()
      }
    } catch (err) {
      addToast?.(err.message || 'Failed to remove assignment', 'error')
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-[var(--text-muted)] font-medium">Loading faculty list...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading text-2xl font-black text-[var(--text)]">Teacher Management</h1>
          <p className="paragraph text-xs text-[var(--text-muted)] mt-1">
            Create teacher accounts, edit details, set active status, reset passwords, and assign classes.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <span>➕</span> Add New Teacher
        </button>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-2xl border border-[var(--neutral-200)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="p-4">Teacher Name & Email</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned Classes & Subjects</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{t.user?.name}</div>
                    <div className="text-slate-500">{t.user?.email}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-700">{t.employeeId}</td>
                  <td className="p-4 text-slate-600">{t.phone || '—'}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        t.user?.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {t.user?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {t.assignments?.map((a) => (
                        <span
                          key={a.id}
                          className="inline-flex items-center gap-1 bg-blue-50 text-[var(--primary)] text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-100"
                        >
                          {a.class?.name} ({a.section?.name}) : {a.subject?.name}
                          <button
                            onClick={() => handleRemoveAssignment(a.id)}
                            className="hover:text-red-600 font-bold ml-1 text-xs"
                            title="Remove assignment"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {(!t.assignments || t.assignments.length === 0) && (
                        <span className="text-slate-400 italic">No classes assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setShowAssignModal(t)}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100"
                    >
                      Assign Class
                    </button>
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="px-2 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(t.id)}
                      className="px-2 py-1 bg-red-50 text-red-700 font-bold rounded-lg hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Teacher */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add New Teacher Account</h3>
            <form onSubmit={handleAddTeacher} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="e.g. Mr. Ahmed Raza"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="ahmed@hopenix.edu.pk"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Employee ID *</label>
                <input
                  type="text"
                  required
                  value={addEmployeeId}
                  onChange={(e) => setAddEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="EMP-1002"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="+92 300 1234567"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-bold"
                >
                  Create Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Teacher */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">Edit Teacher Profile</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DISABLED">DISABLED</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reset Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-bold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Class */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Assign Class & Subject</h3>
            <p className="text-xs text-slate-500 mb-4">Teacher: {showAssignModal.user?.name}</p>
            <form onSubmit={handleAssignClass} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class</label>
                <select
                  value={assignClassId}
                  onChange={handleClassSelectChange}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Section</label>
                <select
                  value={assignSectionId}
                  onChange={(e) => setAssignSectionId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  {availableSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={assignSubjectId}
                  onChange={(e) => setAssignSubjectId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Close
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTeachers
