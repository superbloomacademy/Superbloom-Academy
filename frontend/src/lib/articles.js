// Guides for /resources. Each answers a question students actually search for and
// links to the programmes it mentions.

export const articles = [
  {
    slug: "career-options-after-b-pharmacy",
    category: "Pharmacy careers",
    title: "Career options after B.Pharmacy: 8 paths compared",
    description:
      "What to do after B.Pharm: medical coding, pharmacovigilance, clinical research, Clinical SAS, regulatory affairs, QA, QC and hospital pharmacy compared.",
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
    title: "Medical coding vs pharmacovigilance: which to choose?",
    description:
      "Medical coding and pharmacovigilance are common first jobs for pharmacy students. How the work and skills differ, and how to decide between them.",
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
      "The technical skills CSE and IT students should build before placements: one language, DSA, Git, a full stack project, databases and presenting your work.",
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
  {
    slug: "how-to-prepare-for-campus-placements",
    category: "Engineering careers",
    title: "How to prepare for campus placements: a BTech plan",
    description:
      "A step-by-step plan for BTech campus placements: aptitude, coding rounds, DSA, projects, resume, group discussion and HR interview preparation.",
    date: "2026-11-19",
    body: [
      {
        p: [
          "Campus placement drives follow a fairly standard pattern: an online test with aptitude and coding, one or two technical interviews, and an HR round. Some companies add a group discussion. Each stage filters out a large share of candidates, so preparing for all of them matters more than being excellent at one.",
          "This plan works backwards from those rounds. Start it in third year if you can. If you are already in final year, follow the same order and spend more time each week.",
        ],
      },
      {
        h: "Round 1: the online test",
        p: [
          "Most online tests combine quantitative aptitude, logical reasoning, verbal ability and one to three coding questions. Aptitude is the round students underestimate and the easiest one to improve with practice.",
        ],
        list: [
          "Quant: percentages, ratios, time and work, time and distance, profit and loss, permutations and probability",
          "Reasoning: series, coding-decoding, blood relations, seating arrangements, syllogisms",
          "Verbal: reading comprehension, sentence correction, para jumbles",
          "Practise timed sets, not single questions, because speed is what the test measures",
        ],
      },
      {
        h: "Round 2: coding and data structures",
        p: [
          "Coding questions in placement tests and technical interviews are built on a small set of topics. Learn them in one language, Java, Python or C++, and practise regularly rather than in a burst before the season.",
        ],
        list: [
          "Arrays and strings, including two pointers and sliding window",
          "Hashing, stacks and queues",
          "Linked lists, trees and binary search trees",
          "Recursion, sorting and binary search",
          "Graphs (BFS and DFS) and basic dynamic programming",
        ],
      },
      {
        h: "Round 3: the technical interview",
        p: [
          "Interviewers ask about your projects, your chosen language, and core subjects: object-oriented programming, DBMS and SQL, operating systems and computer networks. Revise these from your own notes, focusing on the questions that come up again and again, such as normalisation, joins, processes versus threads, and what happens when you type a URL into a browser.",
          "Expect to be asked to explain a project line by line. Pick one project you built yourself and know it completely: why you chose the stack, how the data flows, what broke and how you fixed it.",
        ],
      },
      {
        h: "Round 4: HR and group discussion",
        p: [
          "HR rounds check communication and fit. Prepare clear answers to the common questions: tell me about yourself, why this company, your strengths and weaknesses, and where you see yourself in a few years. Keep answers specific and short.",
          "For group discussions, the people who do well speak early, add a new point rather than repeating one, and help the group reach a conclusion. Practise with friends on current topics such as AI at work or electric vehicles.",
        ],
      },
      {
        h: "What to have ready before the season",
        list: [
          "A one-page resume with your projects, skills and links",
          "A GitHub profile with at least one complete, deployed project",
          "A LinkedIn profile that matches your resume",
          "A list of companies visiting your campus and what each one tests",
        ],
      },
      {
        h: "A realistic weekly routine",
        p: [
          "An hour a day is enough if it is consistent: four days of DSA practice, two days of aptitude sets, and one day for revising a core subject or improving your project. In the month before placements, add mock interviews with friends or seniors who have already been through the process.",
        ],
      },
    ],
    related: [
      { label: "Java and DSA", href: "/programs/engineering/java-dsa" },
      { label: "MERN full stack development", href: "/programs/engineering/mern-full-stack-development" },
      { label: "Skills CSE students should learn", href: "/resources/skills-cse-students-should-learn-before-graduation" },
      { label: "Resume guide for BTech freshers", href: "/resources/resume-for-btech-freshers" },
    ],
  },
  {
    slug: "ai-skills-for-engineering-students",
    category: "Engineering careers",
    title: "AI skills engineering students should learn in 2026",
    description:
      "Which AI skills matter for BTech students in 2026: Python, data, machine learning basics, working with LLM APIs, RAG, and building one AI project.",
    date: "2026-11-19",
    body: [
      {
        p: [
          "AI is no longer only for students who want to be AI engineers. More job descriptions for developers, analysts and testers now mention AI tools, and companies expect new hires to use them sensibly from the first week.",
          "That does not mean every student needs a research-level understanding of neural networks. It means knowing enough to build with AI, judge its output and explain what it is doing. Here is what to learn, in order.",
        ],
      },
      {
        h: "1. Python, comfortably",
        p: [
          "Almost all AI work happens in Python. Before anything else, be able to write functions, work with lists and dictionaries, read files and call an API without copying every line.",
        ],
      },
      {
        h: "2. Working with data",
        p: [
          "AI systems are only as good as their data. Learn SQL for querying, and pandas for cleaning and exploring data in Python. This skill also opens data analyst roles, which hire students from every branch.",
        ],
      },
      {
        h: "3. Machine learning fundamentals",
        p: [
          "Understand the basic ideas: training and test data, overfitting, regression and classification, and how to measure whether a model is any good. Build a few small models with scikit-learn. You do not need advanced mathematics to start, but statistics and probability help a lot.",
        ],
      },
      {
        h: "4. Building with large language models",
        p: [
          "This is the newest and fastest-growing area. Learn how to call a language model through an API, how to write prompts that give reliable results, and how to handle the cases where the model is wrong.",
        ],
        list: [
          "Prompting: clear instructions, examples and structured output",
          "Retrieval-augmented generation (RAG): letting a model answer from your own documents",
          "Tool use and simple agents: letting a model call functions to get things done",
          "Evaluation: checking answers instead of trusting them",
        ],
      },
      {
        h: "5. Putting it online",
        p: [
          "An AI project only on your laptop is hard to show. Learn enough web basics to give it a simple interface, and deploy it so an interviewer can open a link and try it.",
        ],
      },
      {
        h: "6. Using AI tools without losing your own skills",
        p: [
          "Coding assistants make you faster, but interviews still test whether you can solve problems yourself. Use AI to explain code, review your work and speed up repetitive tasks, and keep practising DSA and core subjects without it.",
        ],
      },
      {
        h: "One project that shows all of this",
        p: [
          "A good portfolio project is a chatbot that answers questions from a set of documents, such as your college handbook or a product manual. It uses Python, data handling, an LLM API, RAG and deployment. Be ready to explain how it finds the right information and how you tested its answers.",
        ],
      },
    ],
    related: [
      { label: "AI, ML and Generative AI", href: "/programs/engineering/ai-ml-generative-ai" },
      { label: "Data analytics", href: "/programs/engineering/data-analytics" },
      { label: "Python full stack", href: "/programs/engineering/python-full-stack" },
      { label: "Data analytics roadmap", href: "/resources/data-analytics-roadmap-for-engineering-students" },
    ],
  },
  {
    slug: "data-analytics-roadmap-for-engineering-students",
    category: "Engineering careers",
    title: "Data analytics roadmap for engineering students",
    description:
      "A data analytics roadmap for BTech students from any branch: Excel, SQL, Power BI, Python, statistics and the portfolio projects that get interviews.",
    date: "2026-11-19",
    body: [
      {
        p: [
          "Data analytics is one of the most open routes into a tech career. Banks, consulting firms, e-commerce companies, hospitals and IT services firms all hire analysts, and the work suits students from ECE, EEE, mechanical and civil as much as CSE.",
          "An analyst's job is to turn raw data into answers a manager can act on. This roadmap covers the skills in the order you will use them.",
        ],
      },
      {
        h: "Step 1: Excel or Google Sheets",
        p: [
          "Still the most common tool in business. Learn formulas, lookups (XLOOKUP or VLOOKUP), pivot tables, conditional formatting and basic charts. Many analyst interviews include a short spreadsheet task.",
        ],
      },
      {
        h: "Step 2: SQL",
        p: [
          "SQL is the core skill for analysts. Practise until you can write queries with joins, GROUP BY, subqueries and window functions without hesitating. Use a free database such as PostgreSQL or SQLite and a public dataset.",
        ],
      },
      {
        h: "Step 3: Statistics you will actually use",
        list: [
          "Mean, median, spread and distributions",
          "Correlation and why it is not causation",
          "Sampling and confidence",
          "A/B testing: comparing two versions of something fairly",
        ],
      },
      {
        h: "Step 4: A dashboard tool",
        p: [
          "Learn Power BI or Tableau. Build dashboards that answer a question rather than showing every chart possible. Learn to model data, write simple measures and design a page a busy person can read in a minute.",
        ],
      },
      {
        h: "Step 5: Python for analysis",
        p: [
          "With pandas and a plotting library you can clean messy data, automate repeated reports and handle files too large for a spreadsheet. This is also the bridge to machine learning if you want to go further later.",
        ],
      },
      {
        h: "Step 6: Communicating findings",
        p: [
          "The best analysts are the ones whose findings get used. Practise writing a short summary: the question, what the data shows, how sure you are and what you recommend.",
        ],
      },
      {
        h: "Portfolio projects that work",
        list: [
          "A sales or e-commerce dashboard built from a public dataset",
          "An analysis of a public dataset from your own field, such as electricity demand or road accidents",
          "A SQL case study with the questions, queries and answers written up",
          "A Python notebook that cleans a messy dataset and explains each step",
        ],
      },
      {
        h: "How long it takes",
        p: [
          "With an hour or two a day, most students can cover Excel, SQL and a dashboard tool in about three months, and add Python and a solid portfolio in the following two or three.",
        ],
      },
    ],
    related: [
      { label: "Data analytics", href: "/programs/engineering/data-analytics" },
      { label: "AI, ML and Generative AI", href: "/programs/engineering/ai-ml-generative-ai" },
      { label: "IT careers for non-CSE students", href: "/resources/it-careers-for-ece-eee-mech-students" },
      { label: "AI skills for engineering students", href: "/resources/ai-skills-for-engineering-students" },
    ],
  },
  {
    slug: "how-to-become-a-full-stack-developer-in-college",
    category: "Engineering careers",
    title: "How to become a full stack developer in college",
    description:
      "A full stack developer roadmap for college students: HTML, CSS, JavaScript, React, Node.js or Python, databases, Git, deployment and real projects.",
    date: "2026-11-19",
    body: [
      {
        p: [
          "A full stack developer builds both sides of a web application: the interface people use and the server and database behind it. It is one of the most common entry-level roles for engineering graduates, and college is the best time to learn it because you have room to build things and make mistakes.",
        ],
      },
      {
        h: "Choose a stack: MERN or Python",
        p: [
          "The MERN stack (MongoDB, Express, React, Node.js) uses JavaScript throughout, so you learn one language for both sides. A Python stack (Django or Flask with React or plain templates) suits students who already know Python or want to move towards data and AI later. Both are widely used. Pick one and finish it before looking at the other.",
        ],
      },
      {
        h: "The roadmap",
        list: [
          "Web basics: HTML, CSS, responsive layouts and how browsers work",
          "JavaScript: variables, functions, arrays, objects, DOM, async code and fetch",
          "Git and GitHub from the first week",
          "A frontend framework: React components, state, hooks and routing",
          "A backend: Node.js with Express, or Python with Django or Flask",
          "Databases: MongoDB or PostgreSQL, and enough SQL to be comfortable",
          "REST APIs, authentication and handling errors",
          "Deployment: putting your frontend, backend and database online",
        ],
      },
      {
        h: "Build projects as you learn",
        p: [
          "Tutorials teach syntax, projects teach development. After each stage, build something small without following a video. Then build one larger application that someone could actually use, such as a college event portal, a hostel complaint tracker or a small shop's order system.",
          "Deploy it, share the link with friends, and fix what they find broken. That experience is exactly what interviewers ask about.",
        ],
      },
      {
        h: "Common mistakes",
        list: [
          "Switching between stacks and never finishing one",
          "Watching tutorials without building anything alone",
          "Copying a project from YouTube and putting it on a resume unchanged",
          "Ignoring DSA, which most companies still test in the first round",
        ],
      },
      {
        h: "A timeline that works",
        p: [
          "In second year, cover web basics, JavaScript and Git. In third year, learn a framework, a backend and a database, and build your main project. In final year, polish and deploy it, add one more project, and combine this with placement preparation.",
        ],
      },
    ],
    related: [
      { label: "MERN full stack development", href: "/programs/engineering/mern-full-stack-development" },
      { label: "Python full stack", href: "/programs/engineering/python-full-stack" },
      { label: "UI/UX design", href: "/programs/engineering/ui-ux-design" },
      { label: "How to prepare for campus placements", href: "/resources/how-to-prepare-for-campus-placements" },
    ],
  },
  {
    slug: "resume-for-btech-freshers",
    category: "Engineering careers",
    title: "How to write a resume as a BTech fresher",
    description:
      "How BTech freshers should write a one-page resume: layout, projects, skills, what to leave out, ATS-friendly formatting and a checklist before you apply.",
    date: "2026-11-19",
    body: [
      {
        p: [
          "A recruiter usually looks at a fresher resume for well under a minute. In that time they want to know what you can do and whether you have proof. A clear one-page resume with real projects does that better than a long list of courses and certificates.",
        ],
      },
      {
        h: "The layout",
        list: [
          "Name, phone, email, LinkedIn and GitHub links at the top",
          "Education: degree, branch, college, year and CGPA",
          "Skills: languages, tools and frameworks you can actually use",
          "Projects: two or three, with what you built and the result",
          "Internships or experience, if you have any",
          "Certifications and achievements, kept short",
        ],
      },
      {
        h: "Write projects the right way",
        p: [
          "Projects are the most important section for a fresher. For each one, write what it does, the technology used, your part in it, and a result or link. For example: \"Built a college event registration portal with React, Node.js and MongoDB; deployed on Vercel; used by 300 students for the annual fest.\" Only include numbers that are true.",
        ],
      },
      {
        h: "Make it readable by software",
        p: [
          "Many companies screen resumes with applicant tracking systems before a person reads them. Use a simple single-column layout, standard headings, and no text inside images or tables. Use the same words as the job description where they honestly describe your skills.",
        ],
      },
      {
        h: "What to leave out",
        list: [
          "Photographs, date of birth, parents' names and a signature",
          "An objective statement that could apply to anyone",
          "Skills you could not answer a question about",
          "School-level achievements, unless they are significant",
        ],
      },
      {
        h: "Checklist before you send it",
        list: [
          "One page, saved as a PDF with your name in the file name",
          "Every link opens and every project link works",
          "No spelling mistakes; ask someone else to read it",
          "You can talk for two minutes about every line on it",
        ],
      },
    ],
    related: [
      { label: "All engineering programs", href: "/programs/engineering" },
      { label: "How to prepare for campus placements", href: "/resources/how-to-prepare-for-campus-placements" },
      { label: "How to become a full stack developer", href: "/resources/how-to-become-a-full-stack-developer-in-college" },
      { label: "Skills CSE students should learn", href: "/resources/skills-cse-students-should-learn-before-graduation" },
    ],
  },
  {
    slug: "it-careers-for-ece-eee-mech-students",
    category: "Engineering careers",
    title: "IT careers for ECE, EEE, Mech and Civil students",
    description:
      "Can non-CSE engineers get IT jobs? Roles that suit ECE, EEE, mechanical and civil students, the skills each needs and how to switch from your core branch.",
    date: "2026-11-19",
    body: [
      {
        p: [
          "Many students from ECE, EEE, mechanical and civil engineering end up working in software and IT, and most service companies hire from all branches in campus drives. Your branch is not the barrier. What matters is whether you can show the skills the role needs.",
          "Here are the roles that suit non-CSE students best, and how to prepare for each.",
        ],
      },
      {
        h: "Data analyst",
        p: [
          "Probably the most natural switch. Engineers are used to working with numbers, measurements and graphs. Learn Excel, SQL, Power BI and some Python, and build projects using data from your own field.",
        ],
      },
      {
        h: "Software developer",
        p: [
          "Open to anyone who can code. Learn one language well, DSA, and one full stack, and build a deployed project. ECE students often have a head start from C programming and microcontroller work.",
        ],
      },
      {
        h: "Cloud and DevOps",
        p: [
          "Students who like systems, networking and how things run in production do well here. Learn Linux, networking basics, Git, Docker, CI/CD and one cloud platform such as AWS or Azure. Cloud provider certifications at the foundation level are a useful first step.",
        ],
      },
      {
        h: "Testing and quality engineering",
        p: [
          "Software testers check that applications work before release, and automation testers write code to do it. It rewards careful, methodical thinking. Learn testing concepts, SQL and an automation tool such as Selenium or Playwright.",
        ],
      },
      {
        h: "Platform roles such as ServiceNow",
        p: [
          "Large companies run their IT and business workflows on platforms like ServiceNow and hire people who can configure and develop on them. These roles need less algorithm-heavy coding and more understanding of business processes.",
        ],
      },
      {
        h: "Using your core branch as an advantage",
        p: [
          "Your branch can make you stand out rather than hold you back. An EEE student who analyses power consumption data, a mechanical student who builds a maintenance dashboard, or an ECE student who works on IoT data all have a story that a CSE student does not. Choose projects that connect the two.",
        ],
      },
      {
        h: "How to start",
        list: [
          "Pick one role from this list rather than trying several at once",
          "Learn its core skills over three to six months alongside your degree",
          "Build two projects and put them on GitHub",
          "Apply to IT drives on campus and off-campus fresher openings",
        ],
      },
    ],
    related: [
      { label: "Data analytics", href: "/programs/engineering/data-analytics" },
      { label: "DevOps", href: "/programs/engineering/devops" },
      { label: "ServiceNow", href: "/programs/engineering/servicenow" },
      { label: "Data analytics roadmap", href: "/resources/data-analytics-roadmap-for-engineering-students" },
    ],
  },
];

export const getArticle = (slug) => articles.find((a) => a.slug === slug);
