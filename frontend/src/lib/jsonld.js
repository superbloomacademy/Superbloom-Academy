import { site, fullAddress } from "./site";

const abs = (path) => `${site.url}${path}`;

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  logo: abs("/sba-logo.png"),
  image: [abs("/og.jpg"), abs("/images/about/campus-training-hall.jpg")],
  sameAs: site.social,
  description: site.description,
  email: site.email,
  telephone: `+91-${site.phones[0]}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: "Hyderabad",
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "State", name: "Telangana" },
    { "@type": "State", name: "Andhra Pradesh" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
  ],
};

export const faqLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export const breadcrumbLd = (crumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", href: "/" }, ...crumbs].map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: abs(c.href),
  })),
});

export const courseLd = (course) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: `${course.name} training`,
  description: course.metaDescription,
  url: abs(`/programs/${course.category}/${course.slug}`),
  provider: { "@type": "EducationalOrganization", name: site.name, sameAs: site.url },
  teaches: course.learn,
  occupationalCredentialAwarded: "Certificate of Completion",
  // the three fixed durations apply to the pharmacy programmes
  ...(course.category === "pharmacy" && {
    hasCourseInstance: ["P6W", "P3M", "P6M"].map((courseWorkload) => ({
      "@type": "CourseInstance",
      courseMode: "Onsite",
      courseWorkload,
      location: fullAddress,
    })),
  }),
});

export const eventLd = (w) => ({
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  name: w.title,
  description: w.summary || w.description || w.title,
  startDate: w.date,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode:
    w.mode === "online"
      ? "https://schema.org/OnlineEventAttendanceMode"
      : w.mode === "hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
  location:
    w.mode === "online"
      ? { "@type": "VirtualLocation", url: abs(`/workshops/${w.slug}`) }
      : { "@type": "Place", name: w.venue || site.name, address: fullAddress },
  organizer: { "@type": "Organization", name: site.name, url: site.url },
  offers: {
    "@type": "Offer",
    price: w.currentPrice ?? w.price ?? 0,
    priceCurrency: "INR",
    url: abs(`/workshops/${w.slug}`),
    availability: w.registrationOpen ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
  },
});

export const articleLd = (a) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.title,
  description: a.description,
  datePublished: a.date,
  dateModified: a.date,
  author: { "@type": "Organization", name: site.name, url: site.url },
  publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: abs("/sba-logo.png") } },
  mainEntityOfPage: abs(`/resources/${a.slug}`),
});

const employmentType = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
  freelance: "CONTRACTOR",
};

export const jobLd = (job) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: job.title,
  description: job.description || job.title,
  datePosted: job.createdAt,
  employmentType: employmentType[job.jobType] || "FULL_TIME",
  hiringOrganization: { "@type": "Organization", name: site.name, sameAs: site.url, logo: abs("/sba-logo.png") },
  ...(job.locationType === "remote"
    ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "India" } }
    : {
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location || "Hyderabad",
            addressRegion: "Telangana",
            addressCountry: "IN",
          },
        },
      }),
});
