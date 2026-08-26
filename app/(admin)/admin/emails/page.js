'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Envelope,
  PaperPlaneTilt,
  MagnifyingGlass,
  FloppyDisk,
  ArrowsClockwise,
  Eye,
  Code,
  CheckCircle,
  WarningCircle,
  CircleNotch,
  Sparkle,
  Copy,
  Check,
  DeviceMobile,
  Desktop,
  Tag,
  Funnel,
  ShieldCheck,
  User,
  Plus,
  TextB,
  TextItalic,
  TextHTwo,
  TextHThree,
  ListBullets,
  ListNumbers,
  Quotes,
  Link as LinkIcon,
  CodeBlock,
  ArrowSquareOut
} from '@phosphor-icons/react'
import { marked } from 'marked'
import { inlineEmailStyles } from '@/lib/emailTemplates'

const CATEGORIES = [
  'All',
  'Applications',
  'Content',
  'Inquiries',
  'Ambassadors',
  'Partnerships',
  'Intake Waitlist',
  'Admin Alerts'
]

// Official Brand SVG Icons (MIN Deep Teal)
const SvgFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#16556D">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const SvgInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#16556D">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const SvgLinkedin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#16556D">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

const SvgYoutube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#16556D">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const SvgTwitter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#16556D">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const SvgGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#16556D">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 2.059c3.962.497 7.159 3.518 7.828 7.441h-3.419c-.352-2.906-1.89-5.409-4.409-7.441zm-2 0c-2.519 2.032-4.057 4.535-4.409 7.441h-3.419c.669-3.923 3.866-6.944 7.828-7.441zm-8.882 9.441h4.041c-.089.816-.159 1.664-.159 2.5s.07 1.684.159 2.5h-4.041c-.105-.81-.177-1.644-.177-2.5s.072-1.69.177-2.5zm6.059 0h7.646c.108.814.177 1.647.177 2.5s-.069 1.686-.177 2.5h-7.646c-.108-.814-.177-1.647-.177-2.5s.069-1.686.177-2.5zm11.823 0h4.041c.105.81.177 1.644.177 2.5s-.072 1.69-.177 2.5h-4.041c.089-.816.159-1.664.159-2.5s-.07-1.684-.159-2.5zm-2.172 7c-.669 3.923-3.866 6.944-7.828 7.441 2.519-2.032 4.057-4.535 4.409-7.441h3.419zm-7.828 7.441c-3.962-.497-7.159-3.518-7.828-7.441h3.419c.352 2.906 1.89 5.409 4.409 7.441z" />
  </svg>
)

export default function AdminEmailsPage() {
  const [templates, setTemplates] = useState([])
  const [siteSettings, setSiteSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeTab, setActiveTab] = useState('edit') // 'edit' | 'preview'
  const [previewDevice, setPreviewDevice] = useState('desktop') // 'desktop' | 'mobile'
  
  // Editor Form State
  const [subject, setSubject] = useState('')
  const [bodyMarkdown, setBodyMarkdown] = useState('')
  const [fromName, setFromName] = useState('')
  const [fromEmail, setFromEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [copiedHtml, setCopiedHtml] = useState(false)

  // Test Email Modal State
  const [showTestModal, setShowTestModal] = useState(false)
  const [testRecipient, setTestRecipient] = useState('')
  const [sendingTest, setSendingTest] = useState(false)
  const [testResult, setTestResult] = useState(null)

  // Copy helper
  const [copiedVar, setCopiedVar] = useState(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    fetchTemplates()
    fetchSiteSettings()
    const savedEmail = localStorage.getItem('min_test_email') || ''
    if (savedEmail) setTestRecipient(savedEmail)
  }, [])

  async function fetchSiteSettings() {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSiteSettings(data)
      }
    } catch (err) {
      console.error('Failed to fetch site settings:', err)
    }
  }

  async function fetchTemplates() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/templates')
      if (res.ok) {
        const data = await res.json()
        setTemplates(data)
        if (data.length > 0 && !selectedTemplate) {
          selectTemplate(data[0])
        } else if (selectedTemplate) {
          const updated = data.find(t => t.id === selectedTemplate.id)
          if (updated) selectTemplate(updated)
        }
      }
    } catch (err) {
      console.error('Failed to fetch email templates:', err)
    } finally {
      setLoading(false)
    }
  }

  function selectTemplate(tpl) {
    setSelectedTemplate(tpl)
    setSubject(tpl.subject || '')
    setBodyMarkdown(tpl.body_markdown || '')
    setFromName(tpl.from_name || 'Mathematics Initiatives in Nepal')
    setFromEmail(tpl.from_email || 'website@mathsinitiatives.org.np')
    setSaveSuccess(false)
    setSaveError(null)
  }

  const filteredTemplates = useMemo(() => {
    return templates.filter(tpl => {
      const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory
      const matchesSearch =
        tpl.name?.toLowerCase().includes(search.toLowerCase()) ||
        tpl.id?.toLowerCase().includes(search.toLowerCase()) ||
        (tpl.subject || '').toLowerCase().includes(search.toLowerCase()) ||
        (tpl.description || '').toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [templates, selectedCategory, search])

  // Category counts
  const categoryCounts = useMemo(() => {
    const map = { All: templates.length }
    templates.forEach(t => {
      map[t.category] = (map[t.category] || 0) + 1
    })
    return map
  }, [templates])

  // Insert formatting into markdown textarea
  function insertFormatting(prefix, suffix = '', defaultText = '') {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = bodyMarkdown.substring(start, end) || defaultText
    const replacement = `${prefix}${selected}${suffix}`
    const newText = bodyMarkdown.substring(0, start) + replacement + bodyMarkdown.substring(end)
    setBodyMarkdown(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length)
    }, 40)
  }

  // Insert variable into markdown at cursor position
  function insertVariable(varName) {
    const token = `{{${varName}}}`
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newText = bodyMarkdown.substring(0, start) + token + bodyMarkdown.substring(end)
      setBodyMarkdown(newText)
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + token.length, start + token.length)
      }, 50)
    } else {
      setBodyMarkdown(prev => prev + ' ' + token)
    }
    setCopiedVar(varName)
    setTimeout(() => setCopiedVar(null), 1500)
  }

  // Save changes to database
  async function handleSave() {
    if (!selectedTemplate) return
    setSaving(true)
    setSaveSuccess(false)
    setSaveError(null)

    try {
      const res = await fetch('/api/admin/templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTemplate.id,
          name: selectedTemplate.name,
          description: selectedTemplate.description,
          action: selectedTemplate.action,
          subject,
          body_markdown: bodyMarkdown,
          from_name: fromName,
          from_email: fromEmail
        })
      })

      if (res.ok) {
        const saved = await res.json()
        setSaveSuccess(true)
        setTemplates(prev => prev.map(t => t.id === saved.id ? { ...t, ...saved, is_customized: true } : t))
        setSelectedTemplate(prev => ({ ...prev, ...saved, is_customized: true }))
        setTimeout(() => setSaveSuccess(false), 4000)
      } else {
        const err = await res.json()
        setSaveError(err.error || 'Failed to save template')
      }
    } catch (err) {
      setSaveError(err.message || 'Network error')
    } finally {
      setSaving(false)
    }
  }

  // Reset to system default
  async function handleResetDefault() {
    if (!selectedTemplate) return
    if (!confirm(`Are you sure you want to revert "${selectedTemplate.name}" to the official system default?`)) return

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/templates?id=${selectedTemplate.id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchTemplates()
      }
    } catch (err) {
      console.error('Reset error:', err)
    } finally {
      setSaving(false)
    }
  }

  // Send test email
  async function handleSendTest(e) {
    e.preventDefault()
    if (!testRecipient) return
    setSendingTest(true)
    setTestResult(null)

    try {
      localStorage.setItem('min_test_email', testRecipient)
      const res = await fetch('/api/admin/templates/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testRecipient,
          template_id: selectedTemplate.id,
          subject,
          body_markdown: bodyMarkdown,
          from_name: fromName,
          from_email: fromEmail,
          sample_variables: selectedTemplate.sample_variables || {}
        })
      })

      const data = await res.json()
      if (res.ok) {
        setTestResult({ success: true, message: data.message || `Test email dispatched to ${testRecipient}` })
      } else {
        setTestResult({ success: false, message: data.error || 'Failed to send test email' })
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Network error' })
    } finally {
      setSendingTest(false)
    }
  }

  // Generate preview data with sample variables interpolated
  const previewData = useMemo(() => {
    if (!selectedTemplate) return { subject: '', rawHtml: '', styledHtml: '' }
    let interpolated = bodyMarkdown
    let previewSubj = subject
    const vars = selectedTemplate.sample_variables || {}

    Object.entries(vars).forEach(([key, val]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      interpolated = interpolated.replace(regex, `<span style="background-color: #E8F4F8; color: #16556D; font-weight: 700; padding: 1px 6px; border-radius: 4px; border: 1px solid #D4EBF2;">${val}</span>`)
      previewSubj = previewSubj.replace(regex, val)
    })

    try {
      const rawHtml = marked.parse(interpolated)
      const styledHtml = inlineEmailStyles(rawHtml)
      return {
        subject: previewSubj,
        rawHtml,
        styledHtml
      }
    } catch {
      return {
        subject: previewSubj,
        rawHtml: '<p>Rendering error...</p>',
        styledHtml: '<p style="color: #ef4444;">Rendering error...</p>'
      }
    }
  }, [selectedTemplate, bodyMarkdown, subject])

  const copyFullHtml = () => {
    navigator.clipboard.writeText(previewData.styledHtml)
    setCopiedHtml(true)
    setTimeout(() => setCopiedHtml(false), 2000)
  }

  // Social URLs resolved from live site_settings
  const resolvedFacebook = siteSettings?.facebook_url || 'https://www.facebook.com/MathematicsInitiativesNepal/'
  const resolvedInstagram = siteSettings?.instagram_url || 'https://www.instagram.com/min_nepal/'
  const resolvedYoutube = siteSettings?.youtube_url || 'https://www.youtube.com/@min-nepal'
  const resolvedLinkedin = siteSettings?.linkedin_url || 'https://np.linkedin.com/company/min-nepal'
  const resolvedTwitter = siteSettings?.twitter_url || ''
  const resolvedLogo = siteSettings?.site_logo_url || 'https://szosktbhsgqnyvbxmprf.supabase.co/storage/v1/object/public/media/1776685607643-logo.png'

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Envelope size={22} weight="duotone" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Email Format & Dispatch Studio</h2>
          </div>
          <p className="text-auto-secondary text-sm">
            Craft thoughtful, beautifully formatted communications with live preview, dynamic variables, and verified social links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTestModal(true)}
            className="glass border border-primary/30 text-primary hover:bg-primary hover:text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
          >
            <PaperPlaneTilt size={16} />
            Send Test Email
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
          >
            {saving ? <CircleNotch size={16} className="animate-spin" /> : <FloppyDisk size={16} />}
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Template Catalog */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass p-5 rounded-[2rem] border border-border dark:border-white/5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 bg-bg-secondary dark:bg-white/5 px-4 py-2.5 rounded-xl border border-border/50">
              <MagnifyingGlass size={16} className="text-auto-tertiary" />
              <input
                type="text"
                placeholder="Search templates, subjects, or triggers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none text-xs font-bold w-full outline-none placeholder:text-auto-tertiary/60"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map(cat => {
                const count = categoryCounts[cat] || 0
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                        : 'bg-bg-secondary dark:bg-white/5 text-auto-tertiary border-border/50 hover:border-primary/40'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-auto-tertiary'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Template Cards List */}
          <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 scrollbar-hide">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="glass p-5 rounded-3xl border border-border animate-pulse space-y-3">
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded-md w-3/4" />
                  <div className="h-3 bg-black/5 dark:bg-white/5 rounded-md w-1/2" />
                </div>
              ))
            ) : filteredTemplates.length > 0 ? (
              filteredTemplates.map(tpl => {
                const isSelected = selectedTemplate?.id === tpl.id
                return (
                  <button
                    key={tpl.id}
                    onClick={() => selectTemplate(tpl)}
                    className={`w-full text-left p-5 rounded-3xl border transition-all duration-200 flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.01]'
                        : 'glass border-border hover:border-primary/40 text-dynamic hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-dynamic'}`}>
                        {tpl.name}
                      </span>
                      {tpl.is_customized ? (
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                          isSelected ? 'bg-white/20 text-white border-white/30' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        }`}>
                          Custom
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          isSelected ? 'text-white/60' : 'text-auto-tertiary'
                        }`}>
                          Default
                        </span>
                      )}
                    </div>

                    <p className={`text-[11px] line-clamp-2 leading-relaxed font-medium ${isSelected ? 'text-white/80' : 'text-auto-secondary'}`}>
                      {tpl.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-white/10 text-white/90' : 'bg-black/5 dark:bg-white/5 text-auto-tertiary'
                      }`}>
                        {tpl.id}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-white/70' : 'text-primary'}`}>
                        {tpl.category}
                      </span>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="text-center py-16 glass rounded-3xl border border-dashed border-border text-auto-tertiary space-y-2">
                <Envelope size={32} className="mx-auto opacity-30" />
                <p className="text-xs font-bold">No templates found for this criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Studio Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTemplate ? (
            <div className="glass rounded-[2.5rem] border border-border dark:border-white/10 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
              {/* Notification Banner */}
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} />
                      Template changes committed live to system database
                    </div>
                    <span className="text-[10px] font-bold">Active in dispatch</span>
                  </motion.div>
                )}
                {saveError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-2"
                  >
                    <WarningCircle size={16} />
                    {saveError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Template Meta Info & Clean Tab Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-2xl font-black text-dynamic tracking-tight">{selectedTemplate.name}</h3>
                    {selectedTemplate.is_customized && (
                      <button
                        onClick={handleResetDefault}
                        className="text-[9px] font-black uppercase tracking-widest text-coral hover:underline flex items-center gap-1"
                        title="Revert to system default"
                      >
                        <ArrowsClockwise size={12} /> Reset Default
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-auto-secondary font-medium">{selectedTemplate.action}</p>
                </div>

                {/* Focused Two-Tab Navigation */}
                <div className="flex items-center bg-bg-secondary dark:bg-white/5 p-1 rounded-2xl border border-border shadow-inner">
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === 'edit'
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-auto-tertiary hover:text-text-primary'
                    }`}
                  >
                    <Code size={16} /> Edit Format
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === 'preview'
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-auto-tertiary hover:text-text-primary'
                    }`}
                  >
                    <Eye size={16} /> Live Preview
                  </button>
                </div>
              </div>

              {/* View 1: Edit Format Tab */}
              {activeTab === 'edit' && (
                <div className="space-y-6">
                  {/* Sender Details Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary flex items-center gap-1.5">
                        <User size={12} /> Sender Display Name
                      </label>
                      <input
                        type="text"
                        value={fromName}
                        onChange={e => setFromName(e.target.value)}
                        placeholder="Mathematics Initiatives in Nepal"
                        className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-2.5 text-xs font-bold text-dynamic outline-none focus:border-primary transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary flex items-center gap-1.5">
                        <Envelope size={12} /> Sender Reply Email
                      </label>
                      <input
                        type="email"
                        value={fromEmail}
                        onChange={e => setFromEmail(e.target.value)}
                        placeholder="website@mathsinitiatives.org.np"
                        className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-2.5 text-xs font-bold text-dynamic outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                      Email Subject Line
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="e.g. Welcome to MIN Nepal, {{applicant_name}}!"
                      className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-sm font-bold text-dynamic outline-none focus:border-primary transition-all shadow-inner"
                    />
                  </div>

                  {/* Dynamic Variables Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                        <Sparkle size={12} /> Dynamic Placeholders (Click to Insert)
                      </label>
                      <span className="text-[9px] text-auto-tertiary font-bold">Auto-interpolated on dispatch</span>
                    </div>

                    <div className="flex flex-wrap gap-2 p-3.5 bg-primary/5 rounded-2xl border border-primary/10">
                      {(selectedTemplate.variables || []).map(v => {
                        const sample = selectedTemplate.sample_variables?.[v] || 'Sample Value'
                        return (
                          <button
                            key={v}
                            type="button"
                            onClick={() => insertVariable(v)}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 text-primary border border-primary/20 text-xs font-mono font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95 group"
                            title={`Sample value: "${sample}"`}
                          >
                            {copiedVar === v ? <Check size={12} className="text-emerald-500" /> : <Plus size={12} />}
                            <span>{`{{${v}}}`}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Markdown Formatting Toolbar & Full Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-bg-secondary dark:bg-white/5 px-4 py-2.5 rounded-t-2xl border border-border">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => insertFormatting('**', '**', 'Bold text')}
                          className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-auto-secondary hover:text-primary transition-all"
                          title="Bold"
                        >
                          <TextB size={16} weight="bold" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('*', '*', 'Italic text')}
                          className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-auto-secondary hover:text-primary transition-all"
                          title="Italic"
                        >
                          <TextItalic size={16} />
                        </button>
                        <div className="h-4 w-[1px] bg-border mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting('## ', '\n', 'Heading 2')}
                          className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-auto-secondary hover:text-primary transition-all"
                          title="Heading 2"
                        >
                          <TextHTwo size={16} weight="bold" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('### ', '\n', 'Heading 3')}
                          className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-auto-secondary hover:text-primary transition-all"
                          title="Heading 3"
                        >
                          <TextHThree size={16} weight="bold" />
                        </button>
                        <div className="h-4 w-[1px] bg-border mx-1" />
                        <button
                          type="button"
                          onClick={() => insertFormatting('- ', '\n', 'List item')}
                          className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-auto-secondary hover:text-primary transition-all"
                          title="Bulleted List"
                        >
                          <ListBullets size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('1. ', '\n', 'First item')}
                          className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-auto-secondary hover:text-primary transition-all"
                          title="Numbered List"
                        >
                          <ListNumbers size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('> "', '"\n', 'Inspiring quote')}
                          className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-auto-secondary hover:text-primary transition-all"
                          title="Blockquote"
                        >
                          <Quotes size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('[', '](https://)', 'Link Title')}
                          className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-auto-secondary hover:text-primary transition-all"
                          title="Insert Link"
                        >
                          <LinkIcon size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('`', '`', 'code')}
                          className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-auto-secondary hover:text-primary transition-all"
                          title="Inline Code"
                        >
                          <CodeBlock size={16} />
                        </button>
                      </div>

                      <span className="text-[10px] text-auto-tertiary font-mono">
                        {bodyMarkdown.length} characters
                      </span>
                    </div>

                    <textarea
                      ref={textareaRef}
                      rows={16}
                      value={bodyMarkdown}
                      onChange={e => setBodyMarkdown(e.target.value)}
                      placeholder="Draft your email body in Markdown..."
                      className="w-full bg-white dark:bg-white/5 border border-border rounded-b-2xl p-5 text-sm font-mono leading-relaxed text-dynamic outline-none focus:border-primary transition-all resize-y shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* View 2: Live Preview Tab (With Scroll Support) */}
              {activeTab === 'preview' && (
                <div className="space-y-4">
                  {/* Device Toggles & Actions */}
                  <div className="flex items-center justify-between bg-bg-secondary dark:bg-white/5 p-3 rounded-2xl border border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-auto-tertiary uppercase tracking-wider ml-1">Device Frame:</span>
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          previewDevice === 'desktop' ? 'bg-primary text-white shadow-sm' : 'text-auto-tertiary hover:bg-white/10'
                        }`}
                      >
                        <Desktop size={15} /> Desktop (600px)
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          previewDevice === 'mobile' ? 'bg-primary text-white shadow-sm' : 'text-auto-tertiary hover:bg-white/10'
                        }`}
                      >
                        <DeviceMobile size={15} /> Mobile (375px)
                      </button>
                    </div>

                    <button
                      onClick={copyFullHtml}
                      className="px-4 py-2 bg-white dark:bg-white/10 text-auto-secondary hover:text-primary rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-border flex items-center gap-1.5"
                      title="Copy processed HTML with inline styles"
                    >
                      {copiedHtml ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      {copiedHtml ? 'Copied' : 'Copy HTML'}
                    </button>
                  </div>

                  {/* Subject Line Pill */}
                  <div className="px-5 py-3 bg-white dark:bg-black/40 rounded-2xl border border-border text-xs flex items-center gap-2">
                    <span className="font-black text-auto-tertiary uppercase text-[10px] shrink-0">Subject:</span>
                    <span className="font-bold text-dynamic truncate">{previewData.subject}</span>
                  </div>

                  {/* Scrollable Container Viewport */}
                  <div className="p-4 sm:p-8 bg-slate-100 dark:bg-[#07090E] rounded-[2rem] border border-border flex justify-center shadow-inner overflow-y-auto max-h-[calc(100vh-280px)] min-h-[600px]">
                    <div
                      className={`bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#D4EBF2] text-slate-800 transition-all duration-300 h-fit ${
                        previewDevice === 'mobile' ? 'w-[375px]' : 'w-full max-w-[600px]'
                      }`}
                    >
                      {/* Top Gradient Accent Bar */}
                      <div className="h-1.5 bg-gradient-to-r from-[#16556D] via-[#1A6B87] to-[#00CFE8]" />

                      {/* Header Section with MIN Emblem from site_settings */}
                      <div className="p-8 pb-3 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolvedLogo}
                            alt="MIN Nepal"
                            className="w-12 h-12 object-contain rounded-xl border border-slate-100"
                            onError={(e) => { e.target.src = '/images/logo.png' }}
                          />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-[#E8F4F8] text-[#16556D] border border-[#BCE1EE]">
                          Official Notice
                        </span>
                      </div>

                      {/* Organization Subheader in Deep Teal */}
                      <div className="px-8 pb-4">
                        <div className="border-b border-[#E8F4F8] pb-3">
                          <p className="text-sm font-black text-[#0D3D52] leading-none">Mathematics Initiatives in Nepal</p>
                          <p className="text-[11px] text-[#1A6B87] font-semibold mt-1">Democratizing mathematical excellence & Olympiad training across Nepal</p>
                        </div>
                      </div>

                      {/* Email Body Content */}
                      <div
                        className="p-8 pt-2 text-sm leading-relaxed text-[#222225] font-sans"
                        dangerouslySetInnerHTML={{ __html: previewData.styledHtml }}
                      />

                      {/* Branded Footer with Full Social Media SVG Badges from site_settings */}
                      <div className="p-8 bg-[#F8FCFD] border-t border-[#E8F4F8] text-center space-y-3">
                        <p className="text-xs font-bold text-[#0D3D52]">Mathematics Initiatives in Nepal (MIN)</p>
                        <p className="text-[11px] text-[#55555A] leading-relaxed max-w-md mx-auto">
                          A student-led, non-profit academic organization dedicated to fostering mathematical excellence and research.
                        </p>

                        {/* Social Icons Hub with Authentic SVGs */}
                        <div className="flex items-center justify-center gap-2.5 pt-2 pb-1">
                          {resolvedFacebook && (
                            <a
                              href={resolvedFacebook}
                              target="_blank"
                              rel="noreferrer"
                              title="Facebook"
                              className="w-10 h-10 rounded-xl bg-white border border-[#D4EBF2] flex items-center justify-center shadow-sm hover:border-[#16556D] hover:scale-105 transition-all"
                            >
                              <SvgFacebook />
                            </a>
                          )}
                          {resolvedInstagram && (
                            <a
                              href={resolvedInstagram}
                              target="_blank"
                              rel="noreferrer"
                              title="Instagram"
                              className="w-10 h-10 rounded-xl bg-white border border-[#D4EBF2] flex items-center justify-center shadow-sm hover:border-[#16556D] hover:scale-105 transition-all"
                            >
                              <SvgInstagram />
                            </a>
                          )}
                          {resolvedLinkedin && (
                            <a
                              href={resolvedLinkedin}
                              target="_blank"
                              rel="noreferrer"
                              title="LinkedIn"
                              className="w-10 h-10 rounded-xl bg-white border border-[#D4EBF2] flex items-center justify-center shadow-sm hover:border-[#16556D] hover:scale-105 transition-all"
                            >
                              <SvgLinkedin />
                            </a>
                          )}
                          {resolvedYoutube && (
                            <a
                              href={resolvedYoutube}
                              target="_blank"
                              rel="noreferrer"
                              title="YouTube"
                              className="w-10 h-10 rounded-xl bg-white border border-[#D4EBF2] flex items-center justify-center shadow-sm hover:border-[#16556D] hover:scale-105 transition-all"
                            >
                              <SvgYoutube />
                            </a>
                          )}
                          {resolvedTwitter && (
                            <a
                              href={resolvedTwitter}
                              target="_blank"
                              rel="noreferrer"
                              title="Twitter / X"
                              className="w-10 h-10 rounded-xl bg-white border border-[#D4EBF2] flex items-center justify-center shadow-sm hover:border-[#16556D] hover:scale-105 transition-all"
                            >
                              <SvgTwitter />
                            </a>
                          )}
                          <a
                            href="https://www.mathsinitiatives.org.np"
                            target="_blank"
                            rel="noreferrer"
                            title="Official Website"
                            className="w-10 h-10 rounded-xl bg-white border border-[#D4EBF2] flex items-center justify-center shadow-sm hover:border-[#16556D] hover:scale-105 transition-all"
                          >
                            <SvgGlobe />
                          </a>
                        </div>

                        <p className="text-[10px] text-[#55555A] pt-3 border-t border-[#D4EBF2]/60 leading-relaxed">
                          Kathmandu, Nepal · <span className="text-[#16556D] font-bold">mathsinitiatives.org.np</span><br />
                          You received this email because you applied or interacted with MIN Nepal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center glass rounded-[2.5rem] border border-dashed border-border p-16 text-center">
              <div className="space-y-4 max-w-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <Envelope size={32} />
                </div>
                <h4 className="text-lg font-bold">Select an Email Blueprint</h4>
                <p className="text-xs text-auto-tertiary">
                  Pick a template from the catalog on the left to configure wording, formatting, and live dispatch parameters.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Send Live Test Email Modal */}
      <AnimatePresence>
        {showTestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowTestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 md:p-10 max-w-md w-full border border-border dark:border-white/10 shadow-2xl space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <PaperPlaneTilt size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">Send Live Test Email</h3>
                    <p className="text-[10px] font-bold text-auto-tertiary uppercase tracking-widest">{selectedTemplate?.name}</p>
                  </div>
                </div>
                <button onClick={() => setShowTestModal(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-auto-tertiary">✕</button>
              </div>

              <form onSubmit={handleSendTest} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary">
                    Destination Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={testRecipient}
                    onChange={e => setTestRecipient(e.target.value)}
                    placeholder="your-email@domain.com"
                    className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3.5 text-sm font-bold text-dynamic outline-none focus:border-primary transition-all shadow-inner"
                  />
                  <p className="text-[10px] text-auto-tertiary">
                    Dispatched instantly via Resend with sample placeholders interpolated.
                  </p>
                </div>

                {testResult && (
                  <div className={`p-4 rounded-xl text-xs font-bold border ${
                    testResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                  }`}>
                    {testResult.message}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={sendingTest || !testRecipient}
                    className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {sendingTest ? <CircleNotch size={16} className="animate-spin" /> : <PaperPlaneTilt size={16} />}
                    {sendingTest ? 'Sending Test...' : 'Send Test Now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTestModal(false)}
                    className="px-6 py-4 rounded-2xl glass text-xs font-black uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
