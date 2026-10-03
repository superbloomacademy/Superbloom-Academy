export const site = {
  name: "Superbloom Academy",
  url: "https://www.superbloomacademy.in",
  tagline: "Industry-oriented training for career readiness",
  description:
    "Job-oriented training in Hyderabad for pharmacy and engineering students. Pharmacovigilance, clinical research, medical coding, QA, QC and regulatory affairs courses in 6-week, 3-month and 6-month formats.",
  email: "contact@superbloomacademy.in",
  phones: ["9121090091", "7993915924"],
  address: {
    street: "H. No: 2-101/A, Ground Floor, Opp. Mana Hospital, Beside Sub-Registration Office, Venkatrama Colony",
    locality: "Suraram, Hyderabad",
    region: "Telangana",
    postalCode: "500055",
  },
  hours: [
    { days: "Monday to Friday", time: "9:00 AM to 6:00 PM" },
    { days: "Saturday", time: "9:00 AM to 2:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
};

export const fullAddress = `${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`;

export const telHref = (n) => `tel:+91${n}`;
export const formatPhone = (n) => `+91 ${n.slice(0, 5)} ${n.slice(5)}`;

export const nav = [
  { name: "Pharmacy courses", href: "/streams/pharmacy" },
  { name: "Engineering", href: "/streams/engineering" },
  { name: "Why Superbloom", href: "/why-superbloom" },
  { name: "About", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export const durations = [
  { type: "Short-term", duration: "6 weeks", hours: "2–3 hours a day", fit: "A focused introduction to one domain while you finish your degree." },
  { type: "Medium-term", duration: "3 months", hours: "3–4 hours a day", fit: "Covers a domain end to end with assignments and case studies." },
  { type: "Long-term", duration: "6 months", hours: "4–5 hours a day", fit: "The full programme, with projects and hospital or clinical exposure where applicable." },
];

export const methodology = [
  { title: "Classroom sessions", desc: "Trainer-led classes that build the theory each task depends on." },
  { title: "Case study discussions", desc: "Real scenarios worked through as a group, the way a team would at work." },
  { title: "Practical demonstrations", desc: "You watch a task done properly, then do it yourself." },
  { title: "Skill-based assignments", desc: "Regular exercises on the tasks a trainee is given in the first months of a job." },
  { title: "Industry-oriented projects", desc: "A longer piece of work that mirrors a real deliverable." },
  { title: "Hospital and clinical exposure", desc: "Time in a clinical setting, where the domain calls for it." },
];

export const assessment = [
  "Weekly quizzes",
  "Practical assignments",
  "Case study presentations",
  "Final evaluation test",
  "Viva (oral examination)",
];

export const pharmacyEligibility = ["D.Pharm", "B.Pharm", "M.Pharm (all specialisations)", "Pharm.D", "Pharm.D (Post Baccalaureate)"];

export const engineeringEligibility = ["Engineering students", "Degree students", "Freshers", "Early-stage job seekers"];

export const faqs = [
  {
    q: "What is Superbloom Academy?",
    a: "Superbloom Academy is a training institute in Suraram, Hyderabad. We run industry-oriented programmes for pharmacy and engineering students that cover the practical skills employers expect from a new hire.",
  },
  {
    q: "Who can enrol?",
    a: "The pharmacy stream is open to D.Pharm, B.Pharm, M.Pharm, Pharm.D and Pharm.D (PB) students and graduates. The engineering stream is open to engineering students, degree students, freshers and early-stage job seekers.",
  },
  {
    q: "Which pharmacy courses do you offer?",
    a: "Seven domains: pharmacovigilance, clinical research, medical coding, quality control, quality assurance, regulatory affairs, and hospital and clinical pharmacy.",
  },
  {
    q: "How long are the programmes?",
    a: "There are three formats: short-term (6 weeks, 2–3 hours a day), medium-term (3 months, 3–4 hours a day) and long-term (6 months, 4–5 hours a day).",
  },
  {
    q: "Will I receive a certificate?",
    a: "Yes. Students who complete the programme and its assessments receive a Certificate of Completion from Superbloom Academy.",
  },
  {
    q: "How are students assessed?",
    a: "Through weekly quizzes, practical assignments, case study presentations, a final evaluation test and a viva.",
  },
  {
    q: "How do I apply?",
    a: "Fill in the admission form on this website or call us. We will contact you to talk through the course, the batch timings and the fees.",
  },
];
