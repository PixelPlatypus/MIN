import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { name, email, joiningDate, team, position, contributions } = formData;
    console.log('Received certificate request data:', { name, email, joiningDate, team, position, contributions });

    console.log('Nodemailer config:', {
      service: 'gmail',
      user: process.env.GMAIL_USER,
      certificateEmail: process.env.CERTIFICATE_EMAIL,
    });

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Email to the user
    const userMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Certificate Request Confirmation | MIN',
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for submitting your certificate request. We have received your application with the following details:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Joining Date:</strong> ${joiningDate}</li>
          <li><strong>Team:</strong> ${team}</li>
          <li><strong>Position:</strong> ${position}</li>
          <li><strong>Contributions:</strong> ${contributions}</li>
        </ul>
        <p>We will review your request based on the following criteria:</p>
        <ul>
          <li>70% Attendance</li>
          <li>70% Task/Project Completion & Minimum of 4-6 task completion (Monitored by Manager)</li>
          <li>1 Year Contribution (1 month break free break)</li>
        </ul>
        <p>We will get back to you shortly regarding the status of your certificate. If you have any questions, please do not hesitate to contact us.</p>
        <p>Best regards,</p>
        <p>The MIN Team</p>
      `,
    };

    // Email to the certificate request recipient
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.CERTIFICATE_EMAIL,
      subject: `New Certificate Request from ${name} | MIN`,
      html: `
        <p>A new certificate request has been submitted with the following details:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Joining Date:</strong> ${joiningDate}</li>
          <li><strong>Team:</strong> ${team}</li>
          <li><strong>Position:</strong> ${position}</li>
          <li><strong>Contributions:</strong> ${contributions}</li>
        </ul>
        <p>Please review the request and take appropriate action.</p>
      `,
    };

    try {
      await transporter.sendMail(userMailOptions);
      console.log('User email sent successfully!');
    } catch (userMailError) {
      console.error('Error sending user email:', userMailError);
    }

    try {
      await transporter.sendMail(adminMailOptions);
      console.log('Admin email sent successfully!');
    } catch (adminMailError) {
      console.error('Error sending admin email:', adminMailError);
    }

    return NextResponse.json({ message: 'Certificate request submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting certificate request:', error);
    return NextResponse.json({ message: 'Failed to submit certificate request.' }, { status: 500 });
  }
}