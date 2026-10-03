"use client";

import { Field, Sent, SubmitRow, useSubmit } from "./forms";
import { programsIn } from "@/lib/programs";

export default function CollegeForm() {
  const form = useSubmit("/public/college-enquiry", (fd) => Object.fromEntries(fd));

  if (form.status === "sent") {
    return (
      <Sent
        title="Proposal request received"
        text="Thank you. Our team will call you to understand your requirements and arrange a meeting."
        again="Send another request"
        onAgain={form.reset}
      />
    );
  }

  return (
    <form onSubmit={form.onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="College name" name="collegeName" required autoComplete="organization" />
        <Field label="College type" name="collegeType" as="select" optional defaultValue="">
          <option value="">Select type</option>
          <option>Engineering college</option>
          <option>Pharmacy college</option>
          <option>Degree college</option>
          <option>University</option>
          <option>Other</option>
        </Field>
        <Field label="City or location" name="location" optional />
        <Field label="Contact person" name="contactPerson" required autoComplete="name" />
        <Field label="Designation" name="designation" optional hint="For example Principal, TPO or HOD." />
        <Field label="Mobile number" name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9+ ]{10,15}" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Number of students" name="students" optional inputMode="numeric" />
        <Field label="Departments" name="departments" optional hint="For example CSE, IT, B.Pharm." />
        <Field label="Year of study" name="year" as="select" optional defaultValue="">
          <option value="">Select year</option>
          {["1st year", "2nd year", "3rd year", "4th year", "Several years"].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </Field>
        <Field label="Program you are interested in" name="program" as="select" optional defaultValue="">
          <option value="">Not decided yet</option>
          <optgroup label="Engineering">
            {programsIn("engineering").map((p) => (
              <option key={p.slug}>{p.name}</option>
            ))}
          </optgroup>
          <optgroup label="Pharmacy">
            {programsIn("pharmacy").map((p) => (
              <option key={p.slug}>{p.name}</option>
            ))}
          </optgroup>
        </Field>
        <Field label="Preferred training mode" name="mode" as="select" optional defaultValue="">
          <option value="">Select mode</option>
          <option>On campus</option>
          <option>Online</option>
          <option>Hybrid</option>
        </Field>
        <Field label="When would you like to start?" name="timeline" optional />
      </div>
      <Field label="Anything else we should know" name="message" as="textarea" rows={4} optional />
      <SubmitRow
        status={form.status}
        error={form.error}
        label="Request a college proposal"
        sendingLabel="Sending request"
        fallback="We could not send your request. Check your connection and try again."
      />
    </form>
  );
}
