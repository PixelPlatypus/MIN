// lib/resend.js
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const generateMINThemeEmail = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 20px; text-align: center; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); text-align: left; }
    .logo { width: 140px; margin-bottom: 30px; display: block; }
    .title { color: #111111; font-size: 24px; font-weight: 900; margin-bottom: 20px; letter-spacing: -0.02em; }
    .content { color: #444444; font-size: 16px; line-height: 1.6; font-weight: 500; }
    .content a { color: #4361ee; font-weight: 700; text-decoration: none; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; color: #888888; font-size: 12px; text-align: center; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://mathsinitiatives.org.np/images/logo.svg" alt="MIN Nepal Logo" class="logo" />
    <h1 class="title">${title}</h1>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      Mathematics Initiatives Nepal (MIN)
    </div>
  </div>
</body>
</html>
`

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
