'use client'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import RTOEditor from '@/components/admin/RTOEditor'
import ImageUploader from '@/components/admin/ImageUploader'
import { 
  Save, Loader2, AlertCircle, CheckCircle2, 
  Facebook, Instagram, Linkedin, Youtube, 
  Mail, Globe, Layout, Home, Users, Info,
  Type, MousePointer2, Sparkles, BarChart3, 
  History, Plus, Trash2, GripVertical, 
  Calendar, FileText, Target, Heart, 
  Award, Image as ImageIcon, UserPlus, 
  Send, Compass, ChevronDown, Monitor,
  Smartphone, Eye, Settings, ShieldCheck,
  Zap, Bell, ArrowRight, HelpCircle, ExternalLink,
  Layers, Calculator, XCircle
} from 'lucide-react'

// Layout/Internal Components
const SettingSection = ({ title, subtitle, icon, children }) => (
  <section className="space-y-6">
    <div className="flex items-center gap-4 border-b border-border dark:border-white/5 pb-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-black text-dynamic tracking-tight">{title}</h4>
        {subtitle && <p className="text-xs text-text-tertiary font-medium">{subtitle}</p>}
      </div>
    </div>
    <div className="grid grid-cols-1 gap-6">
      {children}
    </div>
  </section>
)

const InputField = ({ label, icon, value, onChange, placeholder, type = "text", description, mono = false, rows = 1 }) => {
  const isTextArea = rows > 1
  return (
    <div className="group space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary group-hover:text-primary transition-colors flex items-center gap-2">
          {icon} {label}
        </label>
        {value?.length > 0 && typeof value === 'string' && (
          <span className="text-[9px] font-bold text-text-tertiary/50">{value.length} chars</span>
        )}
      </div>
      {isTextArea ? (
        <textarea
          value={value || ''}
          onChange={onChange}
          rows={rows}
          className="w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl py-3 px-5 text-sm leading-relaxed focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none font-medium text-dynamic"
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          className={`w-full bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-2xl py-3 px-5 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold text-dynamic ${mono ? 'font-mono' : ''}`}
          placeholder={placeholder}
        />
      )}
      {description && <p className="text-[10px] text-text-tertiary/70 font-medium pl-1 italic">{description}</p>}
    </div>
  )
}

const ImageField = ({ label, value, onUpload, folder, description }) => (
  <div className="group space-y-3">
    <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary group-hover:text-primary transition-colors flex items-center gap-2">
      <ImageIcon size={14}/> {label}
    </label>
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="w-full md:w-48 aspect-video md:aspect-square bg-bg-secondary dark:bg-white/5 rounded-2xl border border-border dark:border-white/10 overflow-hidden relative group-hover:border-primary/20 transition-all">
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-text-tertiary/50 gap-2">
            <ImageIcon size={32} />
            <span className="text-[8px] font-bold uppercase">No Preview</span>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-4">
        <p className="text-[10px] text-text-tertiary leading-relaxed font-medium">{description || "Upload a high-quality image. It will be optimized via Cloudinary."}</p>
        <ImageUploader 
          label={value ? "Replace Image" : "Select Image"} 
          onUpload={onUpload} 
          folder={folder}
        />
        {value && (
          <div className="text-[9px] font-mono text-text-tertiary bg-white/50 dark:bg-black/50 p-2 rounded-lg break-all border border-border dark:border-white/5">
            {value}
          </div>
        )}
      </div>
    </div>
  </div>
)

const TAB_GROUPS = [
  {
    name: 'Core Pages',
    tabs: [
      { id: 'homepage', name: 'Homepage', icon: <Home size={16} /> },
      { id: 'about', name: 'About Page', icon: <Info size={16} /> },
      { id: 'team', name: 'Our Team', icon: <Users size={16} /> },
      { id: 'events', name: 'Events & Programs', icon: <Calendar size={16} /> },
      { id: 'gallery', name: 'Public Gallery', icon: <ImageIcon size={16} /> },
      { id: 'join', name: 'Join Us Page', icon: <UserPlus size={16} /> },
      { id: 'rto', name: 'RTO Program', icon: <Compass size={16} /> },
      { id: 'dmopractice', name: 'DMO Practice', icon: <Calculator size={16} /> },
    ]
  },
  {
    name: 'System & Social',
    tabs: [
      { id: 'timeline', name: 'Milestones', icon: <History size={16} /> },
      { id: 'social', name: 'Social Links', icon: <Youtube size={16} /> },
      { id: 'assets', name: 'Global Assets', icon: <ImageIcon size={16} /> },
      { id: 'general', name: 'Site Defaults', icon: <Settings size={16} /> },
    ]
  }
]

export default function SiteEditor() {
  const [activeTab, setActiveTab] = useState('homepage')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [lastSaved, setLastSaved] = useState(null)
  
  // Settings State
  const [settings, setSettings] = useState({
    facebook_url: '', instagram_url: '', youtube_url: '', linkedin_url: '',
    contact_email: '', hero_badge: '', hero_title: '', hero_subtitle: '',
    hero_cta_text: '', hero_cta_link: '', hero_image_url: '',
    mission_badge: '', mission_title: '', mission_description: '', mission_image_url: '',
    programs_title: '', programs_subtitle: '',
    stats_title: '', stats_subtitle: '',
    footer_description: '', stat_students_count: '', stat_volunteers_count: '', stat_programs_count: '', stat_years_count: '',
    about_hero_title: '', about_hero_description: '', about_vision_text: '',
    about_mission_text: '', about_rec_title: '', about_rec_description: '',
    about_rec_badge_title: '', about_rec_badge_desc: '',
    team_title: '', team_subtitle: '', team_description: '',
    events_title: '', events_subtitle: '', events_description: '',
    gallery_title: '', gallery_subtitle: '', gallery_description: '',
    join_badge: '', join_title: '', join_subtitle: '', join_description: '',
    join_features: [], join_paths: [], join_faqs: [],
    contact_title: '', contact_subtitle: '', contact_description: '',
    rto_title: '', rto_subtitle: '', rto_description: '',
    rto_stages: [], rto_roadmap: [], rto_resources: [],
    dmopractice_badge: '', dmopractice_title: '', dmopractice_subtitle: '', dmopractice_description: '',
    default_team_photo: '', default_event_cover: '', default_content_image: '', team_identity_assets: [],
    site_logo_url: '', active_volunteer_batch: 'General', is_maintenance_mode: false,
    updated_by_name: null, updated_at: null
  })

  // Page fields mapping for DRY rendering of subpages
  const SUBPAGE_CONFIG = {
    team: { name: 'Our Team', fields: ['team_title', 'team_subtitle', 'team_description'], icon: <Users size={20}/> },
    events: { name: 'Events & Programs', fields: ['events_title', 'events_subtitle', 'events_description'], icon: <Calendar size={20}/> },
    gallery: { name: 'Public Gallery', fields: ['gallery_title', 'gallery_subtitle', 'gallery_description'], icon: <ImageIcon size={20}/> },
    rto: { name: 'Road to Olympiad', fields: ['rto_title', 'rto_subtitle', 'rto_description'], icon: <Compass size={20}/> },
    dmopractice: { name: 'DMO Practice', fields: ['dmopractice_title', 'dmopractice_subtitle', 'dmopractice_description'], icon: <Calculator size={20}/> }
  }

  const [timelineItems, setTimelineItems] = useState([])

  useEffect(() => {
    fetchInitialData()
  }, [])

  async function fetchInitialData() {
    try {
      const [settingsRes, timelineRes] = await Promise.all([
        fetch('/api/settings'), fetch('/api/timeline')
      ])
      const settingsData = await settingsRes.json()
      const timelineData = await timelineRes.json()
      if (settingsData) {
        setSettings({
          ...settingsData,
          dmopractice_badge: settingsData.dmopractice_badge || 'Official Practice Portal',
          dmopractice_title: settingsData.dmopractice_title || 'Master the DMO <br />',
          dmopractice_subtitle: settingsData.dmopractice_subtitle || 'One Set at a Time.',
          dmopractice_description: settingsData.dmopractice_description || 'Experience a realistic competition environment with our curated mock exams, designed to push your problem-solving boundaries.'
        })
      }
      if (timelineData) setTimelineItems(timelineData)
      setLastSaved(new Date().toLocaleTimeString())
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
    }
  }

  const addTimelineItem = () => {
    setTimelineItems([...timelineItems, { id: `temp-${Date.now()}`, year: '', title: '', description: '', sort_order: timelineItems.length + 1 }])
  }

  const removeTimelineItem = async (id) => {
    if (!id.toString().startsWith('temp-') && !confirm('Delete milestone?')) return
    if (!id.toString().startsWith('temp-')) await fetch(`/api/timeline/${id}`, { method: 'DELETE' })
    setTimelineItems(timelineItems.filter(item => item.id !== id))
  }

  const updateTimelineItem = (id, field, value) => {
    setTimelineItems(timelineItems.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  async function handleSubmit() {
    setSaving(true)
    setMessage(null)
    try {
      await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
      for (const item of timelineItems) {
        const body = { ...item }; delete body.created_at; delete body.updated_at
        if (item.id.toString().startsWith('temp-')) {
          delete body.id; await fetch('/api/timeline', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        } else {
          await fetch(`/api/timeline/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        }
      }
      await fetchInitialData()
      setMessage({ type: 'success', text: 'Cloud Nexus Synchronized!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-xs font-black uppercase tracking-widest text-text-tertiary">Accessing Core Databases...</p>
    </div>
  )

  const currentTabInfo = TAB_GROUPS.flatMap(g => g.tabs).find(t => t.id === activeTab)

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Hub */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pt-4">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-primary dark:bg-white/10 rounded-[2rem] flex items-center justify-center text-secondary dark:text-white shadow-2xl shadow-primary/20">
              <Zap size={32} />
           </div>
           <div>
             <h2 className="text-4xl font-black tracking-tighter text-dynamic leading-tight">Site Nexus</h2>
             <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green">
                   <ShieldCheck size={12} /> Live Link Active
                </span>
                 <span className="text-[10px] font-medium text-text-tertiary">
                   Last sync: {lastSaved}
                   {settings?.updated_by_name && (
                     <span className="ml-3 border-l border-border pl-3">
                       Modified by <span className="font-black text-dynamic uppercase">{settings.updated_by_name}</span> 
                       {settings.updated_at && ` on ${new Date(settings.updated_at).toLocaleDateString()}`}
                     </span>
                   )}
                 </span>
             </div>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <AnimatePresence>
              {message && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] backdrop-blur-md shadow-lg ${message.type === 'success' ? 'bg-green/10 text-green border border-green/20' : 'bg-coral/10 text-coral border border-coral/20'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 md:flex-none px-10 py-4 bg-primary text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 group"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="group-hover:rotate-12 transition-transform" />}
              Publish Updates
            </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 pt-4">
        {/* Navigation Rail */}
        <aside className="lg:w-72 space-y-8 flex-shrink-0">
          {TAB_GROUPS.map((group) => (
             <div key={group.name} className="space-y-4">
                <h5 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary/60">{group.name}</h5>
                <div className="space-y-1.5 p-2 glass rounded-[2rem] border border-border dark:border-white/5 shadow-sm">
                   {group.tabs.map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-[11px] font-black transition-all group ${activeTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-text-tertiary hover:bg-bg-secondary dark:hover:bg-white/5 hover:text-primary'}`}
                     >
                       <div className="flex items-center gap-4">
                          <span className={`${activeTab === tab.id ? 'text-white' : 'group-hover:text-primary transition-colors'}`}>{tab.icon}</span>
                          <span className="tracking-tight uppercase">{tab.name}</span>
                       </div>
                       {activeTab === tab.id && <motion.div layoutId="rail-arrow"><ArrowRight size={14} className="opacity-50" /></motion.div>}
                     </button>
                   ))}
                </div>
             </div>
          ))}
          
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/5 to-cyan/5 border border-primary/10 overflow-hidden relative group mt-8">
             <div className="relative z-10 space-y-3">
                <h6 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"><Eye size={12}/> Interface Preview</h6>
                <p className="text-[9px] text-text-tertiary leading-relaxed font-medium">Verify how your database changes affect the global viewer experience.</p>
                <Link href="/" target="_blank" className="inline-flex items-center gap-2 text-[10px] font-black text-primary hover:gap-3 transition-all">Launch Site <ArrowRight size={10}/></Link>
             </div>
             <Monitor size={80} className="absolute -bottom-6 -right-6 text-primary/5 group-hover:text-primary/10 transition-colors rotate-12" />
          </div>
        </aside>

        {/* Content Canvas */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
             <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-12">
                
                {activeTab === 'homepage' && (
                  <div className="space-y-16">
                    <SettingSection title="Hero Section" subtitle="The first thing visitors see" icon={<Sparkles size={20}/>}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <InputField label="Impact Badge" icon={<Award size={14}/>} value={settings.hero_badge} onChange={e => setSettings(prev => ({...prev, hero_badge: e.target.value}))} placeholder="Top 100 Innovation..."/>
                          <InputField label="CTA Link" icon={<MousePointer2 size={14}/>} value={settings.hero_cta_link} onChange={e => setSettings(prev => ({...prev, hero_cta_link: e.target.value}))} placeholder="/join" mono/>
                       </div>
                       <InputField label="Main Headline" icon={<Type size={14}/>} value={settings.hero_title} onChange={e => setSettings(prev => ({...prev, hero_title: e.target.value}))} rows={2}/>
                       <InputField label="Narrative Text" value={settings.hero_subtitle} onChange={e => setSettings(prev => ({...prev, hero_subtitle: e.target.value}))} rows={4}/>
                       <InputField label="CTA Button Label" value={settings.hero_cta_text} onChange={e => setSettings(prev => ({...prev, hero_cta_text: e.target.value}))} placeholder="Join Us"/>
                    </SettingSection>

                    <SettingSection title="Impact Numbers" subtitle="Real-time growth metrics" icon={<BarChart3 size={20}/>}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <InputField label="Section Title" value={settings.stats_title} onChange={e => setSettings(prev => ({...prev, stats_title: e.target.value}))} />
                          <InputField label="Section Subtitle" value={settings.stats_subtitle} onChange={e => setSettings(prev => ({...prev, stats_subtitle: e.target.value}))} />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                          <InputField label="Active Students" type="text" value={settings.stat_students_count} onChange={e => setSettings(prev => ({...prev, stat_students_count: e.target.value}))} />
                          <InputField label="Global Volunteers" type="text" value={settings.stat_volunteers_count} onChange={e => setSettings(prev => ({...prev, stat_volunteers_count: e.target.value}))} />
                          <InputField label="Ed. Programs" type="text" value={settings.stat_programs_count} onChange={e => setSettings(prev => ({...prev, stat_programs_count: e.target.value}))} />
                          <InputField label="Years Active" type="text" value={settings.stat_years_count} onChange={e => setSettings(prev => ({...prev, stat_years_count: e.target.value}))} />
                       </div>
                    </SettingSection>

                    <SettingSection title="Mission & Vision" subtitle="Our core philosophy" icon={<Target size={20}/>}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-6">
                            <InputField label="Section Badge" value={settings.mission_badge} onChange={e => setSettings(prev => ({...prev, mission_badge: e.target.value}))} placeholder="Our Mission"/>
                            <InputField label="Mission Statement" value={settings.mission_title} onChange={e => setSettings(prev => ({...prev, mission_title: e.target.value}))} rows={2}/>
                            <InputField label="Full Narrative" value={settings.mission_description} onChange={e => setSettings(prev => ({...prev, mission_description: e.target.value}))} rows={5}/>
                            <div className="p-6 glass bg-secondary/5 border border-secondary/10 rounded-2xl space-y-4">
                               <h6 className="text-[10px] font-black uppercase tracking-widest text-secondary-dark flex items-center gap-2"><Award size={14}/> Recognition Badge (Mission)</h6>
                               <InputField label="Badge Label" value={settings.mission_rec_title} onChange={e => setSettings(prev => ({...prev, mission_rec_title: e.target.value}))} />
                               <InputField label="Badge Text" value={settings.mission_rec_desc} onChange={e => setSettings(prev => ({...prev, mission_rec_desc: e.target.value}))} rows={2} />
                            </div>
                          </div>
                          <ImageField 
                             label="Mission Image" 
                             value={settings.mission_image_url} 
                             onUpload={(url) => setSettings(prev => ({...prev, mission_image_url: url}))}
                             folder="min-website/homepage"
                             description="Portrait or square image showing our impact/students."
                          />
                       </div>
                       
                       <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border mt-4">
                          {[
                            { id: 1, icon: <CheckCircle2 size={16}/>, color: 'text-primary' },
                            { id: 2, icon: <Award size={16}/>, color: 'text-cyan' },
                            { id: 3, icon: <Target size={16}/>, color: 'text-purple' },
                            { id: 4, icon: <Heart size={16}/>, color: 'text-coral' }
                          ].map(p => (
                            <div key={p.id} className="p-6 glass rounded-2xl border border-border space-y-4">
                               <div className={`w-8 h-8 rounded-lg bg-current/10 ${p.color} flex items-center justify-center`}>
                                 {p.icon}
                               </div>
                               <InputField label={`Pillar ${p.id} Title`} value={settings[`mission_f${p.id}_title`]} onChange={e => setSettings(prev => ({...prev, [`mission_f${p.id}_title`]: e.target.value}))} />
                               <InputField label={`Description`} value={settings[`mission_f${p.id}_desc`]} onChange={e => setSettings(prev => ({...prev, [`mission_f${p.id}_desc`]: e.target.value}))} rows={3}/>
                            </div>
                          ))}
                       </div>
                    </SettingSection>

                    <SettingSection title="Programs Overview" subtitle="Highlighting our key initiatives" icon={<Layout size={20}/>}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <InputField label="Section Title" value={settings.programs_title} onChange={e => setSettings(prev => ({...prev, programs_title: e.target.value}))} />
                          <InputField label="Section Subtitle" value={settings.programs_subtitle} onChange={e => setSettings(prev => ({...prev, programs_subtitle: e.target.value}))} />
                       </div>
                       <div className="p-6 glass border border-primary/20 rounded-2xl bg-primary/5 flex items-center justify-between gap-4 mt-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white"><Layers size={20}/></div>
                             <div>
                                <h6 className="text-[10px] font-black uppercase tracking-widest text-primary">Card Management</h6>
                                <p className="text-[10px] text-text-tertiary font-medium">Add, remove, or edit individual program cards from the dedicated Programs page.</p>
                             </div>
                          </div>
                          <Link href="/admin/programs" className="px-5 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Go to Programs</Link>
                       </div>
                    </SettingSection>

                    <SettingSection title="Join Community CTA" subtitle="Call to action at bottom of home" icon={<UserPlus size={20}/>}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                             <InputField label="CTA Title" value={settings.join_cta_title} onChange={e => setSettings(prev => ({...prev, join_cta_title: e.target.value}))} rows={2} />
                             <InputField label="CTA Description" value={settings.join_cta_description} onChange={e => setSettings(prev => ({...prev, join_cta_description: e.target.value}))} rows={4} />
                             <InputField label="Button Label" value={settings.join_cta_btn_text} onChange={e => setSettings(prev => ({...prev, join_cta_btn_text: e.target.value}))} placeholder="Become a Volunteer" />
                          </div>
                          <div className="space-y-8 p-6 glass border border-border rounded-[2rem]">
                             <ImageField 
                                label="Join CTA Image" 
                                value={settings.join_cta_image_url} 
                                onUpload={(url) => setSettings(prev => ({...prev, join_cta_image_url: url}))}
                                folder="min-website/homepage"
                                description="Action-oriented image for the join section."
                             />
                             <div className="space-y-4 pt-4 border-t border-border">
                                <h6 className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Overlay Stats</h6>
                                <InputField label="Stat Value (e.g. 50+ Volunteers)" value={settings.join_cta_stat_title} onChange={e => setSettings(prev => ({...prev, join_cta_stat_title: e.target.value}))} />
                                <InputField label="Stat Description" value={settings.join_cta_stat_desc} onChange={e => setSettings(prev => ({...prev, join_cta_stat_desc: e.target.value}))} rows={2} />
                             </div>
                          </div>
                       </div>
                    </SettingSection>

                    <SettingSection title="Global Recognition Hub" subtitle="Major awards and institutional validation" icon={<Award size={20}/>}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <InputField label="Major Announcement" value={settings.about_rec_title} onChange={e => setSettings(prev => ({...prev, about_rec_title: e.target.value}))} />
                            <InputField label="Badge Status Title" value={settings.about_rec_badge_title} onChange={e => setSettings(prev => ({...prev, about_rec_badge_title: e.target.value}))} />
                            <InputField label="Badge Sub-desc" value={settings.about_rec_badge_desc} onChange={e => setSettings(prev => ({...prev, about_rec_badge_desc: e.target.value}))} />
                            <InputField label="Narrative Proof" value={settings.about_rec_description} onChange={e => setSettings(prev => ({...prev, about_rec_description: e.target.value}))} rows={5} />
                          </div>
                          <ImageField 
                             label="Achievement Photo" 
                             value={settings.recognition_image_url} 
                             onUpload={(url) => setSettings(prev => ({...prev, recognition_image_url: url}))}
                             folder="min-website/homepage"
                             description="Photo of the award, team posing, or certificates."
                          />
                       </div>
                    </SettingSection>
                  </div>
                )}

                {activeTab === 'about' && (
                  <SettingSection title="About Page Master" subtitle="Manage story, vision, and global recognition" icon={<Info size={20}/>}>
                     <div className="space-y-12">
                        <div className="p-8 glass bg-primary/5 rounded-[2.5rem] border border-primary/10 space-y-6">
                          <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Hero Introduction</h6>
                          <InputField label="Main Headline" value={settings.about_hero_title} onChange={e => setSettings(prev => ({...prev, about_hero_title: e.target.value}))}/>
                          <InputField label="Mission Intro" value={settings.about_hero_description} onChange={e => setSettings(prev => ({...prev, about_hero_description: e.target.value}))} rows={3}/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <InputField label="Vision Philosophy" icon={<Eye size={14}/>} value={settings.about_vision_text} onChange={e => setSettings(prev => ({...prev, about_vision_text: e.target.value}))} rows={4}/>
                          <InputField label="Operational Mission" icon={<Heart size={14}/>} value={settings.about_mission_text} onChange={e => setSettings(prev => ({...prev, about_mission_text: e.target.value}))} rows={4}/>
                        </div>
                        <div className="p-8 glass border border-secondary/20 rounded-[2.5rem] space-y-8">
                          <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary-dark flex items-center gap-2"><Award size={14}/> Global Recognition Hub</h6>
                          <InputField label="Award Headline" value={settings.about_rec_title} onChange={e => setSettings(prev => ({...prev, about_rec_title: e.target.value}))}/>
                          <InputField label="Recognition Narrative" value={settings.about_rec_description} onChange={e => setSettings(prev => ({...prev, about_rec_description: e.target.value}))} rows={4}/>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <InputField label="Badge Status" value={settings.about_rec_badge_title} onChange={e => setSettings(prev => ({...prev, about_rec_badge_title: e.target.value}))}/>
                             <InputField label="Badge Sub-desc" value={settings.about_rec_badge_desc} onChange={e => setSettings(prev => ({...prev, about_rec_badge_desc: e.target.value}))}/>
                          </div>
                          <ImageField 
                             label="Award Graphic/Logo" 
                             value={settings.about_rec_image} 
                             onUpload={(url) => setSettings(prev => ({...prev, about_rec_image: url}))}
                             folder="min-website/about"
                             description="Upload the HundrED logo or official organization badge graphic."
                          />
                        </div>
                     </div>
                  </SettingSection>
                )}

                {activeTab === 'join' && (
                  <div className="space-y-16">
                    <SettingSection title="Join Us Page Identity" subtitle="Manage the header and brand identity of the intake portal" icon={<UserPlus size={20}/>}>
                       <div className="p-8 glass rounded-[2.5rem] border border-border space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <InputField label="Hero Badge" icon={<Sparkles size={14}/>} value={settings.join_badge} onChange={e => setSettings(prev => ({...prev, join_badge: e.target.value}))} placeholder="Identify Your Path"/>
                             <InputField label="Primary Title" value={settings.join_title} onChange={e => setSettings(prev => ({...prev, join_title: e.target.value}))}/>
                          </div>
                          <InputField label="Marketing Headline" value={settings.join_subtitle} onChange={e => setSettings(prev => ({...prev, join_subtitle: e.target.value}))} rows={2}/>
                          <InputField label="Mission Disclosure" value={settings.join_description} onChange={e => setSettings(prev => ({...prev, join_description: e.target.value}))} rows={4}/>
                       </div>
                    </SettingSection>

                    <SettingSection title="Value Propositions" subtitle="Why should people join MIN Nepal?" icon={<Target size={20}/>}>
                       <div className="flex justify-end pr-2">
                          <button 
                            onClick={() => setSettings(prev => ({...prev, join_features: [...(settings.join_features || []), { title: '', desc: '' }]}))}
                            className="px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group"
                          >
                             <Plus size={14} /> Add Value Card
                          </button>
                       </div>
                       <Reorder.Group axis="y" values={settings.join_features || []} onReorder={(newVal) => setSettings(prev => ({...prev, join_features: newVal}))} className="space-y-4">
                          {(settings.join_features || []).map((feat, idx) => (
                            <Reorder.Item key={idx} value={feat} className="p-6 glass rounded-2xl border border-border relative group flex gap-6 hover:border-primary/40 transition-all">
                               <div className="flex items-center justify-center text-text-tertiary/20 cursor-grab active:cursor-grabbing hover:text-primary transition-colors pr-4 border-r border-border"><GripVertical size={20} /></div>
                               <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <InputField label="Value Title" value={feat.title} onChange={e => {
                                    const newFeats = [...settings.join_features]
                                    newFeats[idx] = { ...feat, title: e.target.value }
                                    setSettings(prev => ({...prev, join_features: newFeats }))
                                 }} />
                                 <div className="md:col-span-2">
                                    <InputField label="Explanation" value={feat.desc} onChange={e => {
                                       const newFeats = [...settings.join_features]
                                       newFeats[idx] = { ...feat, desc: e.target.value }
                                       setSettings(prev => ({...prev, join_features: newFeats }))
                                    }} />
                                 </div>
                               </div>
                               <button 
                                 onClick={() => {
                                    const newFeats = [...settings.join_features]
                                    newFeats.splice(idx, 1)
                                    setSettings(prev => ({...prev, join_features: newFeats }))
                                 }}
                                 className="p-2 text-coral opacity-0 group-hover:opacity-100 hover:bg-coral/10 rounded-xl transition-all self-center"
                               >
                                  <Trash2 size={16} />
                               </button>
                            </Reorder.Item>
                          ))}
                       </Reorder.Group>
                    </SettingSection>

                    <SettingSection title="Intake Paths" subtitle="Direct links to your form builder blueprints" icon={<Layers size={20}/>}>
                       <div className="flex justify-end pr-2">
                          <button 
                            onClick={() => setSettings(prev => ({...prev, join_paths: [...(settings.join_paths || []), { title: '', desc: '', perks: [], slug: '', icon: 'Heart' }]}))}
                            className="px-6 py-2.5 bg-secondary/10 text-secondary-dark hover:bg-secondary-dark hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group"
                          >
                             <Plus size={14} /> Register Path
                          </button>
                       </div>
                       <Reorder.Group axis="y" values={settings.join_paths || []} onReorder={(newVal) => setSettings(prev => ({...prev, join_paths: newVal}))} className="space-y-4">
                          {(settings.join_paths || []).map((path, idx) => (
                            <Reorder.Item key={idx} value={path} className="p-8 glass rounded-[2.5rem] border border-border relative group flex gap-6 hover:border-secondary/40 transition-all">
                               <div className="flex items-center justify-center text-text-tertiary/20 cursor-grab active:cursor-grabbing transition-colors pr-6 border-r border-border"><GripVertical size={24} /></div>
                               <div className="flex-1 space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <InputField label="Path Label" value={path.title} onChange={e => {
                                        const newPaths = [...settings.join_paths]
                                        newPaths[idx] = { ...path, title: e.target.value }
                                        setSettings(prev => ({...prev, join_paths: newPaths }))
                                     }} />
                                     <InputField label="Form Slug (Must Match Builder)" icon={<ExternalLink size={12}/>} value={path.slug} onChange={e => {
                                        const newPaths = [...settings.join_paths]
                                        newPaths[idx] = { ...path, slug: e.target.value }
                                        setSettings(prev => ({...prev, join_paths: newPaths }))
                                     }} mono placeholder="volunteer"/>
                                  </div>
                                  <InputField label="Short Description" value={path.desc} onChange={e => {
                                     const newPaths = [...settings.join_paths]
                                     newPaths[idx] = { ...path, desc: e.target.value }
                                     setSettings(prev => ({...prev, join_paths: newPaths }))
                                  }} rows={2} />
                                  
                                  <div className="space-y-2">
                                     <label className="text-[9px] font-black uppercase tracking-widest text-text-tertiary">Perks / Highlights</label>
                                     <div className="flex flex-wrap gap-2">
                                        {(path.perks || []).map((perk, pi) => (
                                          <div key={pi} className="flex items-center gap-2 bg-white dark:bg-white/5 border border-border px-3 py-1.5 rounded-lg">
                                             <input 
                                               value={perk} 
                                               onChange={e => {
                                                  const newPaths = [...settings.join_paths]
                                                  const newPerks = [...path.perks]
                                                  newPerks[pi] = e.target.value
                                                  newPaths[idx] = { ...path, perks: newPerks }
                                                  setSettings(prev => ({...prev, join_paths: newPaths }))
                                               }}
                                               className="bg-transparent border-none outline-none text-[10px] font-bold w-24"
                                             />
                                             <button onClick={() => {
                                                const newPaths = [...settings.join_paths]
                                                const newPerks = path.perks.filter((_, i) => i !== pi)
                                                newPaths[idx] = { ...path, perks: newPerks }
                                                setSettings(prev => ({...prev, join_paths: newPaths }))
                                             }}><XCircle size={12} className="text-coral"/></button>
                                          </div>
                                        ))}
                                        <button 
                                          onClick={() => {
                                             const newPaths = [...settings.join_paths]
                                             newPaths[idx] = { ...path, perks: [...(path.perks || []), 'New Perk'] }
                                             setSettings(prev => ({...prev, join_paths: newPaths }))
                                          }}
                                          className="text-[9px] font-black text-primary hover:underline px-2"
                                        >+ Add Perk</button>
                                     </div>
                                  </div>
                               </div>
                               <button 
                                 onClick={() => {
                                    const newPaths = [...settings.join_paths]
                                    newPaths.splice(idx, 1)
                                    setSettings(prev => ({...prev, join_paths: newPaths }))
                                 }}
                                 className="p-3 text-coral opacity-0 group-hover:opacity-100 hover:bg-coral/10 rounded-2xl transition-all self-center"
                               >
                                  <Trash2 size={20} />
                               </button>
                            </Reorder.Item>
                          ))}
                       </Reorder.Group>
                    </SettingSection>

                    <SettingSection title="Applicant FAQ" subtitle="Address common concerns before they submit" icon={<HelpCircle size={20}/>}>
                       <div className="flex justify-end pr-2">
                          <button 
                            onClick={() => setSettings(prev => ({...prev, join_faqs: [...(settings.join_faqs || []), { question: '', answer: '' }]}))}
                            className="px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group"
                          >
                             <Plus size={14} /> New FAQ
                          </button>
                       </div>
                       <Reorder.Group axis="y" values={settings.join_faqs || []} onReorder={(newVal) => setSettings(prev => ({...prev, join_faqs: newVal}))} className="space-y-4">
                          {(settings.join_faqs || []).map((faq, idx) => (
                            <Reorder.Item key={idx} value={faq} className="p-8 glass rounded-[2rem] border border-border relative group flex gap-6 hover:border-primary/40 transition-all">
                               <div className="flex items-center justify-center text-text-tertiary/20 cursor-grab active:cursor-grabbing hover:text-primary transition-colors pr-6 border-r border-border"><GripVertical size={24} /></div>
                               <div className="flex-1 space-y-6">
                                  <InputField label="Question" value={faq.question} onChange={e => {
                                     const newFaqs = [...settings.join_faqs]
                                     newFaqs[idx] = { ...faq, question: e.target.value }
                                     setSettings(prev => ({...prev, join_faqs: newFaqs }))
                                  }} />
                                  <InputField label="Answer" value={faq.answer} onChange={e => {
                                     const newFaqs = [...settings.join_faqs]
                                     newFaqs[idx] = { ...faq, answer: e.target.value }
                                     setSettings(prev => ({...prev, join_faqs: newFaqs }))
                                  }} rows={3} />
                               </div>
                               <button 
                                 onClick={() => {
                                    const newFaqs = [...settings.join_faqs]
                                    newFaqs.splice(idx, 1)
                                    setSettings(prev => ({...prev, join_faqs: newFaqs }))
                                 }}
                                 className="p-3 text-coral opacity-0 group-hover:opacity-100 hover:bg-coral/10 rounded-2xl transition-all self-center"
                               >
                                  <Trash2 size={20} />
                               </button>
                            </Reorder.Item>
                          ))}
                       </Reorder.Group>
                    </SettingSection>
                  </div>
                )}

                {/* Individual Sub-Pages */}
                {SUBPAGE_CONFIG[activeTab] && (
                  <SettingSection 
                    title={`${SUBPAGE_CONFIG[activeTab].name} Page Branding`} 
                    subtitle={`Manage header narrative and visual identity for /${activeTab}`} 
                    icon={SUBPAGE_CONFIG[activeTab].icon}
                  >
                     <div className="p-8 glass rounded-[2.5rem] border border-border space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <InputField label="Primary Page Title" value={settings[SUBPAGE_CONFIG[activeTab].fields[0]]} onChange={e => setSettings(prev => ({...prev, [SUBPAGE_CONFIG[activeTab].fields[0]]: e.target.value}))}/>
                           <InputField label="Marketing Sub-title" value={settings[SUBPAGE_CONFIG[activeTab].fields[1]]} onChange={e => setSettings(prev => ({...prev, [SUBPAGE_CONFIG[activeTab].fields[1]]: e.target.value}))}/>
                        </div>
                        <InputField label="Introductory Disclosure" value={settings[SUBPAGE_CONFIG[activeTab].fields[2]]} onChange={e => setSettings(prev => ({...prev, [SUBPAGE_CONFIG[activeTab].fields[2]]: e.target.value}))} rows={4}/>
                        
                        {activeTab === 'dmopractice' && (
                           <InputField label="Hero Badge Text" icon={<Award size={14}/>} value={settings.dmopractice_badge} onChange={e => setSettings(prev => ({...prev, dmopractice_badge: e.target.value}))} placeholder="Official Practice Portal"/>
                        )}
                        
                        {activeTab === 'rto' && (
                          <div className="pt-8 border-t border-border mt-4">
                             <div className="flex items-center gap-4 mb-8">
                                <Sparkles size={20} className="text-primary animate-pulse" />
                                <h5 className="text-xl font-black text-dynamic">Curriculum & Roadmap Configuration</h5>
                             </div>
                             <RTOEditor settings={settings} setSettings={setSettings} />
                          </div>
                        )}
                     </div>
                  </SettingSection>
                )}

                {activeTab === 'timeline' && (
                   <SettingSection title="Organizational Timeline" subtitle="Historical records and future milestones" icon={<History size={20}/>}>
                      <div className="flex justify-end pr-2">
                         <button onClick={addTimelineItem} className="px-8 py-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group">
                            <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Register New Milestone
                         </button>
                      </div>
                      <Reorder.Group axis="y" values={timelineItems} onReorder={setTimelineItems} className="space-y-4">
                        {timelineItems.map((item) => (
                          <Reorder.Item key={item.id} value={item} className="p-8 glass rounded-[2rem] border border-border relative group flex gap-8 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl">
                            <div className="flex items-center justify-center text-text-tertiary/20 cursor-grab active:cursor-grabbing hover:text-primary transition-colors pr-4 border-r border-border"><GripVertical size={24} /></div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-8">
                              <InputField label="Event Year" icon={<Calendar size={12}/>} value={item.year} onChange={e => updateTimelineItem(item.id, 'year', e.target.value)} placeholder="2024" />
                              <InputField label="Milestone Title" icon={<Type size={12}/>} value={item.title} onChange={e => updateTimelineItem(item.id, 'title', e.target.value)} />
                              <div className="md:col-span-2">
                                <InputField label="Brief Narrative" icon={<FileText size={12}/>} value={item.description} onChange={e => updateTimelineItem(item.id, 'description', e.target.value)} />
                              </div>
                            </div>
                            <button onClick={() => removeTimelineItem(item.id)} className="p-3 text-coral opacity-0 group-hover:opacity-100 hover:bg-coral/10 rounded-2xl transition-all self-center shadow-lg"><Trash2 size={20} /></button>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                      {timelineItems.length === 0 && <div className="py-24 text-center glass rounded-[3rem] border border-dashed border-border"><p className="text-xs text-text-tertiary font-bold uppercase tracking-[0.2em] opacity-50">Timeline Nexus Unpopulated.</p></div>}
                   </SettingSection>
                )}

                {activeTab === 'social' && (
                  <SettingSection title="Social Ecosystem" subtitle="Manage external community connection points" icon={<Youtube size={20}/>}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <InputField label="Facebook Hub" icon={<Facebook size={14}/>} value={settings.facebook_url} onChange={e => setSettings(prev => ({...prev, facebook_url: e.target.value}))} mono placeholder="https://facebook.com/..."/>
                        <InputField label="Instagram Grid" icon={<Instagram size={14}/>} value={settings.instagram_url} onChange={e => setSettings(prev => ({...prev, instagram_url: e.target.value}))} mono placeholder="@mathsinitiatives"/>
                        <InputField label="YouTube Channel" icon={<Youtube size={14}/>} value={settings.youtube_url} onChange={e => setSettings(prev => ({...prev, youtube_url: e.target.value}))} mono placeholder="Channel URL"/>
                        <InputField label="LinkedIn Network" icon={<Linkedin size={14}/>} value={settings.linkedin_url} onChange={e => setSettings(prev => ({...prev, linkedin_url: e.target.value}))} mono placeholder="Company Page"/>
                     </div>
                  </SettingSection>
                )}

                {activeTab === 'assets' && (
                  <div className="space-y-16">
                  <SettingSection title="Global Fallback Assets" subtitle="Identity controls for media-less content interactions" icon={<ImageIcon size={20}/>}>
                     <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                        {/* Team Fallback */}
                        <div className="p-10 glass bg-white/40 dark:bg-white/5 rounded-[3rem] border border-white/40 dark:border-white/10 space-y-8 group hover:border-primary/30 transition-all duration-500 shadow-xl">
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="space-y-4">
                                 <div className="w-14 h-14 bg-primary/10 rounded-[1.2rem] flex items-center justify-center text-primary">
                                    <Users size={28} />
                                 </div>
                                 <div>
                                    <h6 className="text-2xl font-black tracking-tight text-dynamic">Team Identity</h6>
                                    <p className="text-xs text-primary font-black uppercase tracking-[0.25em] flex items-center gap-2 mt-1">
                                       <Globe size={12}/> Applies to: /team (Member Cards)
                                    </p>
                                 </div>
                              </div>
                              <p className="text-sm text-text-tertiary leading-relaxed md:max-w-xs md:text-right font-medium">
                                 The primary visual representation for any team member who hasn't provided a profile headshot.
                              </p>
                           </div>
                           <div className="pt-8 border-t border-border/50">
                              <ImageField 
                                 label="Active Placeholder" 
                                 value={settings.default_team_photo} 
                                 onUpload={(url) => setSettings(prev => ({...prev, default_team_photo: url}))}
                                 folder="min-website/defaults"
                                 description="Upload an image that represents the 'MINian' spirit. Square aspect ratio recommended."
                              />
                           </div>
                        </div>

                        {/* Event Fallback */}
                        <div className="p-10 glass bg-white/40 dark:bg-white/5 rounded-[3rem] border border-white/40 dark:border-white/10 space-y-8 group hover:border-secondary/30 transition-all duration-500 shadow-xl">
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="space-y-4">
                                 <div className="w-14 h-14 bg-secondary/10 rounded-[1.2rem] flex items-center justify-center text-secondary-dark">
                                    <Calendar size={28} />
                                 </div>
                                 <div>
                                    <h6 className="text-2xl font-black tracking-tight text-dynamic">Event Atmosphere</h6>
                                    <p className="text-xs text-secondary-dark font-black uppercase tracking-[0.25em] flex items-center gap-2 mt-1">
                                       <Globe size={12}/> Applies to: /events (Program Cards)
                                    </p>
                                 </div>
                              </div>
                              <p className="text-sm text-text-tertiary leading-relaxed md:max-w-xs md:text-right font-medium">
                                 Displayed as the cover image for institutional programs or community events missing unique media.
                              </p>
                           </div>
                           <div className="pt-8 border-t border-border/50">
                              <ImageField 
                                 label="Event Placeholder" 
                                 value={settings.default_event_cover} 
                                 onUpload={(url) => setSettings(prev => ({...prev, default_event_cover: url}))}
                                 folder="min-website/defaults"
                                 description="Vibrant image suggesting learning, collaboration, or mathematics."
                              />
                           </div>
                        </div>

                        {/* Content Fallback */}
                        <div className="p-10 glass bg-white/40 dark:bg-white/5 rounded-[3rem] border border-white/40 dark:border-white/10 space-y-8 group hover:border-green/30 transition-all duration-500 shadow-xl">
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="space-y-4">
                                 <div className="w-14 h-14 bg-green/10 rounded-[1.2rem] flex items-center justify-center text-green">
                                    <FileText size={28} />
                                 </div>
                                 <div>
                                    <h6 className="text-2xl font-black tracking-tight text-dynamic">Content / Article</h6>
                                    <p className="text-xs text-green font-black uppercase tracking-[0.25em] flex items-center gap-2 mt-1">
                                       <Globe size={12}/> Applies to: Internal Blog, SEO Cards
                                    </p>
                                 </div>
                              </div>
                              <p className="text-sm text-text-tertiary leading-relaxed md:max-w-xs md:text-right font-medium">
                                 A neutral, high-quality background for articles or dynamic content missing designated thumbnails.
                              </p>
                           </div>
                           <div className="pt-8 border-t border-border/50">
                              <ImageField 
                                 label="Content Placeholder" 
                                 value={settings.default_content_image} 
                                 onUpload={(url) => setSettings(prev => ({...prev, default_content_image: url}))}
                                 folder="min-website/defaults"
                                 description="Clean, understated image suitable for overlapping text."
                              />
                           </div>
                        </div>
                     </div>
                  </SettingSection>

                  <div className="pt-12 border-t border-border mt-12">
                     <SettingSection title="Team Identity Assets" subtitle="A collection of images for randomized member profile assignment" icon={<Sparkles size={20}/>}>
                        <div className="space-y-6">
                           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                             {settings.team_identity_assets?.map((url, index) => (
                               <motion.div 
                                 key={index} 
                                 layout
                                 className="group relative aspect-square rounded-2xl overflow-hidden border border-border dark:border-white/10 hover:border-primary/50 transition-all shadow-sm"
                               >
                                 <img src={url} alt={`Asset ${index}`} className="w-full h-full object-cover" />
                                 <button 
                                   onClick={() => {
                                     const newAssets = [...settings.team_identity_assets]
                                     newAssets.splice(index, 1)
                                     setSettings(prev => ({...prev, team_identity_assets: newAssets}))
                                   }}
                                   className="absolute inset-0 bg-coral/90 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                   <Trash2 size={24} />
                                 </button>
                               </motion.div>
                             ))}
                             <div className="aspect-square rounded-2xl border-2 border-dashed border-primary/20 hover:border-primary flex flex-col items-center justify-center gap-2 transition-all p-4 text-center group bg-primary/5">
                                <ImageUploader 
                                   label="Add Brand Asset" 
                                   onUpload={(url) => setSettings(prev => ({...prev, team_identity_assets: [...(prev.team_identity_assets || []), url]}))}
                                   folder="min-website/identity"
                                />
                                <p className="text-[8px] font-bold text-primary/60 uppercase">Add New Avatar Asset</p>
                             </div>
                           </div>
                        </div>
                     </SettingSection>
                  </div>
                  </div>
               )}

                  <SettingSection title="Global Identities & System" subtitle="Administrative contact and sitewide defaults" icon={<Settings size={20}/>}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputField label="Official Support Inbox" icon={<Mail size={14}/>} type="email" value={settings.contact_email} onChange={e => setSettings(prev => ({...prev, contact_email: e.target.value}))} placeholder="office@mathsinitiatives.org.np"/>
                        <InputField label="Volunteer Intake Batch" icon={<UserPlus size={14}/>} value={settings.active_volunteer_batch} onChange={e => setSettings(prev => ({...prev, active_volunteer_batch: e.target.value}))} placeholder="Batch 2026-A" description="New applications will be tagged with this batch name"/>
                     </div>

                     <div className="pt-8 border-t border-border mt-8">
                        <div className={`flex items-center justify-between p-8 rounded-[2rem] border transition-all duration-500 ${settings.is_maintenance_mode ? 'bg-coral/5 border-coral/30 shadow-lg shadow-coral/10' : 'bg-bg-secondary/50 border-border dark:bg-white/5 dark:border-white/10'}`}>
                           <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${settings.is_maintenance_mode ? 'bg-coral text-white' : 'bg-primary/10 text-primary'}`}>
                                    <Zap size={20} className={settings.is_maintenance_mode ? 'animate-pulse' : ''} />
                                 </div>
                                 <h6 className={`text-lg font-black tracking-tight ${settings.is_maintenance_mode ? 'text-coral' : 'text-dynamic'}`}>Maintenance Mode</h6>
                              </div>
                              <p className="text-xs text-text-tertiary font-medium max-w-md">
                                 When activated, public access to the website will be restricted. Only <span className="font-bold text-primary">Admins</span> and <span className="font-bold text-primary">Website Managers</span> can view the site.
                              </p>
                           </div>
                           <button 
                              onClick={async () => {
                                 const willActivate = !settings.is_maintenance_mode;
                                 const message = willActivate 
                                   ? "Are you sure you want to ACTIVATE maintenance mode? \n\nThis will immediately restrict public access to the website for all non-admin users."
                                   : "Are you sure you want to DEACTIVATE maintenance mode? \n\nYour website will be live and visible to everyone again.";
                                 
                                 if (window.confirm(message)) {
                                    // Update state locally first
                                    const newSettings = {...settings, is_maintenance_mode: willActivate};
                                    setSettings(newSettings);
                                    
                                    // Auto-trigger save for this critical action
                                    setSaving(true);
                                    try {
                                       const res = await fetch('/api/settings', {
                                          method: 'PATCH',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify(newSettings)
                                       });
                                       if (res.ok) {
                                          setMessage({ type: 'success', text: `Maintenance mode ${willActivate ? 'activated' : 'deactivated'} successfully` });
                                          setTimeout(() => setMessage(null), 3000);
                                       } else {
                                          throw new Error('Update failed');
                                       }
                                    } catch (err) {
                                       setMessage({ type: 'error', text: 'Failed to update system status' });
                                    } finally {
                                       setSaving(false);
                                    }
                                 }
                              }}
                              disabled={saving}
                              className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl disabled:opacity-50 ${settings.is_maintenance_mode ? 'bg-coral text-white shadow-coral/20' : 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark'}`}
                           >
                              {saving && <Loader2 size={12} className="inline mr-2 animate-spin" />}
                              {settings.is_maintenance_mode ? 'Deactivate Now' : 'Activate Maintenance'}
                           </button>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-border mt-8">
                        <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2"><Sparkles size={14}/> Core Site Branding</h6>
                        <ImageField 
                          label="Custom Site Logo" 
                          value={settings.site_logo_url} 
                          onUpload={(url) => setSettings(prev => ({...prev, site_logo_url: url}))}
                          folder="min-website/branding"
                          description="The primary logo used in the navbar and footer. Uploading here enables Cloudinary optimization."
                        />
                     </div>

                     <div className="pt-8 border-t border-border mt-8">
                        <InputField label="Institutional Footer Narrative" value={settings.footer_description} onChange={e => setSettings(prev => ({...prev, footer_description: e.target.value}))} rows={5} description="Displayed at the base of every page interaction"/>
                     </div>
                  </SettingSection>
             </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
