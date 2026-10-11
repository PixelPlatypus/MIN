// Eyebrow + heading + lead, used at the top of every content section
export default function SectionHeader({ eyebrow, title, description, align = 'center', className = '' }) {
  const centered = align === 'center'
  return (
    <div className={`space-y-4 mb-12 md:mb-16 ${centered ? 'text-center' : ''} ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {title && <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h2>}
      {description && (
        <p className={`text-lg text-auto-secondary max-w-2xl leading-relaxed ${centered ? 'mx-auto' : ''}`}>{description}</p>
      )}
    </div>
  )
}
