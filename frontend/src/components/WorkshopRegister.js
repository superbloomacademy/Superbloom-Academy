"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Field, Sent, SubmitRow, useSubmit } from "./forms";

// UPI ID with a copy button and the QR code with a download button.
// Both come from the admin panel (Payment details).
function UpiPayment({ payment, amount, title }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(payment.upiId);
    } catch {
      // older browsers and non-HTTPS pages
      const el = document.createElement("textarea");
      el.value = payment.upiId;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const ext = payment.qrImage?.match(/^data:image\/(\w+)/)?.[1]?.replace("jpeg", "jpg") || "png";
  const upiLink = `upi://pay?pa=${encodeURIComponent(payment.upiId)}&pn=${encodeURIComponent(
    payment.payeeName || "Superbloom Academy",
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(title.slice(0, 40))}`;

  return (
    <div className="rounded-xl border-2 border-ink bg-white p-5">
      <p className="font-display text-xl font-bold">Pay ₹{amount} by UPI</p>
      {payment.payeeName && <p className="text-slate">Paying to {payment.payeeName}</p>}

      <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,1fr)_11rem]">
        <div>
          <p className="text-sm font-semibold text-slate">UPI ID</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <code className="min-w-0 break-all rounded-md bg-mist px-3 py-2.5 font-mono text-base font-semibold">
              {payment.upiId}
            </code>
            <button type="button" onClick={copy} className="btn btn-ink min-h-11 px-4">
              {copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
              {copied ? "Copied" : "Copy UPI ID"}
            </button>
          </div>
          <p role="status" className="sr-only">
            {copied ? "UPI ID copied" : ""}
          </p>
          <a href={upiLink} className="link mt-4 inline-block sm:hidden">
            Open a UPI app to pay
          </a>
          {payment.instructions && <p className="mt-4 text-[0.95rem] text-slate">{payment.instructions}</p>}
        </div>

        {payment.qrImage && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={payment.qrImage}
              alt={`UPI QR code for ${payment.payeeName || "Superbloom Academy"}`}
              width={176}
              height={176}
              className="aspect-square w-44 rounded-lg border border-line bg-white object-contain"
            />
            <a href={payment.qrImage} download={`superbloom-upi-qr.${ext}`} className="btn btn-line mt-2 min-h-11 w-44 px-3">
              <Download size={18} aria-hidden /> Download QR
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkshopRegister({ workshop, payment }) {
  const paid = workshop.currentPrice > 0;
  const form = useSubmit(`/public/workshops/${workshop.slug}/register`, (fd) => Object.fromEntries(fd));

  if (form.status === "sent") {
    return (
      <Sent
        title="Registration received"
        text={
          paid
            ? "Thank you. We will check your payment against the transaction reference and confirm your seat by phone or email."
            : "Thank you. Your seat is booked. We will send the details by phone or email."
        }
        again="Register another person"
        onAgain={form.reset}
      />
    );
  }

  if (paid && !payment?.upiId) {
    return (
      <p className="rounded-xl border border-line bg-white p-5">
        Online payment is not set up yet. Call us to register for this workshop.
      </p>
    );
  }

  return (
    <form onSubmit={form.onSubmit} className="space-y-5">
      <Field label="Full name" name="name" required autoComplete="name" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Mobile number" name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9+ ]{10,15}" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="College" name="college" optional autoComplete="organization" />
        <Field label="Year of study" name="year" as="select" optional defaultValue="">
          <option value="">Select year</option>
          {["1st year", "2nd year", "3rd year", "4th year", "Final year", "Graduated"].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </Field>
      </div>

      {paid && (
        <>
          <UpiPayment payment={payment} amount={workshop.currentPrice} title={workshop.title} />
          <Field
            label="UPI transaction reference (UTR)"
            name="utr"
            required
            pattern="[A-Za-z0-9]{8,30}"
            autoComplete="off"
            hint="The 12-digit reference number shown in your UPI app after you pay. We use it to confirm your payment."
          />
        </>
      )}

      <SubmitRow
        status={form.status}
        error={form.error}
        label={paid ? "Submit registration" : "Register for free"}
        sendingLabel="Sending registration"
        fallback="We could not send your registration. Check your connection and try again."
      />
    </form>
  );
}
