import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { cars } from "@/data/cars";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/frota", "/reserva", "/contato"].map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const }));
  const fleet = cars.map((c) => ({ url: `${site.url}/frota/${c.id}`, changeFrequency: "monthly" as const }));
  return [...pages, ...fleet];
}
