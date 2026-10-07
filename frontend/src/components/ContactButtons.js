"use client";

import { MessageCircle, Phone } from "lucide-react";
import { formatPhone, site, telHref, whatsappHref } from "@/lib/site";
import { trackContactClick } from "@/lib/ads";

const waText = (topic) => `Hi, I would like to know about ${topic || "your programmes"} at Superbloom Academy.`;

// Call and WhatsApp buttons for ad landing pages. Clicks are reported as conversions.
export function CallWhatsApp({ topic, light = false }) {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={whatsappHref(waText(topic))}
        onClick={() => trackContactClick("whatsapp")}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn ${light ? "btn-line-light" : "btn-line"}`}
      >
        <MessageCircle size={18} aria-hidden /> WhatsApp us
      </a>
      <a href={telHref(site.phones[0])} onClick={() => trackContactClick("call")} className={`btn ${light ? "btn-line-light" : "btn-line"}`}>
        <Phone size={18} aria-hidden /> {formatPhone(site.phones[0])}
      </a>
    </div>
  );
}

// Fixed bar at the bottom of the screen on phones, where most ad clicks land.
export function MobileActionBar({ topic, formId = "enquire" }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-line bg-white p-2 shadow-[0_-8px_24px_-12px_rgb(10_26_74/0.3)] lg:hidden">
      <a href={telHref(site.phones[0])} onClick={() => trackContactClick("call")} className="btn btn-line min-h-12 px-2 text-sm">
        <Phone size={17} aria-hidden /> Call
      </a>
      <a
        href={whatsappHref(waText(topic))}
        onClick={() => trackContactClick("whatsapp")}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-line min-h-12 px-2 text-sm"
      >
        <MessageCircle size={17} aria-hidden /> WhatsApp
      </a>
      <a href={`#${formId}`} className="btn btn-bloom min-h-12 px-2 text-sm">
        Enquire
      </a>
    </div>
  );
}
