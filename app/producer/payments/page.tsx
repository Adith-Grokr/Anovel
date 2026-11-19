"use client";

import Link from "next/link";
import { CircleCheck, Clock, Landmark } from "lucide-react";
import { Card, PageTitle, StatCard, StatusPill } from "@/components/dashboard/widgets";
import { formatINR, getProduct } from "@/lib/mock/data";
import type { Order, PaymentStatus } from "@/lib/types";
import { Note, addDays, formatDate, useMyOrders } from "@/components/producer/shared";

interface Settlement {
  key: string;
  orderId?: string;
  title: string;
  amount: number;
  status: PaymentStatus;
  expected: string;
}

// Payouts from orders completed before this demo's data starts.
const earlier: Settlement[] = [
  { key: "old-1", title: "Ikat Silk Dupatta · 60 pieces", amount: 118000, status: "settled", expected: "2026-08-22" },
  { key: "old-2", title: "Double Ikat Silk Saree · 15 pieces", amount: 112500, status: "settled", expected: "2026-07-10" },
];

/** Producers are paid by ANOVEL after QC. Before that the payout is pending, whatever the buyer has paid. */
function toSettlement(o: Order): Settlement {
  const afterQc = o.stage === "Shipped" || o.stage === "Delivered";
  const qcEvent = o.events.find((e) => e.stage === "Quality check");
  const status: PaymentStatus = o.payment === "settled" ? "settled" : afterQc ? "paid" : "pending";
  const lead = getProduct(o.productSlug)?.leadTimeDays ?? 30;
  const expected = qcEvent ? addDays(qcEvent.date, 3) : addDays(o.createdAt, lead + 3);
  return {
    key: o.id,
    orderId: o.id,
    title: `${getProduct(o.productSlug)?.name ?? o.productSlug} · ${o.quantity} ${o.unit}`,
    amount: o.producerAmount,
    status,
    expected,
  };
}

export default function ProducerPayments() {
  const orders = useMyOrders();
  const rows = [...orders.map(toSettlement), ...earlier];
  const isReceived = (s: Settlement) => s.status === "settled" || s.status === "paid";
  const received = rows.filter(isReceived).reduce((sum, s) => sum + s.amount, 0);
  const pending = rows.filter((s) => !isReceived(s)).reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-5">
      <PageTitle title="Payments" subtitle="Money for your orders, paid by ANOVEL." />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Received" value={formatINR(received)} icon={CircleCheck} tone="olive" />
        <StatCard label="Coming" value={formatINR(pending)} icon={Clock} tone="orange" />
      </div>

      <Card className="flex items-center gap-3">
        <span className="blob flex h-12 w-12 shrink-0 items-center justify-center bg-sage text-olive-dark">
          <Landmark size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase text-muted">Your bank account</p>
          <p className="text-lg font-black tracking-wider text-ink">XXXX 4521</p>
          <p className="text-xs text-muted">State Bank of India · Pochampally</p>
        </div>
        <Link href="/producer/profile" className="text-sm font-bold text-olive underline">
          Change
        </Link>
      </Card>

      <Note>Payouts are made by ANOVEL to your bank account after quality check.</Note>

      <div>
        <h2 className="mb-3 font-hand text-2xl text-ink">Payouts</h2>
        <div className="space-y-3">
          {rows.map((s) => {
            const body = (
              <Card className={s.orderId ? "transition hover:border-olive" : ""}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-black leading-tight text-ink">{s.title}</p>
                    <p className="text-xs text-muted">{s.orderId ?? "Earlier order"}</p>
                  </div>
                  <p className="shrink-0 text-lg font-black text-olive">{formatINR(s.amount)}</p>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <StatusPill status={s.status} />
                  <span className="text-muted">
                    {isReceived(s) ? "Paid on" : "Expected"} <b className="text-ink">{formatDate(s.expected)}</b>
                  </span>
                </div>
              </Card>
            );
            return s.orderId ? (
              <Link key={s.key} href={`/producer/orders/${s.orderId}`} className="block">
                {body}
              </Link>
            ) : (
              <div key={s.key}>{body}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
