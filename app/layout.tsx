import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.retentionmax.in"),
  title: { default: "RetentionMax — Customer Retention, Engineered", template: "%s | RetentionMax" },
  description: "Data-driven customer journeys across Email, WhatsApp, SMS and Web Push that turn first-time buyers into loyal customers.",
  alternates: { canonical: "/" },
  openGraph: { title: "RetentionMax — Turn First-Time Buyers Into Lifelong Customers", description: "A connected retention growth engine for ambitious brands.", type: "website", url: "/", images: [{ url: "/og.png", width: 1760, height: 917, alt: "RetentionMax retention growth engine" }] },
  twitter: { card: "summary_large_image", title: "RetentionMax — Customer Retention, Engineered", description: "Turn first-time buyers into lifelong customers.", images: ["/og.png"] },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": ["Organization","ProfessionalService"], "@id": "https://www.retentionmax.in/#org", name: "RetentionMax", url: "https://www.retentionmax.in", description: "Customer retention marketing consultancy.", areaServed: "Worldwide", knowsAbout: ["Email Marketing","WhatsApp Marketing","SMS Marketing","Customer Retention","Marketing Automation"] },
    { "@type": "Course", name: "Why Your Customers Don’t Come Back", description: "A free retention marketing masterclass.", provider: { "@id": "https://www.retentionmax.in/#org" } },
    { "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "What does a retention audit include?", acceptedAnswer: { "@type": "Answer", text: "A review of your lifecycle, data, creative, channel mix and priority retention opportunities." } }] },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.retentionmax.in/" }] }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></body></html>;
}
