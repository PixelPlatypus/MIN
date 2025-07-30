import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {

  try {
    const formData = await request.json();
    console.log('Received content submission data:', formData);
    
    // Create a test account (for development only)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    console.log('Nodemailer config:', {
      service: 'gmail',
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS ? '********' : 'undefined' // Mask password for logs
    });

    // Send mail with defined transport object
    // Email to the MIN Team
    const minTeamMailOptions = {
      from: '"MIN Team" <team@min.org>', // sender address
      to: process.env.MAIN_CONTENT_EMAIL, // Main content email account
      subject: `New Content Submission from ${formData.name} | MIN`,
      text: `Hello MIN Team,\n\n${formData.name} (${formData.email}) has submitted new content.\n\nTitle: ${formData.title}\nLink: ${formData.link}\nCategory: ${formData.category}\nTags: ${formData.tags}\nDescription: ${formData.description}\n\nWe'll review this submission and get back to the user soon.\n\nBest regards,\nThe MIN Team`, // plain text body
      html: `
        <p>Hello MIN Team,</p>
        <p>${formData.name} (${formData.email}) has submitted new content.</p>
        <p>Here's the submitted content:</p>
        <ul>
          <li><strong>Title:</strong> ${formData.title}</li>
          <li><strong>Link:</strong> <a href="${formData.link}">${formData.link}</a></li>
          <li><strong>Category:</strong> ${formData.category}</li>
          <li><strong>Tags:</strong> ${formData.tags}</li>
          <li><strong>Description:</strong> ${formData.description}</li>
        </ul>
        <p>We'll review this submission and get back to the user soon.</p>
        <p>Best regards,<br/>The MIN Team</p>
      `
    };

    // Email to the content provider
    const authorMailOptions = {
      from: '"MIN Team" <team@min.org>', // sender address
      to: formData.email, // Content provider's email
      subject: `Your Content Submission to MIN | Confirmation`,
      text: `Dear ${formData.name},\n\nThank you for submitting your content to MIN. We have received your submission and will review it shortly.\n\nHere's a summary of your submission:\nTitle: ${formData.title}\nLink: ${formData.link}\nCategory: ${formData.category}\nTags: ${formData.tags}\nDescription: ${formData.description}\n\nWe appreciate your contribution!\n\nBest regards,\nThe MIN Team`, // plain text body
      html: `
        <p>Dear ${formData.name},</p>
        <p>Thank you for submitting your content to MIN. We have received your submission and will review it shortly.</p>
        <p>Here's a summary of your submission:</p>
        <ul>
          <li><strong>Title:</strong> ${formData.title}</li>
          <li><strong>Link:</strong> <a href="${formData.link}">${formData.link}</a></li>
          <li><strong>Category:</strong> ${formData.category}</li>
          <li><strong>Tags:</strong> ${formData.tags}</li>
          <li><strong>Description:</strong> ${formData.description}</li>
        </ul>
        <p>We appreciate your contribution!</p>
        <p>Best regards,<br/>The MIN Team</p>
      `
    };

    const infoMinTeam = await transporter.sendMail(minTeamMailOptions);
    console.log('Message sent to MIN Team: %s', infoMinTeam.messageId);
    console.log('Preview URL (MIN Team): %s', nodemailer.getTestMessageUrl(infoMinTeam));

    const infoAuthor = await transporter.sendMail(authorMailOptions);
    console.log('Message sent to Author: %s', infoAuthor.messageId);
    console.log('Preview URL (Author): %s', nodemailer.getTestMessageUrl(infoAuthor));



    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}