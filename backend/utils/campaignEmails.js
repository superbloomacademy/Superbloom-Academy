import crypto from "crypto";

// The email of a campaign (workshop invitation, course offer, feedback request),
// and the placeholders shared by the email and the WhatsApp message.

const siteUrl = () => (process.env.SITE_URL || "https://www.superbloomacademy.in").trim().replace(/\/$/, "");
const PHONE = "+91 91210 90091";

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
  });

const modeLabel = { online: "Online", offline: "In person", hybrid: "Hybrid" };

const firstName = (name = "") => name.trim().split(/\s+/)[0] || "there";

// {name} and {college} come from the student; the rest from the campaign's workshop.
const values = (recipient, workshop) => {
  const price = workshop?.currentPrice ? workshop.currentPrice() : workshop?.price;
  return {
    name: firstName(recipient.name),
    fullname: (recipient.name || "").trim() || "there",
    college: recipient.college || "",
    workshop: workshop?.title || "",
    date: workshop?.date ? formatDate(workshop.date) : "",
    time: workshop?.time || "",
    venue: workshop?.venue || "",
    mode: workshop ? modeLabel[workshop.mode] || workshop.mode : "",
    fee: workshop ? (price > 0 ? `₹${price}` : "Free") : "",
    slug: workshop?.slug || "",
    link: workshop?.slug ? `${siteUrl()}/workshops/${workshop.slug}` : `${siteUrl()}/workshops`,
  };
};

// Returns a function that swaps {name}-style placeholders in a text. Unknown ones are left as typed.
export const filler = (recipient, workshop) => {
  const v = values(recipient, workshop);
  return (text = "") => String(text).replace(/\{(\w+)\}/g, (whole, key) => (key in v ? v[key] : whole));
};

/* ---------- unsubscribe ---------- */

const sign = (email) =>
  crypto.createHmac("sha256", process.env.JWT_ACCESS_SECRET || "").update(`unsubscribe:${email}`).digest("hex").slice(0, 32);

// The website forwards /api/* to this server, so the link stays on the academy's own domain.
export const unsubscribeLink = (email) =>
  `${siteUrl()}/api/public/unsubscribe?e=${encodeURIComponent(email)}&t=${sign(email)}`;

export const validUnsubscribe = (email, token) => {
  const a = Buffer.from(sign(String(email || "").toLowerCase()));
  const b = Buffer.from(String(token || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

/* ---------- email ---------- */

const details = (w) =>
  [
    ["Workshop", w.title],
    ["Date", formatDate(w.date)],
    w.time && ["Time", w.time],
    ["Mode", modeLabel[w.mode] || w.mode],
    w.venue && ["Venue", w.venue],
    ["Fee", w.currentPrice() > 0 ? `₹${w.currentPrice()}` : "Free"],
  ].filter(Boolean);

const paragraphs = (text) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

// Same table-based layout as the registration emails, so every mail app renders it the same way.
const layout = ({ heading, message, button, workshop, unsubscribe }) => `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#edf2fd;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edf2fd;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#0a1a4a;">
  <tr><td style="background:#0a1a4a;padding:22px 28px;color:#ffffff;font-size:20px;font-weight:bold;">Superbloom Academy</td></tr>
  <tr><td style="padding:28px;">
    <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#0a1a4a;">${esc(heading)}</h1>
    ${paragraphs(message)
      .map((p) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#465079;">${esc(p).replace(/\n/g, "<br>")}</p>`)
      .join("\n    ")}
    ${
      workshop
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 22px;font-size:15px;line-height:1.5;">
      ${details(workshop)
        .map(
          ([label, value]) =>
            `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #d3dcf2;color:#465079;width:42%;vertical-align:top;">${esc(label)}</td><td style="padding:8px 0;border-bottom:1px solid #d3dcf2;font-weight:bold;vertical-align:top;">${esc(value)}</td></tr>`,
        )
        .join("\n      ")}
    </table>`
        : ""
    }
    ${
      button
        ? `<a href="${esc(button.url)}" style="display:inline-block;background:#f6a21a;color:#0a1a4a;font-weight:bold;font-size:16px;text-decoration:none;padding:13px 22px;border-radius:9px;">${esc(button.text)}</a>`
        : ""
    }
    <p style="margin:26px 0 0;font-size:14px;line-height:1.6;color:#465079;">Questions? Call or WhatsApp us on ${PHONE}.</p>
  </td></tr>
  <tr><td style="background:#fafbff;border-top:1px solid #d3dcf2;padding:16px 28px;font-size:12px;line-height:1.5;color:#465079;">
    You are receiving this email because you took part in, or registered for, a Superbloom Academy workshop.
    <a href="${esc(unsubscribe)}" style="color:#465079;">Stop these emails</a>.
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

export const campaignEmail = (campaign, recipient, workshop) => {
  const fill = filler(recipient, workshop);
  const e = campaign.email || {};
  const heading = fill(e.heading || e.subject || "");
  const message = fill(e.message || "");
  const url = fill(e.buttonUrl || "").trim();
  const button = e.buttonText && /^https?:\/\//i.test(url) ? { text: fill(e.buttonText), url } : null;
  const unsubscribe = unsubscribeLink(recipient.email);
  return {
    subject: fill(e.subject || heading),
    html: layout({ heading, message, button, workshop, unsubscribe }),
    text: [
      heading,
      "",
      message,
      "",
      ...(workshop ? [...details(workshop).map(([label, value]) => `${label}: ${value}`), ""] : []),
      ...(button ? [`${button.text}: ${button.url}`, ""] : []),
      `Questions? Call or WhatsApp us on ${PHONE}.`,
      "",
      "Superbloom Academy",
      `Stop these emails: ${unsubscribe}`,
    ].join("\n"),
    // lets Gmail and others show their own "Unsubscribe" link beside the sender
    headers: { "List-Unsubscribe": `<${unsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  };
};
