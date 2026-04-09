'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Award, Mail, Calendar, User, BookOpen, Loader2 } from 'lucide-react'

export default function CertificateForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    recipient_name: '',
    recipient_email: '',
    program_name: '',
    event_name: '',
    issued_date: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/certificates')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to issue certificate')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recipient Info */}
        <div className="glass rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <User size={20} />
            </div>
            <h3 className="text-xl font-bold">Recipient Details</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary px-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full glass bg-white/10 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={formData.recipient_name}
                onChange={e => setFormData({ ...formData, recipient_name: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary px-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full glass bg-white/10 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={formData.recipient_email}
                onChange={e => setFormData({ ...formData, recipient_email: e.target.value })}
                placeholder="john.doe@example.com"
              />
            </div>
          </div>
        </div>

        {/* Program Info */}
        <div className="glass rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary-dark">
              <BookOpen size={20} />
            </div>
            <h3 className="text-xl font-bold">Program Details</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary px-1">Program Name</label>
              <input 
                type="text" 
                required
                className="w-full glass bg-white/10 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={formData.program_name}
                onChange={e => setFormData({ ...formData, program_name: e.target.value })}
                placeholder="e.g. Junior Mathematics Olympiad Camp"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary px-1">Event / Batch Name (Optional)</label>
              <input 
                type="text" 
                className="w-full glass bg-white/10 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={formData.event_name}
                onChange={e => setFormData({ ...formData, event_name: e.target.value })}
                placeholder="e.g. JMOC 2025 Winter Edition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-secondary px-1">Issue Date</label>
              <input 
                type="date" 
                required
                className="w-full glass bg-white/10 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={formData.issued_date}
                onChange={e => setFormData({ ...formData, issued_date: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-8 py-4 rounded-2xl text-text-secondary hover:bg-bg-secondary dark:hover:bg-white/5 transition-all font-semibold"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Generating & Sending...
            </>
          ) : (
            <>
              <Award size={20} />
              Issue & Send Certificate
            </>
          )}
        </button>
      </div>
    </form>
  )
}
