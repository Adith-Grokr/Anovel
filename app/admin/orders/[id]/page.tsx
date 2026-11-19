"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, EmptyState, PageTitle, StatusPill, StatusTimeline } from "@/components/dashboard/widgets";
import { KV, SectionTitle } from "@/components/admin/ui";
import { AdvanceOrder } from "@/components/admin/AdvanceOrder";
import { commission, findProducer, formatNumber } from "@/components/admin/helpers";
import { useDemo } from "@/lib/demo-store";
import { formatINR, getBuyer, getProduct, getVillage } from "@/lib/mock/data";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { orders, producers } = useDemo();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <>
        <BackLink />
        <EmptyState title="Order not found" hint={`No order with id ${id}.`} />
      </>
    );
  }

  const buyer = getBuyer(order.buyerId);
  const producer = findProducer(producers, order.producerSlug);
  const village = producer ? getVillage(producer.villageSlug) : undefined;
  const product = getProduct(order.productSlug);
  const cut = commission(order);

  return (
    <>
      <BackLink />
      <PageTitle title={order.id} subtitle={`${product?.name} · ${formatNumber(order.quantity)} ${order.unit}`} action={<StatusPill status={order.payment} />} />

      <Card className="mb-6">
        <StatusTimeline stage={order.stage} events={order.events} />
      </Card>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Buyer</p>
          <p className="font-black text-ink">
            {buyer?.flag} {buyer?.company}
          </p>
          <p className="text-sm text-muted">
            {buyer?.contactName} · {buyer?.country}
          </p>
          <p className="mt-2 text-sm text-ink">Ship to: {order.destination}</p>
        </Card>
        <Card>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Producer</p>
          <p className="font-black text-ink">{producer?.name}</p>
          <p className="text-sm text-muted">
            {producer?.type} · {village?.name}, {village?.state}
          </p>
          <p className="mt-2 text-sm text-ink">{producer?.phone}</p>
        </Card>
        <Card>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Amounts</p>
          <div className="space-y-1.5">
            <KV k="Buyer amount" v={formatINR(order.amount)} />
            <KV k="Producer amount" v={formatINR(order.producerAmount)} />
            <KV k="ANOVEL commission" v={<span className="text-olive">{formatINR(cut)}</span>} />
            <KV k="Margin" v={`${order.amount ? ((cut / order.amount) * 100).toFixed(1) : 0}%`} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionTitle>Next step</SectionTitle>
          <AdvanceOrder order={order} />
          {(order.carrier || order.qc) && (
            <Card className="mt-4">
              {order.carrier && (
                <div className="space-y-1.5">
                  <KV k="Carrier" v={order.carrier} />
                  <KV k="Tracking" v={<span className="break-all">{order.trackingNo}</span>} />
                </div>
              )}
              {order.qc && (
                <div className={order.carrier ? "mt-3 border-t border-cream-2 pt-3" : ""}>
                  <p className="text-sm font-bold text-ink">
                    QC {order.qc.passed ? "passed" : "failed"} · {order.qc.inspector} · {order.qc.date}
                  </p>
                  <p className="text-sm text-muted">{order.qc.notes}</p>
                </div>
              )}
            </Card>
          )}
        </div>
        <div className="min-w-0">
          <SectionTitle>Activity log</SectionTitle>
          <Card>
            <ol className="space-y-4">
              {[...order.events].reverse().map((e, i) => (
                <li key={`${e.stage}-${i}`} className="border-l-2 border-sage pl-3">
                  <p className="text-sm font-bold text-ink">{e.stage}</p>
                  <p className="text-xs text-muted">{e.date}</p>
                  <p className="text-sm text-ink">{e.note}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}

function BackLink() {
  return (
    <Link href="/admin/orders" className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-olive">
      <ArrowLeft size={14} /> Orders
    </Link>
  );
}
