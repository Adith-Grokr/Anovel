"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, EmptyState, PageTitle, StatusTimeline } from "@/components/dashboard/widgets";
import { Badge } from "@/components/site/ui";
import { formatINR, getProduct } from "@/lib/mock/data";
import { formatDate, useMyOrders } from "@/components/producer/shared";

export default function ProducerOrders() {
  const orders = useMyOrders();
  const active = orders.filter((o) => o.stage !== "Delivered");
  const done = orders.filter((o) => o.stage === "Delivered");

  const list = (items: typeof orders) => (
    <div className="space-y-3">
      {items.map((o) => {
        const product = getProduct(o.productSlug);
        const needsAction = o.stage === "Order placed" || o.stage === "In production";
        return (
          <Link key={o.id} href={`/producer/orders/${o.id}`} className="block">
            <Card className="transition hover:border-olive">
              <div className="flex items-center gap-3">
                {product && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream">
                    <Image src={product.images[0]} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-black leading-tight text-ink">{product?.name ?? o.productSlug}</p>
                  <p className="text-sm text-muted">
                    {o.quantity} {o.unit} · {o.id} · {formatDate(o.createdAt)}
                  </p>
                  <p className="mt-0.5 text-base font-black text-olive">You get {formatINR(o.producerAmount)}</p>
                </div>
                <ChevronRight className="shrink-0 text-muted" />
              </div>
              {needsAction && (
                <div className="mt-3">
                  <Badge tone="orange">Action: send a production update</Badge>
                </div>
              )}
              <div className="mt-4">
                <StatusTimeline stage={o.stage} events={o.events} />
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div>
      <PageTitle title="My orders" subtitle="Tap an order to send photos and updates." />
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" hint="When a buyer confirms, your order will show here." />
      ) : (
        <>
          <h2 className="mb-3 font-hand text-2xl text-ink">Running ({active.length})</h2>
          {active.length ? list(active) : <p className="text-sm text-muted">No running orders.</p>}
          {done.length > 0 && (
            <>
              <h2 className="mb-3 mt-8 font-hand text-2xl text-ink">Completed ({done.length})</h2>
              {list(done)}
            </>
          )}
        </>
      )}
    </div>
  );
}
