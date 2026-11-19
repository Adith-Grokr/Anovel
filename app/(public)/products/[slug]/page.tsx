import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Factory, MessageCircle, Package, PackageCheck, ScrollText } from "lucide-react";
import { Breadcrumbs } from "@/components/catalog/PageBanner";
import { OrderProcessStrip } from "@/components/catalog/OrderProcessStrip";
import { ProducerCard } from "@/components/catalog/ProducerCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { WHATSAPP_URL, priceRange, qty, quoteHref, toCatalogItem } from "@/components/catalog/helpers";
import { CategoryIcon } from "@/components/site/HandIcons";
import { Badge, ButtonLink, SectionHeading, VerifiedBadge, btnClass } from "@/components/site/ui";
import { getCategory, getProducer, getProduct, getVillage, products } from "@/lib/mock/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found | ANOVEL" };
  return {
    title: `${product.name} | ANOVEL`,
    description: product.description,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const producer = getProducer(product.producerSlug);
  const village = producer ? getVillage(producer.villageSlug) : undefined;

  const sameCategory = products.filter((p) => p.slug !== product.slug && p.category === product.category);
  const others = products.filter((p) => p.slug !== product.slug && p.category !== product.category);
  const related = [...sameCategory, ...others].slice(0, 3).map(toCatalogItem);

  const facts = [
    { Icon: Package, label: "Minimum order (MOQ)", value: qty(product.moq, product.unit) },
    { Icon: Factory, label: "Monthly capacity", value: qty(product.monthlyCapacity, product.unit) },
    { Icon: PackageCheck, label: "Available stock", value: qty(product.stock, product.unit) },
    { Icon: CalendarClock, label: "Lead time", value: `${product.leadTimeDays} days` },
  ];

  return (
    <>
      <div className="px-4 pt-5 sm:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/products", label: "Products" },
            ...(category ? [{ href: `/products?category=${category.slug}`, label: category.short }] : []),
            { label: product.name },
          ]}
        />
      </div>

      <section className="grid gap-8 px-4 py-6 sm:px-8 lg:grid-cols-2 lg:gap-10">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="min-w-0">
          {category && (
            <Link
              href={`/products?category=${category.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-plum hover:text-orange"
            >
              <CategoryIcon slug={category.slug} size={22} />
              {category.name}
            </Link>
          )}
          <h1 className="mt-1 font-hand text-4xl leading-tight text-ink sm:text-[42px]">{product.name}</h1>

          <div className="mt-3 flex flex-wrap gap-2">
            {product.verified ? <VerifiedBadge /> : <Badge tone="muted">Verification pending</Badge>}
            {product.exportReady && <Badge tone="orange">Export ready</Badge>}
          </div>

          <div className="mt-5 brush bg-cream px-4 py-3">
            <p className="text-xs text-muted">Indicative bulk price (ex-works)</p>
            <p className="text-2xl font-bold text-olive">{priceRange(product)}</p>
            <p className="mt-0.5 text-xs text-muted">Final price confirmed in your ANOVEL quotation.</p>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            {facts.map(({ Icon, label, value }) => (
              <div key={label} className="rounded-md border border-cream-2 p-3">
                <dt className="flex items-center gap-1.5 text-xs text-muted">
                  <Icon className="h-4 w-4 shrink-0 text-olive" aria-hidden />
                  {label}
                </dt>
                <dd className="mt-1 font-bold text-ink">{value}</dd>
              </div>
            ))}
            <div className="col-span-2 rounded-md border border-cream-2 p-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted">
                <ScrollText className="h-4 w-4 shrink-0 text-olive" aria-hidden />
                Certifications
              </dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {product.certifications.length > 0 ? (
                  product.certifications.map((c) => (
                    <Badge key={c} tone="sage">
                      {c}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted">None listed yet: ask us for test reports</span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <ButtonLink href={quoteHref(product.slug)} size="lg">
              Request quotation
            </ButtonLink>
            <ButtonLink href={quoteHref(product.slug, true)} variant="outline" size="lg">
              Request sample
            </ButtonLink>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={btnClass("ghost", "lg")}>
              <MessageCircle className="h-5 w-5" aria-hidden />
              Ask on WhatsApp
            </a>
          </div>
          <p className="mt-3 text-xs text-muted">
            No cart, no card: ANOVEL sends you a written quotation and mediates the order with the producer.
          </p>
        </div>
      </section>

      <section className="grid gap-8 px-4 pb-10 sm:px-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <h2 className="font-hand text-3xl text-olive">About this product</h2>
          <p className="mt-3 leading-relaxed text-ink/90">{product.description}</p>
          {village && (
            <p className="mt-4 leading-relaxed text-ink/80">
              Made in <strong>{village.name}</strong>, {village.district} district, {village.state}.{" "}
              {village.story}
            </p>
          )}
        </div>
        {producer && <ProducerCard producer={producer} heading="Made by" />}
      </section>

      <OrderProcessStrip />

      {related.length > 0 && (
        <section className="px-4 py-10 sm:px-8">
          <SectionHeading title="You may also like" subtitle="More from India's villages" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.product.slug} item={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
