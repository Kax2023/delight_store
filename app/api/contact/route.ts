/**
 * POST /api/contact – send "Send Us a Message" form to your email.
 * Required env: SMTP_HOST, SMTP_USER, SMTP_PASS.
 * Optional: CONTACT_EMAIL or EMAIL_TO (default: info@delightstore.tz), SMTP_PORT (default 587), SMTP_SECURE (true for 465).
 */
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  consent?: boolean;
};

function validate(body: Body): { ok: true } | { ok: false; error: string } {
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();
  const consent = body.consent === true;

  if (!name) return { ok: false, error: "Full name is required." };
  if (!email) return { ok: false, error: "Email address is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "Please enter a valid email address." };
  if (!subject) return { ok: false, error: "Subject is required." };
  if (!message) return { ok: false, error: "Message is required." };
  if (!consent)
    return { ok: false, error: "You must agree to be contacted regarding your inquiry." };

  return { ok: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    const validation = validate(body);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const toEmail =
      process.env.CONTACT_EMAIL || process.env.EMAIL_TO || "info@delightstore.tz";
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const phone = (body.phone ?? "").trim() || "—";
    const subject = (body.subject ?? "").trim();
    const message = (body.message ?? "").trim();

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          error:
            "Email is not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in your environment.",
        },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort ? parseInt(smtpPort, 10) : 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: smtpUser, pass: smtpPass },
    });

    const html = `
      <h2>New message from DelightStore contact form</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <h3>Message</h3>
      <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(message)}</pre>
    `;

    await transporter.sendMail({
      from: `"DelightStore Contact" <${smtpUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `[DelightStore] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
