import nodemailer from "nodemailer";

// Email is optional. Without the SMTP settings every send is skipped,
// so registrations keep working before mail is set up.

// Values pasted into a hosting dashboard often carry stray spaces or quotes.
const env = (key) => (process.env[key] || "").trim().replace(/^["']|["']$/g, "");

const settings = () => ({
  host: env("SMTP_HOST"),
  port: Number(env("SMTP_PORT")) || 465,
  user: env("SMTP_USER"),
  // Gmail shows app passwords in groups of four; the spaces are not part of it
  pass: env("SMTP_PASS").replace(/\s+/g, ""),
});

const REQUIRED = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"];
const missing = () => REQUIRED.filter((key) => !env(key));

const sender = () => env("MAIL_FROM") || `Superbloom Academy <${env("SMTP_USER")}>`;

let transport;
let transportKey = "";

const getTransport = () => {
  if (missing().length) return null;
  const s = settings();
  const key = `${s.host}|${s.port}|${s.user}|${s.pass}`;
  if (!transport || key !== transportKey) {
    transport = nodemailer.createTransport({
      host: s.host,
      port: s.port,
      secure: s.port === 465,
      auth: { user: s.user, pass: s.pass },
      // a slow mail server must not hold the request open for long
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
    transportKey = key;
  }
  return transport;
};

// A sentence an admin can act on, for the errors that actually happen.
const explain = (err) => {
  const text = `${err.code || ""} ${err.responseCode || ""} ${err.message || ""}`;
  if (/EAUTH|535|534|Username and Password not accepted/i.test(text))
    return "The mail server rejected the login. Check SMTP_USER and SMTP_PASS. For Gmail, SMTP_PASS must be an app password, not the normal password.";
  if (/ETIMEDOUT|ESOCKET|ECONNECTION|ECONNREFUSED|Greeting never received|timeout/i.test(text))
    return "Could not reach the mail server. Check SMTP_HOST and SMTP_PORT (Gmail: smtp.gmail.com and 465).";
  if (/ENOTFOUND|EDNS|getaddrinfo/i.test(text))
    return "The mail server address was not found. Check SMTP_HOST (Gmail: smtp.gmail.com).";
  if (/550|553|EENVELOPE|No recipients/i.test(text))
    return "The mail server refused the address. Check the recipient's email and MAIL_FROM.";
  if (/ quota|limit exceeded|421|452/i.test(text))
    return "The mail account has hit its sending limit for now. Try again later.";
  return (err.message || "Unknown error").slice(0, 300);
};

// What the admin panel shows. Never includes the password.
export const mailStatus = () => {
  const s = settings();
  return {
    configured: missing().length === 0,
    missing: missing(),
    host: s.host,
    port: s.port,
    user: s.user,
    from: sender(),
  };
};

// Logs in to the mail server without sending anything.
export const verifyMail = async () => {
  const t = getTransport();
  if (!t) return { ok: false, error: `Missing settings: ${missing().join(", ")}.` };
  try {
    await t.verify();
    return { ok: true };
  } catch (err) {
    console.error("Mail check failed:", err.message);
    return { ok: false, error: explain(err) };
  }
};

// Resolves to { status: "sent" | "failed" | "skipped", error? }. Never throws:
// a mail failure must not fail the registration that triggered it.
export const sendMail = async ({ to, subject, html, text }) => {
  const t = getTransport();
  if (!t) {
    console.warn(`Email skipped, SMTP is not configured: "${subject}"`);
    return { status: "skipped", error: `Email is not set up. Missing: ${missing().join(", ")}.` };
  }
  try {
    await t.sendMail({ from: sender(), replyTo: env("MAIL_REPLY_TO") || undefined, to, subject, html, text });
    return { status: "sent" };
  } catch (err) {
    console.error(`Email failed: "${subject}":`, err.message);
    return { status: "failed", error: explain(err) };
  }
};
