import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/catalog/PageBanner";
import { ProducerCard } from "@/components/catalog/ProducerCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { VillageCard } from "@/components/catalog/VillageCard";
import { toCatalogItem } from "@/components/catalog/helpers";
import { SeedlingIcon } from "@/components/site/HandIcons";
import { ButtonLink, SectionHeading } from "@/components/site/ui";
import { getVillage, producersByVillage, products, villages } from "@/lib/mock/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return villages.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const village = getVillage(slug);
  if (!village) return { title: "Village not found | ANOVEL" };
  return {
    title: `${village.clusterName}, ${village.state} | ANOVEL`,
    description: village.story,
    openGraph: { images: [village.image] },
  };
}

export default async function VillagePage({ params }: Props) {
  const { slug } = await params;
  const village = getVillage(slug);
  if (!village) notFound();

  const villageProducers = producersByVillage(village.slug);
  const producerSlugs = new Set(villageProducers.map((p) => p.slug));
  const items = products.filter((p) => producerSlugs.has(p.producerSlug)).map(toCatalogItem);
  const otherVillages = villages.filter((v) => v.slug !== village.slug).slice(0, 3);

  return (
    <>
      <div className="px-4 pt-5 sm:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/villages", label: "Villages" },
            { label: village.name },
          ]}
        />
      </div>

      <section className="grid gap-8 px-4 py-6 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-10">
        <div className="relative aspect-[4/3] overflow-hidden brush">
          <Image
            src={village.image}
            alt={village.clusterName}
            fill
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-plum">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {village.district} district, {village.state}
          </p>
          <h1 className="mt-1 font-hand text-4xl leading-tight text-olive sm:text-5xl">{village.clusterName}</h1>
          <p className="mt-4 leading-relaxed text-ink/90">{village.story}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="brush bg-cream p-4">
              <dt className="flex items-center gap-1.5 text-xs text-muted">
                <SeedlingIcon size={20} className="text-olive" />
                Specialty
              </dt>
              <dd className="mt-1 font-bold text-ink">{village.specialty}</dd>
            </div>
            <div className="brush bg-cream p-4">
              <dt className="flex items-center gap-1.5 text-xs text-muted">
                <Users className="h-4 w-4 text-olive" aria-hidden />
                Producer groups
              </dt>
              <dd className="mt-1 font-hand text-3xl leading-none text-olive">{village.producersCount}</dd>
            </div>
          </dl>

          <ButtonLink href="/post-requirement" variant="orange" size="lg" className="mt-6">
            Source from {village.name}
          </ButtonLink>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8">
        <SectionHeading
          title={`Producers in ${village.name}`}
          subtitle="Onboarded and visited by the ANOVEL field team"
        />
        {villageProducers.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {villageProducers.map((p) => (
              <ProducerCard key={p.slug} producer={p} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-muted">Producer profiles from this cluster are coming soon.</p>
        )}
      </section>

      {items.length > 0 && (
        <section className="bg-cream/50 px-4 py-10 sm:px-8">
          <SectionHeading title={`Made in ${village.name}`} subtitle="Request a quotation or sample from any of these" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ProductCard key={item.product.slug} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className="px-4 py-10 sm:px-8">
        <SectionHeading title="More villages" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {otherVillages.map((v) => (
            <VillageCard key={v.slug} village={v} />
          ))}
        </div>
      </section>
    </>
  );
}
