import type { Metadata } from "next";

const title = "About Us";
const description = "Meet RetentionMax, a retention marketing agency founded by Ganesh Kamble and Vishal Singh, connecting strategy, data, creative and technology for D2C brands.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About RetentionMax", description, type: "website", url: "/about", siteName: "RetentionMax", images: ["/og.jpg"] },
  twitter: { card: "summary_large_image", title: "About RetentionMax", description, images: ["/og.jpg"] },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.retentionmax.in/" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://www.retentionmax.in/about" },
  ],
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /></>;
}

