import Policy from "@/components/Policy";
import { site, formatPhone } from "@/lib/site";
import { og } from "@/lib/seo";

const description = "Refund, cancellation and transfer terms for Superbloom Academy workshops and training programmes.";

export const metadata = {
  title: "Refund and Cancellation Policy",
  description,
  alternates: { canonical: "/refund-policy" },
  openGraph: og({ title: "Refund and Cancellation Policy", description, url: "/refund-policy" }),
};

const sections = [
  {
    h: "Workshops",
    list: [
      "If you cancel at least 3 days before the workshop date, we refund the full fee.",
      "If you cancel less than 3 days before, or do not attend, the fee is not refunded, but you can move your seat to a later workshop once, at no extra charge, within 3 months.",
      "If we cancel or reschedule a workshop, you can choose a full refund or a seat at the new date.",
    ],
  },
  {
    h: "Training programmes",
    list: [
      "The fee, and when it is due, is confirmed to you in writing when you enrol.",
      "If you cancel before your batch starts, we refund the fee you have paid, less any registration fee that we told you was non-refundable when you enrolled.",
      "If you cancel within the first 7 days after the batch starts, we refund 50% of the course fee paid.",
      "After the first 7 days, fees are not refunded. You can instead move once to a later batch of the same programme within 6 months.",
      "If we cancel or postpone a batch, you can choose a full refund or a seat in the next batch.",
    ],
  },
  {
    h: "How to ask for a refund",
    p: [
      `Email ${site.email} or call ${formatPhone(site.phones[0])} with your name, mobile number and payment reference (UTR for UPI payments). Approved refunds are paid back to the original payment method within 7 to 10 working days.`,
    ],
  },
];

export default function RefundPolicy() {
  return (
    <Policy
      title="Refund and Cancellation Policy"
      lead="When fees can be refunded or transferred, and how to ask."
      updated="6 October 2026"
      sections={sections}
      href="/refund-policy"
    />
  );
}
