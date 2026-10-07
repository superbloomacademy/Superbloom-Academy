import nodemailer from "nodemailer";

// Email is optional. Without the SMTP settings every send is skipped and logged,
// so registrations keep working before a mail provider is set up.
let transport;

const getTransport = () => {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (!transport) {
    const port = Number(process.env.SMTP_PORT) || 465;
    transport = nodemailer.createTransport({
      host: SMTP_HOST.trim(),
      port,
      secure: port === 465,
      auth: { user: SMTP_USER.trim(), pass: SMTP_PASS },
      // a slow mail server must not hold the request open for long
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    });
  }
  return transport;
};

export const mailConfigured = () => Boolean(getTransport());

// Resolves to true once the mail server has accepted the message. Never throws:
// a mail failure must not fail the registration that triggered it.
export const sendMail = async ({ to, subject, html, text }) => {
  const t = getTransport();
  if (!t) {
    console.warn(`Email skipped, SMTP is not configured: "${subject}"`);
    return false;
  }
  try {
    await t.sendMail({
      from: process.env.MAIL_FROM || `Superbloom Academy <${process.env.SMTP_USER.trim()}>`,
      replyTo: process.env.MAIL_REPLY_TO || undefined,
      to,
      subject,
      html,
      text,
    });
    return true;
  } catch (err) {
    console.error(`Email failed: "${subject}":`, err.message);
    return false;
  }
};
