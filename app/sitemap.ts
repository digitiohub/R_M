import type { MetadataRoute } from "next";

// Fixed date: a "now" lastModified would claim every page changed on every crawl. Bump when page content changes.
const lastModified = new Date("2026-11-03");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.retentionmax.in";
  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}
