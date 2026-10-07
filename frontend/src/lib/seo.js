import { site } from "./site";

// Next.js replaces the whole openGraph object per page rather than merging it,
// so every page builds its own from these shared fields.
export const og = (page = {}) => ({
  type: "website",
  siteName: site.name,
  locale: "en_IN",
  images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.name}: students at a campus training session` }],
  ...page,
});
