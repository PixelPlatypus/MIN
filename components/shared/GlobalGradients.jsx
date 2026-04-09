'use client'

export default function GlobalGradients() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Top Right - Teal */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[160px] -mr-64 -mt-32" />
      
      {/* Middle Left - Yellow */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[140px] -ml-48 -translate-y-1/2" />
      
      {/* Bottom Right - Teal */}
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[160px] -mr-48 -mb-32" />
    </div>
  )
}
