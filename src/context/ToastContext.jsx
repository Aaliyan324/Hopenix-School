/**
 * Lightweight toast notification system.
 * Provides a global toast provider and a `useToast` hook.
 */

import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              pointer-events-auto
              flex items-center justify-between gap-3
              px-4 py-3 rounded-xl shadow-lg border
              text-sm font-medium paragraph
              animate-[slideIn_0.3s_ease-out]
              ${t.type === 'success'
                ? 'bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]/20'
                : t.type === 'error'
                  ? 'bg-[var(--error-light)] text-[var(--error)] border-[var(--error)]/20'
                  : 'bg-[var(--warning-light)] text-[var(--warning)] border-[var(--warning)]/20'
              }
            `}
          >
            <span>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() { // eslint-disable-line react-refresh/only-export-components
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
