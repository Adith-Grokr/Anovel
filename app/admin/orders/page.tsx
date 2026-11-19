"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { formatNumber, isReadyToShip } from "@/components/admin/helpers";
import { useDemo } from "@/lib/demo-store";
import { formatINR, getBuyer, getProduct } from "@/lib/mock/data";
import { ORDER_STAGES, type Order, type Producer } from "@/lib/types";

export default function AdminOrdersPage() {
  const { orders, producers } = useDemo();

  return (
    <>
      <PageTitle title="Order pipeline" subtitle={`${orders.length} orders from placement to delivery.`} />

      {/* Desktop: kanban board, scrolls inside its own container */}
      <div className="hidden max-w-full overflow-x-auto pb-2 lg:block">
        <div className="flex gap-3">
          {ORDER_STAGES.map((stage) => {
            const col = orders.filter((o) => o.stage === stage);
            return (
              <div key={stage} className="w-60 shrink-0 rounded-xl bg-cream-2/50 p-2.5">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-sm font-black text-ink">{stage}</span>
                  <span className="rounded-full bg-white px-2 text-xs font-bold text-muted">{col.length}</span>
                </div>
                <div className="space-y-2">
                  {col.map((o) => (
                    <OrderCard key={o.id} order={o} producers={producers} />
                  ))}
                  {col.length === 0 && <p className="px-1 py-4 text-center text-xs text-muted">No orders</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: grouped list */}
      <div className="space-y-5 lg:hidden">
        {ORDER_STAGES.map((stage) => {
          const col = orders.filter((o) => o.stage === stage);
          if (col.length === 0) return null;
          return (
            <section key={stage}>
              <h2 className="mb-2 font-hand text-xl text-ink">
                {stage} <span className="text-sm text-muted">({col.length})</span>
              </h2>
              <div className="space-y-2">
                {col.map((o) => (
                  <OrderCard key={o.id} order={o} producers={producers} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function OrderCard({ order: o, producers }: { order: Order; producers: Producer[] }) {
  const buyer = getBuyer(o.buyerId);
  const producer = producers.find((p) => p.slug === o.producerSlug);
  return (
    <Link href={`/admin/orders/${o.id}`} className="flex items-center gap-2 rounded-lg border border-cream-2 bg-white p-3 transition hover:border-olive">
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-muted">{o.id}</span>
          <StatusPill status={o.payment} />
        </div>
        <p className="mt-1 truncate text-sm font-bold text-ink">{getProduct(o.productSlug)?.name}</p>
        <p className="truncate text-xs text-muted">
          {buyer?.flag} {buyer?.company} ← {producer?.name}
        </p>
        <p className="mt-1 text-xs text-ink">
          {formatNumber(o.quantity)} {o.unit} · <b>{formatINR(o.amount)}</b>
        </p>
        {isReadyToShip(o) && <p className="mt-1 text-[11px] font-bold text-olive">QC passed · ready to ship</p>}
        {o.stage === "Quality check" && o.qc && !o.qc.passed && <p className="mt-1 text-[11px] font-bold text-red-700">QC failed · rework</p>}
      </div>
      <ChevronRight size={16} className="shrink-0 text-muted lg:hidden" />
    </Link>
  );
}
