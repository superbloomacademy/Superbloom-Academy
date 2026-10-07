import Image from "next/image";
import Link from "next/link";
import { Building2, Check, MapPin, Presentation, Wrench } from "lucide-react";
import ReelPlayer from "@/components/ReelPlayer";
import { CtaBand, DurationOptions, PageHero, Section } from "@/components/sections";
import { programsIn } from "@/lib/programs";
import { og } from "@/lib/seo";
import { fullAddress, site, trainingSteps } from "@/lib/site";

const description =
  "Who we are, how we teach and why engineering and pharmacy students and colleges across Telangana and Andhra Pradesh choose Superbloom Academy.";

export const metadata = {
  title: { absolute: "About Superbloom Academy | Telangana and Andhra Pradesh" },
  description,
  alternates: { canonical: "/about" },
  openGraph: og({
    description,
    url: "/about",
    images: [
      {
        url: "/images/about/campus-training-hall.jpg",
        width: 1600,
        height: 1200,
        alt: "Students at a Superbloom Academy campus training session",
      },
    ],
  }),
};

const gap = [
  {
    heading: "What a degree gives you",
    items: ["The theory of your subject", "Exams that reward recall", "Marks for work done alone"],
  },
  {
    heading: "What a first job asks for",
    items: [
      "The tools, documents and processes a team uses every day",
      "Work finished to a standard and a deadline",
      "Explaining your work and getting on with a team",
    ],
    strong: true,
  },
];

const reasons = [
  {
    title: "A curriculum built from the job",
    desc: "We start from what employers ask of a new hire and work backwards. When the tools and standards change, the syllabus changes with them.",
  },
  {
    title: "Trainers from industry",
    desc: "You learn from professionals with industry experience, so the examples in class come from current practice.",
  },
  {
    title: "Practice in every topic",
    desc: "Each concept is followed by a demonstration, a case study or an assignment. You use it before you move on.",
  },
  {
    title: "Every course points to a role",
    desc: "Each programme is tied to specific job roles, so you know from the first week what you are training for.",
  },
  {
    title: "Assessment that proves the skill",
    desc: "Weekly quizzes, practical assignments, case study presentations, a final test and a viva show what you can do.",
  },
  {
    title: "A certificate you have earned",
    desc: "The Certificate of Completion is issued once you finish the programme and pass its assessments.",
  },
];

const habits = [
  {
    icon: Wrench,
    title: "Practical skills",
    desc: "You have already used the tools, documents and processes your team will hand you.",
  },
  {
    icon: Building2,
    title: "Industry exposure",
    desc: "Projects, case studies and clinical exposure have shown you how real problems get solved.",
  },
  {
    icon: Presentation,
    title: "Professional readiness",
    desc: "You have practised presenting, working in a team and thinking a problem through.",
  },
];

// Add a person here to show them on the page. Without `photo` the card shows their initials.
const contributors = [
  { name: "Sangulugari Madhu Goud", role: "Contributor", photo: "/images/team/madhu-goud.jpg" },
  { name: "Abdul Hameed", role: "Contributor" },
];

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

function Photo({ src, alt, sizes, className = "" }) {
  return (
    <figure className={`relative overflow-hidden rounded-3xl bg-white/10 ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </figure>
  );
}

export default function About() {
  return (
    <>
      <PageHero
        dark
        title={
          <>
            <span className="mb-4 block font-sans text-base font-semibold uppercase tracking-[0.14em] text-bloom">
              About Superbloom Academy
            </span>
            Training that turns a degree into a first job
          </>
        }
        lead={`We teach engineering and pharmacy students across ${site.serviceArea} the practical skills an employer expects on day one.`}
        crumbs={[{ name: "About", href: "/about" }]}
        aside={
          <div className="relative pb-6">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-white/15 lg:rotate-1">
              <Image
                src="/images/about/campus-training-hall.jpg"
                alt="A full hall of students at a Superbloom Academy session on career opportunities for pharmacy students"
                fill
                priority
                sizes="(min-width: 1024px) 32rem, 100vw"
                className="object-cover"
              />
            </figure>
            <p className="absolute bottom-0 left-5 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink shadow-lg">
              <MapPin size={18} aria-hidden className="text-cobalt" />
              Hyderabad centre and college campuses
            </p>
          </div>
        }
      >
        <Link href="/programs" className="btn btn-bloom">
          Explore programmes
        </Link>
        <Link href="/for-colleges" className="btn btn-line-light">
          Training for colleges
        </Link>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <h2 className="text-3xl font-bold sm:text-5xl">
            Students graduate knowing their subject. The first job still feels unfamiliar.
          </h2>
          <div className="prose-sba text-lg text-slate">
            <p>
              We see it every year. A graduate can explain the theory and still not know where to begin when a team
              hands over real work. Superbloom Academy exists to close that gap.
            </p>
            <p>
              We run{" "}
              <Link href="/programs/engineering" className="link">
                {programsIn("engineering").length} engineering programmes
              </Link>{" "}
              and{" "}
              <Link href="/programs/pharmacy" className="link">
                {programsIn("pharmacy").length} pharmacy programmes
              </Link>
              , short{" "}
              <Link href="/workshops" className="link">
                workshops
              </Link>{" "}
              on a single skill, and{" "}
              <Link href="/for-colleges" className="link">
                campus training
              </Link>{" "}
              for whole college batches. Students join us on their own or through their college.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {gap.map(({ heading, items, strong }) => (
            <div
              key={heading}
              className={`rounded-3xl p-7 sm:p-9 ${strong ? "bg-ink text-white" : "bg-paper ring-1 ring-line"}`}
            >
              <h3 className={`text-2xl font-bold ${strong ? "text-bloom" : ""}`}>{heading}</h3>
              <ul className="mt-5 space-y-3 text-lg">
                {items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check
                      size={22}
                      aria-hidden
                      className={`mt-0.5 shrink-0 ${strong ? "text-bloom" : "text-slate"}`}
                    />
                    <span className={strong ? "" : "text-slate"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="why"
        tone="paper"
        title="Why students and colleges choose us"
        lead="Six things you can hold us to."
      >
        <ol className="grid gap-px overflow-hidden rounded-3xl bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <li key={reason.title} className="bg-white p-7 sm:p-8">
              <span aria-hidden className="font-display text-4xl font-bold text-cobalt/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-bold">{reason.title}</h3>
              <p className="mt-2 text-slate">{reason.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        tone="mist"
        title="How we teach"
        lead="Theory is taught for the sake of the task it supports. Every programme moves through the same four stages."
      >
        <ol className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {trainingSteps.map((step, i) => (
            <li key={step.title} className="border-t-2 border-ink pt-5">
              <span className="inline-flex h-9 items-center rounded-full bg-bloom px-3.5 text-sm font-bold">
                Step {i + 1}
              </span>
              <h3 className="mt-4 text-2xl font-bold">{step.title}</h3>
              <p className="mt-2 text-slate">{step.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="white" title="What you carry into your first job">
        <ul className="grid gap-10 md:grid-cols-3">
          {habits.map(({ icon: Icon, title, desc }) => (
            <li key={title}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-cobalt">
                <Icon size={24} aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-slate">{desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone="paper"
        title="Pick the pace that fits your timetable"
        lead="The same approach in three lengths, from a first look at a domain to the full programme."
      >
        <DurationOptions />
      </Section>

      <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
        <div aria-hidden className="dots absolute inset-0 opacity-50" />
        <div className="wrap relative grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div className="mx-auto w-full max-w-xs lg:max-w-none">
            <ReelPlayer
              src="/videos/ui-ux-workshop.mp4"
              poster="/videos/ui-ux-workshop-poster.jpg"
              label="Inside our UI/UX workshop at a college campus"
            />
          </div>
          <div>
            <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">In the room with students</h2>
            <p className="mt-4 max-w-xl text-lg text-white/80">
              We take sessions to college campuses as well as running them at our centre. Play the clip from our
              UI/UX workshop, then see a session on career opportunities for pharmacy students.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5">
              <Photo
                src="/images/about/pharmacy-careers-session.jpg"
                alt="A Superbloom trainer presenting career opportunities for pharmacy students to a college class"
                sizes="(min-width: 1024px) 44rem, 100vw"
                className="col-span-2 aspect-[16/9]"
              />
              <Photo
                src="/images/about/campus-session-trainer.jpg"
                alt="A trainer speaking to a hall of students during a campus session"
                sizes="(min-width: 1024px) 22rem, 50vw"
                className="aspect-[4/3]"
              />
              <Photo
                src="/images/about/campus-session-students.jpg"
                alt="Students following a presentation on the projector during a campus session"
                sizes="(min-width: 1024px) 22rem, 50vw"
                className="aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
          <div>
            <h2 className="max-w-md text-3xl font-bold sm:text-4xl">The people behind Superbloom</h2>
            <p className="mt-4 max-w-md text-lg text-slate">
              Superbloom Academy is built and run by its contributors.
            </p>
          </div>
          <ul className="reveal grid grid-cols-2 gap-4 sm:gap-5">
            {contributors.map((person) => (
              <li key={person.name} className="group sm:w-64">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-mist ring-1 ring-line transition-[translate,box-shadow] duration-300 ease-out-strong group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_48px_-18px_rgb(10_26_74/0.32)]">
                  {/* the shapes stay in the top corners so they never sit behind a face */}
                  <span
                    aria-hidden
                    className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-bloom transition-[scale] duration-500 ease-out-strong group-hover:scale-125 motion-safe:animate-float"
                  />
                  <span
                    aria-hidden
                    className="absolute left-4 top-4 h-11 w-11 rounded-full border-2 border-dashed border-cobalt/40 motion-safe:animate-turn"
                  />
                  {person.photo ? (
                    // multiply drops the photo's white backdrop so the card colour shows through
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      sizes="(min-width: 640px) 16rem, 50vw"
                      className="origin-bottom object-cover object-top mix-blend-multiply transition-[scale] duration-500 ease-out-strong group-hover:scale-105"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center font-display text-5xl font-bold text-cobalt/35 transition-[scale] duration-500 ease-out-strong group-hover:scale-110 sm:text-7xl"
                    >
                      {initials(person.name)}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold sm:text-xl">{person.name}</h3>
                <p className="mt-1 font-semibold text-cobalt">{person.role}</p>
                <span
                  aria-hidden
                  className="mt-3 block h-1 w-8 rounded-full bg-bloom transition-[width] duration-300 ease-out-strong group-hover:w-16"
                />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="mist">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-cobalt ring-1 ring-line">
              <MapPin size={24} aria-hidden />
            </span>
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Where to find us</h2>
              <address className="mt-3 max-w-xl text-lg not-italic text-slate">{fullAddress}</address>
              <p className="mt-2 text-slate">We also train on college campuses across {site.serviceArea}.</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn btn-ink">
              Contact us
            </Link>
            <Link href="/for-colleges" className="btn btn-line">
              Training for colleges
            </Link>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
