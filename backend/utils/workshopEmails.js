import { sendMail } from "./mailer.js";

// Emails sent to a student about a workshop registration:
//   paid workshop  -> "registration received" on sign-up, then "seat confirmed" once an admin verifies
//                     the payment, or "payment not verified" if the admin rejects it
//   free workshop  -> "seat confirmed" on sign-up

const siteUrl = () => (process.env.SITE_URL || "https://www.superbloomacademy.in").trim().replace(/\/$/, "");
const PHONE = "+91 91210 90091";

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
  });

const modeLabel = { online: "Online", offline: "In person", hybrid: "Hybrid" };

const details = (r, w) =>
  [
    ["Workshop", w.title],
    ["Date", formatDate(w.date)],
    w.time && ["Time", w.time],
    ["Mode", modeLabel[w.mode] || w.mode],
    w.venue && ["Venue", w.venue],
    ["Fee", r.amount > 0 ? `₹${r.amount}` : "Free"],
    r.utr && ["UPI reference (UTR)", r.utr],
  ].filter(Boolean);

const statusLink = (r) => `${siteUrl()}/workshops/status?ref=${encodeURIComponent(r.code)}`;

// Table-based layout with inline styles: the only thing every mail app renders the same way.
const layout = ({ heading, intro, r, w, note }) => `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#edf2fd;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edf2fd;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#0a1a4a;">
  <tr><td style="background:#0a1a4a;padding:22px 28px;color:#ffffff;font-size:20px;font-weight:bold;">Superbloom Academy</td></tr>
  <tr><td style="padding:28px;">
    <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#0a1a4a;">${esc(heading)}</h1>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#465079;">Hi ${esc(r.name)}, ${intro}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edf2fd;border-radius:12px;">
      <tr><td style="padding:18px 20px;">
        <p style="margin:0;font-size:13px;font-weight:bold;color:#465079;">Your registration reference</p>
        <p style="margin:6px 0 0;font-family:'Courier New',Courier,monospace;font-size:26px;font-weight:bold;letter-spacing:2px;color:#0a1a4a;">${esc(r.code)}</p>
      </td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;font-size:15px;line-height:1.5;">
      ${details(r, w)
        .map(
          ([label, value]) =>
            `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #d3dcf2;color:#465079;width:42%;vertical-align:top;">${esc(label)}</td><td style="padding:8px 0;border-bottom:1px solid #d3dcf2;font-weight:bold;vertical-align:top;">${esc(value)}</td></tr>`,
        )
        .join("\n      ")}
    </table>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#465079;">${note}</p>
    <a href="${statusLink(r)}" style="display:inline-block;background:#f6a21a;color:#0a1a4a;font-weight:bold;font-size:16px;text-decoration:none;padding:13px 22px;border-radius:9px;">Check my registration</a>
    <p style="margin:26px 0 0;font-size:14px;line-height:1.6;color:#465079;">Questions? Call or WhatsApp us on ${PHONE}.</p>
  </td></tr>
  <tr><td style="background:#fafbff;border-top:1px solid #d3dcf2;padding:16px 28px;font-size:12px;line-height:1.5;color:#465079;">
    You are receiving this email because this address was used to register for a Superbloom Academy workshop.
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

const plain = ({ heading, intro, r, w, note }) =>
  [
    heading,
    "",
    `Hi ${r.name}, ${intro}`,
    "",
    `Registration reference: ${r.code}`,
    ...details(r, w).map(([label, value]) => `${label}: ${value}`),
    "",
    note,
    "",
    `Check your registration: ${statusLink(r)}`,
    `Questions? Call or WhatsApp us on ${PHONE}.`,
    "",
    "Superbloom Academy",
  ].join("\n");

const strip = (html) => html.replace(/<[^>]+>/g, "");

export const receivedEmail = (r, w) => {
  const content = {
    heading: "We have received your registration",
    intro: `thank you for registering for <strong>${esc(w.title)}</strong>. We are now checking your payment.`,
    note: "We check each payment against its UPI reference, usually once it shows in our bank statement. You will get another email as soon as your seat is confirmed. Keep your reference: you need it, with your mobile number, to check your status.",
    r,
    w,
  };
  return {
    subject: `Registration received: ${w.title} (${r.code})`,
    html: layout(content),
    text: plain({ ...content, intro: strip(content.intro) }),
  };
};

export const confirmedEmail = (r, w) => {
  const paid = r.amount > 0;
  const content = {
    heading: "Your seat is confirmed",
    intro: paid
      ? `we have verified your payment of ₹${r.amount} and your seat for <strong>${esc(w.title)}</strong> is confirmed.`
      : `your seat for <strong>${esc(w.title)}</strong> is confirmed. This workshop is free, so there is nothing to pay.`,
    note: "Please keep this email and carry your registration reference on the day. If your plans change, tell us so the seat can go to someone else.",
    r,
    w,
  };
  return {
    subject: `Seat confirmed: ${w.title} (${r.code})`,
    html: layout(content),
    text: plain({ ...content, intro: strip(content.intro) }),
  };
};

export const rejectedEmail = (r, w) => {
  const content = {
    heading: "We could not verify your payment",
    intro: `we could not match a payment to the UPI reference you gave us for <strong>${esc(w.title)}</strong>, so your seat is not confirmed.`,
    note: "If you have paid, reply to this email with a screenshot of the payment that shows the UPI reference, or call us, and we will check again. If the payment did not go through, you can register again on the website.",
    r,
    w,
  };
  return {
    subject: `Payment not verified: ${w.title} (${r.code})`,
    html: layout(content),
    text: plain({ ...content, intro: strip(content.intro) }),
  };
};

const byStatus = {
  pending: ["received", receivedEmail],
  verified: ["confirmed", confirmedEmail],
  rejected: ["rejected", rejectedEmail],
};

// Sends the email that matches the registration's status and returns a log entry for it.
// Free workshops are verified straight away, so they get "confirmed" on sign-up.
export const sendWorkshopEmail = async (r, w) => {
  const [kind, build] = byStatus[r.status] || byStatus.pending;
  const result = await sendMail({ to: r.email, ...build(r, w) });
  return { kind, status: result.status, error: result.error, at: new Date() };
};

// A plain message to prove the mail settings work, sent from the admin panel.
export const sendTestEmail = (to) => {
  const line = "This is a test email from the Superbloom Academy website. If you can read it, workshop emails are working.";
  return sendMail({
    to,
    subject: "Superbloom Academy: test email",
    text: line,
    html: `<p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#0a1a4a;">${line}</p>`,
  });
};
