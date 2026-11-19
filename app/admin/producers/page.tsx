"use client";

import { useState } from "react";
import { CheckCircle2, Circle, MapPin, Phone, Users } from "lucide-react";
import { Card, EmptyState, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { Button } from "@/components/site/ui";
import { FilterTabs } from "@/components/admin/ui";
import { demoActions, useDemo } from "@/lib/demo-store";
import { getCategory, getVillage, products } from "@/lib/mock/data";
import type { Producer, VerificationStatus } from "@/lib/types";

const KYC: { key: keyof Producer["kyc"]; label: string }[] = [
  { key: "pan", label: "PAN" },
  { key: "aadhaar", label: "Aadhaar" },
  { key: "gstin", label: "GSTIN" },
  { key: "bank", label: "Bank account" },
];

export default function AdminProducersPage() {
  const { producers } = useDemo();
  const [tab, setTab] = useState<VerificationStatus>("pending");
  const list = producers.filter((p) => p.verification === tab);
  const count = (s: VerificationStatus) => producers.filter((p) => p.verification === s).length;

  return (
    <>
      <PageTitle title="Producer verification" subtitle="Check KYC and field-visit details before a producer can be matched." />
      <FilterTabs<VerificationStatus>
        value={tab}
        onChange={setTab}
        options={[
          { value: "pending", label: "Pending", count: count("pending") },
          { value: "verified", label: "Verified", count: count("verified") },
          { value: "rejected", label: "Rejected", count: count("rejected") },
        ]}
      />

      {list.length === 0 ? (
        <EmptyState title={`No ${tab} producers`} hint={tab === "pending" ? "The verification queue is clear." : undefined} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((p) => (
            <ProducerCard key={p.slug} producer={p} />
          ))}
        </div>
      )}
    </>
  );
}

function ProducerCard({ producer: p }: { producer: Producer }) {
  const village = getVillage(p.villageSlug);
  const done = KYC.filter((k) => p.kyc[k.key]).length;
  const listed = products.filter((x) => x.producerSlug === p.slug).length;

  return (
    <Card className="flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-black text-ink">{p.name}</p>
          <p className="text-xs text-muted">
            {p.type} · since {p.since} · {listed} products listed
          </p>
        </div>
        <StatusPill status={p.verification} />
      </div>

      <div className="mt-3 space-y-1 text-sm text-ink">
        <p className="flex items-center gap-2">
          <MapPin size={14} className="shrink-0 text-olive" />
          {village?.name}, {village?.district}, {village?.state}
        </p>
        <p className="flex items-center gap-2">
          <Users size={14} className="shrink-0 text-olive" />
          {p.members} members · {p.categories.map((c) => getCategory(c)?.short).join(", ")}
        </p>
        <p className="flex items-center gap-2">
          <Phone size={14} className="shrink-0 text-olive" />
          {p.phone}
        </p>
      </div>

      <div className="mt-3 rounded-lg bg-cream p-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">KYC documents · {done}/4</p>
        <ul className="grid grid-cols-2 gap-1.5">
          {KYC.map((k) => {
            const ok = p.kyc[k.key];
            return (
              <li key={k.key} className={`flex items-center gap-1.5 text-sm ${ok ? "font-bold text-olive-dark" : "text-muted"}`}>
                {ok ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                {k.label}
                {!ok && <span className="text-[11px]">(missing)</span>}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {p.verification !== "verified" && (
          <Button size="sm" onClick={() => demoActions.setVerification(p.slug, "verified")}>
            Approve
          </Button>
        )}
        {p.verification !== "rejected" && (
          <Button size="sm" variant="outline" onClick={() => demoActions.setVerification(p.slug, "rejected")}>
            Reject
          </Button>
        )}
        {p.verification !== "pending" && (
          <Button size="sm" variant="ghost" onClick={() => demoActions.setVerification(p.slug, "pending")}>
            Move to pending
          </Button>
        )}
      </div>
    </Card>
  );
}
