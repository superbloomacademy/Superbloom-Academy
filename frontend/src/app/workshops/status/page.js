import RegistrationStatus from "@/components/RegistrationStatus";
import { PageHero, Section } from "@/components/sections";

export const metadata = {
  title: "Check Your Workshop Registration",
  description: "Check whether your Superbloom Academy workshop registration and payment are confirmed.",
  alternates: { canonical: "/workshops/status" },
  // a personal lookup page, not something to rank
  robots: { index: false, follow: true },
};

export default function StatusPage() {
  return (
    <>
      <PageHero
        title="Check your workshop registration"
        lead="Enter your registration reference and mobile number to see whether your seat is confirmed."
        crumbs={[
          { name: "Workshops", href: "/workshops" },
          { name: "Registration status", href: "/workshops/status" },
        ]}
      />
      <Section tone="paper">
        <RegistrationStatus />
      </Section>
    </>
  );
}
