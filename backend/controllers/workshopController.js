import Workshop from "../models/Workshop.js";
import WorkshopRegistration from "../models/WorkshopRegistration.js";
import PaymentSetting from "../models/PaymentSetting.js";
import CollegeEnquiry from "../models/CollegeEnquiry.js";
import { cleanAttribution } from "../utils/attribution.js";
import { sendConfirmationEmail, sendRegistrationEmail } from "../utils/workshopEmails.js";

const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));

const workshopFields = [
  "title", "slug", "summary", "description", "category", "date", "time", "mode", "venue",
  "trainer", "price", "earlyBirdPrice", "earlyBirdUntil", "seats", "registrationDeadline",
  "audience", "learn", "agenda", "certificate", "status",
];

const slugify = (s = "") =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Empty strings from HTML forms mean "not set".
const clean = (body) => {
  const data = pick(body, workshopFields);
  for (const k of ["earlyBirdPrice", "earlyBirdUntil", "seats", "registrationDeadline"]) {
    if (data[k] === "") data[k] = null;
  }
  if (data.slug || data.title) data.slug = slugify(data.slug || data.title);
  return data;
};

// e.g. SBA-7K3F9Q; no 0/O or 1/I so it is easy to read out and type
const newCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "SBA-" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const last10 = (s = "") => String(s).replace(/\D/g, "").slice(-10);

const seatsTaken = (workshopId) =>
  WorkshopRegistration.countDocuments({ workshop: workshopId, status: { $ne: "rejected" } });

export const publicView = async (w) => {
  const taken = await seatsTaken(w._id);
  const now = new Date();
  const deadlinePassed = w.registrationDeadline && now > w.registrationDeadline;
  const full = w.seats != null && taken >= w.seats;
  return {
    ...w.toObject(),
    currentPrice: w.currentPrice(now),
    seatsLeft: w.seats != null ? Math.max(w.seats - taken, 0) : null,
    registrationOpen: w.status === "published" && !deadlinePassed && !full,
  };
};

/* ---------- public ---------- */

export const listPublicWorkshops = async (req, res, next) => {
  try {
    const workshops = await Workshop.find({ status: { $in: ["published", "closed"] } }).sort({ date: 1 });
    res.json({ workshops: await Promise.all(workshops.map(publicView)) });
  } catch (err) {
    next(err);
  }
};

export const getPublicWorkshop = async (req, res, next) => {
  try {
    const w = await Workshop.findOne({ slug: req.params.slug, status: { $in: ["published", "closed"] } });
    if (!w) return res.status(404).json({ message: "Workshop not found" });
    res.json({ workshop: await publicView(w) });
  } catch (err) {
    next(err);
  }
};

export const registerForWorkshop = async (req, res, next) => {
  try {
    const w = await Workshop.findOne({ slug: req.params.slug });
    if (!w || w.status === "draft") return res.status(404).json({ message: "Workshop not found" });
    const view = await publicView(w);
    if (!view.registrationOpen)
      return res.status(400).json({ message: "Registration for this workshop is closed." });

    const { name, email, phone, college, year } = req.body;
    const utr = (req.body.utr || "").trim();
    if (!name || !email || !phone)
      return res.status(400).json({ message: "Name, email and mobile number are required." });

    const amount = view.currentPrice;
    if (amount > 0) {
      if (!/^[A-Za-z0-9]{8,30}$/.test(utr))
        return res.status(400).json({ message: "Enter the UPI transaction reference (UTR) from your payment app." });
      if (await WorkshopRegistration.exists({ workshop: w._id, utr }))
        return res.status(409).json({ message: "This transaction reference has already been used for this workshop." });
    }

    const registration = await WorkshopRegistration.create({
      code: newCode(),
      workshop: w._id, name, email, phone, college, year, amount,
      utr: amount > 0 ? utr : undefined,
      // free workshops need no payment check
      status: amount > 0 ? "pending" : "verified",
      source: /^[a-f0-9]{24}$/i.test(req.body.source || "") ? req.body.source : undefined,
      attribution: cleanAttribution(req.body.attribution),
    });
    // awaited so the mail is sent before a serverless function is frozen
    const emailed = await sendRegistrationEmail(registration, w);
    res.status(201).json({
      message: "Registration received",
      registration: { id: registration._id, code: registration.code, status: registration.status, emailed },
    });
  } catch (err) {
    next(err);
  }
};

// A student checks their own registration with the reference they were given
// (or the UPI reference they paid with) plus their mobile number.
export const getRegistrationStatus = async (req, res, next) => {
  try {
    const ref = String(req.body.reference || "").trim();
    const phone = last10(req.body.phone);
    if (!ref || phone.length < 10)
      return res.status(400).json({ message: "Enter your registration reference and the mobile number you registered with." });
    const matches = await WorkshopRegistration.find({ $or: [{ code: ref.toUpperCase() }, { utr: ref }] })
      .populate("workshop", "title slug date time mode venue");
    const r = matches.find((m) => last10(m.phone) === phone);
    if (!r)
      return res.status(404).json({ message: "We could not find a registration with that reference and mobile number." });
    res.json({
      registration: {
        code: r.code, name: r.name, status: r.status, amount: r.amount, registeredAt: r.createdAt,
        workshop: r.workshop,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getPublicPayment = async (req, res, next) => {
  try {
    const s = await PaymentSetting.findOne({ key: "payment" });
    res.json({ payment: s ? pick(s, ["upiId", "payeeName", "qrImage", "instructions"]) : null });
  } catch (err) {
    next(err);
  }
};

export const createCollegeEnquiry = async (req, res, next) => {
  try {
    const data = pick(req.body, [
      "collegeName", "collegeType", "location", "contactPerson", "designation", "phone", "email",
      "students", "departments", "year", "program", "mode", "timeline", "message",
    ]);
    data.attribution = cleanAttribution(req.body.attribution);
    await CollegeEnquiry.create(data);
    res.status(201).json({ message: "Enquiry received" });
  } catch (err) {
    if (err.name === "ValidationError") err.status = 400;
    next(err);
  }
};

/* ---------- admin ---------- */

export const listWorkshops = async (req, res, next) => {
  try {
    const workshops = await Workshop.find().sort({ date: -1 });
    const counts = await WorkshopRegistration.aggregate([
      { $group: { _id: "$workshop", total: { $sum: 1 }, pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } } } },
    ]);
    const byId = Object.fromEntries(counts.map((c) => [String(c._id), c]));
    res.json({
      workshops: workshops.map((w) => ({
        ...w.toObject(),
        registrations: byId[String(w._id)]?.total || 0,
        pending: byId[String(w._id)]?.pending || 0,
      })),
    });
  } catch (err) {
    next(err);
  }
};

const duplicateSlug = (err, res) =>
  err.code === 11000 ? res.status(400).json({ message: "Another workshop already uses this URL name (slug)." }) : null;

export const createWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.create(clean(req.body));
    res.status(201).json({ workshop });
  } catch (err) {
    if (duplicateSlug(err, res)) return;
    if (err.name === "ValidationError") err.status = 400;
    next(err);
  }
};

export const updateWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, clean(req.body), { new: true, runValidators: true });
    if (!workshop) return res.status(404).json({ message: "Workshop not found" });
    res.json({ workshop });
  } catch (err) {
    if (duplicateSlug(err, res)) return;
    if (err.name === "ValidationError") err.status = 400;
    next(err);
  }
};

export const deleteWorkshop = async (req, res, next) => {
  try {
    if (await WorkshopRegistration.exists({ workshop: req.params.id }))
      return res.status(400).json({ message: "This workshop has registrations. Close it instead of deleting it." });
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) return res.status(404).json({ message: "Workshop not found" });
    res.json({ message: "Workshop deleted" });
  } catch (err) {
    next(err);
  }
};

export const listRegistrations = async (req, res, next) => {
  try {
    const filter = req.query.workshop ? { workshop: req.query.workshop } : {};
    const registrations = await WorkshopRegistration.find(filter).populate("workshop", "title slug date").sort({ createdAt: -1 });
    res.json({ registrations });
  } catch (err) {
    next(err);
  }
};

export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const before = await WorkshopRegistration.findById(req.params.id).select("status");
    if (!before) return res.status(404).json({ message: "Registration not found" });
    const registration = await WorkshopRegistration.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true, runValidators: true },
    );
    // one confirmation email, the first time the payment is verified
    let emailed = false;
    if (registration.status === "verified" && before.status !== "verified") {
      const w = await Workshop.findById(registration.workshop);
      if (w) emailed = await sendConfirmationEmail(registration, w);
    }
    res.json({ registration, emailed });
  } catch (err) {
    if (err.name === "ValidationError") err.status = 400;
    next(err);
  }
};

export const getPaymentSetting = async (req, res, next) => {
  try {
    const payment = await PaymentSetting.findOne({ key: "payment" });
    res.json({ payment });
  } catch (err) {
    next(err);
  }
};

export const updatePaymentSetting = async (req, res, next) => {
  try {
    const update = pick(req.body, ["upiId", "payeeName", "instructions"]);
    if (update.upiId && !/^[\w.\-]{2,256}@[A-Za-z]{2,64}$/.test(update.upiId.trim()))
      return res.status(400).json({ message: "That does not look like a UPI ID (for example name@bank)." });
    if (req.file) update.qrImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    if (req.body.removeQr === "true") update.qrImage = "";
    const payment = await PaymentSetting.findOneAndUpdate(
      { key: "payment" }, { $set: update }, { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    res.json({ payment });
  } catch (err) {
    next(err);
  }
};

export const listCollegeEnquiries = async (req, res, next) => {
  try {
    const enquiries = await CollegeEnquiry.find().sort({ createdAt: -1 });
    res.json({ enquiries });
  } catch (err) {
    next(err);
  }
};

export const updateCollegeEnquiry = async (req, res, next) => {
  try {
    const enquiry = await CollegeEnquiry.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true, runValidators: true },
    );
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ enquiry });
  } catch (err) {
    if (err.name === "ValidationError") err.status = 400;
    next(err);
  }
};

export const deleteCollegeEnquiry = async (req, res, next) => {
  try {
    const enquiry = await CollegeEnquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Enquiry deleted" });
  } catch (err) {
    next(err);
  }
};
