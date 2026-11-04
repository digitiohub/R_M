import type { Metadata, Viewport } from "next";
import "./globals.css";
import { faq } from "./content/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.retentionmax.in"),
  title: { default: "Retention Marketing Agency for D2C Brands | RetentionMax", template: "%s | RetentionMax" },
  description: "RetentionMax is a retention marketing agency for D2C brands. Lifecycle journeys across Email, WhatsApp, SMS and Web Push that grow repeat purchases and CLTV.",
  alternates: { canonical: "/" },
  openGraph: { title: "RetentionMax — Turn First-Time Buyers Into Lifelong Customers", description: "A retention marketing agency helping D2C brands grow repeat purchases and customer lifetime value.", type: "website", url: "/", siteName: "RetentionMax", locale: "en_IN", images: [{ url: "/og.jpg", width: 1734, height: 907, alt: "RetentionMax retention growth engine" }] },
  twitter: { card: "summary_large_image", title: "Retention Marketing Agency for D2C Brands | RetentionMax", description: "Turn first-time buyers into lifelong customers.", images: ["/og.jpg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  applicationName: "RetentionMax",
  category: "marketing",
  // Search Console / Bing verification tokens are issued per property, so they come from the environment.
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined, other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined },
  icons: { icon: [{ url: "/favicon.ico", sizes: "32x32" }, { url: "/icon-192.png", type: "image/png", sizes: "192x192" }, { url: "/icon-512.png", type: "image/png", sizes: "512x512" }], apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#080911" };

const site = "https://www.retentionmax.in";
const offered = ["Email Marketing", "WhatsApp Marketing", "SMS Campaigns", "Web Push", "Segmentation", "Automation", "Retention Analytics"];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${site}/#org`,
      name: "RetentionMax",
      url: site,
      logo: `${site}/icon-512.png`,
      image: `${site}/og.jpg`,
      description: "Retention marketing agency for D2C brands: lifecycle automation, CLTV and cohort analytics, WhatsApp, email, SMS and web push.",
      areaServed: "Worldwide",
      ...(process.env.NEXT_PUBLIC_RETENTIONMAX_LINKEDIN ? { sameAs: [process.env.NEXT_PUBLIC_RETENTIONMAX_LINKEDIN] } : {}),
      founder: [
        { "@type": "Person", name: "Ganesh Kamble", jobTitle: "Co-founder", url: "https://thecltvguy.retentionmax.in" },
        { "@type": "Person", name: "Vishal Singh", jobTitle: "Co-founder" },
      ],
      knowsAbout: ["Customer Retention", "Retention Marketing", "Customer Lifetime Value", "RFM Segmentation", "Cohort Analysis", "Marketing Automation", "Email Marketing", "WhatsApp Marketing", "SMS Marketing"],
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Retention marketing services", itemListElement: offered.map(name => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })) },
    },
    { "@type": "WebSite", "@id": `${site}/#website`, url: site, name: "RetentionMax", publisher: { "@id": `${site}/#org` } },
    // Only emitted once the approved FAQ (content/site.ts) has entries.
    ...(faq.length ? [{ "@type": "FAQPage", mainEntity: faq.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }] : []),
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></body></html>;
}
