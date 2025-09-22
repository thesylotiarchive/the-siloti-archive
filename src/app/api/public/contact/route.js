// app/api/public/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs'; // ensure Node runtime so nodemailer works

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function userReplyHtml({ name }) {
    return `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <title>Thanks for contacting The Sylheti Archive</title>
    </head>
    <body style="margin:0; padding:0; background:#f6f7fb; font-family:-apple-system, system-ui, Roboto, Arial;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:40px 16px;">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 24px rgba(20,20,40,0.08); color:#222;">
              
              <!-- Blue Header with Logo -->
              <tr>
                <td style="background:#1276AB; text-align:center; padding:24px;">
                  <img src="https://res.cloudinary.com/de2erp9in/image/upload/v1758519257/syloti-logo-01_bekayi.png" 
                       alt="Sylheti Archive" 
                       width="80" 
                       style="display:block; margin:0 auto 10px;" />
                  <div style="font-size:18px; font-weight:600; color:#ffffff;">The Sylheti Archive</div>
                </td>
              </tr>
  
              <!-- Body -->
              <tr>
                <td style="padding:28px; text-align:center;">
                  <h1 style="margin:0; font-size:22px; color:#1276AB;">Thanks, ${escapeHtml(name)}!</h1>
                  <p style="color:#444; max-width:46ch; margin:12px auto;">
                    We’ve received your message and our team will review it shortly.
                  </p>
                  <p style="color:#555; font-size:14px; margin:12px auto;">
                    For further questions, please contact us at 
                    <a href="mailto:silotiarchivercc@gmail.com" style="color:#1276AB; font-weight:600;">silotiarchivercc@gmail.com</a>.
                  </p>
                  <a href="https://sylotiarchive.org" 
                     style="display:inline-block; margin-top:20px; background:#1276AB; color:#fff; padding:10px 20px; border-radius:8px; font-weight:600; text-decoration:none;">
                     Visit the Archive
                  </a>
                  <hr style="border:none; border-top:1px solid #eee; margin:28px 0;" />
                  <p style="color:#999; font-size:12px; margin:0;">
                    This is a system-generated email. Please do not reply directly.
                  </p>
                </td>
              </tr>
  
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
  }
  
  
  function adminNotificationHtml({ name, email, message }) {
    return `
    <!doctype html>
    <html>
    <body style="background:#f6f7fb; padding:24px; font-family:Arial, Helvetica, sans-serif; margin:0;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; margin:auto; border-radius:10px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,0.06); background:#fff;">
        <tr>
          <td style="background:#1276AB; padding:16px; text-align:center;">
            <img src="https://res.cloudinary.com/de2erp9in/image/upload/v1758519257/syloti-logo-01_bekayi.png" alt="Sylheti Archive" width="80" style="display:block; margin:0 auto 6px;" />
            <div style="font-size:18px; font-weight:600; color:#fff;">The Sylheti Archive</div>
            <h2 style="color:#fff; margin:8px 0 0; font-size:20px;">New Contact Form Submission</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:24px; color:#222;">
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="border-left:4px solid #1276AB; padding-left:12px; color:#333;">${escapeHtml(message)}</blockquote>
            <hr style="margin:24px 0; border:none; border-top:1px solid #eee;" />
            <p style="font-size:13px; color:#777;">
              This is a system-generated email. For follow-ups, contact the user at 
              <a href="mailto:silotiarchivercc@gmail.com" style="color:#1276AB;">silotiarchivercc@gmail.com</a>.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
  }
  

// simple helper to avoid very naive XSS in template
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Transporter configuration using Gmail SMTP (App Password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Admin list
    const adminEmails = (process.env.ADMIN_EMAILS || process.env.GMAIL_USER)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Compose messages
    const adminMail = {
      from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
      to: adminEmails.join(','),
      subject: `New contact form: ${name}`,
      html: adminNotificationHtml({ name, email, message }),
      replyTo: email, // allows reply-to the original user
    };

    const userMail = {
      from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
      to: email,
      subject: `Thanks for contacting Sylheti Archive`,
      html: userReplyHtml({ name }),
    };

    // Send both emails (admins + auto-reply)
    const [adminInfo, userInfo] = await Promise.all([
      transporter.sendMail(adminMail),
      transporter.sendMail(userMail),
    ]);

    // Optionally return nodemailer info for debug (not in prod)
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
