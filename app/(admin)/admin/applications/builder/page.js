'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  Undo2, 
  Sparkles, 
  Users, 
  Building2, 
  Handshake, 
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react'

const defaultSchemas = {
  VOLUNTEER: {
    title: 'Volunteer Application',
    description: 'Join our team as a mathematics educator or volunteer.',
    fields: [
      { id: 'motivation', label: 'Why do you want to join MIN?', type: 'textarea', required: true },
      { id: 'experience', label: 'Previous Mathematics/Teaching Experience', type: 'textarea', required: true },
      { id: 'cv', label: 'Upload your CV (PDF only)', type: 'file', required: true },
      { id: 'skills', label: 'Specific Skills (e.g., Olympiad Math, Coding)', type: 'text', required: false },
    ]
  },
  ORGANIZATION: {
    title: 'Institutional Partnership',
    description: 'Collaborate with us as a school, college, or community group.',
    fields: [
      { id: 'orgName', label: 'Official Name of Institution', type: 'text', required: true },
      { id: 'orgWebsite', label: 'Website / Social Media Link', type: 'text', required: false },
      { id: 'collaborationGoal', label: 'What is your primary goal for this collaboration?', type: 'textarea', required: true },
    ]
  },
  PARTNERSHIP: {
    title: 'Strategic Partnership',
    description: 'Build a long-term strategic relationship for mathematics in Nepal.',
    fields: [
      { id: 'entityName', label: 'Partner Entity Name', type: 'text', required: true },
      { id: 'missionAlignment', label: 'How does your mission align with MIN?', type: 'textarea', required: true },
      { id: 'proposal', label: 'Specific Proposal or Project Idea', type: 'textarea', required: true },
    ]
  }
}

export default function FormBuilderPage() {
  const [schemas, setSchemas] = useState(null)
  const [activeCategory, setActiveCategory] = useState('VOLUNTEER')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    // In a real app, fetch from API. For now, try localStorage or use defaults.
    const saved = localStorage.getItem('min_form_schemas')
    if (saved) {
      setSchemas(JSON.parse(saved))
    } else {
      setSchemas(defaultSchemas)
    }
  }, [])

  const handleAddField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: 'New Question',
      type: 'text',
      required: false
    }
    const updated = { ...schemas }
    updated[activeCategory].fields.push(newField)
    setSchemas(updated)
  }

  const handleRemoveField = (id) => {
    const updated = { ...schemas }
    updated[activeCategory].fields = updated[activeCategory].fields.filter(f => f.id !== id)
    setSchemas(updated)
  }

  const handleUpdateField = (id, key, val) => {
    const updated = { ...schemas }
    updated[activeCategory].fields = updated[activeCategory].fields.map(f => 
      f.id === id ? { ...f, [key]: val } : f
    )
    setSchemas(updated)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      localStorage.setItem('min_form_schemas', JSON.stringify(schemas))
      // Mock API call
      await new Promise(r => setTimeout(r, 800))
      setMessage({ type: 'success', text: 'Form schema updated successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save changes.' })
    } finally {
      setSaving(false)
    }
  }

  if (!schemas) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" size={48} /></div>

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter mb-2 uppercase flex items-center gap-3">
            <Sparkles className="text-primary" /> Application Form Creator
          </h2>
          <p className="text-text-secondary dark:text-text-secondary-dark font-medium">
            Define custom questions for each inquiry category.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSchemas(defaultSchemas)}
            className="px-6 py-3 rounded-2xl bg-bg-secondary dark:bg-white/5 text-sm font-bold flex items-center gap-2 hover:bg-black/5 transition-all text-text-tertiary"
          >
            <Undo2 size={18} /> Reset Defaults
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 rounded-2xl bg-primary text-white text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Publish Schema'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-[1.5rem] border flex items-center gap-3 font-bold text-sm ${
              message.type === 'success' 
                ? 'bg-green/10 text-green border-green/20' 
                : 'bg-coral/10 text-coral border-coral/20'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-4">
        {[
          { id: 'VOLUNTEER', icon: <Users size={20} />, label: 'Volunteer' },
          { id: 'ORGANIZATION', icon: <Building2 size={20} />, label: 'Organization' },
          { id: 'PARTNERSHIP', icon: <Handshake size={20} />, label: 'Partnership' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 text-center ${
              activeCategory === cat.id 
                ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' 
                : 'bg-bg-secondary dark:bg-white/5 border-transparent hover:border-border'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              activeCategory === cat.id ? 'bg-primary text-white' : 'bg-white dark:bg-white/10 text-text-tertiary'
            }`}>
              {cat.icon}
            </div>
            <div>
              <p className={`font-black uppercase tracking-widest text-[10px] ${
                activeCategory === cat.id ? 'text-primary' : 'text-text-tertiary'
              }`}>{cat.label}</p>
              <p className="text-xs font-bold text-text-tertiary opacity-60">
                {schemas[cat.id].fields.length} Questions
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="glass rounded-[3rem] p-10 border border-border dark:border-border-dark space-y-10">
        <div className="flex items-center justify-between border-b border-border dark:border-border-dark pb-8">
          <div className="space-y-1">
            <h3 className="text-2xl font-black">{schemas[activeCategory].title}</h3>
            <p className="text-sm text-text-tertiary font-bold">{schemas[activeCategory].description}</p>
          </div>
          <button 
            onClick={handleAddField}
            className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-all active:scale-95 flex items-center gap-2 font-black text-xs uppercase tracking-widest px-6"
          >
            <Plus size={20} /> Add Question
          </button>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {schemas[activeCategory].fields.map((field, idx) => (
              <motion.div 
                key={field.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-bg-secondary dark:bg-white/5 p-6 rounded-[2rem] border border-border dark:border-border-dark group flex items-start gap-6 relative"
              >
                <div className="pt-3 text-text-tertiary opacity-20 cursor-grab active:cursor-grabbing">
                  <GripVertical size={20} />
                </div>
                
                <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-1 border-r border-border/20 py-2">
                    <span className="text-2xl font-black text-primary/20">#{idx + 1}</span>
                  </div>
                  
                  <div className="md:col-span-6 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Question Label</label>
                    <input 
                      type="text" 
                      value={field.label}
                      onChange={(e) => handleUpdateField(field.id, 'label', e.target.value)}
                      className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Response Type</label>
                    <select 
                      value={field.type}
                      onChange={(e) => handleUpdateField(field.id, 'type', e.target.value)}
                      className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                    >
                      <option value="text">Short Text</option>
                      <option value="textarea">Long Passage</option>
                      <option value="number">Numeric Only</option>
                      <option value="email">Email Verified</option>
                      <option value="file">File Upload (PDF)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex items-center justify-center gap-4 py-2">
                    <div className="flex flex-col items-center gap-2">
                      <label className="text-[9px] font-black uppercase text-text-tertiary shrink-0">Required</label>
                      <button 
                        onClick={() => handleUpdateField(field.id, 'required', !field.required)}
                        className={`w-10 h-6 rounded-full p-1 transition-all ${
                          field.required ? 'bg-primary' : 'bg-text-tertiary/20'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${
                          field.required ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemoveField(field.id)}
                      className="p-3 text-coral hover:bg-coral/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {schemas[activeCategory].fields.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[2rem] opacity-40">
            <p className="font-bold">No questions defined for this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
