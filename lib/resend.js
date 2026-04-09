// lib/resend.js
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send an email using Resend
 * @param {Object} options - { to, subject, html, attachments }
 */
export async function sendEmail({ to, subject, html, attachments = [] }) {
  return resend.emails.send({
    from: 'MIN Nepal <no-reply@mathsinitiatives.org.np>',
    to,
    subject,
    html,
    attachments
  })
}
