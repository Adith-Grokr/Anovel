"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { Card, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { TableWrap, td, th } from "@/components/admin/ui";
import { commission } from "@/components/admin/helpers";
import { demoActions, useDemo } from "@/lib/demo-store";
import { formatINR, getBuyer } from "@/lib/mock/data";
import type { Order, PaymentStatus } from "@/lib/types";

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "advance-received", label: "Advance received" },
  { value: "paid", label: "Paid in full" },
  { value: "settled", label: "Settled" },
];

/** Producer payout / settlement status derived from buyer payment + delivery. */
function settlement(o: Order): { payout: string; settled: string } {
  if (o.payment === "settled") return { payout: "paid", settled: "settled" };
  if (o.payment === "paid") return { payout: "due", settled: "pending" };
  if (o.payment === "advance-received") return { payout: "partial", settled: "open" };
  return { payout: "pending", settled: "open" };
}

function PaymentSelect({ order }: { order: Order }) {
  return (
    <select
      aria-label={`Payment status for ${order.id}`}
      value={order.payment}
      onChange={(e) => demoActions.updateOrder(order.id, { payment: e.target.value as PaymentStatus })}
      className="rounded-md border border-cream-2 bg-white px-2 py-1 text-xs font-bold text-ink focus:border-olive focus:outline-none"
    >
      {PAYMENT_OPTIONS.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
        </option>
      ))}
    </select>
  );
}

export default function AdminPaymentsPage() {
  const { orders } = useDemo();
  const totals = orders.reduce(
    (t, o) => ({
      billed: t.billed + o.amount,
      payout: t.payout + o.producerAmount,
      commission: t.commission + commission(o),
      settled: t.settled + (o.payment === "settled" ? commission(o) : 0),
    }),
    { billed: 0, payout: 0, commission: 0, settled: 0 },
  );

  return (
    <>
      <PageTitle title="Payments ledger" subtitle="Buyer receipts, producer payouts and ANOVEL commission per order." />

      <div className="mb-4 flex gap-2 rounded-xl bg-plum/10 p-3 text-sm text-ink">
        <Info size={16} className="mt-0.5 shrink-0 text-plum" />
        <p>
          Payments are recorded manually by the finance team for now (bank transfer / LC). Razorpay collection and automatic payouts arrive in{" "}
          <b>Phase 4</b>.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Billed to buyers", value: totals.billed },
          { label: "Producer payouts", value: totals.payout },
          { label: "ANOVEL commission", value: totals.commission },
          { label: "Commission settled", value: totals.settled },
        ].map((s) => (
          <Card key={s.label} className="!p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">{s.label}</p>
            <p className="mt-1 text-xl font-black text-ink">{formatINR(s.value)}</p>
          </Card>
        ))}
      </div>

      <div className="hidden md:block">
        <TableWrap>
          <thead>
            <tr>
              <th className={th}>Order</th>
              <th className={`${th} text-right`}>Buyer amount</th>
              <th className={th}>Buyer payment</th>
              <th className={`${th} text-right`}>Producer payout</th>
              <th className={th}>Payout</th>
              <th className={`${th} text-right`}>Commission</th>
              <th className={th}>Settlement</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const s = settlement(o);
              return (
                <tr key={o.id}>
                  <td className={td}>
                    <Link href={`/admin/orders/${o.id}`} className="font-bold text-olive">
                      {o.id}
                    </Link>
                    <p className="text-xs text-muted">{getBuyer(o.buyerId)?.company}</p>
                  </td>
                  <td className={`${td} text-right font-bold`}>{formatINR(o.amount)}</td>
                  <td className={td}>
                    <PaymentSelect order={o} />
                  </td>
                  <td className={`${td} text-right`}>{formatINR(o.producerAmount)}</td>
                  <td className={td}>
                    <StatusPill status={s.payout} />
                  </td>
                  <td className={`${td} text-right font-bold text-olive`}>{formatINR(commission(o))}</td>
                  <td className={td}>
                    <StatusPill status={s.settled} />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-cream/60 font-black">
              <td className="px-3 py-2.5">Total</td>
              <td className="px-3 py-2.5 text-right">{formatINR(totals.billed)}</td>
              <td />
              <td className="px-3 py-2.5 text-right">{formatINR(totals.payout)}</td>
              <td />
              <td className="px-3 py-2.5 text-right text-olive">{formatINR(totals.commission)}</td>
              <td />
            </tr>
          </tfoot>
        </TableWrap>
      </div>

      <ul className="space-y-3 md:hidden">
        {orders.map((o) => {
          const s = settlement(o);
          return (
            <li key={o.id} className="rounded-xl border border-cream-2 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <Link href={`/admin/orders/${o.id}`} className="font-bold text-olive">
                  {o.id}
                </Link>
                <StatusPill status={s.settled} />
              </div>
              <p className="text-xs text-muted">{getBuyer(o.buyerId)?.company}</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-muted">Buyer amount</span>
                  <b>{formatINR(o.amount)}</b>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted">Producer payout</span>
                  <span>{formatINR(o.producerAmount)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted">Commission</span>
                  <b className="text-olive">{formatINR(commission(o))}</b>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs text-muted">Buyer payment</span>
                <PaymentSelect order={o} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
