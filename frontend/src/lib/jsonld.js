import { site, fullAddress } from "./site";

const abs = (path) => `${site.url}${path}`;

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  logo: abs("/sba-logo.png"),
  image: abs("/sba-logo.png"),
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
  areaServed: { "@type": "City", name: "Hyderabad" },
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
  url: abs(`/courses/${course.slug}`),
  provider: { "@type": "EducationalOrganization", name: site.name, sameAs: site.url },
  teaches: course.learn,
  occupationalCredentialAwarded: "Certificate of Completion",
  hasCourseInstance: [
    { "@type": "CourseInstance", courseMode: "Onsite", courseWorkload: "P6W", location: fullAddress },
    { "@type": "CourseInstance", courseMode: "Onsite", courseWorkload: "P3M", location: fullAddress },
    { "@type": "CourseInstance", courseMode: "Onsite", courseWorkload: "P6M", location: fullAddress },
  ],
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
