import StudentContact from "../models/StudentContact.js";
import { toWhatsappNumber } from "../utils/whatsapp.js";

const MAX_IMPORT = 5000;

const validEmail = (s = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
const text = (v, max = 200) => String(v ?? "").trim().slice(0, max);

// [{ name, count }], largest first
const listCounts = async () => {
  const rows = await StudentContact.aggregate([
    { $unwind: "$lists" },
    { $group: { _id: "$lists", count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
  ]);
  return rows.map((r) => ({ name: r._id, count: r.count }));
};

export const listStudents = async (req, res, next) => {
  try {
    const filter = req.query.list ? { lists: String(req.query.list) } : {};
    const [students, lists, total] = await Promise.all([
      StudentContact.find(filter).sort({ createdAt: -1, _id: -1 }).lean(),
      listCounts(),
      StudentContact.countDocuments(),
    ]);
    res.json({ students, lists, total });
  } catch (err) {
    next(err);
  }
};

// Just the list names and sizes, for the campaign form.
export const getStudentLists = async (req, res, next) => {
  try {
    res.json({ lists: await listCounts() });
  } catch (err) {
    next(err);
  }
};

// Adds students to a list. Someone already saved (same mobile, or same email) is not added
// twice: they are put on this list too and any detail they were missing is filled in.
export const importStudents = async (req, res, next) => {
  try {
    const list = text(req.body.list, 80);
    const rows = Array.isArray(req.body.contacts) ? req.body.contacts : [];
    if (!list) return res.status(400).json({ message: "Give the list a name, for example the workshop and month." });
    if (!rows.length) return res.status(400).json({ message: "There are no students to save. Upload a file or paste them first." });
    if (rows.length > MAX_IMPORT)
      return res.status(400).json({ message: `One import can hold ${MAX_IMPORT} students at most. Split the file.` });

    const existing = await StudentContact.find().select("name email phone college lists").lean();
    const byPhone = new Map(existing.filter((s) => s.phone).map((s) => [s.phone, s]));
    const byEmail = new Map(existing.filter((s) => s.email).map((s) => [s.email, s]));

    const summary = { added: 0, updated: 0, already: 0, skipped: 0 };
    const created = [];
    const updates = new Map(); // _id -> { $set, $addToSet }
    for (const row of rows) {
      const email = validEmail(row?.email) ? String(row.email).trim().toLowerCase() : "";
      const phone = toWhatsappNumber(row?.phone);
      if (!email && !phone) {
        summary.skipped++;
        continue;
      }
      const incoming = { name: text(row.name, 120), email, phone, college: text(row.college) };
      const found = (phone && byPhone.get(phone)) || (email && byEmail.get(email));
      if (!found) {
        const student = { ...incoming, email: email || undefined, phone: phone || undefined, lists: [list] };
        created.push(student);
        if (phone) byPhone.set(phone, student);
        if (email) byEmail.set(email, student);
        summary.added++;
        continue;
      }
      // fill only what the saved student is missing; never overwrite
      const fill = {};
      for (const key of ["name", "email", "phone", "college"]) {
        if (!found[key] && incoming[key]) {
          fill[key] = incoming[key];
          found[key] = incoming[key];
        }
      }
      const onList = found.lists.includes(list);
      if (!onList) found.lists.push(list);
      if (onList && !Object.keys(fill).length) {
        summary.already++;
        continue;
      }
      // a repeat of someone earlier in this same file: they are not saved yet, and `found` is that row
      if (!found._id) continue;
      const u = updates.get(String(found._id)) || { id: found._id, set: {} };
      Object.assign(u.set, fill);
      updates.set(String(found._id), u);
      if (!u.counted) {
        u.counted = true;
        summary.updated++;
      }
    }

    if (created.length) await StudentContact.insertMany(created);
    if (updates.size)
      await StudentContact.bulkWrite(
        [...updates.values()].map((u) => ({
          updateOne: {
            filter: { _id: u.id },
            update: { ...(Object.keys(u.set).length ? { $set: u.set } : {}), $addToSet: { lists: list } },
          },
        })),
      );
    res.status(201).json({ summary, list });
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await StudentContact.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student removed" });
  } catch (err) {
    next(err);
  }
};

// Removes a whole list. Students who are on another list as well stay saved.
export const deleteStudentList = async (req, res, next) => {
  try {
    const list = text(req.query.list, 80);
    if (!list) return res.status(400).json({ message: "Choose the list to delete." });
    await StudentContact.updateMany({ lists: list }, { $pull: { lists: list } });
    const gone = await StudentContact.deleteMany({ lists: { $size: 0 } });
    res.json({ removed: gone.deletedCount || 0 });
  } catch (err) {
    next(err);
  }
};
