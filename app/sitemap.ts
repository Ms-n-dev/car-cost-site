import type { MetadataRoute } from "next";
import { costToOwnCars } from "@/data/costToOwnCars";
import { costComparisons } from "@/data/costComparisons";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://carcalc.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
    },
    {
      url: `${baseUrl}/compare`,
    },
    {
      url: `${baseUrl}/how-it-works`,
    },
    {
      url: `${baseUrl}/cost-to-own`,
    },
  ];

  const costToOwnPages: MetadataRoute.Sitemap = Object.keys(costToOwnCars).map(
    (slug) => ({
      url: `${baseUrl}/cost-to-own/${slug}`,
    })
  );
const comparisonPages: MetadataRoute.Sitemap = Object.keys(costComparisons).map(
  (slug) => ({
    url: `${baseUrl}/car-comparison/${slug}`,
  })
);
return [...staticPages, ...costToOwnPages, ...comparisonPages];
}