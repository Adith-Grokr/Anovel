"use client";

import { Download } from "lucide-react";
import { Card, PageTitle } from "@/components/dashboard/widgets";
import { Button } from "@/components/site/ui";
import { BarList, KpiCard, SectionTitle } from "@/components/admin/ui";
import { commission, downloadCSV, isInternational, todayISO } from "@/components/admin/helpers";
import { useDemo } from "@/lib/demo-store";
import { buyers, categories, formatINR, getBuyer, getProduct, getVillage, products } from "@/lib/mock/data";

const monthLabel = (ym: string) =>
  new Date(`${ym}-01T00:00:00`).toLocaleString("en-IN", { month: "short", year: "2-digit" });

export default function AdminReportsPage() {
  const { producers, requirements, quotations, orders } = useDemo();

  const verified = producers.filter((p) => p.verification === "verified");
  const clusters = new Set(verified.map((p) => p.villageSlug)).size;
  const completed = orders.filter((o) => o.stage === "Delivered").length;
  const international = orders.filter((o) => isInternational(o.destination)).length;

  const months = [...new Set(orders.map((o) => o.createdAt.slice(0, 7)))].sort();
  const ordersByMonth = months.map((m) => ({ label: monthLabel(m), value: orders.filter((o) => o.createdAt.startsWith(m)).length }));
  const gmvByMonth = months.map((m) => ({
    label: monthLabel(m),
    value: orders.filter((o) => o.createdAt.startsWith(m)).reduce((s, o) => s + o.amount, 0),
  }));
  const maxGmv = Math.max(1, ...gmvByMonth.map((g) => g.value));
  const reqByCategory = categories
    .map((c) => ({ label: c.short, value: requirements.filter((r) => r.category === c.slug).length }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalCommission = orders.reduce((s, o) => s + commission(o), 0);
  const stamp = todayISO();
  const producerName = (slug: string) => producers.find((p) => p.slug === slug)?.name ?? slug;

  const exports = [
    {
      label: "Producers",
      count: producers.length,
      run: () =>
        downloadCSV(
          `anovel-producers-${stamp}.csv`,
          ["slug", "name", "type", "village", "state", "members", "since", "verification", "pan", "aadhaar", "gstin", "bank", "rating", "categories", "phone"],
          producers.map((p) => {
            const v = getVillage(p.villageSlug);
            return [p.slug, p.name, p.type, v?.name, v?.state, p.members, p.since, p.verification, p.kyc.pan, p.kyc.aadhaar, p.kyc.gstin, p.kyc.bank, p.rating, p.categories.join("|"), p.phone];
          }),
        ),
    },
    {
      label: "Products",
      count: products.length,
      run: () =>
        downloadCSV(
          `anovel-products-${stamp}.csv`,
          ["slug", "name", "category", "producer", "price_min_inr", "price_max_inr", "unit", "moq", "monthly_capacity", "stock", "lead_time_days", "verified", "export_ready", "certifications"],
          products.map((p) => [p.slug, p.name, p.category, producerName(p.producerSlug), p.priceMin, p.priceMax, p.unit, p.moq, p.monthlyCapacity, p.stock, p.leadTimeDays, p.verified, p.exportReady, p.certifications.join("|")]),
        ),
    },
    {
      label: "Requirements",
      count: requirements.length,
      run: () =>
        downloadCSV(
          `anovel-requirements-${stamp}.csv`,
          ["id", "created_at", "buyer", "country", "title", "category", "quantity", "unit", "target_price_inr", "destination", "needed_by", "status", "matched_producers", "notes"],
          requirements.map((r) => {
            const b = getBuyer(r.buyerId);
            return [r.id, r.createdAt, b?.company, b?.country, r.title, r.category, r.quantity, r.unit, r.targetPrice, r.destination, r.neededBy, r.status, r.matchedProducerSlugs.join("|"), r.notes];
          }),
        ),
    },
    {
      label: "Quotations",
      count: quotations.length,
      run: () =>
        downloadCSV(
          `anovel-quotations-${stamp}.csv`,
          ["id", "requirement_id", "producer", "product", "producer_price_inr", "margin_pct", "buyer_price_inr", "quantity", "total_inr", "lead_time_days", "sample_available", "valid_until", "status"],
          quotations.map((q) => [q.id, q.requirementId, producerName(q.producerSlug), getProduct(q.productSlug)?.name, q.producerPrice, q.marginPct, q.buyerPrice, q.quantity, q.buyerPrice * q.quantity, q.leadTimeDays, q.sampleAvailable, q.validUntil, q.status]),
        ),
    },
    {
      label: "Orders",
      count: orders.length,
      run: () =>
        downloadCSV(
          `anovel-orders-${stamp}.csv`,
          ["id", "created_at", "quotation_id", "buyer", "producer", "product", "quantity", "unit", "buyer_amount_inr", "producer_amount_inr", "commission_inr", "stage", "payment", "destination", "carrier", "tracking_no", "qc_passed", "qc_inspector"],
          orders.map((o) => [o.id, o.createdAt, o.quotationId, getBuyer(o.buyerId)?.company, producerName(o.producerSlug), getProduct(o.productSlug)?.name, o.quantity, o.unit, o.amount, o.producerAmount, commission(o), o.stage, o.payment, o.destination, o.carrier, o.trackingNo, o.qc?.passed, o.qc?.inspector]),
        ),
    },
  ];

  return (
    <>
      <PageTitle title="Reports" subtitle="Progress against the 6-month plan, plus raw data exports." />

      <SectionTitle>6-month metrics</SectionTitle>
      <div className="mb-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Verified producers" value={verified.length} target={100} targetLabel="100+" />
        <KpiCard label="Clusters" value={clusters} target={3} targetLabel="3–5" />
        <KpiCard label="Qualified buyers" value={buyers.length} target={300} targetLabel="300+" />
        <KpiCard label="Serious enquiries" value={requirements.length} target={50} targetLabel="50+" />
        <KpiCard label="Completed orders" value={completed} target={25} targetLabel="25+" />
        <KpiCard label="International orders" value={international} target={5} targetLabel="5–10" />
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <p className="mb-1 font-bold text-ink">Orders by month</p>
          <p className="mb-4 text-xs text-muted">Bar height = order count · label = order value</p>
          <div className="flex h-44 items-end gap-3">
            {ordersByMonth.map((m, i) => {
              const maxCount = Math.max(1, ...ordersByMonth.map((x) => x.value));
              return (
                <div key={m.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-sm font-black text-ink">{m.value}</span>
                  <div className="w-full max-w-14 rounded-t-md bg-plum" style={{ height: `${(m.value / maxCount) * 110}px` }} />
                  <span className="text-[11px] font-bold text-ink">{m.label}</span>
                  <span className="hidden text-[10px] text-muted min-[400px]:block" title={formatINR(gmvByMonth[i].value)}>
                    {(gmvByMonth[i].value / 100000).toFixed(1)}L
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-muted">Largest month: {formatINR(maxGmv)} billed</p>
        </Card>
        <Card className="min-w-0">
          <p className="mb-1 font-bold text-ink">Requirements by category</p>
          <p className="mb-4 text-xs text-muted">{requirements.length} buyer enquiries in total</p>
          <BarList rows={reqByCategory} />
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
        <Card className="!p-4">
          <p className="text-xs font-bold uppercase text-muted">Gross order value</p>
          <p className="text-xl font-black text-ink">{formatINR(orders.reduce((s, o) => s + o.amount, 0))}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-bold uppercase text-muted">ANOVEL commission</p>
          <p className="text-xl font-black text-olive">{formatINR(totalCommission)}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-bold uppercase text-muted">Quote → order</p>
          <p className="text-xl font-black text-ink">
            {quotations.length ? Math.round((quotations.filter((q) => q.status === "accepted").length / quotations.length) * 100) : 0}%
          </p>
        </Card>
      </div>

      <SectionTitle>Export data (CSV)</SectionTitle>
      <Card>
        <ul className="divide-y divide-cream-2">
          {exports.map((e) => (
            <li key={e.label} className="flex items-center justify-between gap-3 py-2.5">
              <span className="text-sm text-ink">
                <b>{e.label}</b> <span className="text-muted">· {e.count} rows</span>
              </span>
              <Button size="sm" variant="outline" onClick={e.run}>
                <Download size={14} /> Export CSV
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
