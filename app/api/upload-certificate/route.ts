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
    const publicPath = join(process.cwd(), 'public', 'certificates', fileName);
    const bytes = await certificate.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file to public/certificates
    await writeFile(publicPath, buffer);
    
    // Create shareable link
    const shareableLink = `${process.env.NEXT_PUBLIC_BASE_URL}/certificates/${fileName}`; 

    
    // Send email with link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    await sendCertificateEmail(transporter, email, name, shareableLink);

    // Email to the certificate upload recipient
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.CERTIFICATE_EMAIL,
      subject: `New Certificate Upload from ${name} | MIN`,
      html: `
        <p>A new certificate has been uploaded with the following details:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Shareable Link:</strong> <a href="${shareableLink}">${shareableLink}</a></li>
        </ul>
        <p>Please review the uploaded certificate and take appropriate action.</p>
      `,
    };
    await transporter.sendMail(adminMailOptions);
    
    return NextResponse.json({
      message: 'Certificate uploaded successfully',
      shareableLink
    });
  } catch (error) {
    console.error('Error uploading certificate:', error);
    return NextResponse.json(
      { message: 'Failed to upload certificate' },
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