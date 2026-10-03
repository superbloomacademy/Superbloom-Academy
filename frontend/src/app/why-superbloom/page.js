import { Award, BookOpenCheck, ClipboardCheck, Compass, Presentation, Target, UsersRound, Wrench, Building2 } from "lucide-react";
import { CtaBand, DurationOptions, FeatureGrid, PageHero, Section } from "@/components/sections";
import { og } from "@/lib/seo";

const description =
  "Why students choose Superbloom Academy in Hyderabad: industry-aligned curriculum, experienced trainers, hands-on practice and flexible durations.";

export const metadata = {
  title: { absolute: "Why Choose Superbloom Academy for Training in Hyderabad" },
  description,
  alternates: { canonical: "/why-superbloom" },
  openGraph: og({ description, url: "/why-superbloom" }),
};

const reasons = [
  {
    icon: Target,
    title: "Training aligned to industry",
    desc: "The curriculum follows current industry standards and job requirements, so you learn what employers need.",
  },
  {
    icon: UsersRound,
    title: "Faculty with industry experience",
    desc: "You learn from professionals who bring practical insight and current practice into the classroom.",
  },
  {
    icon: BookOpenCheck,
    title: "Theory and practice together",
    desc: "Classroom teaching is balanced with hands-on training, case studies and real-world projects.",
  },
  {
    icon: Compass,
    title: "A career-focused approach",
    desc: "Each course is tied to specific job roles, with a clear path into your chosen field.",
  },
  {
    icon: ClipboardCheck,
    title: "Thorough assessment",
    desc: "Quizzes, practical assignments, presentations and a final examination check that the skills have landed.",
  },
  {
    icon: Award,
    title: "Certificate of Completion",
    desc: "A certificate that shows the training you completed and the assessments you passed.",
  },
];

const habits = [
  {
    icon: Wrench,
    title: "Practical skills",
    desc: "Hands-on experience with the tools, documents and processes used in industry settings.",
  },
  {
    icon: Building2,
    title: "Industry exposure",
    desc: "Projects, case studies and clinical exposure that show how real problems are solved.",
  },
  {
    icon: Presentation,
    title: "Professional readiness",
    desc: "Communication, teamwork and problem-solving, practised alongside the technical work.",
  },
];

export default function WhySuperbloom() {
  return (
    <>
      <PageHero
        title="Why choose Superbloom Academy"
        lead="Six reasons students and colleges pick us for industry-oriented training."
        crumbs={[{ name: "Why Superbloom", href: "/why-superbloom" }]}
      />

      <Section tone="paper">
        <FeatureGrid items={reasons} />
      </Section>

      <Section
        tone="mist"
        title="Flexible durations"
        lead="Choose the format that fits your timetable and how deep you want to go."
      >
        <DurationOptions />
      </Section>

      <Section title="What students take into their first job">
        <FeatureGrid items={habits} />
      </Section>

      <CtaBand />
    </>
  );
}
