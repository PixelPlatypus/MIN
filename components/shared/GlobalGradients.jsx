'use client'

export default function GlobalGradients() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Top Right - Teal */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[80px] md:blur-[160px] -mr-32 md:-mr-64 -mt-16 md:-mt-32 will-change-transform" />
      
      {/* Middle Left - Yellow */}
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[70px] md:blur-[140px] -ml-24 md:-ml-48 -translate-y-1/2 will-change-transform" />
      
      {/* Bottom Right - Teal */}
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] md:w-[700px] md:h-[700px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[80px] md:blur-[160px] -mr-24 md:-mr-48 -mb-16 md:-mb-32 will-change-transform" />
    </div>
  )
}
