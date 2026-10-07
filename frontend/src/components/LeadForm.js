"use client";

import { MessageCircle } from "lucide-react";
import { programsIn } from "@/lib/programs";
import { whatsappHref } from "@/lib/site";
import { trackContactClick } from "@/lib/ads";
import { Field, Sent, SubmitRow, useSubmit } from "./forms";

// Three-field enquiry for ad landing pages: name, mobile, programme. The team calls
// back and collects the rest, so the form stays quick to fill on a phone.
export default function LeadForm({ stream, program, id = "enquire" }) {
  const options = programsIn(stream);
  const form = useSubmit("/public/admission", (fd) => {
    const v = Object.fromEntries(fd);
    return {
      name: v.name,
      phone: v.phone,
      stream,
      course: v.program ? `interested in ${v.program}` : "not sure yet",
      hearAboutUs: "ad",
      message: "Enquiry from an ad landing page",
    };
  });

  if (form.status === "sent") {
    return (
      <div id={id} className="scroll-mt-6">
        <Sent
          title="Thank you, we will call you"
          text="We will call you on the number you gave, during office hours, to talk through the batch, timings and fees."
          again="Send another enquiry"
          onAgain={form.reset}
        />
        <a
          href={whatsappHref(`Hi, I just enquired about ${program?.name || "a programme"} at Superbloom Academy.`)}
          onClick={() => trackContactClick("whatsapp")}
          className="btn btn-ink mt-4 w-full"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} aria-hidden /> Chat with us on WhatsApp now
        </a>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={form.onSubmit} className="scroll-mt-6 space-y-5">
      <Field label="Your name" name="name" required autoComplete="name" />
      <Field
        label="Mobile number"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        inputMode="tel"
        pattern="[0-9+ ]{10,15}"
        hint="We will call you on this number."
      />
      <Field label="Programme" name="program" as="select" defaultValue={program?.name || ""} key={program?.slug}>
        <option value="">Not sure yet, help me choose</option>
        {options.map((p) => (
          <option key={p.slug}>{p.name}</option>
        ))}
      </Field>
      <SubmitRow
        status={form.status}
        error={form.error}
        label="Get a call back"
        sendingLabel="Sending"
        fallback="We could not send your enquiry. Check your connection and try again."
      />
    </form>
  );
}
