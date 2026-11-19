"use client";

import Link from "next/link";
import { ClipboardCheck, Inbox, MessageSquareWarning, RotateCcw, UserCheck } from "lucide-react";
import { Card, PageTitle } from "@/components/dashboard/widgets";
import { Button } from "@/components/site/ui";
import { KpiCard, RowLink, SectionTitle } from "@/components/admin/ui";
import { isInternational, isReadyToShip } from "@/components/admin/helpers";
import { resetDemo, useDemo } from "@/lib/demo-store";
import { buyers, getBuyer } from "@/lib/mock/data";
import { ORDER_STAGES } from "@/lib/types";

export default function AdminOverviewPage() {
  const { requirements, orders, producers, complaints } = useDemo();

  const verified = producers.filter((p) => p.verification === "verified");
  const clusters = new Set(verified.map((p) => p.villageSlug)).size;
  const completed = orders.filter((o) => o.stage === "Delivered").length;
  const international = orders.filter((o) => isInternational(o.destination)).length;

  const newReqs = requirements.filter((r) => r.status === "new");
  const pendingProducers = producers.filter((p) => p.verification === "pending");
  const awaitingQc = orders.filter((o) => o.stage === "Quality check" && !o.qc?.passed);
  const openComplaints = complaints.filter((c) => c.status === "open");

  const work = [
    {
      icon: Inbox,
      title: "New requirements to match",
      href: "/admin/requirements",
      items: newReqs.map((r) => ({ href: `/admin/requirements/${r.id}`, label: `${r.id} · ${r.title}`, sub: getBuyer(r.buyerId)?.company })),
    },
    {
      icon: UserCheck,
      title: "Producers pending verification",
      href: "/admin/producers",
      items: pendingProducers.map((p) => ({ href: "/admin/producers", label: p.name, sub: p.type })),
    },
    {
      icon: ClipboardCheck,
      title: "Orders awaiting QC",
      href: "/admin/quality",
      items: awaitingQc.map((o) => ({ href: "/admin/quality", label: o.id, sub: o.destination })),
    },
    {
      icon: MessageSquareWarning,
      title: "Open complaints",
      href: "/admin/complaints",
      items: openComplaints.map((c) => ({ href: "/admin/complaints", label: `${c.id} · ${c.subject}`, sub: c.orderId })),
    },
  ];

  return (
    <>
      <PageTitle
        title="Operations overview"
        subtitle="Every producer, enquiry, quote, order and payment in one place."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (window.confirm("Reset all demo data to the original sample?")) resetDemo();
            }}
          >
            <RotateCcw size={14} /> Reset demo data
          </Button>
        }
      />

      <SectionTitle>6-month targets</SectionTitle>
      <div className="mb-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Verified producers" value={verified.length} target={100} targetLabel="100+" />
        <KpiCard label="Active clusters" value={clusters} target={3} targetLabel="3–5" />
        <KpiCard label="Qualified buyers" value={buyers.length} target={300} targetLabel="300+" />
        <KpiCard label="Serious enquiries" value={requirements.length} target={50} targetLabel="50+" />
        <KpiCard label="Completed orders" value={completed} target={25} targetLabel="25+" />
        <KpiCard label="International orders" value={international} target={5} targetLabel="5–10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0">
          <SectionTitle>Today&apos;s work</SectionTitle>
          <div className="space-y-3">
            {work.map((w) => {
              const Icon = w.icon;
              return (
                <Card key={w.title} className="!p-3">
                  <Link href={w.href} className="flex items-center gap-3 px-2 py-1">
                    <span className="blob flex h-9 w-9 shrink-0 items-center justify-center bg-sage text-olive-dark">
                      <Icon size={18} />
                    </span>
                    <span className="flex-1 font-bold text-ink">{w.title}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-black ${w.items.length ? "bg-orange text-white" : "bg-cream text-muted"}`}
                    >
                      {w.items.length}
                    </span>
                  </Link>
                  {w.items.length > 0 && (
                    <div className="mt-1 border-t border-cream-2 pt-1">
                      {w.items.slice(0, 4).map((it) => (
                        <RowLink key={it.label} href={it.href}>
                          <span className="block truncate font-bold text-ink">{it.label}</span>
                          {it.sub && <span className="block truncate text-xs text-muted">{it.sub}</span>}
                        </RowLink>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        <div className="min-w-0">
          <SectionTitle action={<Link href="/admin/orders" className="text-sm font-bold text-olive">Pipeline →</Link>}>
            Order pipeline
          </SectionTitle>
          <Card>
            <ul className="space-y-3">
              {ORDER_STAGES.map((stage) => {
                const inStage = orders.filter((o) => o.stage === stage);
                const ready = inStage.filter(isReadyToShip).length;
                const max = Math.max(1, orders.length);
                return (
                  <li key={stage}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-bold text-ink">{stage}</span>
                      <span className="font-black text-ink">{inStage.length}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream-2">
                      <div className="h-full rounded-full bg-plum" style={{ width: `${(inStage.length / max) * 100}%` }} />
                    </div>
                    {ready > 0 && <p className="mt-0.5 text-[11px] font-bold text-olive">{ready} ready to ship</p>}
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 border-t border-cream-2 pt-3 text-xs text-muted">
              {orders.length} orders in total · {requirements.filter((r) => r.status !== "closed").length} open requirements
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
