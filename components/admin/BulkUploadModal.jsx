// components/admin/BulkUploadModal.jsx
'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UploadSimple as Upload, Table, CheckCircle, Warning, CircleNotch as Loader2, Info } from '@phosphor-icons/react'

export default function BulkUploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [csvData, setCsvData] = useState([])
  const [headers, setHeaders] = useState([])
  const [mappings, setMappings] = useState({
    recipient_name: '',
    recipient_email: '',
    event_name: '',
    program_name: '',
    issued_date: '',
    expiry_date: '',
    pdf_url: '',
    is_visible: ''
  })
  const [step, setStep] = useState(1) // 1: upload, 2: map & preview, 3: upload progress
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  // Simple CSV Parser State Machine
  function parseCSV(text) {
    const lines = []
    let row = ['']
    lines.push(row)
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
      const c = text[i]
      const next = text[i + 1]
      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (c === ',' && !inQuotes) {
        row.push('')
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') {
          i++
        }
        row = ['']
        lines.push(row)
      } else {
        row[row.length - 1] += c
      }
    }
    return lines
      .map(r => r.map(cell => cell.trim()))
      .filter(r => r.length > 1 || r[0] !== '')
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a valid CSV file')
      return
    }

    setFile(selectedFile)
    setError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result
        if (typeof text !== 'string') return

        const parsed = parseCSV(text)
        if (parsed.length < 2) {
          setError('CSV file is empty or does not contain data')
          return
        }

        const csvHeaders = parsed[0]
        const csvRows = parsed.slice(1)

        setHeaders(csvHeaders)
        setCsvData(csvRows)

        // Auto mapping
        const newMappings = { ...mappings }
        csvHeaders.forEach((h, index) => {
          const lower = h.toLowerCase().replace(/[^a-z0-9_]/g, '')
          if (lower.includes('name') || lower === 'recipient') newMappings.recipient_name = index.toString()
          else if (lower.includes('email') || lower.includes('mail')) newMappings.recipient_email = index.toString()
          else if (lower.includes('event')) newMappings.event_name = index.toString()
          else if (lower.includes('program')) newMappings.program_name = index.toString()
          else if (lower.includes('issuedate') || lower.includes('issue') || lower === 'date') newMappings.issued_date = index.toString()
          else if (lower.includes('expiry') || lower.includes('expire')) newMappings.expiry_date = index.toString()
          else if (lower.includes('url') || lower.includes('link') || lower.includes('pdf') || lower.includes('file')) newMappings.pdf_url = index.toString()
          else if (lower.includes('visible') || lower.includes('show')) newMappings.is_visible = index.toString()
        })

        setMappings(newMappings)
        setStep(2)
      } catch (err) {
        setError('Failed to parse CSV file: ' + err.message)
      }
    }
    reader.readAsText(selectedFile)
  }

  const handleMappingChange = (field, value) => {
    setMappings(prev => ({ ...prev, [field]: value }))
  }

  const getMappedData = () => {
    return csvData.map(row => {
      const nameIdx = parseInt(mappings.recipient_name)
      const emailIdx = parseInt(mappings.recipient_email)
      const eventIdx = parseInt(mappings.event_name)
      const progIdx = parseInt(mappings.program_name)
      const issueIdx = parseInt(mappings.issued_date)
      const expIdx = parseInt(mappings.expiry_date)
      const urlIdx = parseInt(mappings.pdf_url)
      const visIdx = parseInt(mappings.is_visible)

      const isVisibleVal = visIdx >= 0 ? row[visIdx] : 'true'
      const isVisible = isVisibleVal.toLowerCase() === 'true' || isVisibleVal === '1' || isVisibleVal.toLowerCase() === 'yes'

      return {
        recipient_name: nameIdx >= 0 ? row[nameIdx] : '',
        recipient_email: emailIdx >= 0 ? row[emailIdx] : '',
        event_name: eventIdx >= 0 ? row[eventIdx] : '',
        program_name: progIdx >= 0 ? row[progIdx] : 'MIN Program',
        issued_date: issueIdx >= 0 ? row[issueIdx] : new Date().toISOString().split('T')[0],
        expiry_date: expIdx >= 0 ? row[expIdx] : '',
        pdf_url: urlIdx >= 0 ? row[urlIdx] : '',
        is_visible: isVisible
      }
    }).filter(item => !!item.recipient_name) // Name is required
  }

  const handleUpload = async () => {
    const dataToUpload = getMappedData()

    if (dataToUpload.length === 0) {
      setError('No valid records found to upload. Recipient Name is required.')
      return
    }

    const hasMissingUrls = dataToUpload.some(d => !d.pdf_url)
    if (hasMissingUrls) {
      if (!confirm('Some records are missing a certificate URL/PDF link. They will be created without certificate attachments. Proceed?')) {
        return
      }
    }

    setUploading(true)
    setError(null)
    setStep(3)

    try {
      const res = await fetch('/api/admin/certificates/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificates: dataToUpload })
      })

      const result = await res.json()
      if (res.ok) {
        setResults(result)
        onSuccess()
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (err) {
      setError(err.message)
      setStep(2)
    } finally {
      setUploading(false)
    }
  }

  const resetModal = () => {
    setFile(null)
    setCsvData([])
    setHeaders([])
    setStep(1)
    setResults(null)
    setError(null)
    setMappings({
      recipient_name: '',
      recipient_email: '',
      event_name: '',
      program_name: '',
      issued_date: '',
      expiry_date: '',
      pdf_url: '',
      is_visible: ''
    })
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-bg-dark border border-border dark:border-border-dark rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border dark:border-border-dark flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Bulk Upload Certificates</h3>
            <p className="text-xs text-auto-tertiary">Upload certificate rosters via CSV file.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-secondary dark:hover:bg-white/5 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-hide">
          {step === 1 && (
            <div className="space-y-6">
              {/* Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/20 hover:border-primary bg-primary/5 hover:bg-primary/10 rounded-[2rem] p-12 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center gap-4"
              >
                <Upload size={48} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <span className="text-sm font-bold block mb-1">Click to browse or drag & drop</span>
                  <span className="text-xs text-auto-tertiary">CSV files only (Max 5MB)</span>
                </div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* CSV Sample Template Instructions */}
              <div className="p-5 rounded-2xl bg-bg-secondary dark:bg-white/5 border border-border space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Info size={18} />
                  <span>CSV Formatting Guide</span>
                </div>
                <p className="text-xs text-auto-secondary leading-relaxed">
                  Your CSV should contain headers in the first row. We recommend using standard headers, but you can map custom headers on the next step:
                </p>
                <div className="overflow-x-auto text-[10px] font-mono bg-white dark:bg-black/20 p-3 rounded-xl border border-border text-auto-secondary">
                  recipient_name, recipient_email, event_name, program_name, issued_date, expiry_date, pdf_url, is_visible<br />
                  John Doe, john@example.com, JMOC 2026, Participant, 2026-06-15, , https://cloudinary.com/cert1.pdf, TRUE<br />
                  Jane Smith, jane@example.com, JMOC 2026, Vol, 2026-06-15, 2027-06-15, https://cloudinary.com/cert2.png, FALSE
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Mapping Selectors */}
              <div className="glass rounded-2xl p-6 border border-border space-y-4">
                <h4 className="font-bold text-sm">Map CSV Columns to Certificate Fields</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Recipient Name*', key: 'recipient_name', req: true },
                    { label: 'Recipient Email', key: 'recipient_email' },
                    { label: 'Event Name', key: 'event_name' },
                    { label: 'Program Name', key: 'program_name' },
                    { label: 'Issue Date', key: 'issued_date' },
                    { label: 'Expiry Date', key: 'expiry_date' },
                    { label: 'Certificate URL/PDF*', key: 'pdf_url', req: true },
                    { label: 'Visible (Auto Email)', key: 'is_visible' }
                  ].map(field => (
                    <div key={field.key} className="space-y-1">
                      <label className="text-xs font-bold text-auto-secondary">{field.label}</label>
                      <select
                        className="w-full bg-white dark:bg-white/5 border border-border dark:border-border-dark rounded-xl py-2 px-3 text-xs outline-none focus:border-primary transition-all bg-transparent font-medium"
                        value={mappings[field.key]}
                        onChange={(e) => handleMappingChange(field.key, e.target.value)}
                      >
                        <option value="">-- Don't Map / Default --</option>
                        {headers.map((h, index) => (
                          <option key={index} value={index}>{h}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Preview */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm">Preview Records ({csvData.length} entries found)</h4>
                <div className="border border-border dark:border-border-dark rounded-2xl overflow-hidden max-h-[30vh] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-bg-secondary dark:bg-white/5 border-b border-border z-10">
                      <tr className="font-bold text-auto-tertiary">
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Event</th>
                        <th className="px-4 py-3">Program</th>
                        <th className="px-4 py-3">Document URL</th>
                        <th className="px-4 py-3">Visible</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {getMappedData().slice(0, 10).map((row, i) => (
                        <tr key={i} className="hover:bg-bg-secondary/50">
                          <td className="px-4 py-3 font-semibold">{row.recipient_name}</td>
                          <td className="px-4 py-3 text-auto-tertiary">{row.recipient_email || 'N/A'}</td>
                          <td className="px-4 py-3">{row.event_name || 'N/A'}</td>
                          <td className="px-4 py-3">{row.program_name}</td>
                          <td className="px-4 py-3 font-mono truncate max-w-[150px] text-auto-tertiary" title={row.pdf_url}>
                            {row.pdf_url || <span className="text-coral">Missing</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.is_visible ? 'bg-green/10 text-green' : 'bg-primary/10 text-primary'}`}>
                              {row.is_visible ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvData.length > 10 && (
                    <div className="p-3 text-center text-[10px] text-auto-tertiary bg-bg-secondary/30 border-t border-border">
                      Showing first 10 of {csvData.length} records.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              {uploading ? (
                <>
                  <Loader2 size={48} className="text-primary animate-spin" />
                  <div>
                    <h4 className="text-lg font-bold">Uploading Certificates...</h4>
                    <p className="text-xs text-auto-tertiary mt-1">Please keep this window open while we insert records and send emails.</p>
                  </div>
                </>
              ) : results ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center text-green">
                    <CheckCircle size={36} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Import Completed!</h4>
                    <p className="text-xs text-auto-tertiary mt-1">
                      Successfully imported <strong className="text-green font-bold">{results.insertedCount}</strong> certificates.
                      {results.failedCount > 0 && (
                        <span> Failed: <strong className="text-coral font-bold">{results.failedCount}</strong> records.</span>
                      )}
                    </p>
                  </div>

                  {results.failures && results.failures.length > 0 && (
                    <div className="w-full text-left border border-border rounded-xl overflow-hidden max-h-[20vh] overflow-y-auto">
                      <div className="bg-coral/5 p-3 text-coral font-bold text-xs border-b border-border flex items-center gap-2">
                        <Warning size={16} />
                        <span>Failures list</span>
                      </div>
                      <div className="p-3 space-y-1 text-xs font-mono text-auto-secondary">
                        {results.failures.map((f, i) => (
                          <div key={i}>
                            Row #{i+1}: {f.item.recipient_name} - Error: {f.error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={resetModal}
                    className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
                  >
                    Upload Another File
                  </button>
                </>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border dark:border-border-dark flex items-center justify-between flex-shrink-0 bg-bg-secondary/40">
          <div>
            {step === 2 && (
              <button 
                onClick={() => setStep(1)}
                className="text-xs font-bold text-auto-secondary hover:text-text-primary transition-colors"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-bg-secondary dark:hover:bg-white/5 transition-all text-auto-tertiary"
            >
              Close
            </button>
            {step === 2 && (
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-primary/10 transition-all flex items-center gap-2"
              >
                {uploading && <Loader2 size={14} className="animate-spin" />}
                Confirm and Import
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
