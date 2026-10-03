import { site } from "./site";

// Next.js replaces the whole openGraph object per page rather than merging it,
// so every page builds its own from these shared fields.
export const og = (page = {}) => ({
  type: "website",
  siteName: site.name,
  locale: "en_IN",
  images: [{ url: "/sba-logo.png", width: 1024, height: 1024, alt: site.name }],
  ...page,
});
