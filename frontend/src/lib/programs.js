import { engineering } from "./engineering";
import { pharmacy } from "./pharmacy";

export const categories = {
  engineering: {
    slug: "engineering",
    name: "Engineering",
    title: "Engineering Student Training Programs in Hyderabad",
    metaDescription:
      "Technical training for engineering students in Hyderabad: full stack development, Python, Java and DSA, data analytics, AI and ML, UI/UX, DevOps and ServiceNow, taught through projects.",
    lead: "Technical programmes for engineering and degree students, from first year to fresh graduate. Each one is built around projects you can show in a placement interview.",
    eligibility: ["Engineering students, 1st to final year", "Degree students", "Fresh graduates", "Early-stage job seekers"],
    certificate: "Certificate of Completion in Engineering and Technology Training",
  },
  pharmacy: {
    slug: "pharmacy",
    name: "Pharmacy",
    title: "Pharmacy Training Programs in Hyderabad",
    metaDescription:
      "Job-oriented courses for pharmacy students in Hyderabad after B.Pharm, M.Pharm and Pharm.D: medical coding, pharmacovigilance, clinical research, Clinical SAS, regulatory affairs, QA and QC.",
    lead: "Clinical and industry-oriented programmes that connect a pharmacy degree to the entry-level roles companies hire for.",
    eligibility: ["D.Pharm", "B.Pharm", "M.Pharm (all specialisations)", "Pharm.D", "Pharm.D (Post Baccalaureate)"],
    certificate: "Certificate of Completion in Clinical and Industry-Oriented Pharmacy Training",
  },
};

export const programs = [
  ...engineering.map((p) => ({ ...p, category: "engineering" })),
  ...pharmacy.map((p) => ({ ...p, category: "pharmacy" })),
];

export const programsIn = (category) => programs.filter((p) => p.category === category);
export const getProgram = (category, slug) => programs.find((p) => p.category === category && p.slug === slug);
export const programHref = (p) => `/programs/${p.category}/${p.slug}`;
