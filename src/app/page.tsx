import type { Metadata } from "next";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { Hero } from "@/components/home/hero";
import { ServiceStrip } from "@/components/home/service-strip";
import { buildMetadata, keywords } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "LUMES BD | Premium Jerseys in Bangladesh",
  description: "Shop premium football jerseys, flag fanwear, and original copy jerseys from LUMES BD with Bangladesh delivery.",
  path: "/",
  pageKeywords: keywords([
    "premium jersey Bangladesh",
    "World Cup jersey Bangladesh",
    "Argentina jersey BD",
    "Brazil jersey BD",
    "football fanwear shop",
  ]),
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceStrip />
      <CategoryShowcase />
    </>
  );
}
