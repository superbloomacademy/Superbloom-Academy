import Policy from "@/components/Policy";
import { fullAddress, site, formatPhone } from "@/lib/site";
import { og } from "@/lib/seo";

const description =
  "How Superbloom Academy collects, uses and protects the personal data you share through this website, and how to exercise your rights.";

export const metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: "/privacy-policy" },
  openGraph: og({ title: "Privacy Policy", description, url: "/privacy-policy" }),
};

const sections = [
  {
    h: "Who we are",
    p: [
      `${site.name} ("we", "us") runs this website, ${site.url.replace("https://", "")}. We decide how the personal data collected here is used. Address: ${fullAddress}. Email: ${site.email}.`,
    ],
  },
  {
    h: "What we collect",
    list: [
      "Enquiry and admission forms: your name, mobile number, email, stream, qualification, college, year of study and anything you write to us.",
      "College enquiries: the college name and the name, designation, phone and email of the contact person.",
      "Workshop registrations: your name, mobile number, email, college, year, the amount paid and the UPI reference number (UTR).",
      "Job applications: your details, education and the résumé you upload.",
      "Website usage: the pages you visit, the site or ad that brought you, your device type, and a random ID stored in your browser. This ID is not linked to your name or number.",
      "Advertising details: if you arrive from an ad, the campaign name and the click ID that Google or Meta adds to the link.",
    ],
  },
  {
    h: "Why we use it",
    list: [
      "To call, message or email you about the programme, batch, fees or workshop you asked about.",
      "To confirm workshop payments and registrations.",
      "To assess job applications.",
      "To understand which pages and ads work, so we can improve the website and our advertising.",
    ],
    p: ["We use your data only with your consent, given when you submit a form, or where the law allows. We do not sell your personal data."],
  },
  {
    h: "Cookies and advertising tags",
    p: [
      "This website uses Google Analytics to measure visits, and may use the Google Ads tag and the Meta Pixel to measure and improve our ads. These services can set cookies and receive information about your visit, such as the pages you view and whether you sent an enquiry. They do not receive the contents of the forms you fill in.",
      "You can block or delete cookies in your browser settings, and manage ad personalisation in your Google and Meta account settings.",
    ],
  },
  {
    h: "Who we share it with",
    p: [
      "Only with the service providers that run this website for us, under their own data protection terms: Vercel (hosting), MongoDB Atlas (database), Cloudinary (file storage for résumés and images), Google (analytics and ads) and Meta (ads). We may also share data where the law requires it.",
    ],
  },
  {
    h: "How long we keep it",
    p: [
      "Enquiries and admission records are kept for up to 24 months after our last contact with you. Job applications are kept for up to 12 months. Workshop payment records are kept for as long as tax and accounting law requires. After that, we delete the data or remove anything that identifies you.",
    ],
  },
  {
    h: "Your rights",
    p: [
      "Under the Digital Personal Data Protection Act, 2023, you can ask us to show you the personal data we hold about you, correct or update it, erase it, or stop contacting you, and you can withdraw your consent at any time. Write to us at the email below and we will respond within a reasonable time.",
    ],
  },
  {
    h: "Grievance officer",
    p: [
      `Grievance Officer, ${site.name}. Email: ${site.email}. Phone: ${formatPhone(site.phones[0])}. Address: ${fullAddress}.`,
    ],
  },
  {
    h: "Changes to this policy",
    p: ["We may update this policy. The date at the top shows when it last changed."],
  },
];

export default function PrivacyPolicy() {
  return (
    <Policy
      title="Privacy Policy"
      lead="What we collect through this website, why, and the choices you have."
      updated="6 October 2026"
      sections={sections}
      href="/privacy-policy"
    />
  );
}
