import nodemailer from 'nodemailer';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Helper function to send certificate email to the user
async function sendUserCertificateEmail(transporter: nodemailer.Transporter, email: string, name: string, shareableLink: string) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your Certificate is Ready | MIN',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a5568;">Congratulations, ${name}!</h2>
        <p>Your certificate is ready to view and download.</p>
        <p>Click the link below to access your certificate:</p>
        <p><a href="${shareableLink}" style="color: #3182ce; text-decoration: underline;">View Certificate</a></p>
        <p>Best regards,<br/>The MIN Team</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

// Helper function to send notification email to the admin
async function sendAdminNotificationEmail(transporter: nodemailer.Transporter, name: string, email: string, appShareableLink: string, vercelBlobUrl: string) {
  const adminMailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.CERTIFICATE_EMAIL,
    subject: 'New Certificate Uploaded',
    html: `
      <p>A new certificate has been uploaded for ${name} (${email}).</p>
      <p>Shareable Link: <a href="${appShareableLink}">${appShareableLink}</a></p>
      <p>Blob Link: <a href="${vercelBlobUrl}">${vercelBlobUrl}</a></p>
      <p>Please note: The Shareable Link is for public access, and the Blob Link is for direct storage access.</p>
    `
  };
  await transporter.sendMail(adminMailOptions);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const certificate = formData.get('certificate') as File;
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const minnionId = formData.get('minnionId') as string;

    console.log('Received upload certificate data:', { email, name, minnionId, certificate: certificate ? certificate.name : 'No file' });

    // 1. Validate incoming data
    if (!certificate || !email || !name || !minnionId) {
      console.error('Validation Error: Missing required fields.');
      return NextResponse.json(
        { message: 'Missing required fields. Please provide certificate file, email, name, and MINnion ID.' },
        { status: 400 }
      );
    }

    // 2. Upload certificate to Vercel Blob Storage
    const bytes = await certificate.arrayBuffer();
    const blobFilename = `${minnionId}.pdf`;
    console.log(`Attempting to upload blob with filename: ${blobFilename}`);
    const blob = await put(blobFilename, bytes, { access: 'public', addRandomSuffix: false });
    const vercelBlobUrl = blob.url;
    const appShareableLink = `${process.env.NEXT_PUBLIC_BASE_URL}/certificate/${minnionId}.pdf`;
    console.log(`Certificate uploaded successfully. App Shareable link: ${appShareableLink}`);
    console.log(`Direct Blob URL: ${vercelBlobUrl}`);

    // 3. Configure Nodemailer transporter
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS || !process.env.CERTIFICATE_EMAIL) {
      console.error('Configuration Error: Missing GMAIL_USER, GMAIL_PASS, or CERTIFICATE_EMAIL environment variables.');
      return NextResponse.json(
        { message: 'Server email configuration is incomplete. Please contact support.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    console.log('Nodemailer transporter created.');

    // 4. Send emails
    try {
      await sendUserCertificateEmail(transporter, email, name, appShareableLink);
      console.log(`User email sent to ${email}.`);
    } catch (emailError: any) {
      console.error(`Error sending user email to ${email}:`, emailError);
      // Continue processing even if user email fails, but log the error
    }

    try {
      await sendAdminNotificationEmail(transporter, name, email, appShareableLink, vercelBlobUrl);
      console.log('Admin notification email sent.');
    } catch (adminEmailError: any) {
      console.error('Error sending admin notification email:', adminEmailError);
      // Continue processing even if admin email fails, but log the error
    }

    // 5. Respond to client
    return NextResponse.json({
      message: 'Certificate uploaded and emails processed successfully.',
      shareableLink: appShareableLink,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Unhandled Error during certificate upload process:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred during certificate upload.', error: error.message },
      { status: 500 }
    );
  }
}