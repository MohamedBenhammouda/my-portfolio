'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const { validateContact } = require('../middleware/validate');

const router = express.Router();

// ── ROUTE-LEVEL RATE LIMIT ────────────────────────────────────────────────────
// Stricter than the global limit: 5 form submissions per IP per 15 minutes
router.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many messages sent. Please wait 15 minutes and try again.' },
}));

// ── NODEMAILER TRANSPORTER ────────────────────────────────────────────────────
// Uses Gmail SMTP with an App Password (2-FA must be enabled on the account).
// Set credentials in backend/.env — never hard-code them here.
function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,   // Gmail App Password (16 chars, no spaces)
        },
    });
}

// ── POST /api/contact ─────────────────────────────────────────────────────────
router.post('/', validateContact, async (req, res) => {
    const { name, email, message } = req.cleanBody;

    // Build the email that lands in Mohamed's inbox
    const mailToOwner = {
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        replyTo: email,
        subject: `[Portfolio] New message from ${name}`,
        text: `Name:    ${name}\nEmail:   ${email}\n\nMessage:\n${message}`,
        html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
        <h2 style="color:#1e40af;margin-bottom:4px;">New Contact Form Submission</h2>
        <p style="color:#64748b;font-size:13px;margin-top:0;">Received via portfolio contact form</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;width:80px;vertical-align:top;">Name</td>
            <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600;">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;vertical-align:top;">Email</td>
            <td style="padding:8px 0;font-size:14px;">
              <a href="mailto:${email}" style="color:#1e40af;">${email}</a>
            </td>
          </tr>
        </table>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;">
        <p style="color:#64748b;font-size:13px;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Message</p>
        <p style="color:#0f172a;font-size:15px;line-height:1.7;white-space:pre-wrap;">${message}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0 8px;">
        <p style="color:#94a3b8;font-size:12px;">Reply directly to this email to respond to ${name}.</p>
      </div>
    `,
    };

    // Auto-reply to the sender
    const mailToSender = {
        from: `"Mohamed Ben Hamouda" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Thanks for reaching out!',
        text: `Hi ${name},\n\nThank you for your message. I've received it and will get back to you as soon as possible.\n\nBest regards,\nMohamed Ben Hamouda\nSoftware Engineer · Cybersecurity Researcher`,
        html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
        <h2 style="color:#1e40af;">Thanks for reaching out, ${name}!</h2>
        <p style="color:#334155;line-height:1.7;">
          I've received your message and will get back to you as soon as possible.
        </p>
        <p style="color:#334155;line-height:1.7;">
          In the meantime, feel free to connect with me on
          <a href="https://linkedin.com/in/mohamed-benhamouda" style="color:#1e40af;">LinkedIn</a>
          or check out my work on
          <a href="https://github.com/MohamedBenhammouda" style="color:#1e40af;">GitHub</a>.
        </p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
        <p style="color:#64748b;font-size:13px;">
          Mohamed Ben Hamouda<br>
          Software Engineer · Cybersecurity Researcher<br>
          <a href="mailto:ezz.bnhammouda@gmail.com" style="color:#1e40af;">ezz.bnhammouda@gmail.com</a>
        </p>
      </div>
    `,
    };

    try {
        const transporter = createTransporter();
        // Send both emails in parallel
        await Promise.all([
            transporter.sendMail(mailToOwner),
            transporter.sendMail(mailToSender),
        ]);

        return res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (err) {
        console.error('Email send error:', err.message);
        return res.status(500).json({ error: 'Failed to send message. Please try again or email directly.' });
    }
});

module.exports = router;
