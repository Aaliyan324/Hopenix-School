import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const TeacherProfile = () => {
  const { user, updatePassword } = useAuth()
  const { addToast } = useToast()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      addToast?.('New passwords do not match', 'error')
      return
    }
    if (newPassword.length < 6) {
      addToast?.('New password must be at least 6 characters', 'error')
      return
    }

    setLoading(true)
    try {
      await updatePassword(currentPassword, newPassword)
      addToast?.('Password updated successfully!', 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      addToast?.(err.message || 'Failed to update password', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="heading text-xl font-black text-[var(--text)]">Profile & Security</h1>
        <p className="paragraph text-xs text-[var(--text-muted)] mt-1">
          Manage your account information and change your login password.
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl p-6 border border-[var(--neutral-200)] shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-4">
          Faculty Information
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Full Name:</span>
            <span className="font-bold text-slate-900">{user?.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Email Address:</span>
            <span className="font-bold text-slate-900">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Employee ID:</span>
            <span className="font-bold text-slate-900">{user?.teacher?.employeeId || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500 font-medium">Phone Number:</span>
            <span className="font-bold text-slate-900">{user?.teacher?.phone || 'Not provided'}</span>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="bg-white rounded-2xl p-6 border border-[var(--neutral-200)] shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-4">
          Change Account Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--neutral-300)] text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TeacherProfile
