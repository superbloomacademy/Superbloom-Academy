import "./globals.css";
import Script from "next/script";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { organizationLd } from "@/lib/jsonld";
import { og } from "@/lib/seo";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-K231SSXR6C";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Superbloom Academy | Industry Training in Hyderabad",
    template: "%s | Superbloom",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: og(),
  twitter: { card: "summary" },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: "#0a1a4a" };

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${bricolage.variable} ${figtree.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-semibold"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={organizationLd} />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
