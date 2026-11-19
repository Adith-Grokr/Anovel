"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Card, StatusPill } from "@/components/dashboard/widgets";
import { Button } from "@/components/site/ui";
import { SectionTitle } from "@/components/admin/ui";
import { daysUntil, formatNumber } from "@/components/admin/helpers";
import { demoActions } from "@/lib/demo-store";
import { formatINR, getVillage, products } from "@/lib/mock/data";
import type { Producer, Product, Requirement } from "@/lib/types";

type Fit = "good" | "warn" | "bad";

function FitChip({ fit, children }: { fit: Fit; children: React.ReactNode }) {
  const cls = { good: "bg-sage text-olive-dark", warn: "bg-orange/15 text-orange", bad: "bg-red-100 text-red-700" }[fit];
  const Icon = fit === "bad" ? X : Check;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${cls}`}>
      <Icon size={11} strokeWidth={3} />
      {children}
    </span>
  );
}

/** Best product of a producer for this requirement (same category, highest capacity). */
export function matchingProducts(req: Requirement, slug: string): Product[] {
  const own = products.filter((p) => p.producerSlug === slug);
  const inCat = own.filter((p) => p.category === req.category);
  return (inCat.length ? inCat : own).sort((a, b) => b.monthlyCapacity - a.monthlyCapacity);
}

function fitFor(req: Requirement, producer: Producer, product: Product | undefined) {
  const daysLeft = daysUntil(req.neededBy);
  const monthsLeft = Math.max(daysLeft / 30, 0.5);
  const verified: Fit = producer.verification === "verified" ? "good" : producer.verification === "pending" ? "warn" : "bad";
  if (!product) return { verified, capacity: "bad" as Fit, price: "bad" as Fit, lead: "bad" as Fit, daysLeft };
  const canMake = product.monthlyCapacity * monthsLeft + product.stock;
  const capacity: Fit = canMake >= req.quantity ? "good" : canMake >= req.quantity * 0.6 ? "warn" : "bad";
  const price: Fit = !req.targetPrice
    ? "good"
    : product.priceMin * 1.1 <= req.targetPrice
      ? "good"
      : product.priceMin <= req.targetPrice
        ? "warn"
        : "bad";
  const lead: Fit = product.leadTimeDays <= daysLeft ? "good" : "bad";
  return { verified, capacity, price, lead, daysLeft };
}

export function MatchingPanel({ req, producers }: { req: Requirement; producers: Producer[] }) {
  const [draft, setDraft] = useState<string[] | null>(null);
  const [saved, setSaved] = useState(false);
  const selected = draft ?? req.matchedProducerSlugs;
  const candidates = producers
    .filter((p) => p.categories.includes(req.category) && p.verification !== "rejected")
    .sort((a, b) => Number(b.verification === "verified") - Number(a.verification === "verified"));

  const toggle = (slug: string) => {
    setSaved(false);
    setDraft(selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug]);
  };

  const dirty = draft !== null && [...draft].sort().join() !== [...req.matchedProducerSlugs].sort().join();

  return (
    <section className="mb-8">
      <SectionTitle>1 · Match producers</SectionTitle>
      {candidates.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">No producers in this category yet. Onboard a cluster first.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {candidates.map((p) => {
            const product = matchingProducts(req, p.slug)[0];
            const fit = fitFor(req, p, product);
            const checked = selected.includes(p.slug);
            const village = getVillage(p.villageSlug);
            return (
              <label
                key={p.slug}
                className={`flex cursor-pointer gap-3 rounded-xl border-2 bg-white p-4 transition ${
                  checked ? "border-olive" : "border-cream-2 hover:border-sage"
                }`}
              >
                <input type="checkbox" checked={checked} onChange={() => toggle(p.slug)} className="mt-1 h-5 w-5 shrink-0 accent-olive" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-ink">{p.name}</span>
                    <StatusPill status={p.verification} />
                  </div>
                  <p className="text-xs text-muted">
                    {p.type} · {village?.name}, {village?.state} · ★ {p.rating}
                  </p>
                  {product ? (
                    <p className="mt-1.5 text-sm text-ink">
                      {product.name} · {formatINR(product.priceMin)}–{formatINR(product.priceMax)}/{product.unit} ·{" "}
                      {formatNumber(product.monthlyCapacity)} {product.unit}/month · {product.leadTimeDays} days lead
                    </p>
                  ) : (
                    <p className="mt-1.5 text-sm text-muted">No listed product yet.</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <FitChip fit={fit.verified}>{p.verification === "verified" ? "Verified" : "Not verified"}</FitChip>
                    <FitChip fit={fit.capacity}>Capacity for {formatNumber(req.quantity)}</FitChip>
                    <FitChip fit={fit.price}>{req.targetPrice ? `Price vs ${formatINR(req.targetPrice)}` : "No target price"}</FitChip>
                    <FitChip fit={fit.lead}>Lead time vs {Math.max(fit.daysLeft, 0)} days left</FitChip>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          disabled={!dirty}
          onClick={() => {
            demoActions.matchProducers(req.id, selected);
            setDraft(null);
            setSaved(true);
          }}
        >
          Save matches ({selected.length})
        </Button>
        {saved && <span className="text-sm font-bold text-olive">Matches saved. Build quotations below.</span>}
      </div>
    </section>
  );
}
