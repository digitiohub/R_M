import type { Metadata } from "next";

const title = "About Us";
const description = "Meet RetentionMax, a retention marketing agency founded by Ganesh Kamble and Vishal Singh, connecting strategy, data, creative and technology for D2C brands.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About RetentionMax", description, type: "website", url: "/about", siteName: "RetentionMax", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "About RetentionMax", description, images: ["/og.png"] },
};

export default function AboutLayout({children}:Readonly<{children:React.ReactNode}>){return children;}
