import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const AdminSettings = () => {
  const { updateCredentials, logout } = useAuth()
  const { addToast } = useToast()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!currentPassword) {
      setError('Please enter your current password to confirm changes.')
      return
    }

    const usernameChanged = newUsername.trim().length > 0
    const passwordChanged = newPassword.length > 0

    if (!usernameChanged && !passwordChanged) {
      setError('Please enter a new username or password to update.')
      return
    }

    if (usernameChanged && newUsername.trim().length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }

    if (passwordChanged) {
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters.')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.')
        return
      }
    }

    setSaving(true)
    try {
      await updateCredentials(
        currentPassword,
        usernameChanged ? newUsername.trim() : null,
        passwordChanged ? newPassword : null
      )
      addToast('Credentials updated successfully', 'success')
      setCurrentPassword('')
      setNewUsername('')
      setNewPassword('')
      setConfirmPassword('')
      // Log out so they must re-sign in with new credentials
      logout()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm paragraph text-[var(--text)]
     bg-[var(--background)] placeholder-[var(--text-light)]
     focus:outline-none focus:ring-1 transition-colors
     ${hasError
       ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/30'
       : 'border-[var(--neutral-200)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)]/30'
     }`

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="heading text-2xl font-bold text-[var(--text)]">Settings</h1>

      {/* Change credentials card */}
      <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="heading text-lg font-bold text-[var(--text)] mb-1">Change Credentials</h2>
        <p className="paragraph text-sm text-[var(--text-muted)] mb-6">
          Update your username and/or password. You will need to sign in again after saving.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current password (required to confirm) */}
          <div>
            <label htmlFor="current-password" className="block text-sm font-semibold text-[var(--text)] mb-2">
              Current Password <span className="text-[var(--error)]">*</span>
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setError('') }}
              placeholder="Enter current password to confirm"
              autoComplete="current-password"
              className={inputClass(error && !currentPassword)}
            />
          </div>

          <hr className="border-[var(--neutral-200)]" />

          {/* New username */}
          <div>
            <label htmlFor="new-username" className="block text-sm font-semibold text-[var(--text)] mb-2">
              New Username
            </label>
            <input
              id="new-username"
              type="text"
              value={newUsername}
              onChange={(e) => { setNewUsername(e.target.value); setError('') }}
              placeholder="Leave blank to keep current"
              autoComplete="username"
              className={inputClass(false)}
            />
          </div>

          {/* New password */}
          <div>
            <label htmlFor="new-password" className="block text-sm font-semibold text-[var(--text)] mb-2">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setError('') }}
              placeholder="Leave blank to keep current"
              autoComplete="new-password"
              className={inputClass(false)}
            />
          </div>

          {/* Confirm new password */}
          {newPassword && (
            <div>
              <label htmlFor="confirm-new-password" className="block text-sm font-semibold text-[var(--text)] mb-2">
                Confirm New Password
              </label>
              <input
                id="confirm-new-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                className={inputClass(error && newPassword !== confirmPassword)}
              />
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-xl bg-[var(--error-light)] text-[var(--error)] text-sm paragraph">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="
              w-full py-3 rounded-xl bg-[var(--secondary)] text-white font-semibold text-sm
              hover:bg-[var(--secondary-hover)] transition-colors duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              active:scale-[0.98]
            "
          >
            {saving ? 'Saving...' : 'Update & Sign Out'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminSettings
