"use client";

import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import { Card, EmptyState, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { Badge, ButtonLink } from "@/components/site/ui";
import { fmtDate, useBuyerData } from "@/components/buyer/buyer-data";
import { Money } from "@/components/buyer/money";
import { BackLink, ProducerCard, ProducerLine } from "@/components/buyer/ui";
import { getCategory } from "@/lib/mock/data";
import type { RequirementStatus } from "@/lib/types";

const STEPS: { status: RequirementStatus; label: string; hint: string }[] = [
  { status: "new", label: "Received", hint: "ANOVEL reviews your spec" },
  { status: "matching", label: "Matching producers", hint: "Shortlisting verified clusters" },
  { status: "quoted", label: "Quotations ready", hint: "Compare and choose" },
  { status: "closed", label: "Order placed", hint: "Requirement fulfilled" },
];

function MatchingStepper({ status }: { status: RequirementStatus }) {
  const current = STEPS.findIndex((s) => s.status === status);
  return (
    <ol className="space-y-0 sm:flex sm:gap-2">
      {STEPS.map((s, i) => {
        const done = i <= current;
        return (
          <li key={s.status} className="flex gap-3 pb-4 sm:flex-1 sm:flex-col sm:pb-0">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
                done ? "border-olive bg-olive text-white" : "border-cream-2 bg-white text-muted"
              } ${i === current ? "ring-4 ring-olive/20" : ""}`}
            >
              {done ? <Check size={14} strokeWidth={3} /> : i + 1}
            </span>
            <div>
              <p className={`text-sm font-bold ${done ? "text-ink" : "text-muted"}`}>{s.label}</p>
              <p className="text-xs text-muted">{s.hint}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function RequirementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { requirements, quotations, producers } = useBuyerData();
  const req = requirements.find((r) => r.id === id);

  if (!req) {
    return (
      <>
        <BackLink href="/buyer/requirements" label="All requirements" />
        <EmptyState title="Requirement not found" hint={`We couldn't find ${id} in your account.`} />
      </>
    );
  }

  const matched = producers.filter((p) => req.matchedProducerSlugs.includes(p.slug));
  const quotes = quotations.filter((q) => q.requirementId === req.id);
  const spec: [string, React.ReactNode][] = [
    ["Category", getCategory(req.category)?.name ?? req.category],
    ["Quantity", `${req.quantity.toLocaleString("en-IN")} ${req.unit}`],
    ["Target price", req.targetPrice ? <Money key="tp" inr={req.targetPrice} suffix={` / ${req.unit}`} /> : "Open to offers"],
    ["Destination", req.destination],
    ["Needed by", fmtDate(req.neededBy)],
    ["Posted on", fmtDate(req.createdAt)],
  ];

  return (
    <>
      <BackLink href="/buyer/requirements" label="All requirements" />
      <PageTitle title={req.title} subtitle={`${req.id}`} action={<StatusPill status={req.status} />} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h2 className="mb-3 font-hand text-2xl text-ink">Your spec</h2>
          <dl className="space-y-2 text-sm">
            {spec.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-cream-2 pb-2 last:border-0">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-bold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          {req.certifications.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {req.certifications.map((c) => (
                <Badge key={c} tone="plum">
                  {c}
                </Badge>
              ))}
            </div>
          )}
          {req.notes && <p className="mt-3 rounded-lg bg-cream/60 p-3 text-sm text-ink">{req.notes}</p>}
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="mb-4 font-hand text-2xl text-ink">Matching progress</h2>
            <MatchingStepper status={req.status} />
          </Card>

          <section>
            <h2 className="mb-3 font-hand text-2xl text-ink">Matched producers</h2>
            {matched.length === 0 ? (
              <EmptyState title="Matching in progress" hint="Our sourcing team usually shortlists producers within 48 hours." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {matched.map((p) => (
                  <ProducerCard key={p.slug} producer={p} category={req.category} />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-hand text-2xl text-ink">Quotations</h2>
              {quotes.length > 0 && (
                <ButtonLink href="/buyer/quotations" size="sm">
                  Compare
                </ButtonLink>
              )}
            </div>
            {quotes.length === 0 ? (
              <EmptyState title="No quotations yet" hint="You'll be notified by email and WhatsApp when ANOVEL sends one." />
            ) : (
              <ul className="space-y-2">
                {quotes.map((q) => (
                  <li key={q.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cream-2 bg-white p-4">
                    <ProducerLine producer={producers.find((p) => p.slug === q.producerSlug)} />
                    <div className="flex items-center gap-3">
                      <Money inr={q.buyerPrice} suffix={` / ${req.unit}`} className="text-sm" block />
                      <StatusPill status={q.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
