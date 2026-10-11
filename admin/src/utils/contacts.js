// Reads a contact list saved from Excel or Google Sheets as CSV, or pasted as text.
// Columns can be in any order; a heading row is used when there is one.

const splitRows = (text) => {
  const first = text.split(/\r?\n/, 1)[0] || "";
  const count = (ch) => first.split(ch).length - 1;
  const delimiter = count("\t") ? "\t" : count(";") > count(",") ? ";" : ",";
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"' && cell === "") quoted = true;
    else if (ch === delimiter) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  row.push(cell);
  rows.push(row);
  return rows.map((r) => r.map((c) => c.trim())).filter((r) => r.some(Boolean));
};

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
// a mobile number, however it is spaced or prefixed; a leading apostrophe comes from Excel exports
const isPhone = (s) => /^'?[+\d][\d\s\-().]{8,}$/.test(s) && s.replace(/\D/g, "").length >= 10;

const headings = {
  email: /e-?mail/i,
  phone: /phone|mobile|whats\s*app|contact|number/i,
  college: /college|institut|university|organi[sz]ation|school/i,
  name: /name|student/i,
};

export function parseContacts(text) {
  const rows = splitRows(String(text || "").replace(/^﻿/, ""));
  if (!rows.length) return [];

  const head = rows[0];
  const hasHeading = !head.some((c) => isEmail(c) || isPhone(c)) && head.some((c) => Object.values(headings).some((re) => re.test(c)));
  let columns = null;
  if (hasHeading) {
    columns = {};
    const taken = new Set();
    // "College name" is a college column, so name is matched last, among what is left
    for (const key of ["email", "phone", "college", "name"]) {
      const i = head.findIndex((c, idx) => !taken.has(idx) && headings[key].test(c));
      if (i >= 0) {
        columns[key] = i;
        taken.add(i);
      }
    }
  }

  const contacts = [];
  for (const row of hasHeading ? rows.slice(1) : rows) {
    let c;
    if (columns) {
      c = Object.fromEntries(Object.entries(columns).map(([key, i]) => [key, row[i] || ""]));
    } else {
      // no heading row: work out what each cell is from how it looks
      c = {};
      for (const cell of row.filter(Boolean)) {
        if (isEmail(cell)) c.email ||= cell;
        else if (isPhone(cell)) c.phone ||= cell;
        else if (!c.name) c.name = cell;
        else c.college ||= cell;
      }
    }
    c.phone = (c.phone || "").replace(/^'/, "");
    if (c.email || c.phone) contacts.push({ name: c.name || "", phone: c.phone, email: c.email || "", college: c.college || "" });
  }
  return contacts;
}
