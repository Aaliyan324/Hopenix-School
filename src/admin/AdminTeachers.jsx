import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api-client'
import { useToast } from '../context/ToastContext'

const AdminTeachers = () => {
  const { showToast } = useToast()

  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  // Add Teacher Form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('Teacher@123')
  const [submitting, setSubmitting] = useState(false)

  // Assign Form
  const [assignClassId, setAssignClassId] = useState('')
  const [assignSectionId, setAssignSectionId] = useState('')
  const [assignSubjectId, setAssignSubjectId] = useState('')
  const [availableSections, setAvailableSections] = useState([])

  const loadData = async () => {
    setLoading(true)
    try {
      const [tRes, cRes] = await Promise.all([
        apiGet('/api/teachers'),
        apiGet('/api/classes'),
      ])

      if (tRes.success) setTeachers(tRes.teachers || [])
      if (cRes.success) {
        setClasses(cRes.classes || [])
        setSubjects(cRes.subjects || [])

        if (cRes.classes && cRes.classes.length > 0) {
          setAssignClassId(cRes.classes[0].id)
          setAvailableSections(cRes.classes[0].sections || [])
          if (cRes.classes[0].sections && cRes.classes[0].sections.length > 0) {
            setAssignSectionId(cRes.classes[0].sections[0].id)
          }
        }
        if (cRes.subjects && cRes.subjects.length > 0) {
          setAssignSubjectId(cRes.subjects[0].id)
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to load teachers data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleClassChange = (classId) => {
    setAssignClassId(classId)
    const cls = classes.find((c) => c.id === classId)
    if (cls && cls.sections && cls.sections.length > 0) {
      setAvailableSections(cls.sections)
      setAssignSectionId(cls.sections[0].id)
    } else {
      setAvailableSections([])
      setAssignSectionId('')
    }
  }

  const handleCreateTeacher = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiPost('/api/teachers', {
        name,
        email,
        employeeId,
        phone,
        password,
      })
      showToast('Teacher account created successfully!', 'success')
      setShowAddModal(false)
      setName('')
      setEmail('')
      setEmployeeId('')
      setPhone('')
      setPassword('Teacher@123')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to create teacher', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAssignSubmit = async (e) => {
    e.preventDefault()
    if (!selectedTeacher || !assignClassId || !assignSectionId || !assignSubjectId) {
      showToast('Please select Class, Section, and Subject', 'error')
      return
    }

    try {
      await apiPost('/api/assignments', {
        teacherId: selectedTeacher.id,
        classId: assignClassId,
        sectionId: assignSectionId,
        subjectId: assignSubjectId,
      })
      showToast('Class and Subject assigned to teacher!', 'success')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to assign class', 'error')
    }
  }

  const handleRemoveAssignment = async (assignmentId) => {
    try {
      await apiDelete('/api/assignments', { id: assignmentId })
      showToast('Assignment removed', 'success')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to remove assignment', 'error')
    }
  }

  const handleToggleStatus = async (teacher) => {
    const newStatus = teacher.user?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      await apiPut('/api/teachers', {
        id: teacher.id,
        status: newStatus,
      })
      showToast(`Teacher status changed to ${newStatus}`, 'success')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error')
    }
  }

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher account? All assigned duties will be removed.')) return

    try {
      await apiDelete('/api/teachers', { id: teacherId })
      showToast('Teacher deleted successfully', 'success')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to delete teacher', 'error')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Teacher Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create teacher accounts, manage active status, and assign classes & subjects.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-blue-500/20 transition text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Teacher
        </button>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading teachers data...</div>
        ) : teachers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No teachers found. Click "Add New Teacher" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-4 px-6">Teacher Details</th>
                  <th className="py-4 px-6">Employee ID & Phone</th>
                  <th className="py-4 px-6">Assigned Classes & Subjects</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{t.user?.name}</div>
                      <div className="text-xs text-slate-500">{t.user?.email}</div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs">
                      <div className="font-bold text-slate-800">{t.employeeId}</div>
                      <div className="text-slate-500 font-sans">{t.phone || 'No Phone'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {t.assignments && t.assignments.length > 0 ? (
                          t.assignments.map((asgn) => (
                            <span
                              key={asgn.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-semibold"
                            >
                              {asgn.class?.name} ({asgn.section?.name}) - {asgn.subject?.name}
                              <button
                                onClick={() => handleRemoveAssignment(asgn.id)}
                                className="text-blue-500 hover:text-red-600 font-bold ml-1"
                                title="Remove assignment"
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No classes assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(t)}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          t.user?.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {t.user?.status || 'ACTIVE'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTeacher(t)
                          setShowAssignModal(true)
                        }}
                        className="text-xs font-bold px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg"
                      >
                        + Assign Class
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(t.id)}
                        className="text-xs font-bold px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
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

      {/* Modal 1: Add New Teacher */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Teacher</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mr. Muhammad Ali"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@hopenix.edu"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Employee ID *</label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="EMP-1002"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Initial Password *</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Assign Class/Subject */}
      {showAssignModal && selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Assign Duty</h3>
                <p className="text-xs text-slate-500">Teacher: {selectedTeacher.user?.name}</p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Class *</label>
                <select
                  value={assignClassId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Section *</label>
                <select
                  value={assignSectionId}
                  onChange={(e) => setAssignSectionId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                >
                  {availableSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject *</label>
                <select
                  value={assignSubjectId}
                  onChange={(e) => setAssignSubjectId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600"
                  required
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Save Assignment
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
