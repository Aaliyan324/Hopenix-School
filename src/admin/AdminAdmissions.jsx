import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import {
  getAdmissions,
  saveAdmissions,
  updateAdmissionSection,
  addArrayItem,
  updateArrayItem,
  deleteArrayItem,
  reorderArray,
  addFeeItem,
  updateFeeItem,
  deleteFeeItem,
  toggleFeesEnabled,
  toggleAdmissionPublished,
  toggleAdmissionEnabled,
  formatAdmissionDate,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} from '../lib/admissions-service'
import Modal from './Modal'

const TABS = ['Overview', 'Hero', 'Status', 'Classes', 'Process', 'Documents', 'Requirements', 'Timeline', 'Fees', 'Contact', 'Applications']

const AdminAdmissions = () => {
  const { addToast } = useToast()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')

  // Modals
  const [editModal, setEditModal] = useState(null) // { type, item, section }
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { section, id, name }

  const loadData = () => {
    setData(getAdmissions())
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleSave = (msg) => {
    loadData()
    if (msg) addToast(msg, 'success')
  }

  const handleTogglePublished = async () => {
    toggleAdmissionPublished(!data.published)
    handleSave(`Admissions ${data.published ? 'unpublished' : 'published'}`)
  }

  const handleToggleEnabled = async () => {
    toggleAdmissionEnabled(!data.enabled)
    handleSave(`Admissions ${data.enabled ? 'disabled' : 'enabled'}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="heading text-2xl font-bold text-[var(--text)]">Admissions</h1>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-[var(--neutral-100)] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="heading text-2xl font-bold text-[var(--text)]">Admissions</h1>
        <a
          href="/admissions"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--neutral-100)] transition-colors flex items-center gap-2 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview Page
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-[var(--secondary)] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--neutral-100)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-5 sm:p-6 shadow-sm">
        {activeTab === 'Overview' && (
          <OverviewTab data={data} onTogglePublished={handleTogglePublished} onToggleEnabled={handleToggleEnabled} />
        )}
        {activeTab === 'Hero' && <HeroTab data={data} onSave={handleSave} />}
        {activeTab === 'Status' && <StatusTab data={data} onSave={handleSave} />}
        {activeTab === 'Classes' && (
          <ClassesTab data={data} onEdit={(item) => setEditModal({ type: 'class', item })} onDelete={(item) => setDeleteConfirm({ section: 'classes', id: item.id, name: item.name })} onReorder={(from, to) => { reorderArray('classes', from, to); handleSave('Classes reordered') }} />
        )}
        {activeTab === 'Process' && (
          <ArrayTab data={data} section="process" label="Process Step" titleKey="title" descKey="description" onEdit={(item) => setEditModal({ type: 'process', item })} onDelete={(item) => setDeleteConfirm({ section: 'process', id: item.id, name: item.title })} onReorder={(from, to) => { reorderArray('process', from, to); handleSave('Process reordered') }} />
        )}
        {activeTab === 'Documents' && (
          <ArrayTab data={data} section="documents" label="Document" titleKey="name" hasToggle onEdit={(item) => setEditModal({ type: 'documents', item })} onDelete={(item) => setDeleteConfirm({ section: 'documents', id: item.id, name: item.name })} onReorder={(from, to) => { reorderArray('documents', from, to); handleSave('Documents reordered') }} />
        )}
        {activeTab === 'Requirements' && (
          <ArrayTab data={data} section="requirements" label="Requirement" titleKey="text" hasToggle onEdit={(item) => setEditModal({ type: 'requirements', item })} onDelete={(item) => setDeleteConfirm({ section: 'requirements', id: item.id, name: item.text })} onReorder={(from, to) => { reorderArray('requirements', from, to); handleSave('Requirements reordered') }} />
        )}
        {activeTab === 'Timeline' && (
          <TimelineTab data={data} onEdit={(item) => setEditModal({ type: 'timeline', item })} onDelete={(item) => setDeleteConfirm({ section: 'timeline', id: item.id, name: item.title })} onReorder={(from, to) => { reorderArray('timeline', from, to); handleSave('Timeline reordered') }} onSave={handleSave} />
        )}
        {activeTab === 'Fees' && <FeesTab data={data} onSave={handleSave} />}
        {activeTab === 'Contact' && <ContactTab data={data} onSave={handleSave} />}
        {activeTab === 'Applications' && <ApplicationsTab />}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={Boolean(editModal)} onClose={() => setEditModal(null)} title={editModal ? `Edit ${editModal.type}` : ''} size="lg">
        {editModal && (
          <EditForm modal={editModal} onClose={() => setEditModal(null)} onSave={handleSave} />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm">
        {deleteConfirm && (
          <div className="text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <p className="paragraph text-sm text-[var(--text-secondary)] mb-1">Are you sure you want to delete</p>
            <p className="heading text-lg font-bold text-[var(--text)] mb-2">&ldquo;{deleteConfirm.name}&rdquo;?</p>
            <p className="paragraph text-xs text-[var(--text-muted)] mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--neutral-100)] transition-colors">Cancel</button>
              <button onClick={() => { deleteArrayItem(deleteConfirm.section, deleteConfirm.id); setDeleteConfirm(null); handleSave('Item deleted') }} className="px-5 py-2.5 rounded-xl bg-[var(--error)] text-white text-sm font-semibold hover:bg-[var(--error)]/90 transition-colors">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ── Overview Tab ──────────────────────────────────────────────

const OverviewTab = ({ data, onTogglePublished, onToggleEnabled }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[var(--background)] border border-[var(--neutral-200)] rounded-xl p-4">
        <p className="paragraph text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Status</p>
        <p className={`heading text-lg font-bold ${data.published ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
          {data.published ? '🟢 Published' : '🟡 Draft'}
        </p>
      </div>
      <div className="bg-[var(--background)] border border-[var(--neutral-200)] rounded-xl p-4">
        <p className="paragraph text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Visibility</p>
        <p className={`heading text-lg font-bold ${data.enabled ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
          {data.enabled ? '🟢 Enabled' : '🔴 Disabled'}
        </p>
      </div>
      <div className="bg-[var(--background)] border border-[var(--neutral-200)] rounded-xl p-4">
        <p className="paragraph text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Session</p>
        <p className="heading text-lg font-bold text-[var(--text)]">{data.status?.session || '—'}</p>
      </div>
      <div className="bg-[var(--background)] border border-[var(--neutral-200)] rounded-xl p-4">
        <p className="paragraph text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Last Updated</p>
        <p className="heading text-lg font-bold text-[var(--text)]">{data.updatedAt ? formatAdmissionDate(data.updatedAt.split('T')[0]) : '—'}</p>
      </div>
    </div>

    <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--neutral-200)]">
      <button onClick={onTogglePublished} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${data.published ? 'bg-[var(--warning-light)] text-[var(--warning)] hover:bg-[var(--warning)]/20' : 'bg-[var(--success-light)] text-[var(--success)] hover:bg-[var(--success)]/20'}`}>
        {data.published ? 'Unpublish' : 'Publish'}
      </button>
      <button onClick={onToggleEnabled} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${data.enabled ? 'bg-[var(--error-light)] text-[var(--error)] hover:bg-[var(--error)]/20' : 'bg-[var(--success-light)] text-[var(--success)] hover:bg-[var(--success)]/20'}`}>
        {data.enabled ? 'Disable' : 'Enable'}
      </button>
    </div>
  </div>
)

// ── Hero Tab ──────────────────────────────────────────────────

const HeroTab = ({ data, onSave }) => {
  const [form, setForm] = useState(data.hero || {})
  useEffect(() => { setForm(data.hero || {}) }, [data])

  const handleSave = () => {
    updateAdmissionSection('hero', form)
    onSave('Hero updated')
  }

  return (
    <div className="space-y-5">
      <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
      <Field label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
      <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
      <Field label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="/images/admissions/hero.jpg" />
      <SaveButton onClick={handleSave} />
    </div>
  )
}

// ── Status Tab ────────────────────────────────────────────────

const StatusTab = ({ data, onSave }) => {
  const [form, setForm] = useState(data.status || {})
  useEffect(() => { setForm(data.status || {}) }, [data])

  const [app, setApp] = useState(data.application || {})
  useEffect(() => { setApp(data.application || {}) }, [data])

  const handleSave = () => {
    updateAdmissionSection('status', form)
    updateAdmissionSection('application', app)
    onSave('Status & Application updated')
  }

  return (
    <div className="space-y-6">
      <h3 className="heading text-lg font-bold text-[var(--text)]">Admission Status</h3>
      <Field label="Status Label" value={form.label} onChange={(v) => setForm({ ...form, label: v })} placeholder="Admissions Open" />
      <Field label="Academic Session" value={form.session} onChange={(v) => setForm({ ...form, session: v })} placeholder="2026–27" />
      <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />

      <div className="pt-4 border-t border-[var(--neutral-200)]">
        <h3 className="heading text-lg font-bold text-[var(--text)] mb-4">Application Settings</h3>
        <div className="space-y-5">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={app.enabled || false} onChange={(e) => setApp({ ...app, enabled: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium text-[var(--text)]">Show Application Button</span>
          </label>
          <Field label="Button Label" value={app.label} onChange={(v) => setApp({ ...app, label: v })} placeholder="Apply Now" />

          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-2">Application Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setApp({ ...app, type: 'internal', url: '' })}
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  (app.type || 'internal') === 'internal'
                    ? 'border-[var(--secondary)] bg-[var(--secondary-light)] text-[var(--secondary)]'
                    : 'border-[var(--neutral-200)] text-[var(--text-secondary)] hover:bg-[var(--neutral-100)]'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Built-in Form
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">/admissions/apply</p>
              </button>
              <button
                type="button"
                onClick={() => setApp({ ...app, type: 'external' })}
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                  app.type === 'external'
                    ? 'border-[var(--secondary)] bg-[var(--secondary-light)] text-[var(--secondary)]'
                    : 'border-[var(--neutral-200)] text-[var(--text-secondary)] hover:bg-[var(--neutral-100)]'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  External URL
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">Google Form, etc.</p>
              </button>
            </div>
          </div>

          {app.type === 'external' && (
            <Field label="External Application URL" value={app.url} onChange={(v) => setApp({ ...app, url: v })} placeholder="https://forms.google.com/..." />
          )}
        </div>
      </div>
      <SaveButton onClick={handleSave} />
    </div>
  )
}

// ── Classes Tab ───────────────────────────────────────────────

const ClassesTab = ({ data, onEdit, onDelete, onReorder }) => {
  const classes = (data.classes || []).sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="heading text-lg font-bold text-[var(--text)]">Classes</h3>
        <button onClick={() => onEdit(null)} className="px-4 py-2 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--secondary-hover)] transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Add Class
        </button>
      </div>
      {classes.length === 0 ? (
        <p className="paragraph text-sm text-[var(--text-muted)] text-center py-8">No classes added yet.</p>
      ) : (
        <div className="space-y-2">
          {classes.map((cls, idx) => (
            <div key={cls.id} className="flex items-center gap-3 p-3 bg-[var(--background)] border border-[var(--neutral-200)] rounded-xl">
              <div className="flex flex-col gap-0.5">
                {idx > 0 && <button onClick={() => onReorder(idx, idx - 1)} className="text-[var(--text-muted)] hover:text-[var(--text)]" aria-label="Move up"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg></button>}
                {idx < classes.length - 1 && <button onClick={() => onReorder(idx, idx + 1)} className="text-[var(--text-muted)] hover:text-[var(--text)]" aria-label="Move down"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></button>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text)] truncate">{cls.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{cls.status === 'open' ? 'Open' : 'Closed'} {cls.ageRequirement ? `· Age: ${cls.ageRequirement}` : ''}</p>
              </div>
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${cls.published ? 'bg-[var(--success-light)] text-[var(--success)]' : 'bg-[var(--warning-light)] text-[var(--warning)]'}`}>
                {cls.published ? 'Live' : 'Draft'}
              </span>
              <button onClick={() => onEdit(cls)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--neutral-100)] hover:text-[var(--text)] transition-colors" aria-label="Edit">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => onDelete(cls)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--error-light)] hover:text-[var(--error)] transition-colors" aria-label="Delete">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Generic Array Tab (Process, Documents, Requirements) ──────

const ArrayTab = ({ data, section, label, titleKey, descKey, hasToggle, onEdit, onDelete, onReorder }) => {
  const items = (data[section] || []).sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="heading text-lg font-bold text-[var(--text)]">{label}s</h3>
        <button onClick={() => onEdit(null)} className="px-4 py-2 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--secondary-hover)] transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Add {label}
        </button>
      </div>
      {items.length === 0 ? (
        <p className="paragraph text-sm text-[var(--text-muted)] text-center py-8">No {label.toLowerCase()}s added yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-[var(--background)] border border-[var(--neutral-200)] rounded-xl">
              <div className="flex flex-col gap-0.5">
                {idx > 0 && <button onClick={() => onReorder(idx, idx - 1)} className="text-[var(--text-muted)] hover:text-[var(--text)]" aria-label="Move up"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg></button>}
                {idx < items.length - 1 && <button onClick={() => onReorder(idx, idx + 1)} className="text-[var(--text-muted)] hover:text-[var(--text)]" aria-label="Move down"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></button>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text)] truncate">{item[titleKey]}</p>
                {descKey && item[descKey] && <p className="text-xs text-[var(--text-muted)] truncate">{item[descKey]}</p>}
              </div>
              {hasToggle && (
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${item.enabled !== false ? 'bg-[var(--success-light)] text-[var(--success)]' : 'bg-[var(--neutral-100)] text-[var(--text-muted)]'}`}>
                  {item.enabled !== false ? 'On' : 'Off'}
                </span>
              )}
              <button onClick={() => onEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--neutral-100)] hover:text-[var(--text)] transition-colors" aria-label="Edit">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => onDelete(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--error-light)] hover:text-[var(--error)] transition-colors" aria-label="Delete">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Timeline Tab ──────────────────────────────────────────────

const TimelineTab = ({ data, onEdit, onDelete, onReorder }) => {
  const items = (data.timeline || []).sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="heading text-lg font-bold text-[var(--text)]">Timeline</h3>
        <button onClick={() => onEdit(null)} className="px-4 py-2 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--secondary-hover)] transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Add Date
        </button>
      </div>
      {items.length === 0 ? (
        <p className="paragraph text-sm text-[var(--text-muted)] text-center py-8">No timeline dates added yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-[var(--background)] border border-[var(--neutral-200)] rounded-xl">
              <div className="flex flex-col gap-0.5">
                {idx > 0 && <button onClick={() => onReorder(idx, idx - 1)} className="text-[var(--text-muted)] hover:text-[var(--text)]" aria-label="Move up"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg></button>}
                {idx < items.length - 1 && <button onClick={() => onReorder(idx, idx + 1)} className="text-[var(--text-muted)] hover:text-[var(--text)]" aria-label="Move down"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></button>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text)] truncate">{item.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatAdmissionDate(item.date)}</p>
              </div>
              <button onClick={() => onEdit(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--neutral-100)] hover:text-[var(--text)] transition-colors" aria-label="Edit">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => onDelete(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--error-light)] hover:text-[var(--error)] transition-colors" aria-label="Delete">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Fees Tab ──────────────────────────────────────────────────

const FeesTab = ({ data, onSave }) => {
  const [enabled, setEnabled] = useState(data.fees?.enabled || false)
  const [items, setItems] = useState(data.fees?.items || [])
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    setEnabled(data.fees?.enabled || false)
    setItems(data.fees?.items || [])
  }, [data])

  const handleToggle = () => {
    toggleFeesEnabled(!enabled)
    onSave(`Fees ${enabled ? 'hidden' : 'shown'} on website`)
  }

  const handleDeleteFee = (id) => {
    deleteFeeItem(id)
    setItems((data.fees?.items || []).filter((f) => f.id !== id))
    onSave('Fee item deleted')
  }

  const handleAddFee = () => setEditing({ name: '', amount: '', description: '' })
  const handleEditFee = (item) => setEditing(item)

  const handleSaveFee = (fee) => {
    if (fee.id && data.fees?.items?.find((f) => f.id === fee.id)) {
      updateFeeItem(fee.id, fee)
    } else {
      addFeeItem(fee)
    }
    setEditing(null)
    onSave('Fee item saved')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="heading text-lg font-bold text-[var(--text)]">Fee Information</h3>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={handleToggle} className="w-4 h-4 rounded" />
          <span className="text-sm font-medium text-[var(--text)]">Show on Website</span>
        </label>
      </div>

      {enabled && (
        <>
          <div className="flex justify-end">
            <button onClick={handleAddFee} className="px-4 py-2 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--secondary-hover)] transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Add Fee
            </button>
          </div>
          <div className="space-y-2">
            {items.sort((a, b) => a.order - b.order).map((fee) => (
              <div key={fee.id} className="flex items-center gap-3 p-3 bg-[var(--background)] border border-[var(--neutral-200)] rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)] truncate">{fee.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">PKR {fee.amount}</p>
                </div>
                <button onClick={() => handleEditFee(fee)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--neutral-100)] hover:text-[var(--text)] transition-colors" aria-label="Edit">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDeleteFee(fee.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--error-light)] hover:text-[var(--error)] transition-colors" aria-label="Delete">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Fee edit inline */}
      {editing && (
        <div className="bg-[var(--background)] border border-[var(--neutral-200)] rounded-xl p-4 space-y-3">
          <Field label="Fee Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
          <Field label="Amount" value={editing.amount} onChange={(v) => setEditing({ ...editing, amount: v })} placeholder="15,000" />
          <Field label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} />
          <div className="flex gap-2">
            <button onClick={() => handleSaveFee(editing)} className="px-4 py-2 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--secondary-hover)] transition-colors">Save</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border border-[var(--neutral-200)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--neutral-100)] transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Contact Tab ───────────────────────────────────────────────

const ContactTab = ({ data, onSave }) => {
  const [form, setForm] = useState(data.contact || {})
  useEffect(() => { setForm(data.contact || {}) }, [data])

  const handleSave = () => {
    updateAdmissionSection('contact', form)
    onSave('Contact information updated')
  }

  return (
    <div className="space-y-5">
      <h3 className="heading text-lg font-bold text-[var(--text)]">Admissions Contact</h3>
      <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+92 XXX XXXXXXX" />
      <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="admissions@school.edu" />
      <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} placeholder="+92XXXXXXXXXX" />
      <Field label="Campus Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="School Campus, City" />
      <SaveButton onClick={handleSave} />
    </div>
  )
}

// ── Edit Form Modal ───────────────────────────────────────────

const EditForm = ({ modal, onClose, onSave }) => {
  const { type, item } = modal
  const isEditing = Boolean(item)

  const [form, setForm] = useState(() => {
    if (item) return { ...item }
    if (type === 'class') return { name: '', description: '', status: 'open', ageRequirement: '', seatsAvailable: '', applicationUrl: '', published: true }
    if (type === 'process') return { title: '', description: '', enabled: true }
    if (type === 'documents') return { name: '', enabled: true }
    if (type === 'requirements') return { text: '', enabled: true }
    if (type === 'timeline') return { title: '', date: '', description: '' }
    return {}
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (type === 'class' && !form.name?.trim()) errs.name = 'Class name is required'
    if (type === 'process' && !form.title?.trim()) errs.title = 'Title is required'
    if (type === 'documents' && !form.name?.trim()) errs.name = 'Document name is required'
    if (type === 'requirements' && !form.text?.trim()) errs.text = 'Requirement is required'
    if (type === 'timeline') {
      if (!form.title?.trim()) errs.title = 'Title is required'
      if (!form.date) errs.date = 'Date is required'
    }
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    if (isEditing) {
      updateArrayItem(type === 'class' ? 'classes' : type, item.id, form)
    } else {
      addArrayItem(type === 'class' ? 'classes' : type, form)
    }
    onSave(`${type} ${isEditing ? 'updated' : 'added'}`)
    onClose()
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm paragraph text-[var(--text)]
     bg-[var(--background)] placeholder-[var(--text-light)]
     focus:outline-none focus:ring-1 transition-colors
     ${errors[field]
       ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/30'
       : 'border-[var(--neutral-200)] focus:border-[var(--secondary)] focus:ring-[var(--secondary)]/30'
     }`

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {type === 'class' && (
        <>
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Class Name <span className="text-[var(--error)]">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass('name')} placeholder="Grade 1" />
            {errors.name && <p className="text-xs text-[var(--error)] mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass('status')}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Age Requirement</label>
              <input type="text" value={form.ageRequirement} onChange={(e) => setForm({ ...form, ageRequirement: e.target.value })} className={inputClass('ageRequirement')} placeholder="5–6 years" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Seats Available</label>
              <input type="text" value={form.seatsAvailable} onChange={(e) => setForm({ ...form, seatsAvailable: e.target.value })} className={inputClass('seatsAvailable')} placeholder="20" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Application URL</label>
              <input type="text" value={form.applicationUrl} onChange={(e) => setForm({ ...form, applicationUrl: e.target.value })} className={inputClass('applicationUrl')} placeholder="https://..." />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.published || false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium text-[var(--text)]">Published</span>
          </label>
        </>
      )}

      {type === 'process' && (
        <>
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Title <span className="text-[var(--error)]">*</span></label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass('title')} placeholder="Submit Application" />
            {errors.title && <p className="text-xs text-[var(--error)] mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass('description')} />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.enabled !== false} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium text-[var(--text)]">Enabled</span>
          </label>
        </>
      )}

      {type === 'documents' && (
        <div>
          <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Document Name <span className="text-[var(--error)]">*</span></label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass('name')} placeholder="Birth Certificate" />
          {errors.name && <p className="text-xs text-[var(--error)] mt-1">{errors.name}</p>}
          <label className="flex items-center gap-2.5 cursor-pointer mt-3">
            <input type="checkbox" checked={form.enabled !== false} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium text-[var(--text)]">Enabled</span>
          </label>
        </div>
      )}

      {type === 'requirements' && (
        <div>
          <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Requirement <span className="text-[var(--error)]">*</span></label>
          <input type="text" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className={inputClass('text')} placeholder="Minimum age requirement" />
          {errors.text && <p className="text-xs text-[var(--error)] mt-1">{errors.text}</p>}
          <label className="flex items-center gap-2.5 cursor-pointer mt-3">
            <input type="checkbox" checked={form.enabled !== false} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium text-[var(--text)]">Enabled</span>
          </label>
        </div>
      )}

      {type === 'timeline' && (
        <>
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Title <span className="text-[var(--error)]">*</span></label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass('title')} placeholder="Applications Open" />
            {errors.title && <p className="text-xs text-[var(--error)] mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Date <span className="text-[var(--error)]">*</span></label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass('date')} />
            {errors.date && <p className="text-xs text-[var(--error)] mt-1">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass('description')} />
          </div>
        </>
      )}

      <div className="flex gap-3 justify-end pt-2 border-t border-[var(--neutral-200)]">
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--neutral-100)] transition-colors">Cancel</button>
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--secondary-hover)] transition-colors">{isEditing ? 'Update' : 'Add'}</button>
      </div>
    </form>
  )
}

// ── Shared Components ─────────────────────────────────────────

const Field = ({ label, value, onChange, textarea, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-[var(--text)] mb-1.5">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm paragraph text-[var(--text)] bg-[var(--background)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)]/30 transition-colors" />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm paragraph text-[var(--text)] bg-[var(--background)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)]/30 transition-colors" />
    )}
  </div>
)

// ── Applications Tab ─────────────────────────────────────────

const STATUS_OPTIONS = ['submitted', 'under_review', 'accepted', 'rejected', 'waitlisted']
const STATUS_COLORS = {
  submitted: 'bg-[var(--primary-light)] text-[var(--tertiary)]',
  under_review: 'bg-[var(--warning-light)] text-[var(--warning)]',
  accepted: 'bg-[var(--success-light)] text-[var(--success)]',
  rejected: 'bg-[var(--error-light)] text-[var(--error)]',
  waitlisted: 'bg-[var(--neutral-100)] text-[var(--text-muted)]',
}

const ApplicationsTab = () => {
  const { addToast } = useToast()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = () => {
    setApps(getAllApplications())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = (id, status) => {
    updateApplicationStatus(id, status)
    addToast(`Application ${status.replace('_', ' ')}`, 'success')
    load()
  }

  const handleDelete = (id) => {
    deleteApplication(id)
    setDeleteConfirm(null)
    addToast('Application deleted', 'success')
    load()
  }

  const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter)

  if (loading) {
    return <div className="text-center py-8"><div className="w-32 h-4 bg-[var(--neutral-200)] rounded-full animate-pulse mx-auto" /></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="heading text-lg font-bold text-[var(--text)]">Applications</h3>
          <p className="paragraph text-xs text-[var(--text-muted)]">{apps.length} total submission{apps.length !== 1 ? 's' : ''}</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-[var(--neutral-200)] bg-[var(--surface)] text-sm paragraph text-[var(--text)] focus:outline-none focus:border-[var(--secondary)] transition-colors"
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {apps.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📝</div>
          <p className="paragraph text-sm text-[var(--text-muted)]">No applications submitted yet.</p>
          <p className="paragraph text-xs text-[var(--text-muted)] mt-1">Applications will appear here when students submit the form.</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="paragraph text-sm text-[var(--text-muted)] text-center py-8">No applications match this filter.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((app) => (
            <div key={app.id} className="bg-[var(--background)] border border-[var(--neutral-200)] rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--surface)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)] truncate">
                    {app.studentFirstName} {app.studentLastName}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {app.applyingForClass} &middot; {formatAdmissionDate(app.submittedAt?.split('T')[0])}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[app.status] || STATUS_COLORS.submitted}`}>
                  {app.status.replace('_', ' ')}
                </span>
                <svg className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform ${expanded === app.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expanded === app.id && (
                <div className="px-4 pb-4 border-t border-[var(--neutral-200)] pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-[var(--text-muted)]">Student:</span> <span className="font-medium text-[var(--text)]">{app.studentFirstName} {app.studentLastName}</span></div>
                    <div><span className="text-[var(--text-muted)]">DOB:</span> <span className="font-medium text-[var(--text)]">{formatAdmissionDate(app.studentDOB)}</span></div>
                    <div><span className="text-[var(--text-muted)]">Gender:</span> <span className="font-medium text-[var(--text)]">{app.studentGender}</span></div>
                    <div><span className="text-[var(--text-muted)]">Class:</span> <span className="font-medium text-[var(--text)]">{app.applyingForClass}</span></div>
                    {app.previousSchool && <div><span className="text-[var(--text-muted)]">Previous School:</span> <span className="font-medium text-[var(--text)]">{app.previousSchool}</span></div>}
                    <div><span className="text-[var(--text-muted)]">Guardian:</span> <span className="font-medium text-[var(--text)]">{app.parentFirstName} {app.parentLastName} ({app.relationship})</span></div>
                    <div><span className="text-[var(--text-muted)]">Phone:</span> <span className="font-medium text-[var(--text)]">{app.parentPhone}</span></div>
                    <div><span className="text-[var(--text-muted)]">Email:</span> <span className="font-medium text-[var(--text)]">{app.parentEmail}</span></div>
                    <div><span className="text-[var(--text-muted)]">CNIC:</span> <span className="font-medium text-[var(--text)]">{app.parentCnic}</span></div>
                    <div><span className="text-[var(--text-muted)]">Address:</span> <span className="font-medium text-[var(--text)]">{app.address}, {app.city}</span></div>
                    {app.message && <div className="sm:col-span-2"><span className="text-[var(--text-muted)]">Message:</span> <span className="font-medium text-[var(--text)]">{app.message}</span></div>}
                    <div><span className="text-[var(--text-muted)]">Ref ID:</span> <span className="font-mono font-medium text-[var(--text)]">{app.id}</span></div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--neutral-200)]">
                    <label className="text-xs font-semibold text-[var(--text-muted)] mr-1 self-center">Status:</label>
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(app.id, s)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          app.status === s
                            ? STATUS_COLORS[s]
                            : 'bg-[var(--neutral-100)] text-[var(--text-muted)] hover:bg-[var(--neutral-200)]'
                        }`}
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                    <button
                      onClick={() => setDeleteConfirm(app.id)}
                      className="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-[var(--error-light)] text-[var(--error)] hover:bg-[var(--error)]/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 shadow-xl max-w-sm w-full text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <p className="paragraph text-sm text-[var(--text-secondary)] mb-4">Delete this application? This cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 rounded-xl border border-[var(--neutral-200)] text-sm font-semibold text-[var(--text)] hover:bg-[var(--neutral-100)] transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 rounded-xl bg-[var(--error)] text-white text-sm font-semibold hover:bg-[var(--error)]/90 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const SaveButton = ({ onClick }) => (
  <div className="flex justify-end pt-2 border-t border-[var(--neutral-200)]">
    <button onClick={onClick} className="px-5 py-2.5 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--secondary-hover)] transition-colors active:scale-95">Save Changes</button>
  </div>
)

export default AdminAdmissions
