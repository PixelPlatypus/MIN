// lib/resend.js
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/server'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import { SYSTEM_EMAIL_TEMPLATES, inlineEmailStyles } from '@/lib/emailTemplates'

export const resend = new Resend(process.env.RESEND_API_KEY)


/**
 * Universal Branding Generator — MIN Nepal Email Container
 * High-fidelity, email-client compatible template with MIN Deep Teal branding (#16556D) and full social hub from site_settings.
 */
export const generateMINThemeEmail = (title, contentHtml, settings = {}) => {
  const facebook = settings?.facebook_url || 'https://www.facebook.com/MathematicsInitiativesNepal/'
  const instagram = settings?.instagram_url || 'https://www.instagram.com/min_nepal/'
  const youtube = settings?.youtube_url || 'https://www.youtube.com/@min-nepal'
  const linkedin = settings?.linkedin_url || 'https://np.linkedin.com/company/min-nepal'
  const twitter = settings?.twitter_url || ''
  const prodUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mathsinitiatives.org.np'
  const logoUrl = settings?.site_logo_url || 'https://szosktbhsgqnyvbxmprf.supabase.co/storage/v1/object/public/media/1776685607643-logo.png'

  // Official, email-client safe SVG brand glyphs rendered in MIN Deep Teal (#16556D)
  const svgFacebook = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#16556D"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
  const svgInstagram = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#16556D"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
  const svgLinkedin = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#16556D"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`
  const svgYoutube = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#16556D"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
  const svgTwitter = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#16556D"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
  const svgGlobe = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#16556D"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 2.059c3.962.497 7.159 3.518 7.828 7.441h-3.419c-.352-2.906-1.89-5.409-4.409-7.441zm-2 0c-2.519 2.032-4.057 4.535-4.409 7.441h-3.419c.669-3.923 3.866-6.944 7.828-7.441zm-8.882 9.441h4.041c-.089.816-.159 1.664-.159 2.5s.07 1.684.159 2.5h-4.041c-.105-.81-.177-1.644-.177-2.5s.072-1.69.177-2.5zm6.059 0h7.646c.108.814.177 1.647.177 2.5s-.069 1.686-.177 2.5h-7.646c-.108-.814-.177-1.647-.177-2.5s.069-1.686.177-2.5zm11.823 0h4.041c.105.81.177 1.644.177 2.5s-.072 1.69-.177 2.5h-4.041c.089-.816.159-1.664.159-2.5s-.07-1.684-.159-2.5zm-2.172 7c-.669 3.923-3.866 6.944-7.828 7.441 2.519-2.032 4.057-4.535 4.409-7.441h3.419zm-7.828 7.441c-3.962-.497-7.159-3.518-7.828-7.441h3.419c.352 2.906 1.89 5.409 4.409 7.441z"/></svg>`

  const socialLink = (href, svg, label) => href ? `
    <td style="padding: 0 5px;">
      <a href="${href}" target="_blank" title="${label}" style="display: inline-block; width: 38px; height: 38px; background-color: #F2F8FA; border-radius: 12px; text-align: center; line-height: 38px; text-decoration: none; border: 1px solid #D4EBF2; vertical-align: middle;">
        <span style="display: inline-block; vertical-align: middle; line-height: 0; padding-top: 10px;">${svg}</span>
      </a>
    </td>` : ''

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>${title || 'MIN Nepal'}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { padding: 24px 16px !important; border-radius: 12px !important; }
      .header-logo { width: 42px !important; height: 42px !important; }
    }
  </style>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F2F2F7; margin: 0; padding: 0; -webkit-text-size-adjust: none; width: 100% !important; color: #222225;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #F2F2F7;">
    <tr>
      <td align="center" style="padding: 40px 16px 48px 16px;">

        <!-- Email Main Card -->
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 28px rgba(22, 85, 109, 0.08); border: 1px solid #D4EBF2;">

          <!-- Top Gradient Accent Bar in MIN Deep Teal & Cyan -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #16556D 0%, #1A6B87 50%, #00CFE8 100%);"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding: 32px 40px 16px 40px; background: #FFFFFF;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="vertical-align: middle;">
                    <a href="${prodUrl}" target="_blank" style="text-decoration: none; display: inline-flex; align-items: center;">
                      <img src="${logoUrl}" alt="MIN Nepal" width="48" height="48" class="header-logo" style="display: inline-block; border: 0; vertical-align: middle; border-radius: 12px; object-fit: contain;" />
                    </a>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; padding: 5px 12px; background-color: #E8F4F8; color: #16556D; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 8px; border: 1px solid #BCE1EE;">
                      Official Notice
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Organization Subheader in Deep Teal -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="border-bottom: 1px solid #E8F4F8; padding-bottom: 14px;">
                    <p style="margin: 0; font-size: 14px; font-weight: 800; color: #0D3D52; letter-spacing: -0.01em;">Mathematics Initiatives in Nepal</p>
                    <p style="margin: 3px 0 0 0; font-size: 11px; color: #1A6B87; font-weight: 600;">Democratizing mathematical excellence & Olympiad training across Nepal</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td style="padding: 10px 40px 36px 40px; color: #222225; font-size: 15px; line-height: 1.75;">
              ${title ? `<h1 style="color: #0D3D52; font-size: 24px; font-weight: 800; margin: 0 0 20px 0; letter-spacing: -0.03em; line-height: 1.25;">${title}</h1>` : ''}
              <div style="color: #222225; font-size: 15px; line-height: 1.75;">
                ${inlineEmailStyles(contentHtml)}
              </div>
            </td>
          </tr>

          <!-- Footer Section in MIN Theme -->
          <tr>
            <td style="padding: 28px 40px 32px 40px; background-color: #F8FCFD; border-top: 1px solid #E8F4F8;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 800; color: #0D3D52; letter-spacing: -0.01em;">Mathematics Initiatives in Nepal (MIN)</p>
                    <p style="margin: 0 0 18px 0; font-size: 11px; color: #55555A; font-weight: 500;">A student-led, non-profit academic organization dedicated to fostering mathematical excellence.</p>

                    <!-- Social Network Channel Icons in Deep Teal -->
                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 20px;">
                      <tr>
                        ${socialLink(facebook, svgFacebook, 'Facebook')}
                        ${socialLink(instagram, svgInstagram, 'Instagram')}
                        ${socialLink(linkedin, svgLinkedin, 'LinkedIn')}
                        ${socialLink(youtube, svgYoutube, 'YouTube')}
                        ${socialLink(twitter, svgTwitter, 'Twitter / X')}
                        ${socialLink(prodUrl, svgGlobe, 'Official Website')}
                      </tr>
                    </table>

                    <p style="margin: 0; font-size: 11px; color: #55555A; line-height: 1.6;">
                      Kathmandu, Nepal · <a href="${prodUrl}" target="_blank" style="color: #16556D; text-decoration: none; font-weight: 700;">mathsinitiatives.org.np</a><br />
                      You received this email because you applied or interacted with MIN Nepal.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Outside Card Sub-footer -->
        <table width="600" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="padding: 20px 16px; text-align: center;">
              <p style="margin: 0; color: #55555A; font-size: 11px; font-weight: 600;">
                © ${new Date().getFullYear()} Mathematics Initiatives in Nepal. All rights reserved.
              </p>
              <p style="margin: 6px 0 0 0; color: #77777D; font-size: 11px;">
                <a href="${prodUrl}/about/privacy" target="_blank" style="color: #16556D; text-decoration: none; margin: 0 6px; font-weight: 600;">Privacy Policy</a> · 
                <a href="${prodUrl}/about/terms" target="_blank" style="color: #16556D; text-decoration: none; margin: 0 6px; font-weight: 600;">Terms of Service</a> · 
                <a href="${prodUrl}/join" target="_blank" style="color: #16556D; text-decoration: none; margin: 0 6px; font-weight: 600;">Join Us</a>
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * Core Send Helper
 */
export async function sendEmail({ to, subject, html, attachments = [], from }) {

  return resend.emails.send({
    from: from || 'MIN Nepal <website@mathsinitiatives.org.np>',
    to,
    subject,
    html,
    attachments
  })
}

/**
 * Unified Templated Email Dispatcher
 */
export async function sendTemplatedEmail(eventKey, to, variables = {}) {
  try {
    const supabase = await createAdminClient()
    const [settingsRes, templateRes] = await Promise.all([
      supabase.from('site_settings').select('*').eq('id', 'main').single(),
      supabase.from('email_templates').select('*').eq('id', eventKey).single()
    ])

    const settings = settingsRes.data || {}
    const dbTemplate = templateRes.data

    const defaultTemplate = SYSTEM_EMAIL_TEMPLATES.find(t => t.id === eventKey) || {
      subject: 'Notification from MIN Nepal',
      body_markdown: `Hello {{applicant_name}},\n\nThis is a notification regarding your request.`,
      from_name: 'Mathematics Initiatives in Nepal',
      from_email: 'website@mathsinitiatives.org.np'
    }

    let subject = dbTemplate?.subject || defaultTemplate.subject
    let bodyMarkdown = dbTemplate?.body_markdown || defaultTemplate.body_markdown
    const fromName = dbTemplate?.from_name || defaultTemplate.from_name || 'Mathematics Initiatives in Nepal'
    const fromEmail = dbTemplate?.from_email || defaultTemplate.from_email || 'website@mathsinitiatives.org.np'

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(regex, value ?? '')
      bodyMarkdown = bodyMarkdown.replace(regex, value ?? '')
    })

    const bodyHtml = await marked.parse(bodyMarkdown)
    
    // Sanitize HTML to prevent XSS
    const cleanHtml = sanitizeHtml(bodyHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tbody', 'tr', 'td', 'th', 'thead'])
    })

    const finalHtml = generateMINThemeEmail(null, cleanHtml, settings || {})

    return sendEmail({
      to,
      subject,
      html: finalHtml,
      from: `${fromName} <${fromEmail}>`
    })
  } catch (err) {
    console.error(`Error sending templated email (${eventKey}):`, err)
    return null
  }
}

/**
 * Send Certificate Email
 */
export async function sendCertificateEmail({ to, recipientName, eventName, certUuid, issuedDate }) {
  try {
    const supabase = await createAdminClient()
    const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 'main').single()

    const title = 'Certificate Issued'
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mathsinitiatives.org.np'
    const verificationLink = `${appUrl}/verify/${certUuid}`

    const bodyMarkdown = `## Congratulations, ${recipientName}!

Thank you for your involvement and support for the event **${eventName}**.

Your official certificate has been issued. You can verify and view your certificate online.

### Certificate Details:
- **Recipient:** ${recipientName}
- **Event Name:** ${eventName}
- **Issue Date:** ${new Date(issuedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
- **Certificate ID:** \`${certUuid}\`

<div style="margin-top: 30px; margin-bottom: 30px;">
  <a href="${verificationLink}" target="_blank" style="display: inline-block; background-color: #0066cc; color: #ffffff; font-weight: 700; font-size: 16px; padding: 14px 28px; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2); transition: all 0.2s;">
    Verify & View Certificate
  </a>
</div>

Thank you for supporting mathematics education in Nepal!
`
    const bodyHtml = await marked.parse(bodyMarkdown)
    
    const cleanHtml = sanitizeHtml(bodyHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'a']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'a': ['href', 'target', 'style'],
        'div': ['style']
      }
    })

    const finalHtml = generateMINThemeEmail(title, cleanHtml, settings || {})

    return sendEmail({
      to,
      subject: `🎓 Certificate Issued: ${eventName} — MIN Nepal`,
      html: finalHtml,
      from: 'MIN Nepal <website@mathsinitiatives.org.np>'
    })
  } catch (err) {
    console.error('Error sending certificate email:', err)
    return null
  }
}

