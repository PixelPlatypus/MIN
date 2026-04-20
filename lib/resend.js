// lib/resend.js
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/server'
import { marked } from 'marked'

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

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 40px 20px; color: #333333; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 40px; padding: 56px; box-shadow: 0 40px 100px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.02); }
    .logo { width: 110px; margin-bottom: 48px; display: block; border: 0; outline: none; }
    .title { color: #111111; font-size: 32px; font-weight: 900; margin-bottom: 24px; letter-spacing: -0.04em; line-height: 1.1; }
    .content { font-size: 17px; line-height: 1.8; font-weight: 500; color: #4b5563; }
    .content a { color: #4361ee; font-weight: 700; text-decoration: none; border-bottom: 2px solid rgba(67, 97, 238, 0.15); }
    .content h1, .content h2, .content h3 { color: #111111; margin-top: 40px; margin-bottom: 20px; font-weight: 900; letter-spacing: -0.03em; }
    .content p { margin-bottom: 24px; }
    .content blockquote { border-left: 6px solid #4361ee; background: #f8faff; padding: 24px 32px; margin: 32px 0; font-style: italic; border-radius: 0 20px 20px 0; color: #1f2937; }
    
    .signature { margin-top: 64px; padding-top: 48px; border-top: 2px solid #f3f4f6; }
    .sig-text { font-size: 18px; font-weight: 900; color: #111827; margin-bottom: 8px; letter-spacing: -0.02em; }
    .sig-sub { font-size: 14px; color: #6b7280; margin-bottom: 32px; font-weight: 500; line-height: 1.5; }
    
    .social-links { margin-top: 32px; font-size: 0; }
    .social-icon { display: inline-block; width: 44px; height: 44px; background-color: #000000; border-radius: 14px; text-align: center; margin-right: 12px; margin-bottom: 12px; border: 0; vertical-align: middle; }
    .social-icon img { width: 20px; height: 20px; margin-top: 12px; vertical-align: top; }
    
    .footer { margin-top: 64px; text-align: center; color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; font-weight: 800; }
  </style>
</head>
<body>
  <div class="container">
    <a href="${prodUrl}">
      <img src="https://res.cloudinary.com/dtp4tasmk/image/upload/v1776674320/logo_daehfx.png" alt="MIN Nepal" class="logo" />
    </a>
    
    ${title ? `<h1 class="title">${title}</h1>` : ''}
    
    <div class="content">
      ${contentHtml}
    </div>

    <div class="signature">
      <div class="sig-text">Mathematics Initiatives in Nepal (MIN)</div>
      <div class="sig-sub">Changing the face of mathematics education in Nepal.</div>
      
      <div class="social-links" style="margin-top: 32px; font-size: 0;">
        ${facebook ? `<a href="${facebook}" style="display: inline-block; width: 44px; height: 44px; background-color: #f9fafb; border-radius: 14px; text-align: center; margin-right: 12px; margin-bottom: 12px; vertical-align: middle; border: 1px solid #f3f4f6;"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="FB" style="width: 20px; height: 20px; margin-top: 12px;" /></a>` : ''}
        ${instagram ? `<a href="${instagram}" style="display: inline-block; width: 44px; height: 44px; background-color: #f9fafb; border-radius: 14px; text-align: center; margin-right: 12px; margin-bottom: 12px; vertical-align: middle; border: 1px solid #f3f4f6;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="IG" style="width: 20px; height: 20px; margin-top: 12px;" /></a>` : ''}
        ${linkedin ? `<a href="${linkedin}" style="display: inline-block; width: 44px; height: 44px; background-color: #f9fafb; border-radius: 14px; text-align: center; margin-right: 12px; margin-bottom: 12px; vertical-align: middle; border: 1px solid #f3f4f6;"><img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LI" style="width: 20px; height: 20px; margin-top: 12px;" /></a>` : ''}
        ${youtube ? `<a href="${youtube}" style="display: inline-block; width: 44px; height: 44px; background-color: #f9fafb; border-radius: 14px; text-align: center; margin-right: 12px; margin-bottom: 12px; vertical-align: middle; border: 1px solid #f3f4f6;"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YT" style="width: 20px; height: 20px; margin-top: 12px;" /></a>` : ''}
        <a href="${prodUrl}" style="display: inline-block; width: 44px; height: 44px; background-color: #f9fafb; border-radius: 14px; text-align: center; margin-right: 12px; margin-bottom: 12px; vertical-align: middle; border: 1px solid #f3f4f6;"><img src="https://cdn-icons-png.flaticon.com/512/1356/1356479.png" alt="WEB" style="width: 20px; height: 20px; margin-top: 12px;" /></a>
      </div>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Mathematics Initiatives in Nepal • Kathmandu, Nepal
    </div>
  </div>
</body>
</html>
`
}

/**
 * Core Send Helper
 */
export async function sendEmail({ to, subject, html, attachments = [], from }) {

  return resend.emails.send({
    from: from || 'MIN Nepal <no-reply@mathsinitiatives.org.np>',
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
      }
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
    const { default: DOMPurify } = await import('isomorphic-dompurify')
    const cleanHtml = DOMPurify.sanitize(bodyHtml)

    const finalHtml = generateMINThemeEmail(null, cleanHtml, settings || {})

    return sendEmail({
      to,
      subject,
      html: finalHtml,
      from: 'MIN Nepal <no-reply@mathsinitiatives.org.np>'
    })
  } catch (err) {
    console.error(`Error sending templated email (${eventKey}):`, err)
    return null
  }
}
