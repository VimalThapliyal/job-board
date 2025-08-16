import { NextRequest, NextResponse } from "next/server";
import { sendLeadConfirmation } from "@/lib/email-service";

interface ContactFormData {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  jobCount: string;
  industry?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.companyName || !body.contactName || !body.email || !body.jobCount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create contact lead object
    const contactLead = {
      id: `contact_${Date.now()}`,
      companyName: body.companyName,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone || "",
      jobCount: body.jobCount,
      industry: body.industry || "",
      message: body.message || "",
      status: "new" as const,
      type: "company_contact" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    // Send confirmation email to the company contact
    try {
      await sendContactConfirmation(contactLead);
      console.log(`✅ Contact confirmation email sent to ${body.contactName} (${body.email})`);
    } catch (emailError) {
      console.error(`❌ Failed to send contact confirmation email to ${body.email}:`, emailError);
      // Continue even if email fails
    }

    // Send notification email to admin
    try {
      await sendAdminNotification(contactLead);
      console.log(`✅ Admin notification sent for new contact from ${body.companyName}`);
    } catch (adminEmailError) {
      console.error(`❌ Failed to send admin notification:`, adminEmailError);
    }

    console.log(`✅ New contact lead saved: ${body.contactName} from ${body.companyName}`);

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        contactId: contactLead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

async function sendContactConfirmation(contact: any): Promise<boolean> {
  try {
    const emailContent = generateContactConfirmationEmail(contact);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'React Jobs <noreply@reactdevjobs.com>',
        to: contact.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (response.ok) {
      console.log(`✅ Contact confirmation email sent to ${contact.contactName} (${contact.email})`);
      return true;
    } else {
      console.error(`❌ Failed to send contact confirmation email to ${contact.email}:`, await response.text());
      return false;
    }
  } catch (error) {
    console.error(`❌ Error sending contact confirmation email to ${contact.email}:`, error);
    return false;
  }
}

async function sendAdminNotification(contact: any): Promise<boolean> {
  try {
    const emailContent = generateAdminNotificationEmail(contact);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'React Jobs <noreply@reactdevjobs.com>',
        to: process.env.NEXT_PUBLIC_BILLING_EMAIL || 'jobboard97@gmail.com',
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (response.ok) {
      console.log(`✅ Admin notification sent for new contact from ${contact.companyName}`);
      return true;
    } else {
      console.error(`❌ Failed to send admin notification:`, await response.text());
      return false;
    }
  } catch (error) {
    console.error(`❌ Error sending admin notification:`, error);
    return false;
  }
}

function generateContactConfirmationEmail(contact: any) {
  const subject = `✅ Thank You - React Jobs Portal Contact Request`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Contact Request Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">✅ Contact Request Received</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your interest in listing jobs on React Jobs Portal</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Request Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #3498db; margin-top: 0;">${contact.companyName}</h3>
            <p><strong>Contact:</strong> ${contact.contactName}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
            <p><strong>Jobs Needed:</strong> ${contact.jobCount}</p>
            ${contact.industry ? `<p><strong>Industry:</strong> ${contact.industry}</p>` : ''}
          </div>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #27ae60;">
          <h4 style="color: #27ae60; margin-top: 0;">What Happens Next?</h4>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Our team will review your requirements within 24 hours</li>
            <li>We&apos;ll contact you to discuss the best package for your needs</li>
            <li>You&apos;ll get access to our premium job listing features</li>
            <li>Start receiving qualified React developer applications</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://job-board-nine-lyart.vercel.app" 
             style="background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Browse Current Jobs
          </a>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">
          <p>Thank you for choosing React Jobs Portal</p>
          <p>© 2024 React Jobs Portal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Contact Request Confirmation

Company: ${contact.companyName}
Contact: ${contact.contactName}
Email: ${contact.email}
${contact.phone ? `Phone: ${contact.phone}` : ''}
Jobs Needed: ${contact.jobCount}
${contact.industry ? `Industry: ${contact.industry}` : ''}

What Happens Next?
- Our team will review your requirements within 24 hours
- We'll contact you to discuss the best package for your needs
- You'll get access to our premium job listing features
- Start receiving qualified React developer applications

Browse current jobs: https://job-board-nine-lyart.vercel.app

Thank you for choosing React Jobs Portal
  `;

  return { subject, html, text };
}

function generateAdminNotificationEmail(contact: any) {
  const subject = `🔥 New Company Contact: ${contact.companyName} - ${contact.jobCount} jobs`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Company Contact</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🚀 New Company Contact</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Potential client interested in listing jobs</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Company Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #3498db; margin-top: 0;">${contact.companyName}</h3>
            <p><strong>Contact:</strong> ${contact.contactName}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
            <p><strong>Jobs Needed:</strong> ${contact.jobCount}</p>
            ${contact.industry ? `<p><strong>Industry:</strong> ${contact.industry}</p>` : ''}
          </div>
          
          ${contact.message ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #2c3e50; margin-top: 0;">Additional Requirements</h4>
            <p style="font-style: italic;">${contact.message}</p>
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="mailto:${contact.email}" 
             style="background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Contact Company
          </a>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">
          <p>React Jobs Portal - Admin Notification</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
New Company Contact

Company: ${contact.companyName}
Contact: ${contact.contactName}
Email: ${contact.email}
${contact.phone ? `Phone: ${contact.phone}` : ''}
Jobs Needed: ${contact.jobCount}
${contact.industry ? `Industry: ${contact.industry}` : ''}
${contact.message ? `Additional Requirements: ${contact.message}` : ''}

Contact the company at: ${contact.email}

React Jobs Portal - Admin Notification
  `;

  return { subject, html, text };
} 