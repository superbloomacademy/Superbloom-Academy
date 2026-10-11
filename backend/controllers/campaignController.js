import Campaign from "../models/Campaign.js";
import CampaignRecipient from "../models/CampaignRecipient.js";
import OptOut from "../models/OptOut.js";
import StudentContact from "../models/StudentContact.js";
import WhatsappReply from "../models/WhatsappReply.js";
import Workshop from "../models/Workshop.js";
import WorkshopRegistration from "../models/WorkshopRegistration.js";
import { mailStatus, verifyMail, sendMail } from "../utils/mailer.js";
import { campaignEmail, filler, validUnsubscribe } from "../utils/campaignEmails.js";
import {
  whatsappStatus, verifyWhatsapp, listTemplates, sendTemplate, toWhatsappNumber,
  explainDeliveryError, webhookToken, validSignature,
} from "../utils/whatsapp.js";

const MAX_RECIPIENTS = 5000;
// One send request works for this long, then answers; the admin page asks again until no one is left.
// It has to end well inside the 30 seconds a serverless function is allowed.
const BUDGET_MS = 12000;
const WORKERS = 3;
// a student claimed by a request that died is picked up again after this
const LOCK_MS = 2 * 60 * 1000;

const validEmail = (s = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
const last10 = (s = "") => String(s).replace(/\D/g, "").slice(-10);
const text = (v, max = 5000) => String(v ?? "").trim().slice(0, max);

const waiting = (campaignId) => ({
  campaign: campaignId,
  $or: [{ "mail.status": "pending" }, { "whatsapp.status": "pending" }],
});

// { [campaignId]: { total, pending, mail: { sent: 3, ... }, whatsapp: { ... } } }
const countsFor = async (ids) => {
  const rows = await CampaignRecipient.aggregate([
    { $match: { campaign: { $in: ids } } },
    { $group: { _id: { c: "$campaign", m: "$mail.status", w: "$whatsapp.status" }, n: { $sum: 1 } } },
  ]);
  const out = {};
  for (const { _id, n } of rows) {
    const c = (out[_id.c] ||= { total: 0, pending: 0, mail: {}, whatsapp: {} });
    c.total += n;
    c.mail[_id.m] = (c.mail[_id.m] || 0) + n;
    c.whatsapp[_id.w] = (c.whatsapp[_id.w] || 0) + n;
    if (_id.m === "pending" || _id.w === "pending") c.pending += n;
  }
  return out;
};

const emptyCounts = { total: 0, pending: 0, mail: {}, whatsapp: {} };

const optOuts = async () => {
  const rows = await OptOut.find().select("channel value").lean();
  return {
    email: new Set(rows.filter((r) => r.channel === "email").map((r) => r.value)),
    whatsapp: new Set(rows.filter((r) => r.channel === "whatsapp").map((r) => r.value)),
  };
};

/* ---------- admin ---------- */

// Whether each channel can send, the approved WhatsApp templates and recent WhatsApp replies.
export const getChannels = async (req, res, next) => {
  try {
    const [mail, wa, templates, replies] = await Promise.all([
      verifyMail(),
      verifyWhatsapp(),
      listTemplates().catch(() => []),
      WhatsappReply.find().sort({ at: -1 }).limit(30).lean(),
    ]);
    res.json({
      email: { ...mailStatus(), working: mail.ok, error: mail.error },
      whatsapp: { ...whatsappStatus(), working: wa.ok, error: wa.error, number: wa.number, name: wa.name, quality: wa.quality },
      templates,
      replies,
    });
  } catch (err) {
    next(err);
  }
};

export const listCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find().populate("workshop", "title slug date").sort({ createdAt: -1 }).lean();
    const counts = await countsFor(campaigns.map((c) => c._id));
    res.json({ campaigns: campaigns.map((c) => ({ ...c, counts: counts[c._id] || emptyCounts })) });
  } catch (err) {
    next(err);
  }
};

export const getCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("workshop", "title slug date").lean();
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    const [counts, recipients] = await Promise.all([
      countsFor([campaign._id]),
      CampaignRecipient.find({ campaign: campaign._id }).select("-lockedUntil").sort({ _id: 1 }).lean(),
    ]);
    res.json({ campaign: { ...campaign, counts: counts[campaign._id] || emptyCounts }, recipients });
  } catch (err) {
    next(err);
  }
};

// Saves the message and builds the list of students. Nothing is sent here.
export const createCampaign = async (req, res, next) => {
  try {
    const b = req.body || {};
    const channels = { email: Boolean(b.channels?.email), whatsapp: Boolean(b.channels?.whatsapp) };
    const name = text(b.name, 120);
    if (!name) return res.status(400).json({ message: "Give the campaign a name." });
    if (!channels.email && !channels.whatsapp)
      return res.status(400).json({ message: "Choose email, WhatsApp or both." });

    const email = {
      subject: text(b.email?.subject, 200),
      heading: text(b.email?.heading, 200),
      message: text(b.email?.message),
      buttonText: text(b.email?.buttonText, 60),
      buttonUrl: text(b.email?.buttonUrl, 500),
    };
    if (channels.email) {
      if (!email.subject || !email.message)
        return res.status(400).json({ message: "The email needs a subject and a message." });
      if (email.buttonText && !/^(https?:\/\/|\{link\})/i.test(email.buttonUrl))
        return res.status(400).json({ message: "The email button needs a link that starts with https://, or {link} for the workshop page." });
    }

    const w = b.whatsapp || {};
    const whatsapp = {
      template: text(w.template, 200),
      language: text(w.language, 20),
      preview: text(w.preview, 2000),
      header: {
        type: ["text", "image"].includes(w.header?.type) ? w.header.type : "none",
        name: text(w.header?.name, 60),
        value: text(w.header?.value, 500),
      },
      body: (Array.isArray(w.body) ? w.body : []).slice(0, 20).map((v) => ({ name: text(v?.name, 60), value: text(v?.value, 500) })),
      button: w.button?.index != null && text(w.button.value)
        ? { index: Number(w.button.index) || 0, value: text(w.button.value, 500) }
        : undefined,
    };
    if (channels.whatsapp) {
      if (!whatsapp.template)
        return res.status(400).json({ message: "Choose a WhatsApp template." });
      if (whatsapp.body.some((v) => !v.value) || (whatsapp.header.type !== "none" && !whatsapp.header.value))
        return res.status(400).json({ message: "Fill in every variable of the WhatsApp template." });
      if (whatsapp.header.type === "image" && !/^https:\/\//i.test(whatsapp.header.value))
        return res.status(400).json({ message: "The WhatsApp header picture needs a public link that starts with https://." });
    }

    let workshop = null;
    if (b.workshop) {
      workshop = await Workshop.findById(b.workshop).select("_id");
      if (!workshop) return res.status(400).json({ message: "The chosen workshop no longer exists." });
    }

    // Who gets it: students of earlier workshops, saved student lists, then any contacts typed in or uploaded
    const audience = b.audience || {};
    const fromWorkshops = (Array.isArray(audience.workshops) ? audience.workshops : []).filter((id) => /^[a-f0-9]{24}$/i.test(id));
    const statuses = (Array.isArray(audience.statuses) ? audience.statuses : ["verified"]).filter((s) =>
      ["pending", "verified", "rejected"].includes(s),
    );
    const registrations = fromWorkshops.length
      ? await WorkshopRegistration.find({ workshop: { $in: fromWorkshops }, status: { $in: statuses } })
          .select("name email phone college")
          .sort({ createdAt: 1 })
          .lean()
      : [];
    const lists = (Array.isArray(audience.lists) ? audience.lists : []).map((l) => String(l)).filter(Boolean);
    const saved = lists.length
      ? await StudentContact.find({ lists: { $in: lists } }).select("name email phone college").sort({ _id: 1 }).lean()
      : [];
    const contacts = Array.isArray(audience.contacts) ? audience.contacts : [];
    const people = [...registrations, ...saved, ...contacts];
    if (people.length > MAX_RECIPIENTS)
      return res.status(400).json({ message: `One campaign can go to ${MAX_RECIPIENTS} people at most. Split the list.` });

    const out = await optOuts();
    const seen = { email: new Set(), phone: new Set() };
    const summary = { added: 0, duplicates: 0, noContact: 0, optedOut: 0 };
    const recipients = [];
    for (const p of people) {
      const address = validEmail(p?.email) ? String(p.email).trim().toLowerCase() : "";
      const phone = toWhatsappNumber(p?.phone);
      const useMail = channels.email && address;
      const useWa = channels.whatsapp && phone;
      if (!useMail && !useWa) {
        summary.noContact++;
        continue;
      }
      const newMail = useMail && !seen.email.has(address);
      const newWa = useWa && !seen.phone.has(phone);
      if (!newMail && !newWa) {
        summary.duplicates++;
        continue;
      }
      const state = (on, has, isNew, stopped, missingText, stoppedText) =>
        !on ? { status: "none" }
          : !has ? { status: "skipped", error: missingText }
            : !isNew ? { status: "skipped", error: "Already in this list under another name." }
              : stopped ? { status: "skipped", error: stoppedText }
                : { status: "pending" };
      const mail = state(channels.email, address, newMail, out.email.has(address), "No email address.", "Asked not to be emailed.");
      const wa = state(channels.whatsapp, phone, newWa, out.whatsapp.has(last10(phone)), "No valid mobile number.", "Asked not to be messaged on WhatsApp.");
      if (address) seen.email.add(address);
      if (phone) seen.phone.add(phone);
      if (mail.status !== "pending" && wa.status !== "pending") {
        summary.optedOut++;
        continue;
      }
      recipients.push({ name: text(p.name, 120), email: address, phone, college: text(p.college, 200), mail, whatsapp: wa });
    }
    if (!recipients.length)
      return res.status(400).json({
        message: people.length
          ? "No one in this list can be reached on the chosen channels."
          : "Choose at least one earlier workshop or saved list, or add contacts.",
      });

    const campaign = await Campaign.create({
      name,
      kind: b.kind,
      channels,
      workshop: workshop?._id,
      email: channels.email ? email : undefined,
      whatsapp: channels.whatsapp ? whatsapp : undefined,
      createdBy: req.user?.id,
    });
    await CampaignRecipient.insertMany(recipients.map((r) => ({ ...r, campaign: campaign._id })));
    summary.added = recipients.length;
    res.status(201).json({ campaign, summary });
  } catch (err) {
    if (err.name === "ValidationError") err.status = 400;
    next(err);
  }
};

export const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    await CampaignRecipient.deleteMany({ campaign: campaign._id });
    res.json({ message: "Campaign deleted" });
  } catch (err) {
    next(err);
  }
};

// Sends the campaign's message to one address and number, so the admin can read it first.
export const testCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    const workshop = campaign.workshop ? await Workshop.findById(campaign.workshop) : null;
    const to = { name: text(req.body.name, 120) || "Student", email: text(req.body.email, 200).toLowerCase(), phone: text(req.body.phone, 30), college: "Your College" };
    const result = {};
    if (campaign.channels.email && to.email) {
      if (!validEmail(to.email)) return res.status(400).json({ message: "Enter a valid email address." });
      result.mail = await sendMail({ to: to.email, ...campaignEmail(campaign, to, workshop) });
    }
    if (campaign.channels.whatsapp && to.phone)
      result.whatsapp = await sendTemplate({ to: to.phone, whatsapp: campaign.whatsapp, fill: filler(to, workshop) });
    if (!result.mail && !result.whatsapp)
      return res.status(400).json({ message: "Enter an email address or a mobile number to test with." });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const claim = (campaignId) =>
  CampaignRecipient.findOneAndUpdate(
    { ...waiting(campaignId), $and: [{ $or: [{ lockedUntil: null }, { lockedUntil: { $lt: new Date() } }] }] },
    { $set: { lockedUntil: new Date(Date.now() + LOCK_MS) } },
    { new: true, sort: { _id: 1 } },
  );

const deliver = async (campaign, workshop, r, out) => {
  // each result is saved as soon as it is known, so a request that is cut off
  // half way never leads to the same message going out again
  if (r.mail.status === "pending") {
    const result = out.email.has(r.email)
      ? { status: "skipped", error: "Asked not to be emailed." }
      : await sendMail({ to: r.email, ...campaignEmail(campaign, r, workshop) });
    await CampaignRecipient.updateOne({ _id: r._id }, { $set: { mail: { status: result.status, error: result.error, at: new Date() } } });
  }
  if (r.whatsapp.status === "pending") {
    const result = out.whatsapp.has(last10(r.phone))
      ? { status: "skipped", error: "Asked not to be messaged on WhatsApp." }
      : await sendTemplate({ to: r.phone, whatsapp: campaign.whatsapp, fill: filler(r, workshop) });
    await CampaignRecipient.updateOne(
      { _id: r._id },
      { $set: { whatsapp: { status: result.status, error: result.error, at: new Date(), messageId: result.messageId } } },
    );
  }
  await CampaignRecipient.updateOne({ _id: r._id }, { $unset: { lockedUntil: 1 } });
};

// Sends to as many waiting students as fit in one request and reports how many are left.
export const sendCampaignBatch = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    if (campaign.channels.email && !mailStatus().configured)
      return res.status(400).json({ message: "Email is not set up on the server yet, so this campaign cannot be sent. See the channel status above." });
    if (campaign.channels.whatsapp && !whatsappStatus().configured)
      return res.status(400).json({ message: "WhatsApp is not set up on the server yet, so this campaign cannot be sent. See the channel status above." });

    const workshop = campaign.workshop ? await Workshop.findById(campaign.workshop) : null;
    const out = await optOuts();
    if (campaign.status !== "sending") {
      campaign.status = "sending";
      campaign.startedAt ||= new Date();
      await campaign.save();
    }

    const deadline = Date.now() + BUDGET_MS;
    const worker = async () => {
      while (Date.now() < deadline) {
        const r = await claim(campaign._id);
        if (!r) return;
        await deliver(campaign, workshop, r, out);
      }
    };
    await Promise.all(Array.from({ length: WORKERS }, worker));

    const remaining = await CampaignRecipient.countDocuments(waiting(campaign._id));
    if (!remaining) {
      campaign.status = "sent";
      campaign.finishedAt = new Date();
      await campaign.save();
    }
    const counts = await countsFor([campaign._id]);
    res.json({ remaining, status: campaign.status, counts: counts[campaign._id] || emptyCounts });
  } catch (err) {
    next(err);
  }
};

// Puts the messages that failed back in the queue; the admin then presses Send again.
export const retryCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    const [mail, wa] = await Promise.all([
      CampaignRecipient.updateMany({ campaign: campaign._id, "mail.status": "failed" }, { $set: { "mail.status": "pending" } }),
      CampaignRecipient.updateMany(
        { campaign: campaign._id, "whatsapp.status": "failed" },
        { $set: { "whatsapp.status": "pending" }, $unset: { "whatsapp.messageId": 1 } },
      ),
    ]);
    res.json({ queued: (mail.modifiedCount || 0) + (wa.modifiedCount || 0) });
  } catch (err) {
    next(err);
  }
};

/* ---------- public: stop emails ---------- */

const page = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head>
<body style="margin:0;background:#edf2fd;font-family:Arial,Helvetica,sans-serif;color:#0a1a4a;">
<div style="max-width:480px;margin:48px auto;padding:28px;background:#ffffff;border-radius:16px;">
<p style="margin:0 0 18px;font-size:20px;font-weight:bold;">Superbloom Academy</p>
${body}
</div></body></html>`;

const escape = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// The link in the email opens a page with a button. Stopping needs the button press,
// because mail scanners open every link in a message on their own.
export const unsubscribePage = (req, res) => {
  const email = String(req.query.e || "").toLowerCase();
  if (!validUnsubscribe(email, req.query.t))
    return res.status(400).send(page("Link not valid", `<p style="font-size:16px;line-height:1.6;">This link is not valid. Reply to the email and we will take you off the list.</p>`));
  res.send(
    page(
      "Stop emails",
      `<p style="font-size:16px;line-height:1.6;">Stop emails about workshops and courses to <strong>${escape(email)}</strong>?</p>
<p style="font-size:14px;line-height:1.6;color:#465079;">You will still get emails about a workshop you register for.</p>
<form method="post" action="?e=${encodeURIComponent(email)}&amp;t=${encodeURIComponent(String(req.query.t))}">
<button type="submit" style="background:#0a1a4a;color:#ffffff;font-weight:bold;font-size:16px;border:0;padding:13px 22px;border-radius:9px;cursor:pointer;">Yes, stop these emails</button>
</form>`,
    ),
  );
};

export const unsubscribe = async (req, res, next) => {
  try {
    const email = String(req.query.e || "").toLowerCase();
    if (!validUnsubscribe(email, req.query.t)) return res.status(400).send(page("Link not valid", `<p style="font-size:16px;">This link is not valid.</p>`));
    await OptOut.updateOne({ channel: "email", value: email }, { $setOnInsert: { channel: "email", value: email } }, { upsert: true });
    res.send(page("Emails stopped", `<p style="font-size:16px;line-height:1.6;">Done. We will not email <strong>${escape(email)}</strong> about workshops and courses again.</p>`));
  } catch (err) {
    next(err);
  }
};

/* ---------- WhatsApp webhook ---------- */

// Meta calls this once, when the webhook address is saved in the app dashboard.
export const verifyWebhook = (req, res) => {
  const token = webhookToken();
  if (token && req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === token)
    return res.status(200).send(String(req.query["hub.challenge"] || ""));
  res.sendStatus(403);
};

// a report only ever moves a message forward
const earlier = { delivered: ["sent"], read: ["sent", "delivered"], failed: ["sent", "delivered"] };
const stopWords = /^\s*(stop|stop messages|stop promotions|unsubscribe|opt out|opt-out)\s*[.!]?\s*$/i;

// Delivery reports (delivered, read, failed) and messages students send to the business number.
export const receiveWebhook = async (req, res) => {
  if (!validSignature(req.rawBody, req.get("x-hub-signature-256"))) return res.sendStatus(401);
  try {
    for (const entry of req.body?.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};
        for (const s of value.statuses || []) {
          if (!earlier[s.status]) continue;
          await CampaignRecipient.updateOne(
            { "whatsapp.messageId": s.id, "whatsapp.status": { $in: earlier[s.status] } },
            {
              $set: {
                "whatsapp.status": s.status,
                "whatsapp.at": new Date(Number(s.timestamp) * 1000 || Date.now()),
                ...(s.status === "failed" ? { "whatsapp.error": explainDeliveryError(s.errors?.[0]) } : {}),
              },
            },
          );
        }
        const names = Object.fromEntries((value.contacts || []).map((c) => [c.wa_id, c.profile?.name]));
        for (const m of value.messages || []) {
          const said = m.text?.body || m.button?.text || m.interactive?.button_reply?.title || `(${m.type || "message"})`;
          if (stopWords.test(said)) {
            const number = last10(m.from);
            await OptOut.updateOne({ channel: "whatsapp", value: number }, { $setOnInsert: { channel: "whatsapp", value: number } }, { upsert: true });
          }
          await WhatsappReply.updateOne(
            { messageId: m.id },
            { $setOnInsert: { messageId: m.id, from: m.from, name: names[m.from], text: String(said).slice(0, 2000), at: new Date(Number(m.timestamp) * 1000 || Date.now()) } },
            { upsert: true },
          );
        }
      }
    }
  } catch (err) {
    console.error("WhatsApp webhook error:", err.message);
  }
  // always answer 200, or Meta keeps sending the same report again
  res.sendStatus(200);
};
