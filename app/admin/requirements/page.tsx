"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { EmptyState, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { FilterTabs } from "@/components/admin/ui";
import { formatNumber } from "@/components/admin/helpers";
import { useDemo } from "@/lib/demo-store";
import { formatINR, getBuyer, getCategory } from "@/lib/mock/data";
import type { RequirementStatus } from "@/lib/types";

type Filter = RequirementStatus | "all";
const STATUSES: RequirementStatus[] = ["new", "matching", "quoted", "closed"];

export default function AdminRequirementsPage() {
  const { requirements, quotations } = useDemo();
  const [filter, setFilter] = useState<Filter>("all");
  const list = filter === "all" ? requirements : requirements.filter((r) => r.status === filter);

  return (
    <>
      <PageTitle title="Requirements inbox" subtitle="Buyer enquiries waiting to be matched with verified producers." />
      <FilterTabs<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All", count: requirements.length },
          ...STATUSES.map((s) => ({
            value: s,
            label: s[0].toUpperCase() + s.slice(1),
            count: requirements.filter((r) => r.status === s).length,
          })),
        ]}
      />

      {list.length === 0 ? (
        <EmptyState title="Nothing here" hint="No requirements with this status." />
      ) : (
        <ul className="space-y-3">
          {list.map((r) => {
            const buyer = getBuyer(r.buyerId);
            const quotes = quotations.filter((q) => q.requirementId === r.id).length;
            return (
              <li key={r.id}>
                <Link
                  href={`/admin/requirements/${r.id}`}
                  className="flex items-center gap-3 rounded-xl border border-cream-2 bg-white p-4 transition hover:border-olive"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-muted">{r.id}</span>
                      <StatusPill status={r.status} />
                      <span className="text-xs text-muted">{getCategory(r.category)?.short}</span>
                    </div>
                    <p className="mt-1 font-bold text-ink">{r.title}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {buyer?.flag} {buyer?.company} · {buyer?.country}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink">
                      <span>
                        <b>{formatNumber(r.quantity)}</b> {r.unit}
                      </span>
                      {r.targetPrice && <span>Target {formatINR(r.targetPrice)}/{r.unit}</span>}
                      <span>Needed by {r.neededBy}</span>
                      <span>{r.matchedProducerSlugs.length} matched</span>
                      <span>{quotes} quotes</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-muted" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
