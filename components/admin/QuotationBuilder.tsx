"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Card } from "@/components/dashboard/widgets";
import { Button, Field, inputClass } from "@/components/site/ui";
import { addDays, formatNumber } from "@/components/admin/helpers";
import { matchingProducts } from "@/components/admin/MatchingPanel";
import { demoActions } from "@/lib/demo-store";
import { formatINR, getProduct } from "@/lib/mock/data";
import type { Producer, Requirement } from "@/lib/types";

export const buyerPriceFor = (producerPrice: number, marginPct: number) => Math.round(producerPrice * (1 + marginPct / 100));

export function QuotationBuilder({ req, producer }: { req: Requirement; producer: Producer }) {
  const options = matchingProducts(req, producer.slug);
  const first = options[0];
  const [productSlug, setProductSlug] = useState(first?.slug ?? "");
  const [producerPrice, setProducerPrice] = useState(first?.priceMin ?? 0);
  const [margin, setMargin] = useState(12);
  const [leadTime, setLeadTime] = useState(first?.leadTimeDays ?? 21);
  const [sample, setSample] = useState(true);
  const [validUntil, setValidUntil] = useState(() => addDays(14));
  const [sent, setSent] = useState(false);

  if (!first) {
    return (
      <Card>
        <p className="font-bold text-ink">{producer.name}</p>
        <p className="text-sm text-muted">This producer has no listed products, so a quotation cannot be built.</p>
      </Card>
    );
  }

  const buyerPrice = buyerPriceFor(producerPrice, margin);
  const total = buyerPrice * req.quantity;
  const anovelCut = (buyerPrice - producerPrice) * req.quantity;
  const product = getProduct(productSlug);

  const send = () => {
    demoActions.sendQuotation({
      requirementId: req.id,
      producerSlug: producer.slug,
      productSlug,
      producerPrice,
      marginPct: margin,
      buyerPrice,
      quantity: req.quantity,
      leadTimeDays: leadTime,
      sampleAvailable: sample,
      validUntil,
    });
    setSent(true);
  };

  return (
    <Card>
      <p className="font-bold text-ink">{producer.name}</p>
      <p className="mb-4 text-xs text-muted">
        Quantity {formatNumber(req.quantity)} {req.unit}
        {req.targetPrice ? ` · buyer target ${formatINR(req.targetPrice)}/${req.unit}` : ""}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product">
          <select
            className={inputClass}
            value={productSlug}
            onChange={(e) => {
              const p = getProduct(e.target.value);
              setProductSlug(e.target.value);
              if (p) {
                setProducerPrice(p.priceMin);
                setLeadTime(p.leadTimeDays);
              }
            }}
          >
            {options.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label={`Producer price (₹ per ${product?.unit ?? req.unit})`} hint={product ? `Listed ${formatINR(product.priceMin)}–${formatINR(product.priceMax)}` : undefined}>
          <input type="number" min={0} className={inputClass} value={producerPrice} onChange={(e) => setProducerPrice(Number(e.target.value) || 0)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label={`ANOVEL margin: ${margin}%`}>
            <input type="range" min={0} max={30} step={1} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full accent-orange" />
          </Field>
        </div>
        <Field label="Lead time (days)">
          <input type="number" min={1} className={inputClass} value={leadTime} onChange={(e) => setLeadTime(Number(e.target.value) || 0)} />
        </Field>
        <Field label="Valid until">
          <input type="date" className={inputClass} value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm font-bold text-ink sm:col-span-2">
          <input type="checkbox" checked={sample} onChange={(e) => setSample(e.target.checked)} className="h-4 w-4 accent-olive" />
          Sample available
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 rounded-lg bg-cream p-3 min-[400px]:grid-cols-3">
        <div>
          <p className="text-[11px] font-bold uppercase text-muted">Buyer price</p>
          <p className="text-lg font-black text-ink">{formatINR(buyerPrice)}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase text-muted">Total to buyer</p>
          <p className="text-lg font-black text-ink">{formatINR(total)}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase text-muted">ANOVEL earns</p>
          <p className="text-lg font-black text-olive">{formatINR(anovelCut)}</p>
        </div>
      </div>
      {req.targetPrice && buyerPrice > req.targetPrice && (
        <p className="mt-2 text-xs font-bold text-orange">Buyer price is above the target of {formatINR(req.targetPrice)}.</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button variant="orange" onClick={send} disabled={producerPrice <= 0}>
          <Send size={14} /> Send to buyer
        </Button>
        {sent && <span className="text-sm font-bold text-olive">Quotation sent. The buyer can see it in their dashboard.</span>}
      </div>
    </Card>
  );
}
