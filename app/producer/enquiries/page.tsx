"use client";

import { useState } from "react";
import { Calendar, Check, CircleCheck, Package, TriangleAlert, X } from "lucide-react";
import { Card, EmptyState, PageTitle } from "@/components/dashboard/widgets";
import { Badge } from "@/components/site/ui";
import { useDemo } from "@/lib/demo-store";
import { DEMO_PRODUCER_SLUG, formatINR, getBuyer, getProducer, productsByProducer } from "@/lib/mock/data";
import type { Quotation, Requirement } from "@/lib/types";
import { formatDate } from "@/components/producer/shared";

type Answer = "accepted" | "rejected";

/** Rough capacity check: compare the quantity with what this producer makes per month in the same unit. */
function capacityHint(req: Requirement): { ok: boolean; text: string } {
  const same = productsByProducer(DEMO_PRODUCER_SLUG).filter((p) => p.unit === req.unit);
  const perMonth = same.reduce((s, p) => s + p.monthlyCapacity, 0);
  const daysLeft = Math.max(0, Math.round((new Date(req.neededBy).getTime() - Date.now()) / 86_400_000));
  const monthsLeft = Math.max(daysLeft / 30, 0.25);
  if (!perMonth) {
    return { ok: false, text: `You have no product sold by ${req.unit}. Check with your group before saying yes.` };
  }
  const canMake = Math.floor(perMonth * monthsLeft);
  return canMake >= req.quantity
    ? { ok: true, text: `You can make about ${canMake} ${req.unit} before the date. Looks OK.` }
    : { ok: false, text: `You can make only about ${canMake} ${req.unit} before the date. ANOVEL may split this order.` };
}

export default function ProducerEnquiries() {
  const { requirements, quotations } = useDemo();
  const me = getProducer(DEMO_PRODUCER_SLUG);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const myQuotes = quotations.filter((q) => q.producerSlug === DEMO_PRODUCER_SLUG);
  const matched = requirements.filter(
    (r) => r.matchedProducerSlugs.includes(DEMO_PRODUCER_SLUG) || myQuotes.some((q) => q.requirementId === r.id),
  );
  // Fresh buyer needs in my craft that ANOVEL has not matched yet.
  const inMyCraft = requirements.filter(
    (r) =>
      !matched.includes(r) &&
      (r.status === "new" || r.status === "matching") &&
      (me?.categories ?? []).includes(r.category),
  );

  const renderCard = (r: Requirement, quote?: Quotation) => {
    const buyer = getBuyer(r.buyerId);
    const answer = answers[r.id] ?? (quote?.status === "accepted" ? "accepted" : undefined);
    const closed = r.status === "closed" || quote?.status === "rejected";
    const hint = capacityHint(r);
    return (
      <Card key={r.id} className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">{r.id}</p>
            <p className="text-lg font-black leading-tight text-ink">{r.title}</p>
          </div>
          <span className="text-3xl leading-none" aria-hidden>
            {buyer?.flag ?? "🌍"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-cream p-3">
            <p className="flex items-center gap-1 text-xs font-bold text-muted">
              <Package size={14} /> Quantity
            </p>
            <p className="text-lg font-black text-ink">
              {r.quantity.toLocaleString("en-IN")} <span className="text-sm">{r.unit}</span>
            </p>
          </div>
          <div className="rounded-xl bg-cream p-3">
            <p className="flex items-center gap-1 text-xs font-bold text-muted">
              <Calendar size={14} /> Needed by
            </p>
            <p className="text-lg font-black text-ink">{formatDate(r.neededBy)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge tone="plum">Buyer from {buyer?.country ?? "abroad"}</Badge>
          {r.certifications.map((c) => (
            <Badge key={c} tone="muted">
              {c}
            </Badge>
          ))}
        </div>

        {r.notes && <p className="text-sm text-muted">“{r.notes}”</p>}

        {quote && (
          <div className="rounded-xl bg-sage/50 p-3 text-sm text-olive-dark">
            ANOVEL offered your price: <b>{formatINR(quote.producerPrice)} / {r.unit}</b> · {quote.leadTimeDays} days ·{" "}
            you get <b>{formatINR(quote.producerPrice * quote.quantity)}</b>
          </div>
        )}

        <div className={`flex items-start gap-2 rounded-xl p-3 text-sm ${hint.ok ? "bg-olive/10 text-olive-dark" : "bg-orange/10 text-ink"}`}>
          {hint.ok ? <CircleCheck size={18} className="mt-0.5 shrink-0" /> : <TriangleAlert size={18} className="mt-0.5 shrink-0 text-orange" />}
          <span>{hint.text}</span>
        </div>

        {closed && !answer ? (
          <p className="rounded-xl bg-mauve/50 p-3 text-center text-sm font-bold text-ink">This enquiry is closed.</p>
        ) : answer ? (
          <div
            className={`flex items-center justify-between gap-2 rounded-xl p-3 font-bold ${
              answer === "accepted" ? "bg-olive text-white" : "bg-red-100 text-red-700"
            }`}
          >
            <span className="flex items-center gap-2">
              {answer === "accepted" ? <Check size={20} /> : <X size={20} />}
              {answer === "accepted" ? "You said YES. ANOVEL will call you." : "You said NO."}
            </span>
            <button
              type="button"
              className="rounded-full bg-white/25 px-3 py-1 text-xs underline"
              onClick={() =>
                setAnswers((a) => {
                  const next = { ...a };
                  delete next[r.id];
                  return next;
                })
              }
            >
              Change
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-center text-base font-black text-ink">Can you make this?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, [r.id]: "accepted" }))}
                className="flex min-h-16 flex-col items-center justify-center rounded-2xl bg-olive text-white active:bg-olive-dark"
              >
                <Check size={28} strokeWidth={3} />
                <span className="text-sm font-black">Yes</span>
              </button>
              <button
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, [r.id]: "rejected" }))}
                className="flex min-h-16 flex-col items-center justify-center rounded-2xl border-2 border-red-300 bg-white text-red-600 active:bg-red-50"
              >
                <X size={28} strokeWidth={3} />
                <span className="text-sm font-black">No</span>
              </button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div>
      <PageTitle title="Enquiries" subtitle="Buyers asking for products like yours. ANOVEL talks to the buyer for you." />

      <h2 className="mb-3 font-hand text-2xl text-ink">For you</h2>
      {matched.length === 0 ? (
        <EmptyState title="No enquiries yet" hint="When ANOVEL finds a buyer for you, it will show here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {matched.map((r) => renderCard(r, myQuotes.find((q) => q.requirementId === r.id)))}
        </div>
      )}

      {inMyCraft.length > 0 && (
        <>
          <h2 className="mb-1 mt-8 font-hand text-2xl text-ink">New in your craft</h2>
          <p className="mb-3 text-sm text-muted">Say yes and ANOVEL will consider you for these.</p>
          <div className="grid gap-4 md:grid-cols-2">{inMyCraft.map((r) => renderCard(r))}</div>
        </>
      )}
    </div>
  );
}
