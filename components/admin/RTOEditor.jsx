'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Trash2, GripVertical, 
  MapPin, Flag, Award, Users, Globe, 
  Library, FileText, ChevronRight,
  Sparkles, ListPlus
} from 'lucide-react'

// Icon mapping for RTO
const ICON_MAP = {
  MapPin: <MapPin size={18} />,
  Flag: <Flag size={18} />,
  Award: <Award size={18} />,
  Users: <Users size={18} />,
  Globe: <Globe size={18} />,
  Library: <Library size={18} />,
  FileText: <FileText size={18} />
}

export default function RTOEditor({ settings, setSettings }) {
  const [activeSubTab, setActiveSubTab] = useState('stages')

  const updateArray = (key, index, field, value) => {
    const newArray = [...settings[key]]
    newArray[index] = { ...newArray[index], [field]: value }
    setSettings({ ...settings, [key]: newArray })
  }

  const addItem = (key, defaultObj) => {
    setSettings({ ...settings, [key]: [...settings[key], defaultObj] })
  }

  const removeItem = (key, index) => {
    const newArray = settings[key].filter((_, i) => i !== index)
    setSettings({ ...settings, [key]: newArray })
  }

  // Helper for roadmap items (nested array)
  const updateRoadmapItem = (phaseIndex, itemIndex, field, value) => {
    const newRoadmap = [...settings.rto_roadmap]
    const newItems = [...newRoadmap[phaseIndex].items]
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value }
    newRoadmap[phaseIndex] = { ...newRoadmap[phaseIndex], items: newItems }
    setSettings({ ...settings, rto_roadmap: newRoadmap })
  }

  const addRoadmapSubItem = (phaseIndex) => {
    const newRoadmap = [...settings.rto_roadmap]
    newRoadmap[phaseIndex].items.push({ label: 'New Focus', desc: 'Description here...' })
    setSettings({ ...settings, rto_roadmap: newRoadmap })
  }

  // Helper for resource items (object array)
  const updateResourceItem = (catIndex, itemIndex, field, value) => {
    const newResources = [...settings.rto_resources]
    newResources[catIndex].items[itemIndex] = { ...newResources[catIndex].items[itemIndex], [field]: value }
    setSettings({ ...settings, rto_resources: newResources })
  }

  const addResourceSubItem = (catIndex) => {
    const newResources = [...settings.rto_resources]
    newResources[catIndex].items.push({ name: 'New Resource', url: '#' })
    setSettings({ ...settings, rto_resources: newResources })
  }

  return (
    <div className="space-y-8">
      {/* Sub Tabs */}
      <div className="flex gap-2 p-1.5 glass bg-black/5 dark:bg-white/5 rounded-2xl w-fit">
        {[
          { id: 'stages', name: 'Selection Stages', icon: <MapPin size={14}/> },
          { id: 'roadmap', name: 'Roadmap Flow', icon: <ChevronRight size={14}/> },
          { id: 'resources', name: 'Study Resources', icon: <Library size={14}/> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeSubTab === tab.id 
                ? 'bg-white dark:bg-white/10 text-primary shadow-sm' 
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STAGES EDITOR */}
        {activeSubTab === 'stages' && (
          <motion.div 
            key="stages"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
             <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-dynamic">Olympiad Selection Process</h4>
                <button 
                  onClick={() => addItem('rto_stages', { id: 'NEW', name: 'New Stage', desc: 'Description...', icon: 'Award' })}
                  className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                >
                  <Plus size={20} />
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settings.rto_stages.map((stage, idx) => (
                  <div key={idx} className="glass p-6 rounded-[2rem] border border-border relative group space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                           {ICON_MAP[stage.icon] || <Award size={18} />}
                        </div>
                        <div className="flex-1 space-y-1">
                           <input 
                              value={stage.id || ''} 
                              onChange={e => updateArray('rto_stages', idx, 'id', e.target.value)}
                              className="bg-transparent text-[10px] font-black uppercase tracking-[0.3em] text-primary w-full outline-none"
                              placeholder="ID (e.g. DMO)"
                           />
                           <input 
                              value={stage.name || ''} 
                              onChange={e => updateArray('rto_stages', idx, 'name', e.target.value)}
                              className="bg-transparent text-lg font-black text-dynamic w-full outline-none"
                              placeholder="Stage Name"
                           />
                        </div>
                        <button onClick={() => removeItem('rto_stages', idx)} className="opacity-0 group-hover:opacity-100 p-2 text-coral hover:bg-coral/10 rounded-xl transition-all"><Trash2 size={16}/></button>
                     </div>
                     <textarea 
                        value={stage.desc || ''}
                        onChange={e => updateArray('rto_stages', idx, 'desc', e.target.value)}
                        className="w-full bg-bg-secondary dark:bg-black/20 border border-border rounded-xl py-2 px-3 text-xs leading-relaxed focus:border-primary transition-all resize-none"
                        rows={3}
                        placeholder="Stage description..."
                     />
                     <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-text-tertiary">Icon:</span>
                        <select 
                          value={stage.icon || 'Award'}
                          onChange={e => updateArray('rto_stages', idx, 'icon', e.target.value)}
                          className="bg-transparent text-[10px] font-bold text-text-secondary focus:outline-none"
                        >
                          {Object.keys(ICON_MAP).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {/* ROADMAP EDITOR */}
        {activeSubTab === 'roadmap' && (
          <motion.div 
            key="roadmap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
             <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-dynamic">Roadmap Phases</h4>
                <button 
                  onClick={() => addItem('rto_roadmap', { phase: 'Phase X', timeline: 'Timeframe', goal: 'Goal...', color: 'from-blue-500/20 to-cyan-500/20', borderColor: 'border-blue-500/30', iconColor: 'text-blue-500', items: [] })}
                  className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                >
                  <Plus size={20} />
                </button>
             </div>

             <div className="space-y-12">
                {(settings.rto_roadmap || []).map((phase, pIdx) => (
                  <div key={pIdx} className="space-y-6 p-8 glass rounded-[3rem] border border-border relative group">
                    <button onClick={() => removeItem('rto_roadmap', pIdx)} className="absolute top-8 right-8 text-coral p-2 hover:bg-coral/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Phase Name</label>
                          <input 
                            value={phase.phase || ''} 
                            onChange={e => updateArray('rto_roadmap', pIdx, 'phase', e.target.value)}
                            className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-2 text-sm font-bold"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Timeline</label>
                          <input 
                            value={phase.timeline || ''} 
                            onChange={e => updateArray('rto_roadmap', pIdx, 'timeline', e.target.value)}
                            className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-2 text-sm font-bold"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Goal</label>
                          <input 
                            value={phase.goal || ''} 
                            onChange={e => updateArray('rto_roadmap', pIdx, 'goal', e.target.value)}
                            className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-2 text-sm font-bold"
                          />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary">Focus Items</label>
                          <button onClick={() => addRoadmapSubItem(pIdx)} className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-lg hover:bg-primary hover:text-white transition-all">
                             <Plus size={12}/> Add Focus
                          </button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(phase.items || []).map((item, iIdx) => (
                            <div key={iIdx} className="flex gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/50 relative group/item">
                               <div className="w-8 h-8 rounded-full bg-white dark:bg-black/20 flex items-center justify-center shrink-0 text-xs font-black text-primary border border-border">
                                 {iIdx + 1}
                               </div>
                               <div className="flex-1 space-y-2">
                                  <input 
                                    value={item.label || ''}
                                    onChange={e => updateRoadmapItem(pIdx, iIdx, 'label', e.target.value)}
                                    className="bg-transparent text-sm font-bold text-dynamic w-full outline-none"
                                    placeholder="Topic Label"
                                  />
                                  <textarea 
                                    value={item.desc || ''}
                                    onChange={e => updateRoadmapItem(pIdx, iIdx, 'desc', e.target.value)}
                                    className="bg-transparent text-xs text-text-tertiary w-full outline-none resize-none"
                                    rows={2}
                                    placeholder="Topic description..."
                                  />
                               </div>
                               <button 
                                 onClick={() => {
                                   const newRoadmap = [...settings.rto_roadmap]
                                   newRoadmap[pIdx].items = newRoadmap[pIdx].items.filter((_, idx) => idx !== iIdx)
                                   setSettings({...settings, rto_roadmap: newRoadmap})
                                 }} 
                                 className="opacity-0 group-hover/item:opacity-100 text-coral hover:bg-coral/10 p-1 rounded-lg transition-all absolute top-2 right-2"
                               >
                                 <Plus size={14} className="rotate-45"/>
                               </button>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {/* RESOURCES EDITOR */}
        {activeSubTab === 'resources' && (
          <motion.div 
            key="resources"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
             <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-dynamic">Curated Resource Lists</h4>
                <button 
                  onClick={() => addItem('rto_resources', { title: 'New Category', icon: 'Library', items: [] })}
                  className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                >
                  <Plus size={20} />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(settings.rto_resources || []).map((cat, cIdx) => (
                  <div key={cIdx} className="p-8 glass rounded-[3rem] border border-border space-y-6 relative group">
                    <button onClick={() => removeItem('rto_resources', cIdx)} className="absolute top-8 right-8 text-coral p-2 hover:bg-coral/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>

                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-bg-secondary dark:bg-white/5 flex items-center justify-center text-text-tertiary">
                          {ICON_MAP[cat.icon] || <Library size={18}/>}
                       </div>
                       <input 
                          value={cat.title || ''}
                          onChange={e => updateArray('rto_resources', cIdx, 'title', e.target.value)}
                          className="bg-transparent text-xl font-black text-dynamic w-full outline-none"
                          placeholder="Category Title"
                       />
                    </div>

                    <div className="space-y-4">
                       {(cat.items || []).map((item, iIdx) => (
                         <div key={iIdx} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/50 space-y-3 relative group/item">
                            <div className="flex items-center gap-3">
                               <ChevronRight size={14} className="text-primary shrink-0" />
                               <input 
                                 value={typeof item === 'string' ? item : item.name || ''}
                                 onChange={e => updateResourceItem(cIdx, iIdx, 'name', e.target.value)}
                                 className="bg-transparent text-sm font-bold text-dynamic w-full outline-none"
                                 placeholder="Resource Name"
                               />
                               <button 
                                onClick={() => {
                                  const newRes = [...settings.rto_resources]
                                  newRes[cIdx].items = newRes[cIdx].items.filter((_, idx) => idx !== iIdx)
                                  setSettings({...settings, rto_resources: newRes})
                                }} 
                                className="opacity-0 group-hover/item:opacity-100 text-coral p-1 hover:bg-coral/10 rounded-lg transition-all"
                               >
                                  <Plus size={12} className="rotate-45"/>
                               </button>
                            </div>
                            <div className="flex items-center gap-2 pl-6">
                               <Globe size={12} className="text-text-tertiary" />
                               <input 
                                 value={typeof item === 'string' ? '#' : item.url || '#'}
                                 onChange={e => updateResourceItem(cIdx, iIdx, 'url', e.target.value)}
                                 className="bg-transparent text-[10px] font-medium text-text-tertiary w-full outline-none"
                                 placeholder="Destination URL (https://...)"
                               />
                            </div>
                         </div>
                       ))}
                       <button 
                        onClick={() => addResourceSubItem(cIdx)}
                        className="w-full py-3 rounded-xl border border-dashed border-border text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 mt-2"
                       >
                         <Plus size={12}/> Add Resource Link
                       </button>
                    </div>

                    <div className="flex items-center gap-2 border-t border-border pt-4">
                        <span className="text-[8px] font-black uppercase tracking-widest text-text-tertiary">Icon:</span>
                        <select 
                          value={cat.icon}
                          onChange={e => updateArray('rto_resources', cIdx, 'icon', e.target.value)}
                          className="bg-transparent text-[10px] font-bold text-text-secondary focus:outline-none"
                        >
                          {Object.keys(ICON_MAP).map(icon => <option key={icon} value={icon}>{icon}</option>)}
                        </select>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
