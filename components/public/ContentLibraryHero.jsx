'use client'
import Link from 'next/link'
import { PencilLine as Sparkles, Books as Library } from '@phosphor-icons/react'
import PageHero from '@/components/public/PageHero'

export default function ContentLibraryHero() {
  return (
    <PageHero
      eyebrow="Library"
      icon={<Library size={16} weight="bold" />}
      title="Knowledge & Resources"
      description="Articles, problems and study resources for students and teachers, written and selected by the MIN team."
    >
      <Link href="/submit-content" className="btn-brand">
        <Sparkles size={18} />
        Contribute Your Knowledge
      </Link>
    </PageHero>
  )
}
