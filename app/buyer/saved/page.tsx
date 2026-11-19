"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartOff } from "lucide-react";
import { EmptyState, PageTitle } from "@/components/dashboard/widgets";
import { Badge, ButtonLink } from "@/components/site/ui";
import { savedStore } from "@/components/buyer/buyer-data";
import { FxNote, convert, currencyStore } from "@/components/buyer/money";
import { ProducerLine } from "@/components/buyer/ui";
import { formatINR, getProduct } from "@/lib/mock/data";
import type { Product } from "@/lib/types";
import { useDemo } from "@/lib/demo-store";

export default function BuyerSavedPage() {
  const saved = savedStore.use();
  const { producers } = useDemo();
  const currency = currencyStore.use();
  const items = saved.map((slug) => getProduct(slug)).filter((p): p is Product => Boolean(p));

  return (
    <>
      <PageTitle title="Saved producers" subtitle="Products and village groups you've bookmarked while browsing." />

      {items.length === 0 ? (
        <EmptyState title="Nothing saved yet" hint="Tap the heart on any product to save it here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p.slug} className="flex flex-col overflow-hidden rounded-xl border border-cream-2 bg-white">
              <div className="relative h-40 w-full">
                <Image src={p.images[0]} alt={p.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                <button
                  onClick={() => savedStore.set((prev) => prev.filter((s) => s !== p.slug))}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-orange shadow hover:bg-white"
                  aria-label={`Remove ${p.name} from saved`}
                >
                  <HeartOff size={16} />
                </button>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <Link href={`/products/${p.slug}`} className="font-bold text-ink hover:text-olive">
                  {p.name}
                </Link>
                <div className="mt-2">
                  <ProducerLine producer={producers.find((x) => x.slug === p.producerSlug)} />
                </div>
                <div className="mt-3 text-sm">
                  <p className="font-bold text-ink">
                    {formatINR(p.priceMin)} – {formatINR(p.priceMax)}
                    <span className="font-normal text-muted"> / {p.unit}</span>
                  </p>
                  <p className="text-xs text-muted">
                    ≈ {convert(p.priceMin, currency)} – {convert(p.priceMax, currency)}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge tone="muted">
                    MOQ {p.moq} {p.unit}
                  </Badge>
                  <Badge tone="muted">{p.leadTimeDays} days lead</Badge>
                  {p.exportReady && <Badge tone="sage">Export ready</Badge>}
                </div>
                <ButtonLink href={`/post-requirement?product=${p.slug}`} variant="orange" size="sm" className="mt-4 self-start">
                  Request quote
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6">
        <FxNote />
      </div>
    </>
  );
}
