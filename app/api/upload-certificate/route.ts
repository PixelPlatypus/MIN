import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const formData = await request.formData();
  const certificate = formData.get('certificate') as File;
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  console.log('Received upload certificate data:', { email, name, certificate: certificate ? certificate.name : 'No file' });

  if (!certificate || !email || !name) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    // Generate unique filename
    const fileName = `${randomBytes(8).toString('hex')}.pdf`;
    const currentWorkingDirectory = process.cwd();
    const certificatesDirectory = join(currentWorkingDirectory, 'public', 'certificates');
    const filePath = join(certificatesDirectory, fileName);
    const bytes = await certificate.arrayBuffer();
    const buffer = Buffer.from(bytes);
    

    // Save file to public/certificates
    try {
      await writeFile(filePath, buffer);
      console.log(`Certificate saved to: ${filePath}`);
    } catch (writeError) {
      console.error('Error writing certificate file:', writeError);
      throw writeError; // Re-throw to be caught by the main catch block
    }
    
    // Create shareable link
    const shareableLink = `${process.env.NEXT_PUBLIC_BASE_URL}/certificates/${fileName}`; 
    console.log(`Shareable link created: ${shareableLink}`);

    console.log('Attempting to create Nodemailer transporter...');
    // Send email with link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    console.log('Nodemailer transporter created. Attempting to send user email...');
    await sendCertificateEmail(transporter, email, name, shareableLink);
    console.log('User email sent. Attempting to send admin email...');

    // Email to the certificate upload recipient
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.CERTIFICATE_EMAIL,
      subject: 'New Certificate Uploaded',
      html: `
        <p>A new certificate has been uploaded for ${name} (${email}).</p>
        <p>Shareable Link: <a href="${shareableLink}">${shareableLink}</a></p>
      `
    };
    await transporter.sendMail(adminMailOptions);
    console.log('Admin email sent.');

    return NextResponse.json({
      message: 'Certificate uploaded successfully',
      shareableLink
    });
  } catch (error: any) {
    console.error('Error uploading certificate:', error);
    return NextResponse.json(
      { message: 'Failed to upload certificate', error: error.message },
      { status: 500 }
    );
  }
}

async function sendCertificateEmail(transporter: nodemailer.Transporter, email: string, name: string, link: string) {

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your Certificate is Ready | MIN',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a5568;">Congratulations, ${name}!</h2>
        <p>Your certificate is ready to view and download.</p>
        <p>Click the link below to access your certificate:</p>
        <p><a href="${link}" style="color: #3182ce; text-decoration: underline;">View Certificate</a></p>
        <p>Best regards,<br/>The MIN Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}