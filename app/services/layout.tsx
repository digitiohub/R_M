import type { Metadata } from "next";

const title = "Retention Marketing Services";
const description = "Explore RetentionMax services across Email, WhatsApp, SMS, Web Push, segmentation, automation and retention analytics.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services" },
  openGraph: { title, description, type: "website", url: "/services", siteName: "RetentionMax", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
