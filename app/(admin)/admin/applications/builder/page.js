'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  FilePlus, Settings, CheckCircle2, XCircle,
  Loader2, Layout, Plus, Save, Activity, Layers,
  Map, Trash2, GripVertical, Calendar, ChevronRight, X
} from 'lucide-react'

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'link', label: 'Link / URL' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'file', label: 'File Upload' },
]

const CATEGORIES = [
  { value: 'VOLUNTEER', label: 'Volunteer' },
  { value: 'ORGANIZATION', label: 'Organization' },
  { value: 'AMBASSADOR', label: 'Ambassador' },
  { value: 'OTHER', label: 'Other' },
]

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  category: 'VOLUNTEER',
  fields: [],
  batch_name: '',
  is_active: true,
}

export default function FormBuilderPage() {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [validationErrors, setValidationErrors] = useState([])

  useEffect(() => { fetchForms() }, [])

  async function fetchForms() {
    setLoading(true)
    const res = await fetch('/api/admin/forms')
    if (res.ok) setForms(await res.json())
    setLoading(false)
  }

  function openNew() {
    setForm({ ...emptyForm })
    setValidationErrors([])
    setEditing(true)
  }

  function openEdit(f) {
    setForm({ ...f })
    setValidationErrors([])
    setEditing(true)
  }

  function close() {
    setValidationErrors([])
    setEditing(false)
  }

  /* ---------- field helpers ---------- */
  function addField() {
    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, { id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, label: '', type: 'text', required: true, options: [] }],
    }))
  }

  function updateField(i, key, val) {
    setForm(prev => {
      const fields = [...prev.fields]
      fields[i] = { ...fields[i], [key]: val }
      return { ...prev, fields }
    })
  }

  function removeField(i) {
    setForm(prev => ({ ...prev, fields: prev.fields.filter((_, idx) => idx !== i) }))
  }

  function addOption(i) {
    setForm(prev => {
      const fields = [...prev.fields]
      fields[i] = { ...fields[i], options: [...(fields[i].options || []), ''] }
      return { ...prev, fields }
    })
  }

  function updateOption(fi, oi, val) {
    setForm(prev => {
      const fields = [...prev.fields]
      const opts = [...(fields[fi].options || [])]
      opts[oi] = val
      fields[fi] = { ...fields[fi], options: opts }
      return { ...prev, fields }
    })
  }

  function removeOption(fi, oi) {
    setForm(prev => {
      const fields = [...prev.fields]
      fields[fi] = { ...fields[fi], options: fields[fi].options.filter((_, idx) => idx !== oi) }
      return { ...prev, fields }
    })
  }

  /* ---------- validation ---------- */
  function validate() {
    const errors = []

    if (!form.title.trim()) errors.push('Form title is required.')
    if (!form.slug.trim()) errors.push('URL slug is required.')
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug))
      errors.push('Slug must be lowercase letters, numbers, and hyphens only (e.g. "content-writer").')

    if (form.fields.length === 0) {
      errors.push('At least one field is required.')
    } else {
      form.fields.forEach((field, i) => {
        const n = i + 1
        if (!field.label.trim()) errors.push(`Field #${n} is missing a label.`)
        if (['select', 'radio', 'checkbox'].includes(field.type)) {
          const validOpts = (field.options || []).filter(o => o.trim())
          if (validOpts.length === 0)
            errors.push(`Field #${n} ("${field.label || 'Untitled'}") needs at least one option.`)
        }
      })
    }

    return errors
  }

  /* ---------- CRUD ---------- */
  async function handleSave() {
    const errors = validate()
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }
    setValidationErrors([])
    setSaving(true)
    const payload = { ...form }
    delete payload.email_templates
    const method = payload.id ? 'PATCH' : 'POST'
    const res = await fetch('/api/admin/forms', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setEditing(false)
      fetchForms()
    } else {
      const err = await res.json()
      alert(err.error || 'Save failed.')
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this form blueprint permanently? Any active public routes will stop working.')) return
    setLoading(true)
    const res = await fetch(`/api/admin/forms?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setEditing(false)
      fetchForms()
    } else {
      const err = await res.json()
      alert(err.error || 'Delete failed.')
      setLoading(false)
    }
  }

  /* ---------- render ---------- */
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-bg-secondary dark:bg-white/5 rounded-lg" />
            <div className="h-4 w-96 bg-bg-secondary dark:bg-white/5 rounded-lg" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-bg-secondary dark:bg-white/5 rounded-xl" />
            <div className="h-10 w-40 bg-bg-secondary dark:bg-white/5 rounded-xl" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 w-full bg-bg-secondary dark:bg-white/5 rounded-2xl" />
            ))}
          </div>
          <div className="lg:col-span-8">
            <div className="h-[70vh] w-full bg-bg-secondary dark:bg-white/5 rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Form Builder</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Create and manage intake forms for your public application pages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="glass px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Activity size={14} className="text-green" />
            {forms.filter(f => f.is_active).length} Active
          </span>
          <button
            onClick={openNew}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
          >
            <Plus size={14} /> New Blueprint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── sidebar list ── */}
        <div className="lg:col-span-4 space-y-4">
          {forms.map(f => {
            const active = editing && form.id === f.id
            return (
              <button
                key={f.id}
                onClick={() => openEdit(f)}
                className={`w-full text-left glass rounded-2xl p-5 transition-all duration-200 group ${
                  active
                    ? 'ring-2 ring-primary shadow-lg shadow-primary/10'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm tracking-tight truncate">{f.title}</h3>
                  <ChevronRight size={16} className="text-text-tertiary group-hover:text-primary transition-colors shrink-0" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {!f.is_active && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-coral/15 text-coral">Inactive</span>
                  )}
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-bg-secondary dark:bg-white/5 text-text-tertiary">
                    /join/{f.slug}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-bg-secondary dark:bg-white/5 text-text-tertiary">
                    {f.category}
                  </span>
                </div>
              </button>
            )
          })}

          {forms.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center">
              <FilePlus size={32} className="mx-auto text-text-tertiary mb-3 opacity-40" />
              <p className="text-sm text-text-tertiary font-medium">No forms yet. Create your first blueprint.</p>
            </div>
          )}
        </div>

        {/* ── main panel ── */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="glass rounded-3xl p-8 shadow-sm"
              >
                {/* editor header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold mb-1">
                      {form.id ? 'Edit Blueprint' : 'New Blueprint'}
                    </h3>
                    <p className="text-xs text-text-tertiary">
                      {form.id ? `ID: ${String(form.id).substring(0, 8)}…` : 'Unsaved draft'}
                    </p>
                  </div>
                  <button
                    onClick={close}
                    className="w-9 h-9 rounded-xl bg-bg-secondary dark:bg-white/5 flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* ── meta fields ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {/* title — full width */}
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-1.5 block">
                      Form Title
                    </label>
                    <input
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Content Writer Application"
                      className="w-full bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark rounded-xl px-4 py-3 text-sm font-semibold text-dynamic outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-tertiary/50"
                    />
                  </div>

                  {/* slug */}
                  <div>
                    <label className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-1.5 block">
                      URL Slug
                    </label>
                    <div className="flex items-center bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                      <span className="shrink-0 px-3 text-xs font-semibold text-text-tertiary border-r border-border dark:border-border-dark bg-bg-tertiary dark:bg-white/5 h-full py-3">/join/</span>
                      <input
                        value={form.slug}
                        onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                        placeholder="engineering"
                        className="w-full bg-transparent px-3 py-3 text-sm font-semibold text-dynamic outline-none placeholder:text-text-tertiary/50"
                      />
                    </div>
                  </div>

                  {/* category */}
                  <div>
                    <label className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-1.5 block">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark rounded-xl px-4 py-3 text-sm font-semibold text-dynamic outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    >
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>

                  {/* batch */}
                  <div>
                    <label className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-1.5 block">
                      Batch Name
                    </label>
                    <input
                      value={form.batch_name}
                      onChange={e => setForm({ ...form, batch_name: e.target.value })}
                      placeholder="Q3 2026 Intake"
                      className="w-full bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark rounded-xl px-4 py-3 text-sm font-semibold text-dynamic outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-tertiary/50"
                    />
                  </div>

                  {/* deadline */}
                  <div>
                    <label className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                      <Calendar size={12} /> Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={form.deadline ? new Date(new Date(form.deadline).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                      onChange={e => setForm({ ...form, deadline: e.target.value ? new Date(e.target.value).toISOString() : null })}
                      className="w-full bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark rounded-xl px-4 py-3 text-sm font-semibold text-dynamic outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <p className="text-[10px] text-text-tertiary mt-1.5 ml-1">Form auto-closes after this date.</p>
                  </div>

                  {/* description — full width */}
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-1.5 block">
                      Public Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      placeholder="Briefly describe this role to applicants…"
                      className="w-full bg-bg-secondary dark:bg-white/5 border border-border dark:border-border-dark rounded-xl px-4 py-3 text-sm text-dynamic outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-text-tertiary/50"
                    />
                  </div>
                </div>

                {/* ── fields section ── */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-bold">Form Fields</h4>
                      <p className="text-xs text-text-tertiary">{form.fields.length} field{form.fields.length !== 1 ? 's' : ''} configured</p>
                    </div>
                    <button
                      onClick={addField}
                      className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
                    >
                      <Plus size={14} /> Add Field
                    </button>
                  </div>

                  {form.fields.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-border dark:border-border-dark p-10 text-center">
                      <Layout size={24} className="mx-auto text-text-tertiary opacity-40 mb-2" />
                      <p className="text-sm text-text-tertiary font-medium">No fields yet. Add your first field to start building.</p>
                    </div>
                  ) : (
                    <Reorder.Group
                      axis="y"
                      values={form.fields}
                      onReorder={(newFields) => setForm(prev => ({ ...prev, fields: newFields }))}
                      className="space-y-4"
                    >
                      {form.fields.map((field, i) => (
                        <Reorder.Item
                          key={field.id || i}
                          value={field}
                          className="bg-bg-secondary dark:bg-white/5 rounded-2xl p-5 border border-border dark:border-border-dark transition-all hover:border-primary/30 cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-start gap-4">
                            <div className="pt-1 text-text-tertiary opacity-40">
                              <GripVertical size={16} />
                            </div>

                            <div className="flex-1 space-y-4">
                              <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                  value={field.label}
                                  onChange={e => updateField(i, 'label', e.target.value)}
                                  placeholder="Field label (e.g. Phone Number)"
                                  className="flex-1 bg-transparent border-b-2 border-border/50 dark:border-border-dark focus:border-primary outline-none py-1.5 text-sm font-semibold text-dynamic transition-colors placeholder:text-text-tertiary/50"
                                />
                                <select
                                  value={field.type}
                                  onChange={e => updateField(i, 'type', e.target.value)}
                                  className="bg-white dark:bg-black/30 border border-border dark:border-border-dark rounded-lg px-3 py-1.5 text-xs font-semibold text-dynamic outline-none cursor-pointer focus:ring-2 focus:ring-primary/20 transition-all sm:w-48"
                                >
                                  {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                              </div>

                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <div className="relative flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={field.required}
                                      onChange={e => updateField(i, 'required', e.target.checked)}
                                      className="peer shrink-0 appearance-none w-4 h-4 border-2 border-border-strong dark:border-border-strong-dark rounded checked:bg-primary checked:border-primary transition-all"
                                    />
                                    <CheckCircle2 size={12} className="absolute text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                  </div>
                                  <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark">Required</span>
                                </label>
                              </div>

                              {/* options for select/radio/checkbox */}
                              {['select', 'radio', 'checkbox'].includes(field.type) && (
                                <div className="pt-3 border-t border-border dark:border-border-dark space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark flex items-center gap-1.5">
                                      <Settings size={12} /> Options
                                    </span>
                                    <button
                                      onClick={() => addOption(i)}
                                      className="text-[10px] font-semibold text-primary hover:underline"
                                    >
                                      + Add Option
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-2 text-wrap">
                                    {(field.options || []).map((opt, oi) => (
                                      <div
                                        key={oi}
                                        className="flex items-center gap-1.5 bg-white dark:bg-black/30 border border-border dark:border-border-dark rounded-lg pl-3 pr-1 py-1 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                                      >
                                        <input
                                          value={opt}
                                          onChange={e => updateOption(i, oi, e.target.value)}
                                          placeholder="Option…"
                                          className="bg-transparent outline-none text-xs font-medium text-dynamic w-24 placeholder:text-text-tertiary/50"
                                        />
                                        <button
                                          onClick={() => removeOption(i, oi)}
                                          className="p-1 rounded text-text-tertiary hover:text-coral transition-colors"
                                        >
                                          <XCircle size={14} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => removeField(i)}
                              className="p-2 rounded-lg text-text-tertiary hover:text-coral hover:bg-coral/10 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
                </div>

                {/* ── validation errors ── */}
                {validationErrors.length > 0 && (
                  <div className="rounded-2xl border border-coral/20 bg-coral/5 p-4 mb-2 space-y-1">
                    <p className="text-xs font-bold text-coral mb-1">Please fix the following before saving:</p>
                    {validationErrors.map((err, i) => (
                      <p key={i} className="text-xs text-coral/80 flex items-start gap-2">
                        <span className="shrink-0 mt-0.5">•</span> {err}
                      </p>
                    ))}
                  </div>
                )}

                {/* ── footer actions ── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border dark:border-border-dark">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      {saving ? 'Saving…' : 'Save Blueprint'}
                    </button>
                    {form.id && (
                      <button
                        onClick={() => handleDelete(form.id)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-coral bg-coral/10 hover:bg-coral hover:text-white transition-all flex items-center gap-2 border border-coral/20"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                    className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all ${
                      form.is_active
                        ? 'text-coral border-coral/20 hover:bg-coral/10'
                        : 'text-green border-green/20 hover:bg-green/10'
                    }`}
                  >
                    {form.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-3xl p-16 text-center min-h-[50vh] flex items-center justify-center"
              >
                <div className="space-y-4 max-w-xs mx-auto">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                    <Layers size={36} />
                  </div>
                  <h4 className="text-lg font-bold">Select a Blueprint</h4>
                  <p className="text-sm text-text-tertiary font-medium">
                    Choose an existing form from the sidebar or create a new one to get started.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
