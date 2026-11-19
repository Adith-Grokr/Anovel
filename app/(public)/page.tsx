// ANOVEL home page, laid out as a replica of the Groundy reference design.
import { SectionHeading } from "@/components/site/ui";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { ClusterCarousel, type ClusterCard } from "@/components/home/ClusterCarousel";
import { SourcingBanner } from "@/components/home/SourcingBanner";
import { CategoryBand } from "@/components/home/CategoryBand";
import { StoriesGrid } from "@/components/home/StoriesGrid";
import { ProducerCta } from "@/components/home/ProducerCta";
import { formatINR, producersByVillage, products, villages } from "@/lib/mock/data";
import type { CategorySlug } from "@/lib/types";

/** Short card label and main category of each cluster (used to pick a representative price). */
const clusterMeta: Record<string, { craft: string; category: CategorySlug }> = {
  pochampally: { craft: "Ikat", category: "handloom" },
  guntur: { craft: "Red chilli", category: "spices" },
  kondapalli: { craft: "Wooden toys", category: "handicrafts" },
  channapatna: { craft: "Lacquer toys", category: "handicrafts" },
  vasmat: { craft: "Turmeric", category: "spices" },
  purulia: { craft: "Bamboo & jute", category: "jute-eco" },
};

function buildClusterCards(): ClusterCard[] {
  return villages.flatMap((v) => {
    const villageProducers = producersByVillage(v.slug);
    const slugs = new Set(villageProducers.map((p) => p.slug));
    const meta = clusterMeta[v.slug];
    const own = products.filter((p) => slugs.has(p.producerSlug));
    const pool = meta ? own.filter((p) => p.category === meta.category) : own;
    const cheapest = (pool.length ? pool : own).reduce<(typeof products)[number] | undefined>(
      (min, p) => (!min || p.priceMin < min.priceMin ? p : min),
      undefined,
    );
    if (!cheapest) return [];
    const firstProducer = villageProducers[0];
    return [
      {
        slug: v.slug,
        name: v.name,
        craft: meta?.craft ?? v.specialty,
        image: v.image,
        href: firstProducer ? `/producers/${firstProducer.slug}` : "/villages",
        price: formatINR(cheapest.priceMin),
        unit: cheapest.unit,
      },
    ];
  });
}

export default function Home() {
  const clusterCards = buildClusterCards();

  return (
    <>
      <HeroCarousel />
      <ProcessSteps />

      <section className="bg-white px-4 py-10 sm:px-12 md:px-[60px] md:py-12">
        <SectionHeading
          title="Choose your village cluster!"
          subtitle="Verified producers, real production capacity, direct from the source"
        />
        <ClusterCarousel cards={clusterCards} />
      </section>

      <SourcingBanner />
      <CategoryBand />
      <StoriesGrid />
      <ProducerCta />
    </>
  );
}
