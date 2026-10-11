import crypto from "crypto";

// WhatsApp messages go through Meta's WhatsApp Business Cloud API, from the academy's own
// business number. Nothing here touches a personal WhatsApp account.
// WhatsApp is optional: without the settings below every send is skipped.

const env = (key) => (process.env[key] || "").trim().replace(/^["']|["']$/g, "");

const REQUIRED = ["WHATSAPP_TOKEN", "WHATSAPP_PHONE_ID", "WHATSAPP_BUSINESS_ID"];
const missing = () => REQUIRED.filter((key) => !env(key));

const graph = (path) => `https://graph.facebook.com/${env("WHATSAPP_API_VERSION") || "v23.0"}/${path}`;

const call = async (path, options = {}) => {
  const res = await fetch(graph(path), {
    ...options,
    headers: { Authorization: `Bearer ${env("WHATSAPP_TOKEN")}`, "Content-Type": "application/json" },
    // a slow answer must not hold the request open for long
    signal: AbortSignal.timeout(12000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const e = data.error || {};
    throw Object.assign(new Error(e.error_data?.details || e.message || `WhatsApp answered ${res.status}`), { code: e.code });
  }
  return data;
};

// A sentence an admin can act on, for the errors that actually happen.
const explain = (err) => {
  const known = {
    190: "The WhatsApp access token has expired or is wrong. Create a new permanent token in Meta Business settings and update WHATSAPP_TOKEN.",
    10: "The access token is not allowed to use this WhatsApp account. Give the system user access to the WhatsApp account and its number.",
    200: "The access token is not allowed to use this WhatsApp account. Give the system user access to the WhatsApp account and its number.",
    100: "WhatsApp rejected the request. Check WHATSAPP_PHONE_ID and WHATSAPP_BUSINESS_ID, and that every template variable has a value.",
    130429: "WhatsApp is receiving messages too fast. Wait a minute and press Send again.",
    131026: "Not delivered. The number is probably not on WhatsApp.",
    131030: "This number is not on the allowed list of the test number. Add it in the Meta dashboard, or switch to your real business number.",
    131047: "More than 24 hours have passed since this person last wrote. Send an approved template instead.",
    131048: "WhatsApp paused sending because too many people blocked or reported the messages. Wait and review the message.",
    131049: "WhatsApp chose not to deliver this, to limit the promotional messages one person gets. Try again after a day.",
    131056: "Too many messages to this number in a short time. Try again later.",
    132000: "The number of values does not match the variables in the template. Open the campaign and fill every variable.",
    132001: "The template does not exist in this language or is not approved yet. Check it in WhatsApp Manager.",
    132012: "A template variable has the wrong format. Check the header and button values.",
    132015: "This template is paused because of low quality. Edit it in WhatsApp Manager.",
    132016: "This template has been disabled by Meta. Create a new one in WhatsApp Manager.",
    131042: "There is a payment problem on the WhatsApp account. Add or fix the payment method in Meta Business settings.",
  };
  if (known[err.code]) return known[err.code];
  if (/timeout|aborted|fetch failed|ENOTFOUND|ECONNRESET/i.test(`${err.name} ${err.message}`))
    return "Could not reach WhatsApp. Try again.";
  return (err.message || "Unknown error").slice(0, 300);
};

// 10-digit Indian numbers get the country code; anything else must already carry one.
export const toWhatsappNumber = (raw = "") => {
  let digits = String(raw).replace(/\D/g, "").replace(/^00/, "");
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = "91" + digits;
  return digits.length >= 11 && digits.length <= 15 ? digits : "";
};

// What the admin panel shows. Never includes the token.
export const whatsappStatus = () => ({
  configured: missing().length === 0,
  missing: missing(),
  webhook: Boolean(env("WHATSAPP_VERIFY_TOKEN")),
});

// Asks Meta about the sending number without sending anything.
export const verifyWhatsapp = async () => {
  if (missing().length) return { ok: false, error: `Missing settings: ${missing().join(", ")}.` };
  try {
    const n = await call(`${env("WHATSAPP_PHONE_ID")}?fields=display_phone_number,verified_name,quality_rating`);
    return { ok: true, number: n.display_phone_number, name: n.verified_name, quality: n.quality_rating };
  } catch (err) {
    console.error("WhatsApp check failed:", err.message);
    return { ok: false, error: explain(err) };
  }
};

const variables = (text = "") => [...new Set([...text.matchAll(/\{\{\s*([\w]+)\s*\}\}/g)].map((m) => m[1]))];

// Approved templates in the shape the admin form needs.
export const listTemplates = async () => {
  if (missing().length) return [];
  const data = await call(
    `${env("WHATSAPP_BUSINESS_ID")}/message_templates?fields=name,language,status,category,components&limit=200`,
  );
  return (data.data || [])
    .filter((t) => t.status === "APPROVED")
    .map((t) => {
      const part = (type) => (t.components || []).find((c) => c.type === type);
      const header = part("HEADER");
      const body = part("BODY");
      const buttons = part("BUTTONS")?.buttons || [];
      const linkIndex = buttons.findIndex((b) => b.type === "URL" && /\{\{/.test(b.url || ""));
      // only text and image headers are supported here
      const supported = !header || ["TEXT", "IMAGE"].includes(header.format);
      return {
        name: t.name,
        language: t.language,
        category: t.category,
        supported,
        header: !header
          ? { type: "none" }
          : header.format === "IMAGE"
            ? { type: "image" }
            : { type: variables(header.text).length ? "text" : "none", text: header.text, name: variables(header.text)[0] },
        body: body?.text || "",
        bodyVariables: variables(body?.text),
        footer: part("FOOTER")?.text || "",
        buttons: buttons.map((b) => b.text),
        linkButton: linkIndex >= 0 ? { index: linkIndex, text: buttons[linkIndex].text, url: buttons[linkIndex].url } : null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

// WhatsApp refuses variables with line breaks, tabs or long runs of spaces, and empty ones.
const param = (value) => String(value ?? "").replace(/\s+/g, " ").trim() || "-";

// Variables are numbered ({{1}}) in most templates and named ({{first_name}}) in newer ones.
const textParam = (name, value) => ({
  type: "text",
  text: param(value),
  ...(name && !/^\d+$/.test(name) ? { parameter_name: name } : {}),
});

// Resolves to { status: "sent" | "failed" | "skipped", error?, messageId? }. Never throws.
// `fill` turns a stored value such as "{name}" into the text for this student.
export const sendTemplate = async ({ to, whatsapp, fill = (s) => s }) => {
  if (missing().length)
    return { status: "skipped", error: `WhatsApp is not set up. Missing: ${missing().join(", ")}.` };
  const number = toWhatsappNumber(to);
  if (!number) return { status: "skipped", error: "Not a valid mobile number." };

  const components = [];
  const header = whatsapp.header || {};
  if (header.type === "image")
    components.push({ type: "header", parameters: [{ type: "image", image: { link: fill(header.value || "").trim() } }] });
  if (header.type === "text")
    components.push({ type: "header", parameters: [textParam(header.name, fill(header.value))] });
  if (whatsapp.body?.length)
    components.push({ type: "body", parameters: whatsapp.body.map((v) => textParam(v.name, fill(v.value))) });
  if (whatsapp.button?.index != null && whatsapp.button.value)
    components.push({
      type: "button",
      sub_type: "url",
      index: String(whatsapp.button.index),
      parameters: [{ type: "text", text: param(fill(whatsapp.button.value)) }],
    });

  try {
    const data = await call(`${env("WHATSAPP_PHONE_ID")}/messages`, {
      method: "POST",
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: number,
        type: "template",
        template: { name: whatsapp.template, language: { code: whatsapp.language || "en" }, components },
      }),
    });
    return { status: "sent", messageId: data.messages?.[0]?.id };
  } catch (err) {
    console.error(`WhatsApp failed: "${whatsapp.template}":`, err.message);
    return { status: "failed", error: explain(err) };
  }
};

// A failed delivery report carries the same error codes as a failed send.
export const explainDeliveryError = (e = {}) =>
  explain({ code: e.code, message: e.error_data?.details || e.title || e.message });

/* ---------- webhook ---------- */

export const webhookToken = () => env("WHATSAPP_VERIFY_TOKEN");

// Meta signs each webhook call with the app secret. Without WHATSAPP_APP_SECRET the check is off.
export const validSignature = (rawBody, header = "") => {
  const secret = env("WHATSAPP_APP_SECRET");
  if (!secret) return true;
  if (!rawBody || !header) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(header);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
