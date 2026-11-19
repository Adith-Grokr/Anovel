"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, EmptyState, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { KV, SectionTitle } from "@/components/admin/ui";
import { MatchingPanel } from "@/components/admin/MatchingPanel";
import { QuotationBuilder } from "@/components/admin/QuotationBuilder";
import { findProducer, formatNumber } from "@/components/admin/helpers";
import { useDemo } from "@/lib/demo-store";
import { formatINR, getBuyer, getCategory, getProduct } from "@/lib/mock/data";

export default function AdminRequirementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { requirements, producers, quotations } = useDemo();
  const req = requirements.find((r) => r.id === id);

  if (!req) {
    return (
      <>
        <BackLink />
        <EmptyState title="Requirement not found" hint={`No requirement with id ${id}.`} />
      </>
    );
  }

  const buyer = getBuyer(req.buyerId);
  const sent = quotations.filter((q) => q.requirementId === req.id);
  const matched = req.matchedProducerSlugs.map((s) => findProducer(producers, s)).filter((p) => p !== undefined);

  return (
    <>
      <BackLink />
      <PageTitle title={req.title} subtitle={`${req.id} · received ${req.createdAt}`} action={<StatusPill status={req.status} />} />

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Requirement</p>
          <div className="space-y-1.5">
            <KV k="Category" v={getCategory(req.category)?.name} />
            <KV k="Quantity" v={`${formatNumber(req.quantity)} ${req.unit}`} />
            <KV k="Target price" v={req.targetPrice ? `${formatINR(req.targetPrice)}/${req.unit}` : "Open"} />
            <KV k="Destination" v={req.destination} />
            <KV k="Needed by" v={req.neededBy} />
            <KV k="Certifications" v={req.certifications.length ? req.certifications.join(", ") : "None"} />
          </div>
          {req.notes && <p className="mt-3 rounded-lg bg-cream p-3 text-sm text-ink">{req.notes}</p>}
        </Card>
        <Card>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Buyer</p>
          {buyer ? (
            <div className="space-y-1.5">
              <p className="text-lg font-black text-ink">
                {buyer.flag} {buyer.company}
              </p>
              <KV k="Country" v={buyer.country} />
              <KV k="Type" v={buyer.type} />
              <KV k="Contact" v={buyer.contactName} />
              <KV k="Email" v={<span className="break-all">{buyer.email}</span>} />
            </div>
          ) : (
            <p className="text-sm text-muted">Unknown buyer</p>
          )}
        </Card>
      </div>

      <MatchingPanel req={req} producers={producers} />

      <section className="mb-8">
        <SectionTitle>2 · Build quotations</SectionTitle>
        {matched.length === 0 ? (
          <EmptyState title="No matched producers yet" hint="Select producers above and save matches to build quotations." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {matched.map((p) => (
              <QuotationBuilder key={p.slug} req={req} producer={p} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle>Quotations sent ({sent.length})</SectionTitle>
        {sent.length === 0 ? (
          <EmptyState title="No quotations sent yet" />
        ) : (
          <div className="space-y-3">
            {sent.map((q) => (
              <Card key={q.id} className="!p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-ink">
                    {q.id} · {findProducer(producers, q.producerSlug)?.name}
                  </span>
                  <StatusPill status={q.status} />
                </div>
                <p className="mt-1 text-sm text-muted">{getProduct(q.productSlug)?.name}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink">
                  <span>Producer {formatINR(q.producerPrice)}</span>
                  <span>Margin {q.marginPct}%</span>
                  <span className="font-bold">Buyer {formatINR(q.buyerPrice)}</span>
                  <span>Total {formatINR(q.buyerPrice * q.quantity)}</span>
                  <span>{q.leadTimeDays} days</span>
                  <span>Valid until {q.validUntil}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function BackLink() {
  return (
    <Link href="/admin/requirements" className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-olive">
      <ArrowLeft size={14} /> Requirements
    </Link>
  );
}
