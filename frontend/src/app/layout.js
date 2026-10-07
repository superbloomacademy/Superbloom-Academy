import "./globals.css";
import Script from "next/script";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import AnnouncementDialog from "@/components/AnnouncementDialog";
import Tracker from "@/components/Tracker";
import SiteOnly from "@/components/SiteOnly";
import { GA_ID, GADS_ID, META_PIXEL_ID } from "@/lib/ads";
import { site } from "@/lib/site";
import { organizationLd } from "@/lib/jsonld";
import { og } from "@/lib/seo";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Superbloom Academy | Industry Training in Hyderabad",
    template: "%s | Superbloom",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: og(),
  twitter: { card: "summary_large_image" },
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
        <SiteOnly>
          <Header />
        </SiteOnly>
        <main id="main">{children}</main>
        <SiteOnly>
          <Footer />
          <AnnouncementDialog />
        </SiteOnly>
        <JsonLd data={organizationLd} />
        <Tracker />
        {(GA_ID || GADS_ID) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID || GADS_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${GA_ID ? `gtag('config','${GA_ID}');` : ""}${GADS_ID ? `gtag('config','${GADS_ID}');` : ""}`}
            </Script>
          </>
        )}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
