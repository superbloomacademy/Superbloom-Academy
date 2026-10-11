import React, { useMemo, useState } from "react";
import { Mail, MessageCircle, Upload } from "lucide-react";
import api from "../utils/api";
import { parseContacts } from "../utils/contacts";

// Starting text for each kind of message. The admin edits it before saving.
const presets = {
  workshop_invite: {
    label: "Workshop invitation",
    subject: "{name}, our next workshop: {workshop}",
    heading: "You are invited: {workshop}",
    message:
      "Hi {name},\n\nThank you for joining our earlier workshop. Our next one, {workshop}, is on {date}, and we would love to see you there.\n\nSeats are limited, so register early.",
    buttonText: "See details and register",
    buttonUrl: "{link}",
  },
  course_offer: {
    label: "Course offer",
    subject: "A course offer for you, {name}",
    heading: "A course offer for our workshop students",
    message:
      "Hi {name},\n\nBecause you attended one of our workshops, you can join our next course at a special fee.\n\n[Write the course name, the offer and the last date here.]",
    buttonText: "View the course",
    buttonUrl: "https://www.superbloomacademy.in/programs",
  },
  feedback: {
    label: "Feedback request",
    subject: "{name}, how was the workshop?",
    heading: "Tell us how it went",
    message:
      "Hi {name},\n\nThank you for attending our workshop. It takes two minutes to tell us what worked and what did not, and it helps us make the next one better.",
    buttonText: "Give feedback",
    buttonUrl: "",
  },
};

// the value each template variable starts with, by position
const firstGuess = ["{name}", "{workshop}", "{date}", "{time}", "{venue}"];

const showDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "";

const label = "text-sm font-medium text-slate-700";

export default function CampaignForm({ workshops, lists = [], channels, onSaved, onCancel }) {
  const [kind, setKind] = useState("workshop_invite");
  const [name, setName] = useState("");
  const [about, setAbout] = useState(""); // the workshop the message is about
  const [from, setFrom] = useState([]); // earlier workshops whose students get it
  const [everyone, setEveryone] = useState(false);
  const [saved, setSaved] = useState([]); // names of saved student lists
  const [pasted, setPasted] = useState("");
  const [fileContacts, setFileContacts] = useState([]);
  const [fileName, setFileName] = useState("");
  const [useEmail, setUseEmail] = useState(true);
  const [email, setEmail] = useState(presets.workshop_invite);
  const [useWhatsapp, setUseWhatsapp] = useState(false);
  const [templateKey, setTemplateKey] = useState("");
  const [values, setValues] = useState({ body: [], header: "", button: "{slug}" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const whatsappReady = channels?.whatsapp?.working;
  const templates = (channels?.templates || []).filter((t) => t.supported);
  const template = templates.find((t) => `${t.name}|${t.language}` === templateKey);

  const contacts = useMemo(() => [...fileContacts, ...parseContacts(pasted)], [fileContacts, pasted]);
  const fromWorkshops = workshops.filter((w) => from.includes(w._id)).reduce((n, w) => n + (w.registrations || 0), 0);
  const fromLists = lists.filter((l) => saved.includes(l.name)).reduce((n, l) => n + l.count, 0);

  const pickKind = (k) => {
    setKind(k);
    setEmail(presets[k]);
  };

  const pickTemplate = (key) => {
    setTemplateKey(key);
    const t = templates.find((x) => `${x.name}|${x.language}` === key);
    setValues({ body: (t?.bodyVariables || []).map((_, i) => firstGuess[i] || ""), header: "", button: "{slug}" });
  };

  const readFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileContacts(parseContacts(await file.text()));
  };

  const preview = template
    ? template.body.replace(/\{\{\s*(\w+)\s*\}\}/g, (whole, v) => values.body[template.bodyVariables.indexOf(v)] || whole)
    : "";

  const save = async (e) => {
    e.preventDefault();
    setError("");
    if (!useEmail && !useWhatsapp) return setError("Choose email, WhatsApp or both.");
    if (useWhatsapp && !template) return setError("Choose a WhatsApp template.");
    setSaving(true);
    try {
      const res = await api.post("/admin/campaigns", {
        name,
        kind,
        workshop: about || undefined,
        channels: { email: useEmail, whatsapp: useWhatsapp },
        email: useEmail ? email : undefined,
        whatsapp: useWhatsapp
          ? {
              template: template.name,
              language: template.language,
              preview: template.body,
              header: { type: template.header.type, name: template.header.name, value: values.header },
              body: template.bodyVariables.map((v, i) => ({ name: v, value: values.body[i] || "" })),
              button: template.linkButton ? { index: template.linkButton.index, value: values.button } : undefined,
            }
          : undefined,
        audience: { workshops: from, lists: saved, statuses: everyone ? ["verified", "pending"] : ["verified"], contacts },
      });
      onSaved(res.data.campaign, res.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the campaign.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="card mb-8">
      <div className="card-header">
        <h2 className="text-lg font-bold text-slate-900">New campaign</h2>
        <p className="text-sm text-slate-600">Saving does not send anything. You check the list and send a test first.</p>
      </div>

      <div className="card-body space-y-8">
        {/* 1. what */}
        <fieldset>
          <legend className="mb-3 text-base font-bold text-slate-900">1. What is it about?</legend>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Kind of message">
            {Object.entries(presets).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => pickKind(key)}
                aria-pressed={kind === key}
                className={`min-h-[2.5rem] rounded-lg px-4 text-sm font-semibold transition-colors duration-150 ${
                  kind === key ? "bg-ink text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className={label}>Campaign name (only you see this) *
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Invite to November UI/UX workshop" className="input-field mt-1" />
            </label>
            <label className={label}>Workshop the message is about
              <select value={about} onChange={(e) => setAbout(e.target.value)} className="input-field mt-1">
                <option value="">None</option>
                {workshops.map((w) => <option key={w._id} value={w._id}>{w.title} ({showDate(w.date)})</option>)}
              </select>
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Fills {"{workshop}"}, {"{date}"}, {"{time}"}, {"{venue}"}, {"{fee}"} and {"{link}"}, and adds its details to the email.
              </span>
            </label>
          </div>
        </fieldset>

        {/* 2. who */}
        <fieldset>
          <legend className="mb-3 text-base font-bold text-slate-900">2. Who gets it?</legend>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className={label}>Students of earlier workshops</p>
              {workshops.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">No workshops on the website yet.</p>
              ) : (
                <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
                  {workshops.map((w) => (
                    <li key={w._id}>
                      <label className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={from.includes(w._id)}
                          onChange={(e) => setFrom(e.target.checked ? [...from, w._id] : from.filter((id) => id !== w._id))}
                        />
                        <span>
                          <span className="font-medium text-slate-900">{w.title}</span>
                          <span className="block text-xs text-slate-500">{showDate(w.date)}, {w.registrations || 0} registered</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={everyone} onChange={(e) => setEveryone(e.target.checked)} />
                Include students whose payment is not verified yet
              </label>
            </div>

            <div>
              <p className={label}>Saved student lists</p>
              {lists.length === 0 ? (
                <p className="mb-4 mt-2 text-sm text-slate-500">None yet. Save one on the Student list page to use it again and again.</p>
              ) : (
                <ul className="mb-4 mt-2 max-h-40 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
                  {lists.map((l) => (
                    <li key={l.name}>
                      <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={saved.includes(l.name)}
                          onChange={(e) => setSaved(e.target.checked ? [...saved, l.name] : saved.filter((n) => n !== l.name))}
                        />
                        <span className="font-medium text-slate-900">{l.name}</span>
                        <span className="text-xs text-slate-500">{l.count} students</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <p className={label}>One-off contacts, for this campaign only</p>
              <label className="btn-secondary btn-sm mt-2 cursor-pointer">
                <Upload size={16} aria-hidden /> Upload a CSV file
                <input type="file" accept=".csv,.tsv,.txt,text/csv" onChange={readFile} className="sr-only" />
              </label>
              {fileName && <span className="ml-2 text-sm text-slate-600">{fileName}: {fileContacts.length} contacts</span>}
              <p className="mt-2 text-xs text-slate-500">
                In Excel or Google Sheets, use Save as, CSV. The file needs a mobile or email column; name and college help.
              </p>
              <label className={`${label} mt-3 block`}>Or paste them, one student per line
                <textarea
                  value={pasted}
                  onChange={(e) => setPasted(e.target.value)}
                  placeholder={"Ravi Kumar, 9876543210, ravi@example.com\nAnjali Rao, 9123456780"}
                  className="input-field mt-1 !min-h-24 font-mono text-sm"
                />
              </label>
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-slate-700" role="status">
            About {fromWorkshops + fromLists + contacts.length} people before repeats are removed. The exact list is shown after you save.
          </p>
        </fieldset>

        {/* 3. how */}
        <fieldset>
          <legend className="mb-3 text-base font-bold text-slate-900">3. The message</legend>
          <p className="mb-4 text-sm text-slate-600">
            Write {"{name}"} where the student's first name should go. With a workshop chosen above you can also use{" "}
            {"{workshop}"}, {"{date}"}, {"{time}"}, {"{venue}"}, {"{fee}"} and {"{link}"}.
          </p>

          <div className="rounded-xl border border-slate-200">
            <label className="flex cursor-pointer items-center gap-3 px-4 py-3 font-semibold text-slate-900">
              <input type="checkbox" checked={useEmail} onChange={(e) => setUseEmail(e.target.checked)} />
              <Mail size={18} aria-hidden className="text-slate-500" /> Email
              {channels && !channels.email.working && <span className="badge-warning">Not working yet</span>}
            </label>
            {useEmail && (
              <div className="grid gap-4 border-t border-slate-200 p-4 md:grid-cols-2">
                <label className={`${label} md:col-span-2`}>Subject *
                  <input value={email.subject} onChange={(e) => setEmail({ ...email, subject: e.target.value })} required className="input-field mt-1" />
                </label>
                <label className={`${label} md:col-span-2`}>Heading inside the email
                  <input value={email.heading} onChange={(e) => setEmail({ ...email, heading: e.target.value })} className="input-field mt-1" />
                </label>
                <label className={`${label} md:col-span-2`}>Message * (leave an empty line between paragraphs)
                  <textarea value={email.message} onChange={(e) => setEmail({ ...email, message: e.target.value })} required className="input-field mt-1 !min-h-44" />
                </label>
                <label className={label}>Button text
                  <input value={email.buttonText} onChange={(e) => setEmail({ ...email, buttonText: e.target.value })} className="input-field mt-1" />
                </label>
                <label className={label}>Button link
                  <input
                    value={email.buttonUrl}
                    onChange={(e) => setEmail({ ...email, buttonUrl: e.target.value })}
                    placeholder={kind === "feedback" ? "Paste the link of your Google Form" : "https://..."}
                    className="input-field mt-1"
                  />
                </label>
                <p className="text-xs text-slate-500 md:col-span-2">
                  A Gmail account can send about 500 emails a day. Every email ends with a "Stop these emails" link.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200">
            <label className={`flex items-center gap-3 px-4 py-3 font-semibold ${whatsappReady ? "cursor-pointer text-slate-900" : "text-slate-400"}`}>
              <input type="checkbox" checked={useWhatsapp} disabled={!whatsappReady} onChange={(e) => setUseWhatsapp(e.target.checked)} />
              <MessageCircle size={18} aria-hidden className="text-slate-500" /> WhatsApp
              {!whatsappReady && <span className="badge-warning">Not connected yet</span>}
            </label>
            {useWhatsapp && (
              <div className="grid gap-5 border-t border-slate-200 p-4 md:grid-cols-2">
                {templates.length === 0 ? (
                  <div className="alert-warning md:col-span-2">
                    No approved template yet. Create one in WhatsApp Manager (the setup guide has ready text), wait for Meta
                    to approve it, then open this form again.
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <label className={`${label} block`}>Approved template *
                        <select value={templateKey} onChange={(e) => pickTemplate(e.target.value)} className="input-field mt-1">
                          <option value="">Choose a template</option>
                          {templates.map((t) => (
                            <option key={`${t.name}|${t.language}`} value={`${t.name}|${t.language}`}>
                              {t.name} ({t.language}, {t.category.toLowerCase()})
                            </option>
                          ))}
                        </select>
                      </label>
                      {template?.header.type === "image" && (
                        <label className={`${label} block`}>Link of the header picture *
                          <input value={values.header} onChange={(e) => setValues({ ...values, header: e.target.value })} required placeholder="https://..." className="input-field mt-1" />
                        </label>
                      )}
                      {template?.header.type === "text" && (
                        <label className={`${label} block`}>Header: {template.header.text}
                          <input value={values.header} onChange={(e) => setValues({ ...values, header: e.target.value })} required className="input-field mt-1" />
                        </label>
                      )}
                      {template?.bodyVariables.map((v, i) => (
                        <label key={v} className={`${label} block`}>Value for {`{{${v}}}`} *
                          <input
                            value={values.body[i] || ""}
                            onChange={(e) => setValues({ ...values, body: values.body.map((x, j) => (j === i ? e.target.value : x)) })}
                            required
                            className="input-field mt-1"
                          />
                        </label>
                      ))}
                      {template?.linkButton && (
                        <label className={`${label} block`}>End of the "{template.linkButton.text}" link *
                          <input value={values.button} onChange={(e) => setValues({ ...values, button: e.target.value })} required className="input-field mt-1" />
                          <span className="mt-1 block text-xs font-normal text-slate-500">
                            The link is {template.linkButton.url}. {"{slug}"} is the URL name of the workshop chosen above.
                          </span>
                        </label>
                      )}
                    </div>
                    <div>
                      <p className={label}>What the student sees</p>
                      {template ? (
                        <div className="mt-2 rounded-xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200">
                          {template.header.type === "image" && <p className="mb-2 text-xs font-semibold text-emerald-800">[Picture]</p>}
                          {template.header.type !== "image" && template.header.text && <p className="mb-2 font-bold text-slate-900">{template.header.text}</p>}
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-900">{preview}</p>
                          {template.footer && <p className="mt-2 text-xs text-slate-500">{template.footer}</p>}
                          {template.buttons.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {template.buttons.map((b) => (
                                <span key={b} className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-primary-700 ring-1 ring-inset ring-emerald-200">{b}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500">Choose a template to see it here.</p>
                      )}
                      <p className="mt-2 text-xs text-slate-500">
                        The wording of a WhatsApp message is fixed by the template Meta approved; only the values change.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </fieldset>

        {error && <div role="alert" className="alert-error">{error}</div>}
      </div>

      <div className="card-footer flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save and check the list"}</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}
