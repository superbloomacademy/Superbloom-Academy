export const site = {
  name: "Superbloom Academy",
  url: "https://www.superbloomacademy.in",
  tagline: "Industry-oriented training for career readiness",
  description:
    "Industry-oriented training for engineering and pharmacy students across Telangana and Andhra Pradesh: practical programmes, workshops and campus training.",
  // where we train: shown in the hero badge and used in the copy
  serviceArea: "Telangana and Andhra Pradesh",
  email: "superbloomacademy@gmail.com",
  phones: ["9121090091", "7993915924"],
  // public profiles, listed in the organisation data search engines read
  social: ["https://www.instagram.com/superbloom.academy/"],
  // number used for WhatsApp chat buttons; must be a WhatsApp account
  whatsapp: "9121090091",
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

export const whatsappHref = (text = "") =>
  `https://wa.me/91${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const telHref = (n) => `tel:+91${n}`;
export const formatPhone = (n) => `+91 ${n.slice(0, 5)} ${n.slice(5)}`;

export const nav = [
  { name: "Programs", href: "/programs" },
  { name: "For colleges", href: "/for-colleges" },
  { name: "Workshops", href: "/workshops" },
  { name: "Resources", href: "/resources" },
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

// The four stages every programme follows (home page and ad landing pages).
export const trainingSteps = [
  { title: "Learn", desc: "Trainer-led classes and demonstrations build the theory each task depends on." },
  { title: "Practise", desc: "Assignments and case studies on the tasks a trainee is given in a first job." },
  { title: "Build", desc: "A project that mirrors a real deliverable." },
  { title: "Get certified", desc: "Quizzes, a final evaluation and a viva lead to your Certificate of Completion." },
];

export const assessment = [
  "Weekly quizzes",
  "Practical assignments",
  "Case study presentations",
  "Final evaluation test",
  "Viva (oral examination)",
];


export const faqs = [
  {
    q: "What is Superbloom Academy?",
    a: "Superbloom Academy is a training academy for engineering and pharmacy students across Telangana and Andhra Pradesh. We teach the practical skills employers expect from a new hire, at our Hyderabad centre and on college campuses.",
  },
  {
    q: "Who can enrol?",
    a: "The pharmacy stream is open to D.Pharm, B.Pharm, M.Pharm, Pharm.D and Pharm.D (PB) students and graduates. The engineering stream is open to engineering students, degree students, freshers and early-stage job seekers.",
  },
  {
    q: "Which programmes do you offer?",
    a: "For pharmacy students: medical coding, pharmacovigilance, clinical research, Clinical SAS, regulatory affairs, quality assurance, quality control, and hospital and clinical pharmacy. For engineering students: MERN and Python full stack development, Java and DSA, data analytics, AI and ML, UI/UX design, DevOps and ServiceNow.",
  },
  {
    q: "Do you train whole batches at colleges?",
    a: "Yes. We deliver campus training for engineering and pharmacy colleges. A college can request a proposal from the For colleges page.",
  },
  {
    q: "How long are the pharmacy programmes?",
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
