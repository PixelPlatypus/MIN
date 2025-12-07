'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ClientOnly } from '@/components/client-only';
import { MinFloatingElements } from '@/components/ui/min-floating-elements';

type Result = {
  studentName: string;
  studentEmail?: string | null;
  studentGrade?: string | null;
  studentSection?: string | null;
  score: number;
  percentage: number | null;
  timeSpent: number | null;
  timestamp: string;
};

export default function TestPrepResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/testprep-results');
        if (!res.ok) throw new Error('Failed to load results');
        const data = await res.json();
        const sorted = [...data].sort((a: Result, b: Result) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setResults(sorted);
      } catch (e: any) {
        setError(e?.message || 'Error loading results');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toCSV = (rows: Result[]) => {
    const header = ['Student','Email','Grade','Section','Score','Percentage','TimeSpentSeconds','Timestamp'];
    const esc = (v: any) => {
      const s = v == null ? '' : String(v);
      const e = s.replace(/"/g, '""');
      return '"' + e + '"';
    };
    const lines = [header.join(',')].concat(rows.map(r => [
      esc(r.studentName),
      esc(r.studentEmail ?? ''),
      esc(r.studentGrade ?? ''),
      esc(r.studentSection ?? ''),
      esc(r.score),
      esc(r.percentage != null ? r.percentage : ''),
      esc(r.timeSpent != null ? r.timeSpent : ''),
      esc(r.timestamp)
    ].join(',')));
    return lines.join('\n');
  };

  const handleDownloadCSV = () => {
    if (results.length === 0) return;
    setDownloading(true);
    try {
      const csv = toCSV(results);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().slice(0,10);
      a.href = url;
      a.download = `trinity-results-${date}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (deleting) return;
    const ok = typeof window !== 'undefined' ? window.confirm('Delete all stored results? This cannot be undone.') : true;
    if (!ok) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/testprep-results', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: deletePassword }) });
      if (!res.ok) {
        setDeleteError('Incorrect password');
        return;
      }
      setDeleteError(null);
      try { localStorage.removeItem('trinityExamResults'); } catch {}
      setResults([]);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <ClientOnly>
        <MinFloatingElements />
      </ClientOnly>
      <Navigation />
      <div className="min-h-screen flex flex-col items-center justify-start p-4 pt-24 relative z-10">
        <div className="glassmorphic-card p-8 rounded-lg shadow-lg w-full max-w-5xl text-white">
          <h1 className="text-3xl font-bold mb-6 min-gradient-accent">TestPrep Results</h1>
          <div className="flex justify-end mb-4 gap-3">
            <button
              onClick={handleDownloadCSV}
              disabled={loading || results.length === 0 || downloading}
              className="btn-min-primary px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {downloading ? 'Preparing...' : 'Download CSV'}
            </button>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter password"
              className="px-3 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-min-accent"
            />
            <button
              onClick={handleDeleteAll}
              disabled={loading || deleting || deletePassword.trim().length === 0}
              className="btn-min-accent px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Delete All Results'}
            </button>
          </div>
          {deleteError && <div className="text-red-400 mb-2">{deleteError}</div>}
          {loading && <div className="text-white/80">Loading...</div>}
          {error && <div className="text-red-400">{error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-transparent text-white min-gradient-border">
                <thead>
                  <tr className="bg-gray-700 bg-opacity-50">
                    <th className="px-4 py-2 border-b border-gray-600 text-left">Student</th>
                    <th className="px-4 py-2 border-b border-gray-600 text-left">Email</th>
                    <th className="px-4 py-2 border-b border-gray-600 text-left">Grade</th>
                    <th className="px-4 py-2 border-b border-gray-600 text-left">Section</th>
                    <th className="px-4 py-2 border-b border-gray-600 text-left">Score</th>
                    <th className="px-4 py-2 border-b border-gray-600 text-left">Percentage</th>
                    <th className="px-4 py-2 border-b border-gray-600 text-left">Time Spent</th>
                    <th className="px-4 py-2 border-b border-gray-600 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-white/70" colSpan={5}>No results yet.</td>
                    </tr>
                  ) : (
                    results.map((r, i) => (
                      <tr className="border-b border-gray-700" key={`${r.studentName}-${r.timestamp}-${i}`}>
                        <td className="px-4 py-2">{r.studentName}</td>
                        <td className="px-4 py-2">{r.studentEmail ?? '—'}</td>
                        <td className="px-4 py-2">{r.studentGrade ?? '—'}</td>
                        <td className="px-4 py-2">{r.studentSection ?? '—'}</td>
                        <td className="px-4 py-2">{r.score}</td>
                        <td className="px-4 py-2">{r.percentage != null ? `${r.percentage}%` : '—'}</td>
                        <td className="px-4 py-2">{r.timeSpent != null ? `${Math.floor(r.timeSpent / 60)}m ${r.timeSpent % 60}s` : '—'}</td>
                        <td className="px-4 py-2">{new Date(r.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style jsx>{`
        .glassmorphic-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
