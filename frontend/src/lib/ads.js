// Ad tracking: remembers which ad or campaign brought the visitor, and reports form
// submissions as conversions to GA4, Google Ads and the Meta Pixel. Browser-only.
// Every tag is optional: nothing is sent to a platform whose ID is not set.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-K231SSXR6C";
// Google Ads tag ID, for example AW-123456789
export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID || "";
// conversion labels from Google Ads > Goals > Conversions (the part after the slash in send_to)
const GADS_LABELS = {
  lead: process.env.NEXT_PUBLIC_GADS_LEAD_LABEL || "",
  workshop: process.env.NEXT_PUBLIC_GADS_WORKSHOP_LABEL || "",
};
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

const KEY = "sba_attr";
const KEEP = 30 * 24 * 60 * 60 * 1000; // a lead often converts days after the ad click
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

// Called on every page view. A visit that arrives from a campaign link replaces the
// stored one (last ad click wins); ordinary visits leave it alone.
export function captureAttribution() {
  try {
    const q = new URLSearchParams(window.location.search);
    const found = Object.fromEntries(PARAMS.filter((p) => q.get(p)).map((p) => [p, q.get(p).slice(0, 200)]));
    if (!Object.keys(found).length) return;
    const referrer = document.referrer && new URL(document.referrer).host !== window.location.host ? document.referrer : "";
    const value = { ...found, landingPage: window.location.pathname, referrer, at: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // storage blocked: the lead is still sent, just without its campaign
  }
}

// The campaign details sent with a form, or undefined when there are none.
export function getAttribution() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY) || "null");
    if (!saved || Date.now() - saved.at > KEEP) return undefined;
    const { at, ...rest } = saved;
    return rest;
  } catch {
    return undefined;
  }
}

// What each form counts as. Job applications are not ad conversions.
const conversions = [
  { match: /^\/public\/admission$/, ga: "generate_lead", meta: "Lead", gads: "lead", label: "admission" },
  { match: /^\/public\/college-enquiry$/, ga: "generate_lead", meta: "Lead", gads: "lead", label: "college" },
  { match: /^\/public\/contact$/, ga: "contact", meta: "Contact", label: "contact" },
  { match: /^\/public\/workshops\/.+\/register$/, ga: "sign_up", meta: "CompleteRegistration", gads: "workshop", label: "workshop" },
];

export function trackConversion(path, details = {}) {
  const c = conversions.find((x) => x.match.test(path));
  if (!c) return;
  try {
    const params = { form: c.label, ...details };
    window.gtag?.("event", c.ga, params);
    const label = c.gads && GADS_LABELS[c.gads];
    if (GADS_ID && label) window.gtag?.("event", "conversion", { send_to: `${GADS_ID}/${label}` });
    window.fbq?.("track", c.meta, params);
  } catch {
    // tracking must never break the form
  }
}

// Meta does not see client-side navigation on its own. The first view is
// already sent by the pixel snippet in the layout.
let firstView = true;
export function trackPageView() {
  if (firstView) {
    firstView = false;
    return;
  }
  try {
    window.fbq?.("track", "PageView");
  } catch {
    // ignore
  }
}

// Clicks on call and WhatsApp buttons are leads too, especially from mobile ads.
export function trackContactClick(method) {
  try {
    window.gtag?.("event", "contact_click", { method });
    window.fbq?.("track", "Contact", { method });
  } catch {
    // ignore
  }
}
