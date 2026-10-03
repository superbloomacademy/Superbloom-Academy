"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, CircleAlert, Clock, Loader2 } from "lucide-react";
import { site, telHref, formatPhone } from "@/lib/site";

const views = {
  verified: {
    tone: "border-leaf bg-leaf-soft",
    icon: Check,
    iconTone: "bg-leaf text-white",
    title: "Your seat is confirmed",
    text: "Your payment is verified. We will see you at the workshop.",
  },
  pending: {
    tone: "border-bloom bg-bloom-soft",
    icon: Clock,
    iconTone: "bg-bloom text-ink",
    title: "Payment is being checked",
    text: "We have your registration and are matching your payment against its UPI reference. Check again later; your seat is confirmed once it shows as verified.",
  },
  rejected: {
    tone: "border-danger bg-white",
    icon: CircleAlert,
    iconTone: "bg-danger text-white",
    title: "We could not verify this payment",
    text: "The UPI reference did not match a payment we received. Call us so we can sort it out.",
  },
};

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

export default function RegistrationStatus() {
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState({ status: "idle", error: "", registration: null });

  // /workshops/status?ref=SBA-XXXXXX fills in the reference
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) setReference(ref);
  }, []);

  const check = async (e) => {
    e.preventDefault();
    setState({ status: "loading", error: "", registration: null });
    try {
      const res = await fetch("/api/public/registrations/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "We could not check your status. Try again in a moment.");
      setState({ status: "done", error: "", registration: data.registration });
    } catch (err) {
      setState({ status: "error", error: err.message, registration: null });
    }
  };

  const r = state.registration;
  const view = r && views[r.status];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
      <form onSubmit={check} className="space-y-5 rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8">
        <div className="field">
          <label htmlFor="reference">Registration reference</label>
          <input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            required
            autoComplete="off"
            placeholder="SBA-XXXXXX"
            aria-describedby="reference-hint"
          />
          <p id="reference-hint" className="hint">
            Shown after you registered. The UPI transaction reference (UTR) you paid with also works.
          </p>
        </div>
        <div className="field">
          <label htmlFor="status-phone">Mobile number you registered with</label>
          <input
            id="status-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
            pattern="[0-9+ ]{10,15}"
          />
        </div>
        <button type="submit" className="btn btn-bloom w-full sm:w-auto" disabled={state.status === "loading"}>
          {state.status === "loading" ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden /> Checking
            </>
          ) : (
            "Check status"
          )}
        </button>
        {state.status === "error" && (
          <p role="alert" className="font-semibold text-danger">
            {state.error}
          </p>
        )}
      </form>

      <div aria-live="polite">
        {view ? (
          <div className={`rounded-3xl border-2 p-6 sm:p-8 ${view.tone}`}>
            <span className={`flex h-12 w-12 items-center justify-center rounded-full ${view.iconTone}`}>
              <view.icon size={24} aria-hidden />
            </span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">{view.title}</h2>
            <p className="mt-2 text-slate">{view.text}</p>

            <dl className="mt-6 divide-y divide-line rounded-2xl bg-white px-5 ring-1 ring-line">
              {[
                ["Name", r.name],
                ["Workshop", r.workshop?.title],
                ["Date", r.workshop?.date && fmt(r.workshop.date)],
                ["Time", r.workshop?.time],
                ["Venue", r.workshop?.venue],
                ["Amount", r.amount > 0 ? `₹${r.amount}` : "Free"],
                ["Reference", r.code],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3">
                    <dt className="font-semibold text-slate">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
            </dl>

            {r.status === "rejected" && (
              <a href={telHref(site.phones[0])} className="btn btn-ink mt-6">
                Call {formatPhone(site.phones[0])}
              </a>
            )}
          </div>
        ) : (
          <div className="rounded-3xl bg-mist p-6 sm:p-8">
            <h2 className="text-2xl font-bold">What the status means</h2>
            <ul className="mt-5 space-y-4">
              {["pending", "verified", "rejected"].map((k) => {
                const v = views[k];
                return (
                  <li key={k} className="flex gap-4">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${v.iconTone}`}>
                      <v.icon size={18} aria-hidden />
                    </span>
                    <div>
                      <p className="font-display text-lg font-bold">{v.title}</p>
                      <p className="text-slate">{v.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 border-t border-line pt-5">
              Lost your reference?{" "}
              <Link href="/contact" className="link">
                Contact us
              </Link>{" "}
              with your name and mobile number.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
