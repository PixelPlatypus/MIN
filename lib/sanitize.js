import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML from the database before rendering with dangerouslySetInnerHTML.
 * Allows safe subset of tags and attributes for rich text content.
 */
export function sanitizeHtml(dirty) {
  if (!dirty) return ''
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'b', 'i', 'u', 's', 'sub', 'sup', 'mark',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
      'figure', 'figcaption',
      'iframe', // YouTube embeds
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'width', 'height', 'loading',
      'class', 'style',
      'colspan', 'rowspan',
      'frameborder', 'allow', 'allowfullscreen', 'title',
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    // Allow YouTube iframe embeds
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder'],
  })
}
