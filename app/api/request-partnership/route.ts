import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const { personName, organizationName, contactNumber, contactEmail, category, collaborationIdea, goalsObjective } = formData;

    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mainContentEmail = process.env.MAIN_CONTENT_EMAIL;

    if (!mainContentEmail) {
      return NextResponse.json({ message: 'MAIN_CONTENT_EMAIL is not configured.' }, { status: 500 });
    }

    // Email to MAIN_CONTENT_EMAIL
    const mailOptionsToMain = {
      from: process.env.EMAIL_USER,
      to: mainContentEmail,
      subject: `New Partnership Request from ${personName} (${organizationName}) | MIN`,
      html: `
        <p><strong>Person Name:</strong> ${personName}</p>
        <p><strong>Organization Name:</strong> ${organizationName}</p>
        <p><strong>Contact Number:</strong> ${contactNumber}</p>
        <p><strong>Contact Email:</strong> ${contactEmail}</p>
        <p><strong>Partnership Category:</strong> ${category}</p>
        <p><strong>Collaboration Idea:</strong> ${collaborationIdea}</p>
        <p><strong>Goals and Objective:</strong> ${goalsObjective}</p>
      `,
    };

    // Email to the provided Contact Email
    const mailOptionsToContact = {
      from: process.env.EMAIL_USER,
      to: contactEmail,
      subject: 'Your Partnership Request to MIN has been received | MIN',
      html: `
        <p>Dear ${personName},</p>
        <p>Thank you for your partnership request to MIN. We have received your submission and will get back to you shortly.</p>
        <p>Here are the details you submitted:</p>
        <p><strong>Person Name:</strong> ${personName}</p>
        <p><strong>Organization Name:</strong> ${organizationName}</p>
        <p><strong>Contact Number:</strong> ${contactNumber}</p>
        <p><strong>Contact Email:</strong> ${contactEmail}</p>
        <p><strong>Partnership Category:</strong> ${category}</p>
        <p><strong>Collaboration Idea:</strong> ${collaborationIdea}</p>
        <p><strong>Goals and Objective:</strong> ${goalsObjective}</p>
        <p>Best regards,</p>
        <p>The MIN Team</p>
      `,
    };

    await transporter.sendMail(mailOptionsToMain);
    await transporter.sendMail(mailOptionsToContact);

    return NextResponse.json({ message: 'Partnership request sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error in partnership request API:', error);
    return NextResponse.json({ message: 'Failed to send partnership request.' }, { status: 500 });
  }
}