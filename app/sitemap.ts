import type { MetadataRoute } from "next";
import { costToOwnCars } from "@/data/costToOwnCars";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://carcalc.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/cost-to-own`,
      lastModified: new Date(),
    },
  ];

  const costToOwnPages: MetadataRoute.Sitemap = Object.keys(costToOwnCars).map(
    (slug) => ({
      url: `${baseUrl}/cost-to-own/${slug}`,
      lastModified: new Date(),
    })
  );

  return [...staticPages, ...costToOwnPages];
}