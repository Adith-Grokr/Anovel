"use client";

import Link from "next/link";
import { Card, EmptyState, PageTitle, StatusPill, StatusTimeline } from "@/components/dashboard/widgets";
import { Badge } from "@/components/site/ui";
import { fmtDate, useBuyerData } from "@/components/buyer/buyer-data";
import { Money } from "@/components/buyer/money";
import { getProducer, getProduct } from "@/lib/mock/data";

export default function BuyerOrdersPage() {
  const { orders } = useBuyerData();

  return (
    <>
      <PageTitle title="Orders" subtitle="Track every order from the village loom or farm to your door." />
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" hint="Accept a quotation to place an order." />
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/buyer/orders/${o.id}`} className="block">
                <Card className="transition hover:border-olive">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-muted">
                        {o.id} · placed {fmtDate(o.createdAt)}
                      </p>
                      <p className="font-bold text-ink">{getProduct(o.productSlug)?.name ?? o.productSlug}</p>
                      <p className="text-xs text-muted">
                        {o.quantity.toLocaleString("en-IN")} {o.unit} · {getProducer(o.producerSlug)?.name} → {o.destination}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <StatusPill status={o.payment} />
                        {o.qc?.passed && <Badge tone="olive">QC passed</Badge>}
                      </div>
                    </div>
                    <Money inr={o.amount} className="text-sm sm:text-right" block />
                  </div>
                  <StatusTimeline stage={o.stage} events={o.events} />
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
