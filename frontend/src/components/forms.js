"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { programs, programsIn } from "@/lib/programs";
import { site, formatPhone } from "@/lib/site";

// Posts to /api/* on this domain; next.config.mjs proxies it to the Express backend.
async function send(path, body) {
  const isForm = body instanceof FormData;
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "");
  }
}

export function useSubmit(path, toBody) {
  const [state, setState] = useState({ status: "idle", error: "" });
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ status: "sending", error: "" });
    try {
      await send(path, toBody(new FormData(form)));
      form.reset();
      setState({ status: "sent", error: "" });
    } catch (err) {
      setState({ status: "error", error: err.message });
    }
  };
  return { ...state, onSubmit, reset: () => setState({ status: "idle", error: "" }) };
}

export function Field({ label, name, hint, optional, as = "input", children, ...props }) {
  const Tag = as;
  return (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {optional && <span className="font-normal text-slate"> (optional)</span>}
      </label>
      <Tag id={name} name={name} aria-describedby={hint ? `${name}-hint` : undefined} {...props}>
        {children}
      </Tag>
      {hint && (
        <p id={`${name}-hint`} className="hint">
          {hint}
        </p>
      )}
    </div>
  );
}

export function SubmitRow({ status, error, label, sendingLabel, fallback }) {
  return (
    <div>
      <button type="submit" className="btn btn-bloom w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden /> {sendingLabel}
          </>
        ) : (
          label
        )}
      </button>
      {status === "error" && (
        <p role="alert" className="mt-3 font-semibold text-danger">
          {error || fallback} You can also call {formatPhone(site.phones[0])}.
        </p>
      )}
    </div>
  );
}

export function Sent({ title, text, again, onAgain }) {
  return (
    <div role="status" className="rounded-xl border-2 border-cobalt bg-white p-8">
      <CheckCircle2 size={36} className="text-cobalt" aria-hidden />
      <h2 className="mt-4 text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-slate">{text}</p>
      <button type="button" className="link mt-5" onClick={onAgain}>
        {again}
      </button>
    </div>
  );
}

const pharmacyQualifications = ["D.Pharm", "B.Pharm", "M.Pharm", "Pharm.D", "Pharm.D (Post Baccalaureate)"];
const engineeringQualifications = ["B.Tech / B.E.", "M.Tech / M.E.", "B.Sc (Computer Science / IT)", "M.Sc (Computer Science / IT)", "Diploma in Engineering", "Other degree"];

export function AdmissionForm() {
  const [stream, setStream] = useState("pharmacy");
  const [interest, setInterest] = useState("");

  // /admission?course=<slug> or ?stream=engineering preselects the choice.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const program = programs.find((p) => p.slug === params.get("course"));
    if (program) {
      setStream(program.category);
      setInterest(program.name);
    } else if (params.get("stream") === "engineering") setStream("engineering");
  }, []);

  const form = useSubmit("/public/admission", (fd) => {
    const v = Object.fromEntries(fd);
    const name = `${v.firstName} ${v.lastName}`.trim();
    return {
      name,
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone,
      stream,
      // The admin panel shows `course`; carry both the qualification and the domain they asked about.
      course: [v.qualification, interest ? `interested in ${interest}` : ""].filter(Boolean).join(", "),
      institution: v.institution,
      yearOfStudy: v.yearOfStudy,
      duration: v.duration,
      hearAboutUs: v.hearAboutUs,
      message: v.message,
    };
  });

  if (form.status === "sent") {
    return (
      <Sent
        title="Application received"
        text="Thank you. We will call you on the number you gave to talk through the course, batch timings and fees."
        again="Submit another application"
        onAgain={form.reset}
      />
    );
  }

  return (
    <form onSubmit={form.onSubmit} className="space-y-10">
      <fieldset>
        <legend className="font-display text-2xl font-bold">Choose a stream</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { value: "pharmacy", title: "Pharmacy", desc: "D.Pharm, B.Pharm, M.Pharm and Pharm.D" },
            { value: "engineering", title: "Engineering and technology", desc: "Engineering and degree students, freshers" },
          ].map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer gap-3 rounded-xl border-2 bg-white p-4 ${
                stream === o.value ? "border-cobalt" : "border-line"
              }`}
            >
              <input
                type="radio"
                name="stream"
                value={o.value}
                checked={stream === o.value}
                onChange={() => {
                  setStream(o.value);
                  setInterest("");
                }}
                className="mt-1 h-5 w-5 accent-cobalt"
              />
              <span>
                <span className="block font-bold">{o.title}</span>
                <span className="text-[0.95rem] text-slate">{o.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-2xl font-bold">Your details</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="First name" name="firstName" required autoComplete="given-name" />
          <Field label="Last name" name="lastName" required autoComplete="family-name" />
          <Field label="Mobile number" name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9+ ]{10,15}" hint="We will call you on this number." />
          <Field label="Email" name="email" type="email" required autoComplete="email" />
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-2xl font-bold">Your studies</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Qualification" name="qualification" as="select" required defaultValue="" key={stream}>
            <option value="" disabled>
              Select your qualification
            </option>
            {(stream === "pharmacy" ? pharmacyQualifications : engineeringQualifications).map((q) => (
              <option key={q}>{q}</option>
            ))}
          </Field>
          <Field label="Year of study" name="yearOfStudy" as="select" optional defaultValue="">
            <option value="">Select year</option>
            {["1st year", "2nd year", "3rd year", "4th year", "Final year", "Graduated"].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </Field>
          <Field label="College or university" name="institution" optional autoComplete="organization" />
          <div className="field">
            <label htmlFor="interest">
              Program you are interested in<span className="font-normal text-slate"> (optional)</span>
            </label>
            <select id="interest" value={interest} onChange={(e) => setInterest(e.target.value)}>
              <option value="">Not sure yet</option>
              {programsIn(stream).map((p) => (
                <option key={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>
          {stream === "pharmacy" && (
            <Field label="Preferred duration" name="duration" as="select" optional defaultValue="">
              <option value="">Not sure yet</option>
              <option value="6weeks">Short-term (6 weeks)</option>
              <option value="3months">Medium-term (3 months)</option>
              <option value="6months">Long-term (6 months)</option>
            </Field>
          )}
          <Field label="How did you hear about us?" name="hearAboutUs" as="select" optional defaultValue="">
            <option value="">Select one</option>
            <option value="website">Google or this website</option>
            <option value="social">Social media</option>
            <option value="friend">Friend or senior</option>
            <option value="college">My college</option>
            <option value="other">Other</option>
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Anything you would like us to know" name="message" as="textarea" rows={4} optional />
        </div>
      </fieldset>

      <SubmitRow
        status={form.status}
        error={form.error}
        label="Send application"
        sendingLabel="Sending application"
        fallback="We could not send your application. Check your connection and try again."
      />
    </form>
  );
}

export function ContactForm() {
  const form = useSubmit("/public/contact", (fd) => Object.fromEntries(fd));

  if (form.status === "sent") {
    return (
      <Sent
        title="Message sent"
        text="Thank you. We will reply by phone or email."
        again="Send another message"
        onAgain={form.reset}
      />
    );
  }

  return (
    <form onSubmit={form.onSubmit} className="space-y-5">
      <Field label="Full name" name="name" required autoComplete="name" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Mobile number" name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9+ ]{10,15}" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <Field label="College or organisation" name="organization" optional autoComplete="organization" />
      <Field label="What is this about?" name="subject" as="select" required defaultValue="">
        <option value="" disabled>
          Select a topic
        </option>
        <option>Student enquiry</option>
        <option>Fees and batch timings</option>
        <option>Workshop enquiry</option>
        <option>College partnership</option>
        <option>Trainer enquiry</option>
        <option>General enquiry</option>
      </Field>
      <Field label="Message" name="message" as="textarea" rows={5} required />
      <SubmitRow
        status={form.status}
        error={form.error}
        label="Send message"
        sendingLabel="Sending message"
        fallback="We could not send your message. Check your connection and try again."
      />
    </form>
  );
}

export function JobApplyForm({ jobId }) {
  const form = useSubmit("/public/apply", (fd) => {
    fd.set("job", jobId);
    return fd;
  });

  if (form.status === "sent") {
    return (
      <Sent
        title="Application sent"
        text="Thank you for applying. We will contact you if your profile matches the role."
        again="Send another application"
        onAgain={form.reset}
      />
    );
  }

  return (
    <form onSubmit={form.onSubmit} className="space-y-5">
      <Field label="Full name" name="name" required autoComplete="name" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Mobile number" name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
        <Field label="Date of birth" name="dob" type="date" optional autoComplete="bday" />
        <Field label="University" name="university" optional />
        <Field label="Degree" name="course" optional />
        <Field label="Branch or specialisation" name="branch" optional />
        <Field label="Percentage or CGPA" name="percentage" optional />
      </div>
      <Field label="Why do you want to join us?" name="whyJoinUs" as="textarea" rows={4} optional />
      <Field
        label="Resume"
        name="resume"
        type="file"
        required
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        hint="PDF or Word file, up to 5 MB."
      />
      <SubmitRow
        status={form.status}
        error={form.error}
        label="Send job application"
        sendingLabel="Uploading application"
        fallback="We could not send your application. Check the resume is a PDF or Word file under 5 MB and try again."
      />
    </form>
  );
}
