// The ad or campaign that brought a lead to the website, sent by the site's forms.
const FIELDS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "fbclid", "landingPage", "referrer",
];

// Mongoose field definition, shared by every model that stores leads.
export const attributionField = {
  type: Object.fromEntries(FIELDS.map((f) => [f, { type: String, maxlength: 300 }])),
  _id: false,
  default: undefined,
};

// Keeps only the known keys as short strings; returns undefined when nothing is left.
export function cleanAttribution(input) {
  if (!input || typeof input !== "object") return undefined;
  const out = {};
  for (const f of FIELDS) {
    if (typeof input[f] === "string" && input[f].trim()) out[f] = input[f].trim().slice(0, 300);
  }
  return Object.keys(out).length ? out : undefined;
}
