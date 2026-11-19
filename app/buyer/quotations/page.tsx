"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Check, FlaskConical, Landmark, ShieldCheck, X } from "lucide-react";
import { Card, EmptyState, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { Badge, Button, ButtonLink } from "@/components/site/ui";
import {
  declineQuotation,
  fmtDate,
  readDemoState,
  requestSample,
  sampleStore,
  useBuyerData,
} from "@/components/buyer/buyer-data";
import { FxNote, Money } from "@/components/buyer/money";
import { Modal, ProducerLine, Toast } from "@/components/buyer/ui";
import { demoActions } from "@/lib/demo-store";
import { DEMO_BUYER_ID, getProduct } from "@/lib/mock/data";
import type { Producer, Quotation, Requirement } from "@/lib/types";

interface Row {
  q: Quotation;
  producer?: Producer;
  sampleRequested: boolean;
}

function Actions({
  row,
  onSample,
  onAccept,
  onDecline,
  compact = false,
}: {
  row: Row;
  onSample: (q: Quotation) => void;
  onAccept: (q: Quotation) => void;
  onDecline: (q: Quotation) => void;
  compact?: boolean;
}) {
  const { q } = row;
  if (q.status !== "sent") return <StatusPill status={q.status} />;
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "justify-end"}`}>
      {q.sampleAvailable && (
        <Button size="sm" variant="outline" onClick={() => onSample(q)} disabled={row.sampleRequested}>
          <FlaskConical size={14} /> {row.sampleRequested ? "Sample requested" : "Request sample"}
        </Button>
      )}
      <Button size="sm" variant="orange" onClick={() => onAccept(q)}>
        <Check size={14} /> Accept &amp; place order
      </Button>
      <Button size="sm" variant="ghost" onClick={() => onDecline(q)}>
        <X size={14} /> Decline
      </Button>
    </div>
  );
}

function CompareGroup({
  req,
  rows,
  onSample,
  onAccept,
  onDecline,
}: {
  req: Requirement;
  rows: Row[];
  onSample: (q: Quotation) => void;
  onAccept: (q: Quotation) => void;
  onDecline: (q: Quotation) => void;
}) {
  const live = rows.filter((r) => r.q.status === "sent");
  const best = live.length > 1 ? Math.min(...live.map((r) => r.q.buyerPrice)) : undefined;
  const fastest = live.length > 1 ? Math.min(...live.map((r) => r.q.leadTimeDays)) : undefined;
  const handlers = { onSample, onAccept, onDecline };

  return (
    <section className="mb-8">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-muted">{req.id}</p>
          <h2 className="font-hand text-2xl leading-tight text-ink">{req.title}</h2>
          <p className="text-xs text-muted">
            {req.quantity.toLocaleString("en-IN")} {req.unit} → {req.destination}
            {req.targetPrice ? ` · your target ₹${req.targetPrice.toLocaleString("en-IN")} / ${req.unit}` : ""}
          </p>
        </div>
        <StatusPill status={req.status} />
      </div>

      {/* Desktop: comparison table */}
      <div className="hidden overflow-x-auto rounded-xl border border-cream-2 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream/60 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Producer</th>
              <th className="px-4 py-3">Unit price</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Lead time</th>
              <th className="px-4 py-3">Sample</th>
              <th className="px-4 py-3">Valid until</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const { q } = row;
              return (
                <tr key={q.id} className={`border-t border-cream-2 align-top ${q.status === "rejected" ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3">
                    <ProducerLine producer={row.producer} />
                    <p className="mt-1 text-xs text-muted">{getProduct(q.productSlug)?.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Money inr={q.buyerPrice} block />
                    {best === q.buyerPrice && <Badge tone="olive">Best price</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <Money inr={q.buyerPrice * q.quantity} block />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-ink">{q.leadTimeDays} days</span>
                    {fastest === q.leadTimeDays && (
                      <span className="mt-1 block">
                        <Badge tone="plum">Fastest</Badge>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{q.sampleAvailable ? <Badge tone="sage">Available</Badge> : <span className="text-muted">—</span>}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{fmtDate(q.validUntil)}</td>
                  <td className="px-4 py-3">
                    <Actions row={row} {...handlers} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {rows.map((row) => {
          const { q } = row;
          return (
            <Card key={q.id} className={q.status === "rejected" ? "opacity-60" : ""}>
              <ProducerLine producer={row.producer} />
              <p className="mt-1 text-xs text-muted">{getProduct(q.productSlug)?.name}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {best === q.buyerPrice && <Badge tone="olive">Best price</Badge>}
                {fastest === q.leadTimeDays && <Badge tone="plum">Fastest</Badge>}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted">Unit price</dt>
                  <dd>
                    <Money inr={q.buyerPrice} block />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Total</dt>
                  <dd>
                    <Money inr={q.buyerPrice * q.quantity} block />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Lead time</dt>
                  <dd className="font-bold text-ink">{q.leadTimeDays} days</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Sample</dt>
                  <dd className="font-bold text-ink">{q.sampleAvailable ? "Available" : "—"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-muted">Valid until</dt>
                  <dd className="font-bold text-ink">{fmtDate(q.validUntil)}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <Actions row={row} {...handlers} compact />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default function BuyerQuotationsPage() {
  const router = useRouter();
  const { requirements, quotations, producers } = useBuyerData();
  const samples = sampleStore.use();
  const [accepting, setAccepting] = useState<Quotation | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);
  const closeModal = useCallback(() => setAccepting(null), []);

  const groups = requirements
    .map((req) => ({
      req,
      rows: quotations
        .filter((q) => q.requirementId === req.id)
        .map<Row>((q) => ({
          q,
          producer: producers.find((p) => p.slug === q.producerSlug),
          sampleRequested: samples.some((s) => s.quotationId === q.id),
        })),
    }))
    .filter((g) => g.rows.length > 0);

  const onSample = (q: Quotation) => {
    requestSample({
      quotationId: q.id,
      productSlug: q.productSlug,
      producerSlug: q.producerSlug,
      qty: "Standard sample set",
    });
    setToast("Sample requested — ANOVEL will confirm courier details.");
  };

  const onDecline = (q: Quotation) => {
    declineQuotation(q.id);
    setToast(`Quotation ${q.id} declined.`);
  };

  const confirmAccept = () => {
    if (!accepting) return;
    const req = requirements.find((r) => r.id === accepting.requirementId);
    if (!req) return;
    const before = new Set(readDemoState().orders.map((o) => o.id));
    demoActions.acceptQuotation(accepting.id, DEMO_BUYER_ID, req.destination, req.unit);
    const created = readDemoState().orders.find((o) => !before.has(o.id) && o.quotationId === accepting.id);
    setAccepting(null);
    router.push(created ? `/buyer/orders/${created.id}` : "/buyer/orders");
  };

  const acceptReq = accepting ? requirements.find((r) => r.id === accepting.requirementId) : undefined;
  const acceptTotal = accepting ? accepting.buyerPrice * accepting.quantity : 0;

  return (
    <>
      <PageTitle
        title="Quotations"
        subtitle="Prices are all-inclusive ANOVEL quotes: sourcing, quality check and export paperwork."
      />

      {groups.length === 0 ? (
        <EmptyState title="No quotations yet" hint="Post a requirement and ANOVEL will send you matched quotes." />
      ) : (
        groups.map((g) => <CompareGroup key={g.req.id} req={g.req} rows={g.rows} onSample={onSample} onAccept={setAccepting} onDecline={onDecline} />)
      )}

      <FxNote />

      {accepting && acceptReq && (
        <Modal title="Confirm your order" onClose={closeModal}>
          <div className="space-y-4 text-sm">
            <div className="rounded-lg bg-cream/60 p-3">
              <p className="font-bold text-ink">{getProduct(accepting.productSlug)?.name}</p>
              <p className="text-muted">
                {accepting.quantity.toLocaleString("en-IN")} {acceptReq.unit} · delivered to {acceptReq.destination}
              </p>
              <div className="mt-2">
                <ProducerLine producer={producers.find((p) => p.slug === accepting.producerSlug)} link={false} />
              </div>
            </div>

            <dl className="space-y-1">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Unit price</dt>
                <dd className="text-right">
                  <Money inr={accepting.buyerPrice} />
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-cream-2 pt-1">
                <dt className="font-bold text-ink">Order total</dt>
                <dd className="text-right">
                  <Money inr={acceptTotal} />
                </dd>
              </div>
            </dl>

            <div>
              <h3 className="mb-2 font-bold text-ink">Payment terms</h3>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <Landmark size={16} className="mt-0.5 shrink-0 text-olive" />
                  <span>
                    <strong>30% advance</strong> (<Money inr={Math.round(acceptTotal * 0.3)} />) via bank transfer or card to
                    start production.
                  </span>
                </li>
                <li className="flex gap-2">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-olive" />
                  <span>
                    <strong>70% balance</strong> after ANOVEL&apos;s quality check passes, before dispatch. You&apos;ll get the QC
                    report first.
                  </span>
                </li>
              </ul>
              <p className="mt-3 rounded-lg border border-orange/40 bg-orange/5 p-3 text-xs text-ink">
                Payment link will be shared by ANOVEL by email after you confirm. No money is charged in this demo.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="orange" onClick={confirmAccept}>
                <Check size={16} /> Confirm &amp; place order
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast} onDone={clearToast} />}
      <div className="mt-6">
        <ButtonLink href="/post-requirement" variant="outline" size="sm">
          Need something else? Post a requirement
        </ButtonLink>
      </div>
    </>
  );
}
