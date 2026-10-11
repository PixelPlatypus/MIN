// Canonical site identity for SEO/AEO: metadata, sitemap, robots, JSON-LD, llms.txt.
// Always the production www host (the apex domain redirects here), even in dev/preview,
// so canonicals never point at a redirect. Emails/auth links keep using NEXT_PUBLIC_APP_URL.
export const SITE_URL = 'https://www.mathsinitiatives.org.np'

export const SITE_NAME = 'Mathematics Initiatives in Nepal'

// Meta description: keep under ~160 characters.
export const SITE_DESCRIPTION =
  'A nonprofit making mathematics accessible and fun for every student in Nepal, taught as a tool for life. We also run Olympiad training, workshops and events.'

export const SITE_SHORT_DESCRIPTION = 'Making mathematics accessible and fun for every student in Nepal.'

// Longer summary for structured data and AI assistants.
export const SITE_SUMMARY =
  'Mathematics Initiatives in Nepal (MIN) is a nonprofit that makes mathematics accessible and fun for students across Nepal and teaches it as a practical tool for everyday life. MIN also runs Olympiad training, workshops and events.'

export const SOCIAL_LINKS = [
  'https://www.facebook.com/mathsinitiatives',
  'https://www.instagram.com/minnepal',
  'https://www.youtube.com/@mathsinitiatives',
]
