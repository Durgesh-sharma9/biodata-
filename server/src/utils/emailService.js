import nodemailer from 'nodemailer';

const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'mail.webncode.in';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || 'hirehub@webncode.in';
  const pass = process.env.SMTP_PASS || 'Webncode2026@hostycare';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Core generic sendEmail function
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || `"HireHub Recruitment" <${process.env.SMTP_USER || 'hirehub@webncode.in'}>`;

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || '',
      html: html || text,
    });

    console.log(`[SMTP] Email sent to ${to} (MessageID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send OTP Verification Email
 */
export const sendOtpEmail = async ({ to, otp, purpose = 'Verification', name = 'User' }) => {
  const subject = `Your HireHub Verification Code: ${otp}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6fb; margin: 0; padding: 20px; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #3160E8 0%, #4E66F8 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 8px 0 0; font-size: 13px; opacity: 0.85; }
        .body { padding: 32px 28px; color: #334155; }
        .greeting { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #0f172a; }
        .otp-box { background: #f8faff; border: 2px dashed #4E66F8; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #3160E8; font-family: monospace; }
        .expiry { font-size: 12px; color: #64748b; margin-top: 8px; font-weight: 500; }
        .note { font-size: 12px; color: #94a3b8; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; }
        .footer { background: #fafbfc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>HireHub</h1>
          <p>School Faculty &amp; Staff Recruitment Platform</p>
        </div>
        <div class="body">
          <div class="greeting">Hello ${name},</div>
          <p style="font-size: 14px; line-height: 1.6; margin: 0;">
            Use the verification code below for <strong>${purpose}</strong> on HireHub.
          </p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="expiry">Valid for 10 minutes &bull; Do not share with anyone</div>
          </div>
          <div class="note">
            If you did not request this OTP, please ignore this email or contact support at support@webncode.in.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} HireHub &bull; Powered by webncode.in
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html, text: `Your HireHub verification code is: ${otp}` });
};

/**
 * Send Welcome Email on School Registration
 */
export const sendWelcomeEmail = async ({ to, name, schoolName, schoolId }) => {
  const subject = `Welcome to HireHub - ${schoolName}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6fb; margin: 0; padding: 20px; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #3160E8 0%, #4E66F8 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 800; }
        .body { padding: 32px 28px; color: #334155; }
        .highlight-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0; }
        .footer { background: #fafbfc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Welcome to HireHub!</h1>
          <p>School Recruitment Simplified</p>
        </div>
        <div class="body">
          <p style="font-size: 15px; font-weight: 600; color: #0f172a;">Dear ${name},</p>
          <p style="font-size: 14px; line-height: 1.6;">
            Congratulations! Your school <strong>${schoolName}</strong> has been successfully registered on HireHub.
          </p>
          <div class="highlight-box">
            <div style="font-size: 13px; color: #166534; font-weight: 600;">School Details:</div>
            <div style="font-size: 12px; color: #15803d; margin-top: 4px;">School ID: <strong>${schoolId}</strong></div>
            <div style="font-size: 12px; color: #15803d; margin-top: 2px;">Trial Plan: <strong>30 Days Free Trial</strong></div>
            <div style="font-size: 12px; color: #15803d; margin-top: 2px;">Complimentary Credits: <strong>5 Free Unlocks</strong></div>
          </div>
          <p style="font-size: 13px; line-height: 1.6; color: #64748b;">
            You can now log in, explore verified teacher profiles, and start direct hiring.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} HireHub &bull; Powered by webncode.in
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html, text: `Welcome to HireHub, ${schoolName}! Your School ID is ${schoolId}.` });
};

/**
 * Verify SMTP connection
 */
export const verifySmtpConnection = async () => {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return { success: true, message: 'SMTP connection verified successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
