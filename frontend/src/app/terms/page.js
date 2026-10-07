import Policy from "@/components/Policy";
import { site } from "@/lib/site";
import { og } from "@/lib/seo";

const description = "Terms for using the Superbloom Academy website and enrolling in its programmes and workshops.";

export const metadata = {
  title: "Terms and Conditions",
  description,
  alternates: { canonical: "/terms" },
  openGraph: og({ title: "Terms and Conditions", description, url: "/terms" }),
};

const sections = [
  {
    h: "Using this website",
    p: [
      `This website is run by ${site.name}. Information about programmes, curricula, durations and workshops is given in good faith and may change. Batch dates, timings and fees are confirmed when you enrol.`,
    ],
  },
  {
    h: "Enrolment",
    list: [
      "Sending an enquiry or application does not reserve a seat. A seat is confirmed when we confirm it to you and any fee due has been paid.",
      "Please give accurate details. We may decline an application with incorrect information.",
      "Workshop registrations with a fee are confirmed after we verify the UPI payment reference.",
    ],
  },
  {
    h: "Certificates",
    p: ["A Certificate of Completion is issued to students who complete the programme and pass its assessments."],
  },
  {
    h: "Jobs and placements",
    p: [
      "Our programmes are designed to prepare you for the roles named on each programme page. We do not guarantee a job, an interview or a salary.",
    ],
  },
  {
    h: "Fees and refunds",
    p: ["Fees, refunds and transfers follow our Refund and Cancellation Policy."],
  },
  {
    h: "Content",
    p: [`The text, design and materials on this website and in our programmes belong to ${site.name} and may not be copied for commercial use without permission.`],
  },
  {
    h: "Governing law",
    p: ["These terms are governed by the laws of India, and the courts of Hyderabad, Telangana have jurisdiction."],
  },
];

export default function Terms() {
  return (
    <Policy
      title="Terms and Conditions"
      lead="The basics of using this website and enrolling with us."
      updated="6 October 2026"
      sections={sections}
      href="/terms"
    />
  );
}
