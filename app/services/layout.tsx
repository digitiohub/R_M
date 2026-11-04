import type { Metadata } from "next";

const title = "Retention Marketing Services";
const description = "Explore RetentionMax services across Email, WhatsApp, SMS, Web Push, segmentation, automation and retention analytics.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services" },
  openGraph: { title, description, type: "website", url: "/services", siteName: "RetentionMax", images: ["/og.jpg"] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.retentionmax.in/" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://www.retentionmax.in/services" },
  ],
};

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /></>;
}

