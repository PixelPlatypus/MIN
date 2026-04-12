'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Mail, Calendar, MessageSquare, CheckCircle2 } from 'lucide-react'

export default function InquiryDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [inquiry, setInquiry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInquiry() {
      try {
        const res = await fetch(`/api/applications/admin/${id}`)
        if (res.ok) {
          const data = await res.json()
          setInquiry(data)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchInquiry()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    )
  }

  if (!inquiry) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold mb-4 text-coral">Inquiry Not Found</h2>
        <button onClick={() => router.push('/admin/inquiries')} className="text-primary hover:underline">Return to list</button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-tertiary hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass rounded-[3rem] p-8 md:p-12 border border-border dark:border-border-dark space-y-10 shadow-2xl">
         <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-500">
                General Inquiry
              </span>
              <h1 className="text-4xl font-black tracking-tighter leading-none pt-4">{inquiry.name}</h1>
            </div>
            {inquiry.status === 'ACCEPTED' && (
              <div className="flex items-center gap-2 bg-green/10 text-green px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 size={16} /> Responded
              </div>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-bg-secondary dark:bg-white/5 p-5 rounded-2xl border border-border dark:border-border-dark">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Sender Email</p>
                <p className="font-bold">{inquiry.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-bg-secondary dark:bg-white/5 p-5 rounded-2xl border border-border dark:border-border-dark">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary-dark">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Received Date</p>
                <p className="font-bold">{new Date(inquiry.created_at).toLocaleString()}</p>
              </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="p-8 bg-black/5 dark:bg-white/5 rounded-[2rem] border border-border dark:border-border-dark space-y-4 shadow-inner">
               <div className="flex items-center gap-2 text-primary">
                 <MessageSquare size={18} />
                 <h4 className="font-black uppercase tracking-widest text-xs">Subject</h4>
               </div>
               <p className="text-2xl font-black tracking-tight">{inquiry.form_data?.subject || 'No Subject'}</p>
            </div>

            <div className="p-8 bg-black/5 dark:bg-white/5 rounded-[2rem] border border-border dark:border-border-dark space-y-4 shadow-inner">
               <div className="flex items-center gap-2 text-primary">
                 <MessageSquare size={18} />
                 <h4 className="font-black uppercase tracking-widest text-xs">Full Message</h4>
               </div>
               <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap">{inquiry.form_data?.message}</p>
            </div>
         </div>

         {inquiry.status === 'PENDING' && (
           <div className="pt-8 flex justify-center">
              <button 
                onClick={async () => {
                  const res = await fetch(`/api/applications/admin/${inquiry.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'ACCEPTED' }),
                  })
                  if (res.ok) setInquiry({ ...inquiry, status: 'ACCEPTED' })
                }}
                className="bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
              >
                <CheckCircle2 size={24} />
                Mark as Responded
              </button>
           </div>
         )}
      </div>
    </div>
  )
}
