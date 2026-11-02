import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.retentionmax.in"),
  title: { default: "Retention Marketing Agency for D2C Brands | RetentionMax", template: "%s | RetentionMax" },
  description: "RetentionMax is a retention marketing agency for D2C brands. Lifecycle journeys across Email, WhatsApp, SMS and Web Push that grow repeat purchases and CLTV.",
  alternates: { canonical: "/" },
  openGraph: { title: "RetentionMax — Turn First-Time Buyers Into Lifelong Customers", description: "A retention marketing agency helping D2C brands grow repeat purchases and customer lifetime value.", type: "website", url: "/", siteName: "RetentionMax", locale: "en_IN", images: [{ url: "/og.png", width: 1760, height: 917, alt: "RetentionMax retention growth engine" }] },
  twitter: { card: "summary_large_image", title: "Retention Marketing Agency for D2C Brands | RetentionMax", description: "Turn first-time buyers into lifelong customers.", images: ["/og.png"] },
  robots: { index: true, follow: true },
  icons: { icon: [{ url: "/favicon.ico", sizes: "32x32" }, { url: "/icon-192.png", type: "image/png", sizes: "192x192" }, { url: "/icon-512.png", type: "image/png", sizes: "512x512" }], apple: "/apple-touch-icon.png" },
};

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
      image: `${site}/og.png`,
      description: "Retention marketing agency for D2C brands: lifecycle automation, CLTV and cohort analytics, WhatsApp, email, SMS and web push.",
      areaServed: "Worldwide",
      founder: [
        { "@type": "Person", name: "Ganesh Kamble", jobTitle: "Co-founder", url: "https://thecltvguy.retentionmax.in" },
        { "@type": "Person", name: "Vishal Singh", jobTitle: "Co-founder" },
      ],
      knowsAbout: ["Customer Retention", "Retention Marketing", "Customer Lifetime Value", "RFM Segmentation", "Cohort Analysis", "Marketing Automation", "Email Marketing", "WhatsApp Marketing", "SMS Marketing"],
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Retention marketing services", itemListElement: offered.map(name => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })) },
    },
    { "@type": "WebSite", "@id": `${site}/#website`, url: site, name: "RetentionMax", publisher: { "@id": `${site}/#org` } },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></body></html>;
}
