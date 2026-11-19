import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, MapPin, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/catalog/PageBanner";
import { VerificationBadge } from "@/components/catalog/ProducerCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { OrderProcessStrip } from "@/components/catalog/OrderProcessStrip";
import { WHATSAPP_URL, formatNumber, qty, toCatalogItem } from "@/components/catalog/helpers";
import { CategoryIcon, ShieldCheckIcon } from "@/components/site/HandIcons";
import { ButtonLink, SectionHeading, btnClass } from "@/components/site/ui";
import { getCategory, getProducer, getVillage, producers, productsByProducer } from "@/lib/mock/data";
import type { Producer } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return producers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producer = getProducer(slug);
  if (!producer) return { title: "Producer not found | ANOVEL" };
  return {
    title: `${producer.name} | ANOVEL producers`,
    description: producer.about,
    openGraph: { images: [producer.image] },
  };
}

// Only the fact of verification is public. Document numbers never leave the admin panel.
const KYC_LABELS: { key: keyof Producer["kyc"]; label: string }[] = [
  { key: "pan", label: "PAN" },
  { key: "aadhaar", label: "Aadhaar" },
  { key: "gstin", label: "GSTIN" },
  { key: "bank", label: "Bank account" },
];

export default async function ProducerPage({ params }: Props) {
  const { slug } = await params;
  const producer = getProducer(slug);
  if (!producer) notFound();

  const village = getVillage(producer.villageSlug);
  const items = productsByProducer(producer.slug).map(toCatalogItem);
  const cats = producer.categories.map(getCategory).filter((c) => c !== undefined);
  const firstProduct = items[0]?.product.slug;
  const sourceHref = firstProduct
    ? `/post-requirement?product=${firstProduct}&producer=${producer.slug}`
    : `/post-requirement?producer=${producer.slug}`;

  const stats = [
    { label: "Members", value: formatNumber(producer.members) },
    { label: "Since", value: String(producer.since) },
    { label: "Rating", value: `★ ${producer.rating.toFixed(1)}` },
    { label: "Products", value: String(items.length) },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={village?.image ?? producer.image}
            alt=""
            fill
            priority
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/90 via-plum-dark/55 to-plum-dark/20" />
        </div>
        <div className="px-4 pb-8 pt-5 sm:px-8 sm:pt-6">
          <Breadcrumbs
            className="[&_a]:text-white/80 [&_span]:text-white [&_svg]:text-white/60"
            items={[
              { href: "/", label: "Home" },
              ...(village ? [{ href: `/villages/${village.slug}`, label: village.name }] : []),
              { label: producer.name },
            ]}
          />
          <div className="mt-20 flex flex-col gap-5 sm:mt-28 sm:flex-row sm:items-end">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-cream shadow-lg">
              <Image src={producer.image} alt={producer.name} fill sizes="112px" className="object-cover" />
            </div>
            <div className="min-w-0 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-sage">{producer.type}</p>
              <h1 className="font-hand text-4xl leading-tight sm:text-5xl">{producer.name}</h1>
              {village && (
                <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  <Link href={`/villages/${village.slug}`} className="hover:text-orange">
                    {village.name}, {village.district}, {village.state}
                  </Link>
                </p>
              )}
              <div className="mt-3 inline-flex rounded-full bg-white">
                <VerificationBadge status={producer.verification} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream px-4 py-5 sm:px-8">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <dt className="text-xs text-muted">{s.label}</dt>
              <dd className="font-hand text-3xl text-olive">{s.value}</dd>
            </div>
          ))}
          <div className="col-span-2 text-center sm:col-span-1 sm:text-left">
            <dt className="text-xs text-muted">Categories</dt>
            <dd className="mt-1 flex flex-wrap justify-center gap-2 sm:justify-start">
              {cats.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  title={c.name}
                  className="flex items-center gap-1 text-xs font-bold text-plum hover:text-orange"
                >
                  <CategoryIcon slug={c.slug} size={26} />
                  {c.short}
                </Link>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      {/* About + KYC */}
      <section className="grid gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <h2 className="font-hand text-3xl text-olive">Our story</h2>
          <p className="mt-3 leading-relaxed text-ink/90">{producer.about}</p>
          {village && (
            <p className="mt-4 leading-relaxed text-ink/80">
              <strong>{village.clusterName}.</strong> {village.story}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <ButtonLink href={sourceHref} variant="orange" size="lg">
              Source from this producer
            </ButtonLink>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={btnClass("outline", "lg")}>
              <MessageCircle className="h-5 w-5" aria-hidden />
              Ask on WhatsApp
            </a>
          </div>
        </div>

        <aside className="brush h-fit bg-sage/50 p-5" aria-labelledby="kyc-heading">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon size={44} className="shrink-0 text-olive" />
            <h2 id="kyc-heading" className="font-hand text-2xl leading-tight text-olive-dark">
              Verified by ANOVEL
            </h2>
          </div>
          <ul className="mt-4 space-y-2">
            {KYC_LABELS.map(({ key, label }) => {
              const ok = producer.kyc[key];
              return (
                <li key={key} className="flex items-center justify-between gap-3 rounded-md bg-white/70 px-3 py-2 text-sm">
                  <span className="font-bold text-ink">{label}</span>
                  {ok ? (
                    <span className="flex items-center gap-1 font-bold text-olive">
                      <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted">
                      <Clock className="h-4 w-4" aria-hidden /> Pending
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-ink/70">
            Documents are checked by the ANOVEL team on a field visit. Numbers are kept private and never shown
            to buyers.
          </p>
        </aside>
      </section>

      {/* Products */}
      <section className="px-4 pb-10 sm:px-8">
        <SectionHeading title="Products" subtitle={`What ${producer.name} makes for bulk buyers`} />
        {items.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ProductCard key={item.product.slug} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-muted">Products are being catalogued. Ask us for a quote.</p>
        )}
      </section>

      {/* Capacity table */}
      {items.length > 0 && (
        <section className="px-4 pb-10 sm:px-8">
          <h2 className="font-hand text-3xl text-olive">Production capacity</h2>
          <div className="mt-4 overflow-x-auto rounded-md border border-cream-2">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-wide text-plum">
                <tr>
                  <th scope="col" className="px-4 py-3">Product</th>
                  <th scope="col" className="px-4 py-3">Monthly capacity</th>
                  <th scope="col" className="px-4 py-3">MOQ</th>
                  <th scope="col" className="px-4 py-3">Lead time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-2">
                {items.map(({ product: p }) => (
                  <tr key={p.slug}>
                    <th scope="row" className="px-4 py-3 font-bold text-ink">
                      <Link href={`/products/${p.slug}`} className="hover:text-orange">
                        {p.name}
                      </Link>
                    </th>
                    <td className="px-4 py-3">{qty(p.monthlyCapacity, p.unit)}</td>
                    <td className="px-4 py-3">{qty(p.moq, p.unit)}</td>
                    <td className="px-4 py-3">{p.leadTimeDays} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <OrderProcessStrip />

      {/* CTA */}
      <section className="px-4 py-10 text-center sm:px-8">
        <p className="font-hand text-3xl text-ink">Ready to work with {producer.name}?</p>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          Tell us your quantity, destination and timeline. ANOVEL confirms the price with the producer and sends
          you a quotation, usually within 48 hours.
        </p>
        <ButtonLink href={sourceHref} variant="orange" size="lg" className="mt-5">
          Source from this producer
        </ButtonLink>
      </section>
    </>
  );
}
