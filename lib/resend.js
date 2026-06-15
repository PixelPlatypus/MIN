// lib/resend.js
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/server'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Universal Branding Generator
 */
export const generateMINThemeEmail = (title, contentHtml, settings = {}) => {
  const facebook = settings?.facebook_url || 'https://facebook.com/mathsinitiatives'
  const instagram = settings?.instagram_url || 'https://instagram.com/mathsinitiatives'
  const youtube = settings?.youtube_url || 'https://youtube.com/@mathsinitiatives'
  const linkedin = settings?.linkedin_url || 'https://linkedin.com/company/mathsinitiatives'
  const prodUrl = 'https://www.mathsinitiatives.org.np'
  const logoUrl = 'https://www.mathsinitiatives.org.np/images/logo.png'

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>${title || 'Notification'}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { padding: 30px 15px !important; border-radius: 0 !important; }
      .logo { margin-bottom: 30px !important; }
      .title { font-size: 26px !important; }
    }
  </style>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 0; -webkit-text-size-adjust: none; width: 100% !important;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f8fafc;">
    <tr>
      <td align="center">
        <table class="container" width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #eef2f6;">
          <tr>
            <td style="padding: 50px 40px;">
              <!-- Logo -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="left">
                    <a href="${prodUrl}" target="_blank">
                      <img src="${logoUrl}" alt="MIN Nepal" width="120" style="display: block; border: 0; margin-bottom: 40px;" />
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              ${title ? `<h1 style="color: #0f172a; font-size: 32px; font-weight: 900; margin: 0 0 24px 0; letter-spacing: -0.04em; line-height: 1.1;">${title}</h1>` : ''}
              
              <!-- Content -->
              <div style="color: #334155; font-size: 16px; line-height: 1.6; font-weight: 500;">
                ${contentHtml}
              </div>

              <!-- Signature -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top: 50px; padding-top: 40px; border-top: 1px solid #f1f5f9;">
                <tr>
                  <td>
                    <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em;">Mathematics Initiatives in Nepal (MIN)</p>
                    <p style="margin: 0 0 30px 0; font-size: 14px; color: #64748b; font-weight: 500;">Transforming mathematics education across the nation.</p>
                    
                    <!-- Social Links -->
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding-right: 12px;">
                          <a href="${facebook}" target="_blank" style="display: inline-block; width: 40px; height: 40px; background-color: #f1f5f9; border-radius: 12px; text-align: center;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="FB" width="20" height="20" style="margin-top: 10px; border: 0;" />
                          </a>
                        </td>
                        <td style="padding-right: 12px;">
                          <a href="${instagram}" target="_blank" style="display: inline-block; width: 40px; height: 40px; background-color: #f1f5f9; border-radius: 12px; text-align: center;">
                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="IG" width="20" height="20" style="margin-top: 10px; border: 0;" />
                          </a>
                        </td>
                        <td style="padding-right: 12px;">
                          <a href="${linkedin}" target="_blank" style="display: inline-block; width: 40px; height: 40px; background-color: #f1f5f9; border-radius: 12px; text-align: center;">
                            <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LI" width="20" height="20" style="margin-top: 10px; border: 0;" />
                          </a>
                        </td>
                        <td style="padding-right: 12px;">
                          <a href="${youtube}" target="_blank" style="display: inline-block; width: 40px; height: 40px; background-color: #f1f5f9; border-radius: 12px; text-align: center;">
                            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YT" width="20" height="20" style="margin-top: 10px; border: 0;" />
                          </a>
                        </td>
                        <td>
                          <a href="${prodUrl}" target="_blank" style="display: inline-block; width: 40px; height: 40px; background-color: #f1f5f9; border-radius: 12px; text-align: center;">
                            <img src="https://cdn-icons-png.flaticon.com/512/1356/1356479.png" alt="WEB" width="20" height="20" style="margin-top: 10px; border: 0;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Footer -->
        <table width="600" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="padding: 30px; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
                © ${new Date().getFullYear()} Mathematics Initiatives in Nepal • Kathmandu, Nepal
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
    const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 'main').single()

    const templates = {
      'submission_received': {
        subject: 'Submission Received — MIN Nepal',
        body: `## Hello {{applicant_name}},\n\nThank you for reaching out to **Mathematics Initiatives in Nepal (MIN)**. We have received your **{{content_title}}** and our team will review it shortly.\n\nWe appreciate your interest in supporting mathematics education in Nepal!`
      },
      'application_accepted': {
        subject: '🎉 Congratulations! Your Application to MIN Nepal',
        body: `## Welcome to the MIN Family, {{applicant_name}}!\n\nWe are absolutely thrilled to let you know that your application to join **Mathematics Initiatives in Nepal (MIN)** has been **accepted**.\n\nOur team coordinators will be reaching out to you shortly with the next steps and onboarding details.\n\nWelcome aboard!`
      },
      'application_rejected': {
        subject: 'Thank you for your interest in MIN Nepal',
        body: `## Dear {{applicant_name}},\n\nThank you for applying to join MIN Nepal. After careful consideration, we have decided to move forward with other candidates at this time.\n\nWe appreciate your passion and encourage you to apply again in the future.`
      },
      'content_approved': {
        subject: '✅ Your Submission Has Been Published — MIN Nepal',
        body: `## Great news, {{applicant_name}}!\n\nYour submission titled **"{{content_title}}"** has been reviewed and **approved** by the MIN editorial team.\n\nIt is now live on our platform. Thank you for contributing to mathematics education in Nepal!`
      },
      'inquiry_received': {
        subject: 'We received your message — MIN Nepal',
        body: `## Thank you for reaching out, {{applicant_name}}!\n\nWe have received your message and will get back to you as soon as possible, usually within 3-5 business days.\n\n**Your Message:**\n> {{contact_message}}`
      },
      'inquiry_responded': {
        subject: 'Response to your inquiry — MIN Nepal',
        body: `## Hello {{applicant_name}},\n\nThank you for your patience. One of our coordinators has reviewed your inquiry and will be in touch with you shortly relative to your message:\n\n> {{contact_message}}`
      },
      'org_submission': {
        subject: 'Organization Application Received — MIN Nepal',
        body: `## Hello {{applicant_name}},\n\nWe have received your organization's application to collaborate with MIN Nepal. Our team will review the details and get back to you soon.`
      },
      'org_accepted': {
        subject: '🎉 Organization Partnership Accepted — MIN Nepal',
        body: `## Welcome, {{applicant_name}}!\n\nWe are excited to inform you that your organization's application has been **accepted**. We look forward to a fruitful collaboration!`
      },
      'org_rejected': {
        subject: 'Update regarding your Organization Application — MIN Nepal',
        body: `## Dear {{applicant_name}},\n\nThank you for reaching out to **Mathematics Initiatives in Nepal (MIN)** with an interest in organizational collaboration.\n\nAfter reviewing the details of your application, we have decided not to move forward with this specific partnership at this time. We appreciate the work your organization is doing and wish you the best in your future endeavors.`
      },
      'ambassadorship_submission': {
        subject: 'Ambassador Application Received — MIN Nepal',
        body: `## Hello {{applicant_name}},\n\nThank you for applying to the **MIN Ambassador Program**. We are excited to see your interest in representing and promoting mathematics in your institution/community.\n\nOur team is reviewing your application and will get back to you with the next steps soon.`
      },
      'ambassadorship_accepted': {
        subject: '🎉 Congratulations! You are now a MIN Ambassador',
        body: `## Welcome aboard, {{applicant_name}}!\n\nWe are thrilled to inform you that your application for the **MIN Ambassador Program** has been **accepted**.\n\nAs a MIN Ambassador, you will play a key role in our mission to transform mathematics education. Our program coordinators will be in touch with you shortly with your ambassador toolkit and onboarding details.\n\nLet's make mathematics engaging together!`
      },
      'ambassadorship_rejected': {
        subject: 'Update on your MIN Ambassador Application',
        body: `## Dear {{applicant_name}},\n\nThank you for your interest in the MIN Ambassador Program and for taking the time to share your passion for mathematics with us.\n\nAfter a careful review of our current needs and the high number of applications we've received, we are unable to offer you an ambassador role at this time.\n\nWe encourage you to stay connected with MIN through our events and other programs, and we wish you all the best in your mathematical journey.`
      },
      'application_received': { 
        subject: 'We received your application — MIN Nepal',
        body: `## Hello {{applicant_name}},\n\nThank you for your interest in joining **Mathematics Initiatives in Nepal (MIN)**. We have received your application.\n\nOur team is currently reviewing all submissions and we will get back to you soon.`
      },
      'intake_reopened': {
        subject: '🚀 Intake is now OPEN — MIN Nepal',
        body: `## Good News, {{applicant_name}}!\n\nYou asked us to notify you when the **{{form_name}}** intake opens, and that time is now.\n\nApplications are officially being accepted for the current batch. We encourage you to submit yours while the window is open!\n\n**Apply Here:** https://www.mathsinitiatives.org.np/join/{{slug}}`
      },
      'reminder_confirmed': {
        subject: 'Alert Request Received — MIN Nepal',
        body: `## Hello,\n\nWe have received your request to be notified when the **{{form_name}}** intake opens.\n\nWe will send you an email at this address as soon as we start accepting new applications. Thank you for your interest in joining **Mathematics Initiatives in Nepal (MIN)**!`
      },
      // --- Admin Templates ---
      'admin_error_report': {
        subject: '🚨 System Error: {{error_name}}',
        body: `### Error Detected on MIN Website\n\n**URL:** {{url}}\n**Type:** {{error_name}}\n**Message:** {{error_message}}\n\n**Stack Trace:**\n\`\`\`\n{{error_stack}}\n\`\`\``
      },
      'admin_new_application': {
        subject: '📩 New {{form_title}}: {{applicant_name}}',
        body: `### New {{form_title}} Submission\n\n**From:** {{applicant_name}} ({{applicant_email}})\n**Category:** {{category}}\n\n**Submission Data:**\n{{form_data_summary}}\n\n[View in Admin Panel]({{admin_url}})`
      },
      'admin_new_submission': {
        subject: '📝 New Content: "{{content_title}}"',
        body: `### New Content Submission Received\n\n**Title:** {{content_title}}\n**From:** {{submitter_name}} ({{submitter_email}})\n**Type:** {{content_type}}\n\n[Review Submission]({{admin_url}})`
      },
      /*
      'admin_waitlist_entry': {
        subject: '⏳ New Waitlist: {{category}}',
        body: `### New Waitlist Signup\n\n**Email:** {{email}}\n**Category:** {{category}}\n\n[Manage Waitlist]({{admin_url}})`
      }
      */
    }

    const template = templates[eventKey] || { 
      subject: 'Notification from MIN Nepal',
      body: `Hello {{applicant_name}},\n\nThis is a notification regarding your request.`
    }

    let subject = template.subject
    let bodyMarkdown = template.body

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(regex, value || '')
      bodyMarkdown = bodyMarkdown.replace(regex, value || '')
    })

    const bodyHtml = await marked.parse(bodyMarkdown)
    
    // Sanitize HTML to prevent XSS
    const cleanHtml = sanitizeHtml(bodyHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    })

    const finalHtml = generateMINThemeEmail(null, cleanHtml, settings || {})

    return sendEmail({
      to,
      subject,
      html: finalHtml,
      from: 'MIN Nepal <website@mathsinitiatives.org.np>'
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

