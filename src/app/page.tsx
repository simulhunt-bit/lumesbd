import { CollectionSection } from "@/components/catalog/collection-section";
import { EventSection } from "@/components/home/event-section";
import { Hero } from "@/components/home/hero";
import { eventOne } from "@/content/events/event-one";
import { eventTwo } from "@/content/events/event-two";
import { getFeaturedProducts, getNewProducts, getPremiumProducts } from "@/lib/catalog";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EventSection event={eventOne} />
      <CollectionSection
        eyebrow="Featured"
        title="Featured products"
        description="Standout picks across the current LUMES jersey lineup."
        products={getFeaturedProducts().slice(0, 4)}
      />
      <EventSection event={eventTwo} />
      <CollectionSection
        eyebrow="Just Added"
        title="New products"
        description="Fresh arrivals and new edits designed for this season's supporters."
        products={getNewProducts().slice(0, 4)}
      />
      <CollectionSection
        eyebrow="Top Tier"
        title="Premium products"
        description="Collector-friendly pieces and original copy jerseys with an elevated finish."
        products={getPremiumProducts().slice(0, 4)}
      />
    </>
  );
}
