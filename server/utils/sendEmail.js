const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email templates
const emailTemplates = {
  emailVerification: {
    subject: 'Verify Your Email - GradeHarvest',
    template: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #1e40af; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GradeHarvest</h1>
          </div>
          <div class="content">
            <h2>Welcome to GradeHarvest, {{name}}!</h2>
            <p>Thank you for registering with GradeHarvest. To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="{{verificationUrl}}" class="button">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #1e40af;">{{verificationUrl}}</p>
            <p><strong>This verification link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with GradeHarvest, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 GradeHarvest. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  passwordReset: {
    subject: 'Reset Your Password - GradeHarvest',
    template: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GradeHarvest</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello {{name}},</p>
            <p>We received a request to reset your password for your GradeHarvest account. If you made this request, click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="{{resetUrl}}" class="button">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #dc2626;">{{resetUrl}}</p>
            <div class="warning">
              <p><strong>Important:</strong></p>
              <ul>
                <li>This reset link will expire in 10 minutes for security reasons.</li>
                <li>If you didn't request a password reset, please ignore this email.</li>
                <li>Your password will remain unchanged until you create a new one.</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 GradeHarvest. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  orderNotification: {
    subject: 'Order Update - GradeHarvest',
    template: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #059669; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GradeHarvest</h1>
          </div>
          <div class="content">
            <h2>{{title}}</h2>
            <p>Hello {{name}},</p>
            <p>{{message}}</p>
            <div class="order-details">
              <h3>Order Details:</h3>
              <p><strong>Order Number:</strong> {{orderNumber}}</p>
              <p><strong>Title:</strong> {{orderTitle}}</p>
              <p><strong>Status:</strong> {{orderStatus}}</p>
              <p><strong>Deadline:</strong> {{deadline}}</p>
            </div>
            {{#if actionUrl}}
            <div style="text-align: center;">
              <a href="{{actionUrl}}" class="button">{{actionText}}</a>
            </div>
            {{/if}}
          </div>
          <div class="footer">
            <p>&copy; 2024 GradeHarvest. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  paymentNotification: {
    subject: 'Payment Update - GradeHarvest',
    template: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #059669; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .payment-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GradeHarvest</h1>
          </div>
          <div class="content">
            <h2>{{title}}</h2>
            <p>Hello {{name}},</p>
            <p>{{message}}</p>
            <div class="payment-details">
              <h3>Payment Details:</h3>
              <p><strong>Amount:</strong> $\{{amount}}</p>
              <p><strong>Payment ID:</strong> {{paymentId}}</p>
              <p><strong>Status:</strong> {{status}}</p>
              <p><strong>Date:</strong> {{date}}</p>
            </div>
            {{#if actionUrl}}
            <div style="text-align: center;">
              <a href="{{actionUrl}}" class="button">{{actionText}}</a>
            </div>
            {{/if}}
          </div>
          <div class="footer">
            <p>&copy; 2024 GradeHarvest. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  writerApproval: {
    subject: 'Welcome to GradeHarvest - Writer Application Approved!',
    template: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Writer Application Approved</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #059669; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .success { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
          </div>
          <div class="content">
            <div class="success">
              <h2>Your Writer Application Has Been Approved!</h2>
            </div>
            <p>Hello {{name}},</p>
            <p>We're excited to inform you that your application to become a writer on GradeHarvest has been approved! You can now start accepting orders and earning money.</p>
            <h3>What's Next?</h3>
            <ul>
              <li>Complete your writer profile</li>
              <li>Browse available orders</li>
              <li>Start applying for orders that match your expertise</li>
              <li>Build your reputation and increase your writer level</li>
            </ul>
            <div style="text-align: center;">
              <a href="{{dashboardUrl}}" class="button">Access Writer Dashboard</a>
            </div>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Welcome to the GradeHarvest family!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 GradeHarvest. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  writerRejection: {
    subject: 'GradeHarvest Writer Application Update',
    template: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Writer Application Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #1e40af; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .info { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GradeHarvest</h1>
          </div>
          <div class="content">
            <h2>Writer Application Update</h2>
            <p>Hello {{name}},</p>
            <p>Thank you for your interest in becoming a writer with GradeHarvest. After careful review of your application, we regret to inform you that we cannot approve your application at this time.</p>
            <div class="info">
              <h3>Reason:</h3>
              <p>{{reason}}</p>
            </div>
            <h3>What You Can Do:</h3>
            <ul>
              <li>Review our writer requirements and guidelines</li>
              <li>Improve your qualifications and experience</li>
              <li>Reapply after 30 days with updated information</li>
            </ul>
            <p>We encourage you to continue developing your writing skills and consider reapplying in the future.</p>
            <div style="text-align: center;">
              <a href="{{guidelinesUrl}}" class="button">View Writer Guidelines</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 GradeHarvest. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Template rendering function
const renderTemplate = (templateName, data) => {
  const template = emailTemplates[templateName];
  if (!template) {
    throw new Error(`Email template '${templateName}' not found`);
  }

  let html = template.template;
  
  // Simple template replacement
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, data[key] !== undefined ? data[key] : '');
  });

  // Handle conditional blocks (simple implementation)
  html = html.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
    return data[condition] ? content : '';
  });

  return {
    subject: template.subject,
    html
  };
};

// Main send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    let emailContent;
    
    if (options.template) {
      // Use template
      emailContent = renderTemplate(options.template, options.data || {});
    } else {
      // Use provided content
      emailContent = {
        subject: options.subject,
        html: options.html || options.message
      };
    }

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'GradeHarvest'} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.email,
      subject: emailContent.subject,
      html: emailContent.html
    };

    // Add attachments if provided
    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }

    // Add CC and BCC if provided
    if (options.cc) mailOptions.cc = options.cc;
    if (options.bcc) mailOptions.bcc = options.bcc;

    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', {
      messageId: result.messageId,
      to: options.email,
      subject: emailContent.subject
    });

    return {
      success: true,
      messageId: result.messageId,
      response: result.response
    };

  } catch (error) {
    console.error('Email sending failed:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

// Send bulk emails
const sendBulkEmails = async (emails) => {
  const results = [];
  const batchSize = 10; // Send in batches to avoid overwhelming the SMTP server
  
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const batchPromises = batch.map(email => sendEmail(email));
    
    try {
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
      
      // Wait between batches to avoid rate limiting
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Batch email sending failed:', error);
    }
  }
  
  return results;
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    
    console.log('Email configuration verified successfully');
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return { success: false, error: error.message };
  }
};

// Send test email
const sendTestEmail = async (toEmail) => {
  try {
    const result = await sendEmail({
      email: toEmail,
      subject: 'GradeHarvest - Test Email',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from GradeHarvest to verify email configuration.</p>
        <p>If you received this email, the email service is working correctly.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `
    });
    
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Email queue for handling high volume (basic implementation)
const emailQueue = [];
let isProcessingQueue = false;

const addToQueue = (emailOptions) => {
  emailQueue.push({
    ...emailOptions,
    queuedAt: new Date(),
    attempts: 0
  });
  
  processQueue();
};

const processQueue = async () => {
  if (isProcessingQueue || emailQueue.length === 0) {
    return;
  }
  
  isProcessingQueue = true;
  
  while (emailQueue.length > 0) {
    const emailOptions = emailQueue.shift();
    
    try {
      const result = await sendEmail(emailOptions);
      
      if (!result.success && emailOptions.attempts < 3) {
        // Retry failed emails up to 3 times
        emailOptions.attempts++;
        emailQueue.push(emailOptions);
      }
    } catch (error) {
      console.error('Queue email processing failed:', error);
    }
    
    // Small delay between emails
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  isProcessingQueue = false;
};

// Get email statistics
const getEmailStats = () => {
  return {
    queueLength: emailQueue.length,
    isProcessing: isProcessingQueue,
    configValid: !!process.env.SMTP_HOST
  };
};

module.exports = {
  sendEmail,
  sendBulkEmails,
  verifyEmailConfig,
  sendTestEmail,
  addToQueue,
  getEmailStats,
  renderTemplate,
  emailTemplates
};
