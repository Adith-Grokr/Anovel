"use client";

import Link from "next/link";
import { CheckCircle2, PackageCheck, XCircle } from "lucide-react";
import { Card, EmptyState, PageTitle } from "@/components/dashboard/widgets";
import { Button, ButtonLink } from "@/components/site/ui";
import { SectionTitle } from "@/components/admin/ui";
import { QcForm } from "@/components/admin/QcForm";
import { findProducer, formatNumber, isReadyToShip } from "@/components/admin/helpers";
import { demoActions, useDemo } from "@/lib/demo-store";
import { getBuyer, getProduct } from "@/lib/mock/data";

export default function AdminQualityPage() {
  const { orders, producers } = useDemo();
  const inQc = orders.filter((o) => o.stage === "Quality check");
  const reports = orders.filter((o) => o.qc).sort((a, b) => (b.qc?.date ?? "").localeCompare(a.qc?.date ?? ""));

  return (
    <>
      <PageTitle title="Quality checks" subtitle="Every lot is inspected by ANOVEL before it leaves the village." />

      <SectionTitle>In quality check ({inQc.length})</SectionTitle>
      {inQc.length === 0 ? (
        <div className="mb-8">
          <EmptyState title="No orders awaiting QC" hint="Orders appear here when they move to the Quality check stage." />
        </div>
      ) : (
        <div className="mb-8 space-y-4">
          {inQc.map((o) => {
            const product = getProduct(o.productSlug);
            const producer = findProducer(producers, o.producerSlug);
            const buyer = getBuyer(o.buyerId);
            return (
              <Card key={o.id}>
                <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/admin/orders/${o.id}`} className="text-xs font-bold text-olive">
                      {o.id}
                    </Link>
                    <p className="font-black text-ink">{product?.name}</p>
                    <p className="text-xs text-muted">
                      {producer?.name} → {buyer?.flag} {buyer?.company} · {formatNumber(o.quantity)} {o.unit}
                    </p>
                  </div>
                </div>

                {isReadyToShip(o) ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-sage/60 p-4">
                    <p className="flex items-center gap-2 font-bold text-olive-dark">
                      <PackageCheck size={20} /> QC passed · Ready to ship
                    </p>
                    <ButtonLink href={`/admin/orders/${o.id}`} size="sm">
                      Dispatch order
                    </ButtonLink>
                  </div>
                ) : o.qc && !o.qc.passed ? (
                  <div className="rounded-lg bg-red-50 p-4">
                    <p className="flex items-center gap-2 font-bold text-red-700">
                      <XCircle size={18} /> QC failed on {o.qc.date} · rework with producer
                    </p>
                    <p className="mt-1 text-sm text-ink">{o.qc.notes}</p>
                    <Button size="sm" variant="outline" className="mt-3" onClick={() => demoActions.updateOrder(o.id, { qc: undefined })}>
                      Re-inspect
                    </Button>
                  </div>
                ) : (
                  <QcForm order={o} product={product} />
                )}
              </Card>
            );
          })}
        </div>
      )}

      <SectionTitle>QC reports ({reports.length})</SectionTitle>
      {reports.length === 0 ? (
        <EmptyState title="No reports yet" />
      ) : (
        <ul className="space-y-3">
          {reports.map((o) => (
            <li key={o.id} className="rounded-xl border border-cream-2 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-bold text-ink">
                  {o.qc?.passed ? <CheckCircle2 size={16} className="text-olive" /> : <XCircle size={16} className="text-red-600" />}
                  <Link href={`/admin/orders/${o.id}`} className="hover:text-olive">
                    {o.id}
                  </Link>{" "}
                  · {getProduct(o.productSlug)?.name}
                </span>
                <span className="text-xs text-muted">
                  {o.qc?.inspector} · {o.qc?.date}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{o.qc?.notes}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
