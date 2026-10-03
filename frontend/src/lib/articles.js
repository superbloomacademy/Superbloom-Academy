// Guides for /resources. Each answers a question students actually search for and
// links to the programmes it mentions.

export const articles = [
  {
    slug: "career-options-after-b-pharmacy",
    category: "Pharmacy careers",
    title: "Career options after B.Pharmacy: eight industry paths compared",
    description:
      "What to do after B.Pharm: a plain comparison of medical coding, pharmacovigilance, clinical research, Clinical SAS, regulatory affairs, QA, QC and hospital pharmacy, and who each one suits.",
    date: "2026-10-03",
    body: [
      {
        p: [
          "A B.Pharm degree opens more doors than most students realise in their final year. Beyond the medical shop and the M.Pharm entrance exam, there is a set of industry roles that hire pharmacy graduates as freshers. They differ a lot in what the day looks like, so the useful question is which kind of work suits you.",
          "This guide groups the options by the kind of work involved: desk-based case and document work, laboratory and manufacturing work, and patient-facing work.",
        ],
      },
      {
        h: "Desk-based roles in pharma services",
        p: [
          "These are non-clinical roles, usually in an office, where the work is reading, assessing and recording information accurately. Hyderabad has a large concentration of the service companies that hire for them.",
        ],
        list: [
          "Pharmacovigilance: processing reports of side effects for medicines already on the market. Suits people who are careful readers and comfortable with medical terminology.",
          "Medical coding: translating diagnoses and procedures in clinical records into standard codes used for billing. Suits people who like clear rules and steady, detail-focused work.",
          "Regulatory affairs: compiling the documents a company submits to regulators to get a medicine approved. Suits people who write precisely and like structure.",
          "Clinical SAS: programming the datasets and tables that report clinical trial results. Suits people who enjoy logic and numbers and are willing to learn to code.",
        ],
      },
      {
        h: "Clinical research",
        p: [
          "Clinical research sits between the desk and the patient. Coordinators and trial assistants keep a clinical trial running to protocol at a hospital site or at the sponsor. The work involves documentation, coordination with doctors and ethics committees, and sometimes direct contact with trial participants. It suits organised people who are comfortable talking to others.",
        ],
      },
      {
        h: "Laboratory and manufacturing roles",
        p: [
          "If you liked your practical labs, the manufacturing side of the industry is where that experience counts most.",
        ],
        list: [
          "Quality control: testing raw materials and finished products in the laboratory with instruments such as HPLC. Bench work, usually at a manufacturing site, often in shifts.",
          "Quality assurance: managing the procedures and records that make sure every batch is made correctly, and investigating when something goes wrong. More documentation than bench work.",
        ],
      },
      {
        h: "Patient-facing roles",
        p: [
          "Hospital and clinical pharmacy keeps you closest to patients: checking prescriptions, catching interactions and counselling patients on how to take their medicines. It is the natural route for Pharm.D graduates and for B.Pharm graduates who want direct patient contact.",
        ],
      },
      {
        h: "How to choose",
        p: [
          "Ask yourself three questions. Do you want to work at a desk, at a bench or with patients? Are you happier with reading and writing, or with instruments and procedures? Are you open to learning some programming? Your answers narrow eight options to two or three quite quickly.",
          "Then read the curriculum of those two or three and see which one you would actually enjoy practising for weeks. Interest matters more than which field is talked about most in your college.",
        ],
      },
    ],
    related: [
      { label: "All pharmacy programs", href: "/programs/pharmacy" },
      { label: "Pharmacovigilance", href: "/programs/pharmacy/pharmacovigilance" },
      { label: "Medical coding", href: "/programs/pharmacy/medical-coding" },
      { label: "Clinical research", href: "/programs/pharmacy/clinical-research" },
    ],
  },
  {
    slug: "medical-coding-vs-pharmacovigilance",
    category: "Pharmacy careers",
    title: "Medical coding vs pharmacovigilance: which should a pharmacy student choose?",
    description:
      "Medical coding and pharmacovigilance are two of the most common first jobs for pharmacy students. How the work, the skills and the training differ, and how to decide between them.",
    date: "2026-10-03",
    body: [
      {
        p: [
          "Medical coding and pharmacovigilance are the two courses pharmacy students ask about most, and they are often presented as if they were interchangeable. They are different jobs. Both are desk-based and both reward accuracy, but what you read all day and what you produce are not the same.",
        ],
      },
      {
        h: "What a medical coder does",
        p: [
          "A medical coder reads a patient's clinical record, such as a doctor's notes or a discharge summary, and assigns standard codes for each diagnosis and procedure. The main code sets are ICD-10 for diagnoses and CPT and HCPCS for procedures and services. Hospitals and insurers use those codes to bill and pay claims.",
          "The skill is knowing anatomy and medical terminology well enough to understand the record, and knowing the coding guidelines well enough to pick the right code. Work is measured on accuracy and volume.",
        ],
      },
      {
        h: "What a pharmacovigilance associate does",
        p: [
          "A pharmacovigilance associate processes reports of adverse events, the unwanted effects people experience while taking a medicine. For each case they check it is valid, enter the details, code the events using the MedDRA dictionary, assess seriousness, and write a narrative that summarises what happened. Cases have regulatory deadlines.",
          "The skill is pharmacology and clinical judgement: understanding what the drug does, what the event is, and how to describe the case clearly.",
        ],
      },
      {
        h: "The main differences",
        list: [
          "Subject: medical coding is about diagnoses, procedures and billing. Pharmacovigilance is about medicines and their side effects.",
          "Knowledge you use: coding leans on anatomy and terminology. Pharmacovigilance leans on pharmacology.",
          "Writing: coding involves very little free writing. Pharmacovigilance involves writing case narratives.",
          "Who hires: coders are hired by healthcare service and medical billing companies. Pharmacovigilance associates are hired by pharmaceutical companies and the service firms that support them.",
        ],
      },
      {
        h: "Which one suits you",
        p: [
          "Choose medical coding if you like clear rules, were strong in anatomy, and prefer work where the answer is right or wrong. Choose pharmacovigilance if pharmacology was your favourite subject, you write reasonably well in English, and you want to stay close to drugs and drug safety.",
          "If you cannot decide, look at one real example of each: a coded medical record and an adverse event narrative. Most students know within a few minutes which one they would rather do every day.",
        ],
      },
    ],
    related: [
      { label: "Medical coding programme", href: "/programs/pharmacy/medical-coding" },
      { label: "Pharmacovigilance programme", href: "/programs/pharmacy/pharmacovigilance" },
      { label: "Career options after B.Pharmacy", href: "/resources/career-options-after-b-pharmacy" },
    ],
  },
  {
    slug: "skills-cse-students-should-learn-before-graduation",
    category: "Engineering careers",
    title: "What skills should CSE students learn before graduation?",
    description:
      "A practical list of the technical skills CSE and IT students should build before placements: one language, DSA, Git, a full stack project, databases, and how to present your work.",
    date: "2026-10-03",
    body: [
      {
        p: [
          "Most engineering students reach final year having passed every subject and still unsure whether they are ready for a software job. The gap is rarely theory. It is that placements test things the syllabus only touches: writing code under time pressure, building something that works, and explaining it.",
          "Here is what is worth learning before you graduate, in the order that makes each step easier.",
        ],
      },
      {
        h: "1. One programming language, properly",
        p: [
          "Pick Java or Python and stay with it until you can write a few hundred lines without looking things up. Depth in one language is worth more in an interview than a list of five on your resume.",
        ],
      },
      {
        h: "2. Data structures and algorithms",
        p: [
          "Coding rounds are built on arrays, strings, linked lists, trees, graphs, sorting, searching and dynamic programming. Learn each structure, then practise problems regularly in the language you chose. Consistency over months matters more than a burst before placements.",
        ],
      },
      {
        h: "3. Git and GitHub",
        p: [
          "Every software team uses version control. Learn to commit, branch, merge and open a pull request, and keep your projects on GitHub so there is something for an interviewer to look at.",
        ],
      },
      {
        h: "4. Build one complete application",
        p: [
          "A full stack project teaches you things no single subject does: how a frontend talks to a server, how data is stored, how a user logs in, and how to put the result online. The MERN stack and Python full stack are both good routes. Build something with a real use, such as a college management portal, and deploy it.",
        ],
      },
      {
        h: "5. Databases and SQL",
        p: [
          "Almost every application stores data, and SQL questions appear in many interviews. Be comfortable writing queries with joins and aggregation, and understand how to design a simple schema.",
        ],
      },
      {
        h: "6. One specialisation that interests you",
        p: [
          "Once the basics are in place, go a step further in one direction: data analytics, AI and machine learning, DevOps, UI/UX design or a platform skill such as ServiceNow. It gives you something specific to talk about and a second kind of role to apply for.",
        ],
      },
      {
        h: "7. Explaining your work",
        p: [
          "Interviewers ask you to walk through your project and your reasoning. Practise explaining what you built, the decisions you made and what you would change. A modest project explained clearly beats an impressive one you cannot describe.",
        ],
      },
      {
        h: "When to start",
        p: [
          "First and second year are the time for a language and DSA. Third year is the time for a project and a specialisation. If you are already in final year, focus on DSA practice and finishing one deployed project.",
        ],
      },
    ],
    related: [
      { label: "All engineering programs", href: "/programs/engineering" },
      { label: "MERN full stack development", href: "/programs/engineering/mern-full-stack-development" },
      { label: "Java and DSA", href: "/programs/engineering/java-dsa" },
      { label: "Python full stack", href: "/programs/engineering/python-full-stack" },
    ],
  },
];

export const getArticle = (slug) => articles.find((a) => a.slug === slug);
