"use client";

import Link from "next/link";
import { useState } from "react";
import { EmptyState, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { Button } from "@/components/site/ui";
import { FilterTabs } from "@/components/admin/ui";
import { demoActions, useDemo } from "@/lib/demo-store";
import { getBuyer, getProduct } from "@/lib/mock/data";
import type { Complaint } from "@/lib/types";

type Filter = Complaint["status"] | "all";

export default function AdminComplaintsPage() {
  const { complaints, orders, producers } = useDemo();
  const [filter, setFilter] = useState<Filter>("open");
  const list = filter === "all" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <>
      <PageTitle title="Complaints" subtitle="Disputes raised by buyers or producers, tracked until resolved." />
      <FilterTabs<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { value: "open", label: "Open", count: complaints.filter((c) => c.status === "open").length },
          { value: "resolved", label: "Resolved", count: complaints.filter((c) => c.status === "resolved").length },
          { value: "all", label: "All", count: complaints.length },
        ]}
      />

      {list.length === 0 ? (
        <EmptyState title="All clear" hint="No complaints in this view." />
      ) : (
        <ul className="space-y-3">
          {list.map((c) => {
            const order = orders.find((o) => o.id === c.orderId);
            const party =
              c.raisedBy === "buyer"
                ? getBuyer(order?.buyerId ?? "")?.company
                : producers.find((p) => p.slug === order?.producerSlug)?.name;
            return (
              <li key={c.id} className="rounded-xl border border-cream-2 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-muted">
                    {c.id} · {c.date}
                  </span>
                  <StatusPill status={c.status} />
                </div>
                <p className="mt-1 font-bold text-ink">{c.subject}</p>
                <p className="mt-0.5 text-sm text-muted">
                  Raised by {c.raisedBy}
                  {party ? ` (${party})` : ""} on{" "}
                  <Link href={`/admin/orders/${c.orderId}`} className="font-bold text-olive">
                    {c.orderId}
                  </Link>
                  {order ? ` · ${getProduct(order.productSlug)?.name}` : ""}
                </p>
                {c.status === "open" && (
                  <Button size="sm" className="mt-3" onClick={() => demoActions.resolveComplaint(c.id)}>
                    Mark resolved
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
