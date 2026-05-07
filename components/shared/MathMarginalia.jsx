'use client'

export default function MathMarginalia({ text, position = 'right', className = '' }) {
  return (
    <div
      className={`absolute pointer-events-none hidden lg:block ${className}`}
      style={{
        [position === 'right' ? 'right' : 'left']: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
      }}
    >
      <span className="text-[10px] font-mono tracking-widest text-text-tertiary-dynamic opacity-40">
        {text}
      </span>
    </div>
  )
}
