"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Pencil, Plus } from "lucide-react";
import { Card, PageTitle } from "@/components/dashboard/widgets";
import { Badge, ButtonLink } from "@/components/site/ui";
import { DEMO_PRODUCER_SLUG, formatINR, productsByProducer } from "@/lib/mock/data";

export default function ProducerProducts() {
  const products = productsByProducer(DEMO_PRODUCER_SLUG);
  const [stock, setStock] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((p) => [p.slug, p.stock])),
  );
  const change = (slug: string, delta: number) =>
    setStock((s) => ({ ...s, [slug]: Math.max(0, (s[slug] ?? 0) + delta) }));

  return (
    <div>
      <PageTitle
        title="My products"
        subtitle="Keep stock up to date so ANOVEL can send you more orders."
        action={
          <ButtonLink href="/producer/products/new" variant="orange" size="lg" className="w-full sm:w-auto">
            <Plus size={20} /> Add product
          </ButtonLink>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((p) => (
          <Card key={p.slug} className="!p-0 overflow-hidden">
            <div className="flex gap-3 p-3 sm:p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream sm:h-28 sm:w-28">
                <Image src={p.images[0]} alt={p.name} fill sizes="112px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-black leading-tight text-ink">{p.name}</p>
                  <Link
                    href={`/producer/products/new?edit=${p.slug}`}
                    aria-label={`Edit ${p.name}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-olive hover:bg-sage"
                  >
                    <Pencil size={18} />
                  </Link>
                </div>
                <p className="mt-1 text-base font-bold text-olive">
                  {formatINR(p.priceMin)} – {formatINR(p.priceMax)}
                  <span className="text-xs font-normal text-muted"> / {p.unit}</span>
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.verified ? <Badge tone="olive">Verified</Badge> : <Badge tone="orange">In review</Badge>}
                  <Badge tone="muted">{p.leadTimeDays} days</Badge>
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 border-t border-cream-2 text-center">
              <div className="border-r border-cream-2 p-2">
                <dt className="text-[11px] font-bold uppercase text-muted">Min. order</dt>
                <dd className="font-black text-ink">
                  {p.moq} <span className="text-xs font-normal">{p.unit}</span>
                </dd>
              </div>
              <div className="p-2">
                <dt className="text-[11px] font-bold uppercase text-muted">Per month</dt>
                <dd className="font-black text-ink">
                  {p.monthlyCapacity} <span className="text-xs font-normal">{p.unit}</span>
                </dd>
              </div>
            </dl>

            <div className="flex items-center justify-between gap-2 border-t border-cream-2 bg-cream/50 p-3">
              <span className="text-sm font-bold text-ink">In stock</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Less stock"
                  onClick={() => change(p.slug, -1)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-olive bg-white text-olive active:bg-sage"
                >
                  <Minus size={22} />
                </button>
                <span className="min-w-14 text-center text-2xl font-black text-ink" aria-live="polite">
                  {stock[p.slug]}
                </span>
                <button
                  type="button"
                  aria-label="More stock"
                  onClick={() => change(p.slug, 1)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-olive text-white active:bg-olive-dark"
                >
                  <Plus size={22} />
                </button>
              </div>
            </div>
          </Card>
        ))}

        <Link
          href="/producer/products/new"
          className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-sage bg-cream/40 p-6 text-center hover:border-olive"
        >
          <span className="blob flex h-16 w-16 items-center justify-center bg-sage text-olive-dark">
            <Plus size={30} />
          </span>
          <span className="text-lg font-black text-ink">Add product</span>
          <span className="text-xs text-muted">Take photos and set your price</span>
        </Link>
      </div>
    </div>
  );
}
