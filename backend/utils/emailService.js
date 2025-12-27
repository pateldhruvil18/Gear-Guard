import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Check if SMTP credentials are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  SMTP credentials not configured. Emails will not be sent.');
    console.warn('   Please set SMTP_USER and SMTP_PASS in your .env file.');
    return null;
  }

  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // For Gmail, we might need additional options
  if (config.host.includes('gmail.com')) {
    config.service = 'gmail';
  }

  return nodemailer.createTransporter(config);
};

export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      const error = new Error('SMTP transporter not configured. Please set SMTP_USER and SMTP_PASS in your .env file.');
      console.error('❌', error.message);
      throw error;
    }

    // Verify transporter connection
    try {
      await transporter.verify();
      console.log('✅ SMTP server connection verified');
    } catch (verifyError) {
      console.error('❌ SMTP server connection failed:', verifyError.message);
      throw new Error(`SMTP server connection failed: ${verifyError.message}. Please check your SMTP credentials.`);
    }
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"GearGuard" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your GearGuard Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 20px 0; text-align: center; background-color: #1f2937;">
                <h1 style="color: #ffffff; margin: 0;">GearGuard</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1f2937; margin-top: 0;">Welcome to GearGuard, ${name}!</h2>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Thank you for signing up. Please verify your email address to complete your registration and start using GearGuard.
                      </p>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="display: inline-block; padding: 14px 28px; background-color: #374151; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                          Verify Email Address
                        </a>
                      </div>
                      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                        If the button doesn't work, copy and paste this link into your browser:
                      </p>
                      <p style="color: #6b7280; font-size: 12px; word-break: break-all;">
                        ${verificationUrl}
                      </p>
                      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                        This verification link will expire in 24 hours. If you didn't create an account, please ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                <p style="margin: 0;">© ${new Date().getFullYear()} GearGuard. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        Welcome to GearGuard, ${name}!
        
        Thank you for signing up. Please verify your email address by clicking the link below:
        
        ${verificationUrl}
        
        This verification link will expire in 24 hours. If you didn't create an account, please ignore this email.
        
        © ${new Date().getFullYear()} GearGuard. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully:', info.messageId);
    console.log(`   To: ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    if (error.command) {
      console.error(`   Failed command: ${error.command}`);
    }
    throw error;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"GearGuard" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to GearGuard!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to GearGuard</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 20px 0; text-align: center; background-color: #1f2937;">
                <h1 style="color: #ffffff; margin: 0;">GearGuard</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1f2937; margin-top: 0;">Welcome to GearGuard, ${name}!</h2>
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Your email has been verified successfully. You can now log in to your account and start using GearGuard.
                      </p>
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                           style="display: inline-block; padding: 14px 28px; background-color: #374151; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                          Login to GearGuard
                        </a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                <p style="margin: 0;">© ${new Date().getFullYear()} GearGuard. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

