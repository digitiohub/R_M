import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retention Marketing Services",
  description: "Explore RetentionMax services across Email, WhatsApp, SMS, Web Push, segmentation, automation and retention analytics.",
};

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
