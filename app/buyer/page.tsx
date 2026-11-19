"use client";

import Link from "next/link";
import { ClipboardList, FileText, PackageCheck, Plus, ShieldCheck, Truck } from "lucide-react";
import { Card, EmptyState, PageTitle, StatCard, StatusTimeline } from "@/components/dashboard/widgets";
import { ButtonLink } from "@/components/site/ui";
import { fmtDate, sampleStore, useBuyerData } from "@/components/buyer/buyer-data";
import { Money } from "@/components/buyer/money";
import { DEMO_BUYER_ID, getBuyer, getProducer, getProduct } from "@/lib/mock/data";

export default function BuyerOverviewPage() {
  const buyer = getBuyer(DEMO_BUYER_ID);
  const { requirements, quotations, orders } = useBuyerData();
  const samples = sampleStore.use();

  const openReqs = requirements.filter((r) => r.status !== "closed");
  const newQuotes = quotations.filter((q) => q.status === "sent");
  const active = orders.filter((o) => o.stage !== "Delivered");
  const delivered = orders.filter((o) => o.stage === "Delivered");
  const samplesToReview = samples.filter((s) => s.stage === "Received");

  const reqTitle = (id: string) => requirements.find((r) => r.id === id)?.title ?? id;

  return (
    <>
      <PageTitle
        title={`Welcome back, ${buyer?.contactName.split(" ")[0] ?? "there"}`}
        subtitle={`${buyer?.company ?? ""} · ${buyer?.country ?? ""} — sourcing direct from verified Indian villages.`}
        action={
          <ButtonLink href="/post-requirement" variant="orange">
            <Plus size={16} /> Post a new requirement
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Open requirements" value={openReqs.length} icon={ClipboardList} />
        <StatCard label="Quotations for you" value={newQuotes.length} target="Awaiting your review" icon={FileText} tone="orange" />
        <StatCard label="Active orders" value={active.length} icon={Truck} tone="plum" />
        <StatCard label="Delivered" value={delivered.length} icon={PackageCheck} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2">
          <h2 className="mb-3 font-hand text-2xl text-ink">Needs your attention</h2>
          {newQuotes.length === 0 && samplesToReview.length === 0 ? (
            <EmptyState title="All caught up" hint="New quotations from ANOVEL will appear here." />
          ) : (
            <ul className="space-y-3">
              {newQuotes.map((q) => (
                <li key={q.id}>
                  <Link href="/buyer/quotations" className="block rounded-xl border border-orange/40 bg-orange/5 p-4 hover:border-orange">
                    <p className="text-xs font-bold uppercase tracking-wide text-orange">New quotation · {q.id}</p>
                    <p className="mt-1 font-bold text-ink">{reqTitle(q.requirementId)}</p>
                    <p className="text-sm text-muted">{getProducer(q.producerSlug)?.name}</p>
                    <div className="mt-2 flex flex-wrap items-end justify-between gap-2 text-sm">
                      <Money inr={q.buyerPrice} suffix={` / unit`} />
                      <span className="text-xs text-muted">Valid until {fmtDate(q.validUntil)}</span>
                    </div>
                  </Link>
                </li>
              ))}
              {samplesToReview.map((s) => (
                <li key={s.id}>
                  <Link href="/buyer/samples" className="block rounded-xl border border-sage bg-sage/30 p-4 hover:border-olive">
                    <p className="text-xs font-bold uppercase tracking-wide text-olive">Sample received · {s.id}</p>
                    <p className="mt-1 font-bold text-ink">{getProduct(s.productSlug)?.name}</p>
                    <p className="text-sm text-muted">Approve the sample or share feedback with ANOVEL.</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Card className="mt-4 flex gap-3 bg-sage/20">
            <ShieldCheck className="shrink-0 text-olive" />
            <div className="text-sm">
              <p className="font-bold text-ink">Every order is protected by ANOVEL</p>
              <p className="mt-1 text-muted">
                Producers are KYC-verified, every batch is quality-checked by our inspectors before dispatch, and you can
                track each stage here.
              </p>
            </div>
          </Card>
        </section>

        <section className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-hand text-2xl text-ink">Active orders</h2>
            <Link href="/buyer/orders" className="text-sm font-bold text-olive">
              All orders →
            </Link>
          </div>
          {active.length === 0 ? (
            <EmptyState title="No active orders" hint="Accept a quotation to place your first order." />
          ) : (
            <div className="space-y-3">
              {active.map((o) => (
                <Link key={o.id} href={`/buyer/orders/${o.id}`} className="block">
                  <Card className="hover:border-olive">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-muted">{o.id}</p>
                        <p className="font-bold text-ink">{getProduct(o.productSlug)?.name ?? o.productSlug}</p>
                        <p className="text-xs text-muted">
                          {o.quantity.toLocaleString("en-IN")} {o.unit} · {getProducer(o.producerSlug)?.name}
                        </p>
                      </div>
                      <Money inr={o.amount} className="text-sm" block />
                    </div>
                    <StatusTimeline stage={o.stage} events={o.events} />
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
