import { Lead, Company } from "@/types/lead";

// Zero-cost email service using Resend free tier (3,000 emails/month)
const RESEND_API_KEY = process.env.RESEND_API_KEY;

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export async function sendLeadToCompany(lead: Lead, company: Company): Promise<boolean> {
  try {
    if (!RESEND_API_KEY) {
      console.log("⚠️ Resend API key not configured, skipping email");
      return false;
    }

    const emailContent = generateLeadEmail(lead, company);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'React Jobs <noreply@reactdevjobs.com>',
        to: company.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (response.ok) {
      console.log(`✅ Lead email sent to ${company.name} (${company.email})`);
      return true;
    } else {
      console.error(`❌ Failed to send email to ${company.email}:`, await response.text());
      return false;
    }
  } catch (error) {
    console.error(`❌ Error sending lead email to ${company.email}:`, error);
    return false;
  }
}

export async function sendLeadConfirmation(lead: Lead): Promise<boolean> {
  try {
    if (!RESEND_API_KEY) {
      console.log("⚠️ Resend API key not configured, skipping confirmation email");
      return false;
    }

    const emailContent = generateConfirmationEmail(lead);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'React Jobs <noreply@reactdevjobs.com>',
        to: lead.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (response.ok) {
      console.log(`✅ Confirmation email sent to ${lead.name} (${lead.email})`);
      return true;
    } else {
      console.error(`❌ Failed to send confirmation email to ${lead.email}:`, await response.text());
      return false;
    }
  } catch (error) {
    console.error(`❌ Error sending confirmation email to ${lead.email}:`, error);
    return false;
  }
}

export async function sendJobAlertConfirmation(jobAlert: any): Promise<boolean> {
  try {
    if (!RESEND_API_KEY) {
      console.log("⚠️ Resend API key not configured, skipping job alert confirmation email");
      return false;
    }

    const emailContent = generateJobAlertConfirmationEmail(jobAlert);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'React Jobs <noreply@reactdevjobs.com>',
        to: jobAlert.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (response.ok) {
      console.log(`✅ Job alert confirmation email sent to ${jobAlert.email}`);
      return true;
    } else {
      console.error(`❌ Failed to send job alert confirmation email to ${jobAlert.email}:`, await response.text());
      return false;
    }
  } catch (error) {
    console.error(`❌ Error sending job alert confirmation email to ${jobAlert.email}:`, error);
    return false;
  }
}

export async function sendJobPostedNotification(job: any): Promise<void> {
  try {
    const { companyName, jobTitle, location, contactEmail } = job;
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; margin-bottom: 20px;">🎉 Job Posted Successfully!</h2>
        
        <p>Dear ${companyName} Team,</p>
        
        <p>Your job posting has been successfully published on our platform!</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Job Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 8px;"><strong>Position:</strong> ${jobTitle}</li>
            <li style="margin-bottom: 8px;"><strong>Location:</strong> ${location}</li>
            <li style="margin-bottom: 8px;"><strong>Status:</strong> Active</li>
            <li style="margin-bottom: 8px;"><strong>Valid Until:</strong> ${new Date(job.expiresAt).toLocaleDateString()}</li>
          </ul>
        </div>
        
        <p>Your job posting will be visible to thousands of qualified candidates and will remain active for 30 days.</p>
        
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af;"><strong>💡 Pro Tip:</strong> You can track views and applications through your dashboard.</p>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact us at <a href="mailto:jobboard97@gmail.com" style="color: #2563eb;">jobboard97@gmail.com</a></p>
        
        <p>Best regards,<br>The Job Board Team</p>
      </div>
    `;

    // For now, we'll just log the email content
    // In production, integrate with your email service provider
    console.log('Job Posted Notification Email:', {
      to: contactEmail,
      subject: `Job Posted Successfully: ${jobTitle}`,
      content: emailContent
    });

    // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
    // await sendEmail({
    //   to: contactEmail,
    //   subject: `Job Posted Successfully: ${jobTitle}`,
    //   html: emailContent
    // });

  } catch (error) {
    console.error('Failed to send job posted notification:', error);
    // Don't throw error to avoid breaking the job posting flow
  }
}

function generateLeadEmail(lead: Lead, company: Company): EmailTemplate {
  const subject = `🔥 New React Developer Lead: ${lead.name} - ${lead.jobTitle}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New React Developer Lead</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🚀 New React Developer Lead</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Qualified candidate for your React developer position</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Candidate Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #3498db; margin-top: 0;">${lead.name}</h3>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
            <p><strong>Experience:</strong> ${lead.experience}</p>
            <p><strong>Job Applied:</strong> ${lead.jobTitle} at ${lead.company}</p>
          </div>
          
          ${lead.coverLetter ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #2c3e50; margin-top: 0;">Cover Letter</h4>
            <p style="font-style: italic;">${lead.coverLetter}</p>
          </div>
          ` : ''}
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #27ae60;">
            <h4 style="color: #27ae60; margin-top: 0;">Lead Quality Score: ${lead.qualificationScore}/100</h4>
            <p style="margin: 0;"><strong>Level:</strong> ${getLeadLevel(lead.qualificationScore)}</p>
            <p style="margin: 0;"><strong>Price:</strong> $${getLeadPrice(lead.qualificationScore)}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://job-board-nine-lyart.vercel.app/admin/leads" 
             style="background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            View Full Lead Details
          </a>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #666;">
          <p style="margin: 0;"><strong>Next Steps:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Review the candidate's resume and cover letter</li>
            <li>Contact the candidate directly at ${lead.email}</li>
            <li>Schedule an interview if interested</li>
            <li>Update lead status in your dashboard</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">
          <p>This lead was generated by React Developer Jobs & Interview Prep</p>
          <p>© 2024 React Developer Jobs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
New React Developer Lead

Candidate: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone || 'Not provided'}
Experience: ${lead.experience}
Job Applied: ${lead.jobTitle} at ${lead.company}

${lead.coverLetter ? `Cover Letter: ${lead.coverLetter}` : ''}

Lead Quality Score: ${lead.qualificationScore}/100
Level: ${getLeadLevel(lead.qualificationScore)}
Price: $${getLeadPrice(lead.qualificationScore)}

View full lead details: https://job-board-nine-lyart.vercel.app/admin/leads

Next Steps:
- Review the candidate's resume and cover letter
- Contact the candidate directly at ${lead.email}
- Schedule an interview if interested
- Update lead status in your dashboard

Generated by React Developer Jobs & Interview Prep
  `;

  return { subject, html, text };
}

function generateConfirmationEmail(lead: Lead): EmailTemplate {
  const subject = `✅ Application Submitted - ${lead.jobTitle} at ${lead.company}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Application Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">✅ Application Submitted</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your application has been successfully submitted</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Application Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #3498db; margin-top: 0;">${lead.jobTitle}</h3>
            <p><strong>Company:</strong> ${lead.company}</p>
            <p><strong>Applied:</strong> ${new Date(lead.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span style="color: #f39c12; font-weight: bold;">Under Review</span></p>
          </div>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #27ae60;">
          <h4 style="color: #27ae60; margin-top: 0;">What Happens Next?</h4>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>We'll review your application and qualifications</li>
            <li>If you're a good match, we'll share your profile with the company</li>
            <li>The company will contact you directly if interested</li>
            <li>You'll receive updates on your application status</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://job-board-nine-lyart.vercel.app/interview-questions" 
             style="background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Practice Interview Questions
          </a>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">
          <p>Thank you for using React Developer Jobs & Interview Prep</p>
          <p>© 2024 React Developer Jobs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Application Submitted Successfully

Job: ${lead.jobTitle}
Company: ${lead.company}
Applied: ${new Date(lead.createdAt).toLocaleDateString()}
Status: Under Review

What Happens Next?
- We'll review your application and qualifications
- If you're a good match, we'll share your profile with the company
- The company will contact you directly if interested
- You'll receive updates on your application status

Practice interview questions: https://job-board-nine-lyart.vercel.app/interview-questions

Thank you for using React Developer Jobs & Interview Prep
  `;

  return { subject, html, text };
}

function generateJobAlertConfirmationEmail(jobAlert: any): EmailTemplate {
  const subject = `🔔 New Job Alert: ${jobAlert.jobTitle} at ${jobAlert.company}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Job Alert</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🔔 New Job Alert</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">A new job opportunity has been posted that matches your criteria.</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Job Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #3498db; margin-top: 0;">${jobAlert.jobTitle}</h3>
            <p><strong>Company:</strong> ${jobAlert.company}</p>
            <p><strong>Location:</strong> ${jobAlert.location}</p>
            <p><strong>Salary:</strong> ${jobAlert.salaryRange}</p>
            <p><strong>Type:</strong> ${jobAlert.jobType}</p>
            <p><strong>Description:</strong> ${jobAlert.description}</p>
          </div>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #27ae60;">
          <h4 style="color: #27ae60; margin-top: 0;">What Happens Next?</h4>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>You'll receive an email notification when the company contacts you.</li>
            <li>You can apply directly through the job board or save it for later.</li>
            <li>You can unsubscribe from job alerts at any time.</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://job-board-nine-lyart.vercel.app/job-alerts" 
             style="background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            View All Job Alerts
          </a>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">
          <p>This alert was generated by React Developer Jobs & Interview Prep</p>
          <p>© 2024 React Developer Jobs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
New Job Alert

Job: ${jobAlert.jobTitle}
Company: ${jobAlert.company}
Location: ${jobAlert.location}
Salary: ${jobAlert.salaryRange}
Type: ${jobAlert.jobType}
Description: ${jobAlert.description}

What Happens Next?
- You'll receive an email notification when the company contacts you.
- You can apply directly through the job board or save it for later.
- You can unsubscribe from job alerts at any time.

View all job alerts: https://job-board-nine-lyart.vercel.app/job-alerts

This alert was generated by React Developer Jobs & Interview Prep
  `;

  return { subject, html, text };
}

function generateJobPostedNotificationEmail(job: any) {
  const subject = `Your job posting is now live: ${job.jobTitle}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Job Posted Successfully</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .job-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
        .cta { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Job Posted Successfully!</h1>
          <p>Your React developer job is now live on our platform</p>
        </div>
        
        <div class="content">
          <h2>Job Details</h2>
          <div class="job-details">
            <p><strong>Position:</strong> ${job.jobTitle}</p>
            <p><strong>Company:</strong> ${job.companyName}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Type:</strong> ${job.jobType}</p>
            <p><strong>Experience:</strong> ${job.experienceLevel}</p>
            ${job.salaryRange ? `<p><strong>Salary:</strong> ${job.salaryRange}</p>` : ''}
          </div>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-number">30</div>
              <div>Days Active</div>
            </div>
            <div class="stat">
              <div class="stat-number">1000+</div>
              <div>Potential Views</div>
            </div>
            <div class="stat">
              <div class="stat-number">24/7</div>
              <div>Availability</div>
            </div>
          </div>
          
          <h3>What happens next?</h3>
          <ul>
            <li>Your job will appear in search results immediately</li>
            <li>Candidates can apply through our platform</li>
            <li>You'll receive email notifications for each application</li>
            <li>Track performance through our analytics dashboard</li>
          </ul>
          
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://reactdevjobs.com'}" class="cta">View Your Job Posting</a>
          
          <h3>Need to make changes?</h3>
          <p>Contact us at <a href="mailto:jobboard97@gmail.com">jobboard97@gmail.com</a> for any modifications to your job posting.</p>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing React Jobs for your hiring needs!</p>
          <p>© 2024 React Jobs. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Job Posted Successfully!

Your React developer job is now live on our platform.

Job Details:
- Position: ${job.jobTitle}
- Company: ${job.companyName}
- Location: ${job.location}
- Type: ${job.jobType}
- Experience: ${job.experienceLevel}
${job.salaryRange ? `- Salary: ${job.salaryRange}` : ''}

What happens next?
- Your job will appear in search results immediately
- Candidates can apply through our platform
- You'll receive email notifications for each application
- Track performance through our analytics dashboard

View your job posting: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://reactdevjobs.com'}

Need to make changes? Contact us at jobboard97@gmail.com

Thank you for choosing React Jobs for your hiring needs!
© 2024 React Jobs. All rights reserved.
  `;
  
  return { subject, html, text };
}

function getLeadLevel(score: number): string {
  if (score >= 80) return "Lead";
  if (score >= 60) return "Senior";
  if (score >= 40) return "Mid-level";
  return "Junior";
}

function getLeadPrice(score: number): number {
  if (score >= 80) return 200;
  if (score >= 60) return 150;
  if (score >= 40) return 100;
  return 50;
} 