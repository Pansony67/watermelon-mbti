import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { TYPES } from "@/lib/types";

// /quiz/results is a personal per-user page and is deliberately left out.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/quiz`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/types`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...TYPES.map(({ slug }) => ({ url: `${SITE_URL}/types/${slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: `${SITE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ];
}
