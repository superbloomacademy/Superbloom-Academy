// One entry per pharmacy programme. Each becomes its own page at /programs/pharmacy/<slug>,
// so every course can rank for its own "<course> training in Hyderabad" search.

export const pharmacy = [
  {
    slug: "pharmacovigilance",
    name: "Pharmacovigilance",
    short: "Drug safety: adverse event reporting, MedDRA coding, narrative writing and case processing.",
    title: "Pharmacovigilance Training in Hyderabad",
    metaDescription:
      "Pharmacovigilance course in Hyderabad for B.Pharm, M.Pharm and Pharm.D students. Learn adverse event reporting, MedDRA coding and ICSR case processing.",
    intro: [
      "Pharmacovigilance is the work of collecting, assessing and reporting the side effects of medicines once they are in use. Every pharmaceutical company and the service firms that support them need people who can process safety cases accurately, and Hyderabad is one of the main centres in India for this work.",
      "This course takes you through a safety case from the moment a report arrives to the point it is ready for submission, so the first tasks you are given as a trainee are ones you have already practised.",
    ],
    learn: [
      "What counts as an adverse event, and the four elements of a valid case",
      "Adverse event reporting and the sources reports come from",
      "Seriousness, expectedness and causality assessment",
      "MedDRA coding of events, indications and medical history",
      "Writing a clear, complete case narrative",
      "Case processing workflow: intake, data entry, quality review and submission timelines",
    ],
    roles: ["Drug Safety Associate", "Pharmacovigilance Associate", "Safety Case Processor"],
    faqs: [
      {
        q: "Who is the pharmacovigilance course for?",
        a: "D.Pharm, B.Pharm, M.Pharm, Pharm.D and Pharm.D (PB) students and graduates who want to work in drug safety.",
      },
      {
        q: "What jobs can I apply for after pharmacovigilance training?",
        a: "Entry-level roles such as Drug Safety Associate, Pharmacovigilance Associate and Safety Case Processor.",
      },
      {
        q: "How long is the pharmacovigilance course?",
        a: "You can choose a 6-week, 3-month or 6-month format depending on how much depth and practice you want.",
      },
    ],
  },
  {
    slug: "clinical-research",
    name: "Clinical Research",
    short: "ICH-GCP, clinical trial phases, CRF handling and informed consent.",
    title: "Clinical Research Course in Hyderabad",
    metaDescription:
      "Clinical research training in Hyderabad for pharmacy students. Covers ICH-GCP, trial phases, CRF handling and informed consent, for CRC and CTA roles.",
    intro: [
      "Before a medicine reaches patients it is tested in clinical trials, and each trial needs people at the site and at the sponsor who keep it running to protocol and to regulation. Clinical research is where pharmacy graduates most directly use what they learned about drugs and patients.",
      "This course explains how a trial is designed and run, and trains you on the documents and procedures you would handle as a coordinator or trial assistant.",
    ],
    learn: [
      "ICH-GCP principles and why each one exists",
      "The phases of a clinical trial and what each phase is trying to find out",
      "Reading a protocol and understanding the roles of sponsor, investigator and ethics committee",
      "Case report form (CRF) handling and source data verification",
      "The informed consent process and its documentation",
      "Essential documents and the trial master file",
    ],
    roles: ["Clinical Research Coordinator (CRC)", "Clinical Trial Assistant (CTA)", "Clinical Research Associate (Trainee)"],
    faqs: [
      {
        q: "Is clinical research a good career after B.Pharm or Pharm.D?",
        a: "It suits graduates who like structured, documentation-heavy work with direct patient or site contact. Most people start as a coordinator or trial assistant and move towards monitoring roles with experience.",
      },
      {
        q: "What does the clinical research course cover?",
        a: "ICH-GCP, clinical trial phases, CRF handling and informed consent, taught through classes, case studies and practical assignments.",
      },
      {
        q: "Which roles does this course prepare me for?",
        a: "Clinical Research Coordinator, Clinical Trial Assistant and trainee Clinical Research Associate.",
      },
    ],
  },
  {
    slug: "medical-coding",
    name: "Medical Coding",
    short: "ICD-10, CPT and HCPCS overview, anatomy and medical terminology.",
    title: "Medical Coding Course in Hyderabad",
    metaDescription:
      "Medical coding training in Hyderabad for pharmacy and life science students. Learn ICD-10, CPT and HCPCS, anatomy and medical terminology.",
    intro: [
      "Medical coders read clinical records and translate diagnoses and procedures into standard codes that hospitals and insurers use for billing. It is steady, detail-focused work, and Hyderabad has a large number of healthcare service companies that hire freshers for it.",
      "Pharmacy students start with an advantage because they already know the anatomy, the pharmacology and much of the terminology. This course adds the code sets and the guidelines for applying them.",
    ],
    learn: [
      "Anatomy and physiology, organised the way the code books are",
      "Medical terminology: prefixes, suffixes and root words",
      "ICD-10 diagnosis coding and its conventions",
      "An overview of CPT procedure codes and HCPCS",
      "Reading a medical record and picking out what needs to be coded",
      "How coding fits into medical billing and accounts receivable",
    ],
    roles: ["Medical Coder", "Medical Billing Analyst", "AR Executive"],
    faqs: [
      {
        q: "Can pharmacy students do medical coding?",
        a: "Yes. Pharmacy students already know anatomy and medical terminology, which are the foundation of coding. The course is open to D.Pharm, B.Pharm, M.Pharm and Pharm.D students.",
      },
      {
        q: "What will I learn in the medical coding course?",
        a: "ICD-10 diagnosis coding, an overview of CPT and HCPCS, anatomy and medical terminology.",
      },
      {
        q: "What jobs follow medical coding training?",
        a: "Medical Coder, Medical Billing Analyst and AR (accounts receivable) Executive.",
      },
    ],
  },
  {
    slug: "quality-control",
    name: "Quality Control",
    short: "SOPs, HPLC and GC basics, wet lab analysis and documentation.",
    title: "Quality Control (QC) Training in Hyderabad",
    metaDescription:
      "Pharmaceutical quality control training in Hyderabad. Learn SOPs, HPLC and GC basics, wet lab analysis and documentation for QC analyst roles.",
    intro: [
      "Quality control is the laboratory side of pharmaceutical manufacturing. QC analysts test raw materials, in-process samples and finished products to confirm each batch meets its specification before it is released.",
      "Hyderabad's manufacturing belt means QC is one of the most common first jobs for pharmacy graduates. This course covers the instruments, the bench techniques and the documentation habits a QC lab expects.",
    ],
    learn: [
      "Reading and following standard operating procedures (SOPs)",
      "HPLC basics: principle, parts of the system and reading a chromatogram",
      "GC basics and where it is used",
      "Wet lab analysis and classical techniques",
      "Recording results correctly in lab notebooks and worksheets",
      "Good laboratory practice and why data integrity matters",
    ],
    roles: ["QC Analyst (Trainee)", "Lab Assistant"],
    faqs: [
      {
        q: "What is the difference between QC and QA in pharma?",
        a: "Quality control tests the product in the laboratory. Quality assurance manages the systems and documentation that make sure every batch is made correctly. We run a separate course for each.",
      },
      {
        q: "What does the QC course cover?",
        a: "SOPs, HPLC and GC basics, wet lab analysis and documentation.",
      },
      {
        q: "What roles can I apply for after QC training?",
        a: "Trainee QC Analyst and Lab Assistant roles in pharmaceutical manufacturing and testing labs.",
      },
    ],
  },
  {
    slug: "quality-assurance",
    name: "Quality Assurance",
    short: "GMP, documentation systems, deviation management and CAPA.",
    title: "Quality Assurance (QA) Training in Hyderabad",
    metaDescription:
      "Pharmaceutical quality assurance course in Hyderabad. Learn GMP, documentation systems, deviation management and CAPA for QA executive roles.",
    intro: [
      "Quality assurance makes sure a medicine is manufactured the same correct way every time. QA teams own the procedures, review the batch records, investigate what went wrong when something deviates, and make sure it does not happen again.",
      "This course teaches the quality system as a working whole, so you understand what each document is for as well as how to fill it in.",
    ],
    learn: [
      "Good manufacturing practice (GMP) and what it requires on the shop floor",
      "Documentation systems: how procedures and records are written, issued and controlled",
      "Good documentation practice",
      "Deviation management: recording, investigating and closing a deviation",
      "Corrective and preventive action (CAPA)",
      "How QA works with production and QC",
    ],
    roles: ["QA Executive (Trainee)", "Documentation Officer"],
    faqs: [
      {
        q: "What will I learn in the QA course?",
        a: "GMP, documentation systems, deviation management and CAPA.",
      },
      {
        q: "Is QA a good first job for a B.Pharm graduate?",
        a: "It suits people who are careful with documents and like understanding how a whole process fits together. Trainee QA Executive and Documentation Officer are common entry points.",
      },
      {
        q: "Should I choose QA or QC?",
        a: "Choose QC if you want to work at the bench with instruments. Choose QA if you prefer systems, documentation and investigation. Call us if you would like help deciding.",
      },
    ],
  },
  {
    slug: "regulatory-affairs",
    name: "Regulatory Affairs",
    short: "CTD and eCTD, dossier preparation, labelling compliance, CDSCO and FDA overview.",
    title: "Regulatory Affairs Course in Hyderabad",
    metaDescription:
      "Drug regulatory affairs training in Hyderabad for pharmacy students. Learn CTD and eCTD, dossier preparation, labelling and CDSCO and FDA requirements.",
    intro: [
      "No medicine can be sold until a regulator approves it, and regulatory affairs is the team that prepares and submits that case. The work is to assemble the evidence on quality, safety and efficacy into the format each authority requires.",
      "This course introduces the common technical document, the Indian and US regulators, and the practical task of compiling a dossier.",
    ],
    learn: [
      "The role of regulatory affairs across a product's life",
      "CTD structure and what belongs in each module",
      "eCTD: the electronic format and how submissions are organised",
      "Dossier preparation and compilation",
      "Labelling compliance",
      "An overview of CDSCO and US FDA requirements",
    ],
    roles: ["Regulatory Affairs Executive (Trainee)"],
    faqs: [
      {
        q: "What does a regulatory affairs executive do?",
        a: "They prepare and compile the documents a company submits to regulators such as CDSCO and the US FDA to get a medicine approved and keep it on the market.",
      },
      {
        q: "What does the regulatory affairs course cover?",
        a: "CTD and eCTD, dossier preparation, labelling compliance, and an overview of CDSCO and FDA requirements.",
      },
      {
        q: "Who should take this course?",
        a: "B.Pharm, M.Pharm and Pharm.D students who enjoy precise writing and want a desk-based role in the pharmaceutical industry.",
      },
    ],
  },
  {
    slug: "hospital-clinical-pharmacy",
    name: "Hospital and Clinical Pharmacy",
    short: "Prescription analysis, patient counselling and identifying drug interactions.",
    title: "Hospital and Clinical Pharmacy Training",
    metaDescription:
      "Hospital and clinical pharmacy training in Hyderabad for D.Pharm, B.Pharm and Pharm.D students: prescription analysis, counselling and drug interactions.",
    intro: [
      "Hospital and clinical pharmacists are the last check between a prescription and a patient. They read the prescription critically, catch interactions and dosing problems, and explain to patients how to take their medicines.",
      "This course builds those skills through practice on real prescription patterns, with hospital or clinical exposure where applicable.",
    ],
    learn: [
      "Prescription analysis: reading, checking and querying a prescription",
      "Identifying drug interactions and what to do about them",
      "Patient counselling: explaining dose, timing and side effects in plain language",
      "Dispensing practice and medication safety",
      "Working alongside doctors and nurses on a ward",
    ],
    roles: ["Hospital Pharmacist", "Clinical Pharmacist (Assistant level)"],
    faqs: [
      {
        q: "Is this course useful for Pharm.D students?",
        a: "Yes. It gives Pharm.D and Pharm.D (PB) students structured practice in prescription analysis, counselling and interaction checking alongside their clinical postings.",
      },
      {
        q: "What does the course cover?",
        a: "Prescription analysis, patient counselling and drug interaction identification.",
      },
      {
        q: "Which roles does it prepare me for?",
        a: "Hospital Pharmacist and assistant-level Clinical Pharmacist roles.",
      },
    ],
  },
  {
    slug: "clinical-sas",
    name: "Clinical SAS",
    short: "SAS programming for clinical trial data: datasets, tables, listings and CDISC standards.",
    title: "Clinical SAS Training in Hyderabad",
    metaDescription:
      "Clinical SAS course in Hyderabad for pharmacy and life science students. Learn Base SAS, clinical trial data, CDISC SDTM and ADaM, and tables and listings.",
    intro: [
      "Every clinical trial produces data that has to be cleaned, organised and reported to regulators in a standard form. Clinical SAS programmers do that work, using the SAS language to turn raw trial data into the datasets and tables a submission needs.",
      "It is a route into the technical side of clinical research for pharmacy students who are comfortable with logic and numbers. This course starts from SAS basics and builds up to the clinical standards and outputs used on real studies.",
    ],
    learn: [
      "Base SAS: data steps, procedures and working with datasets",
      "Importing, cleaning and merging data",
      "How clinical trial data is collected and structured",
      "An introduction to CDISC standards: SDTM and ADaM",
      "Producing tables, listings and figures",
      "SAS macros and SQL basics for repeatable work",
    ],
    roles: ["Clinical SAS Programmer (Trainee)", "Statistical Programmer (Trainee)", "Clinical Data Analyst"],
    faqs: [
      {
        q: "Can pharmacy students learn Clinical SAS without a programming background?",
        a: "Yes. The course starts from the basics of SAS. It suits students who are comfortable with logical, step-by-step work.",
      },
      {
        q: "What does the Clinical SAS course cover?",
        a: "Base SAS, clinical trial data, an introduction to CDISC SDTM and ADaM, and producing tables, listings and figures.",
      },
      {
        q: "What roles does Clinical SAS lead to?",
        a: "Trainee Clinical SAS Programmer, trainee Statistical Programmer and Clinical Data Analyst roles.",
      },
    ],
  },
];

