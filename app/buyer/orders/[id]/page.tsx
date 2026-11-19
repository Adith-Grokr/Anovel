"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { CircleAlert, ClipboardCheck, Download, Repeat, ShieldCheck, Star, Truck } from "lucide-react";
import { Card, EmptyState, PageTitle, StatusPill, StatusTimeline } from "@/components/dashboard/widgets";
import { Button, ButtonLink, Field, inputClass } from "@/components/site/ui";
import { fmtDate, useBuyerData } from "@/components/buyer/buyer-data";
import { Money } from "@/components/buyer/money";
import { BackLink, ProducerLine, Toast } from "@/components/buyer/ui";
import { getProduct } from "@/lib/mock/data";

function FeedbackForm({ orderId }: { orderId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="rounded-lg bg-sage/40 p-3 text-sm text-ink">
        Thank you! Your {rating}-star feedback for {orderId} has been shared with ANOVEL and the producer group.
      </p>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (rating > 0) setSent(true);
      }}
    >
      <div>
        <span className="mb-1 block text-sm font-bold text-ink">How was this order?</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              className="p-1"
            >
              <Star size={28} className={n <= rating ? "fill-orange text-orange" : "text-cream-2"} />
            </button>
          ))}
        </div>
      </div>
      <Field label="Comment" hint="Quality, packaging, communication — it helps the village group improve.">
        <textarea
          className={inputClass}
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="The fabric quality was excellent…"
        />
      </Field>
      <Button type="submit" disabled={rating === 0}>
        Send feedback
      </Button>
    </form>
  );
}

export default function BuyerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { orders, producers } = useBuyerData();
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <>
        <BackLink href="/buyer/orders" label="All orders" />
        <EmptyState title="Order not found" hint={`We couldn't find ${id} in your account.`} />
      </>
    );
  }

  const product = getProduct(order.productSlug);
  const producer = producers.find((p) => p.slug === order.producerSlug);
  const delivered = order.stage === "Delivered";
  const unitPrice = order.quantity ? Math.round(order.amount / order.quantity) : 0;
  const paymentHint: Record<string, string> = {
    pending: "30% advance due — payment link will be shared by ANOVEL.",
    "advance-received": "Advance received. Balance due after QC passes, before dispatch.",
    paid: "Fully paid. Thank you!",
    settled: "Fully paid and closed.",
  };

  return (
    <>
      <BackLink href="/buyer/orders" label="All orders" />
      <PageTitle
        title={product?.name ?? order.productSlug}
        subtitle={`${order.id} · placed ${fmtDate(order.createdAt)}`}
        action={
          <Link href={`/buyer/complaints?order=${order.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-orange">
            <CircleAlert size={16} /> Raise an issue
          </Link>
        }
      />

      <Card className="mb-6">
        <StatusTimeline stage={order.stage} events={order.events} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Product + producer */}
          <Card className="flex flex-col gap-4 sm:flex-row">
            {product?.images[0] && (
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-28">
                <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 640px) 112px, 100vw" className="object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Product</p>
                <p className="font-bold text-ink">{product?.name}</p>
                <p className="text-sm text-muted">
                  {order.quantity.toLocaleString("en-IN")} {order.unit} · <Money inr={unitPrice} suffix={` / ${order.unit}`} />
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Made by</p>
                <ProducerLine producer={producer} />
              </div>
            </div>
          </Card>

          {/* QC */}
          {order.qc ? (
            <Card className={order.qc.passed ? "border-olive/40" : "border-red-300"}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span className="blob flex h-11 w-11 shrink-0 items-center justify-center bg-sage text-olive-dark">
                    <ClipboardCheck size={20} />
                  </span>
                  <div>
                    <h2 className="font-hand text-2xl leading-none text-ink">Quality check report</h2>
                    <p className={`mt-1 text-sm font-bold ${order.qc.passed ? "text-olive" : "text-red-700"}`}>
                      {order.qc.passed ? "Passed" : "Failed — ANOVEL will contact you"}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setToast("QC report PDF download is a demo — available in Phase 2.")}>
                  <Download size={14} /> Download QC report
                </Button>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted">Inspector</dt>
                  <dd className="font-bold text-ink">{order.qc.inspector} (ANOVEL)</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Inspected on</dt>
                  <dd className="font-bold text-ink">{fmtDate(order.qc.date)}</dd>
                </div>
              </dl>
              <p className="mt-3 rounded-lg bg-cream/60 p-3 text-sm text-ink">{order.qc.notes}</p>
            </Card>
          ) : (
            <Card className="flex gap-3 bg-sage/20">
              <ShieldCheck className="shrink-0 text-olive" />
              <p className="text-sm text-ink">
                An ANOVEL inspector will check this batch before dispatch. The QC report (photos, measurements, notes) will
                appear here and you approve it before the balance is due.
              </p>
            </Card>
          )}

          {/* Event log */}
          <Card>
            <h2 className="mb-3 font-hand text-2xl text-ink">Activity</h2>
            <ol className="relative space-y-4 border-l-2 border-cream-2 pl-5">
              {[...order.events].reverse().map((e, i) => (
                <li key={`${e.stage}-${i}`} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-olive" />
                  <p className="text-sm font-bold text-ink">{e.stage}</p>
                  <p className="text-sm text-ink">{e.note}</p>
                  <p className="text-xs text-muted">{fmtDate(e.date)}</p>
                </li>
              ))}
            </ol>
          </Card>

          {delivered && (
            <Card>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-hand text-2xl text-ink">Rate this order</h2>
                <ButtonLink href={`/post-requirement?product=${order.productSlug}`} variant="orange" size="sm">
                  <Repeat size={14} /> Reorder
                </ButtonLink>
              </div>
              <FeedbackForm orderId={order.id} />
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Order amount</p>
            <Money inr={order.amount} className="text-xl" block />
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-muted">Payment:</span>
              <StatusPill status={order.payment} />
            </div>
            <p className="mt-2 text-xs text-muted">{paymentHint[order.payment]}</p>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2">
              <Truck size={18} className="text-olive" />
              <h2 className="font-hand text-2xl leading-none text-ink">Shipment</h2>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Destination</dt>
                <dd className="text-right font-bold text-ink">{order.destination}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Carrier</dt>
                <dd className="text-right font-bold text-ink">{order.carrier ?? "Assigned at dispatch"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Tracking no.</dt>
                <dd className="break-all text-right font-mono text-xs font-bold text-ink">{order.trackingNo ?? "—"}</dd>
              </div>
            </dl>
            {order.trackingNo && (
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setToast("Live carrier tracking is a demo.")}>
                Track with {order.carrier}
              </Button>
            )}
          </Card>

          <Card className="text-sm">
            <p className="font-bold text-ink">Questions about this order?</p>
            <p className="mt-1 text-muted">Your ANOVEL account manager replies within 24 hours on email or WhatsApp.</p>
            <Link href={`/buyer/complaints?order=${order.id}`} className="mt-2 inline-block font-bold text-orange">
              Raise an issue →
            </Link>
          </Card>
        </div>
      </div>

      {toast && <Toast message={toast} onDone={clearToast} />}
    </>
  );
}
