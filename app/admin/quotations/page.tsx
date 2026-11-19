"use client";

import Link from "next/link";
import { useState } from "react";
import { EmptyState, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { FilterTabs, TableWrap, td, th } from "@/components/admin/ui";
import { formatNumber } from "@/components/admin/helpers";
import { useDemo } from "@/lib/demo-store";
import { formatINR, getProduct } from "@/lib/mock/data";
import type { QuotationStatus } from "@/lib/types";

type Filter = QuotationStatus | "all";

export default function AdminQuotationsPage() {
  const { quotations, producers } = useDemo();
  const [filter, setFilter] = useState<Filter>("all");
  const list = filter === "all" ? quotations : quotations.filter((q) => q.status === filter);
  const name = (slug: string) => producers.find((p) => p.slug === slug)?.name ?? slug;
  const accepted = quotations.filter((q) => q.status === "accepted").length;
  const decided = quotations.filter((q) => q.status === "accepted" || q.status === "rejected").length;

  return (
    <>
      <PageTitle
        title="Quotations"
        subtitle={`${quotations.length} sent · ${decided ? Math.round((accepted / decided) * 100) : 0}% win rate on decided quotes`}
      />
      <FilterTabs<Filter>
        value={filter}
        onChange={setFilter}
        options={(["all", "sent", "accepted", "rejected"] as const).map((s) => ({
          value: s,
          label: s[0].toUpperCase() + s.slice(1),
          count: s === "all" ? quotations.length : quotations.filter((q) => q.status === s).length,
        }))}
      />

      {list.length === 0 ? (
        <EmptyState title="No quotations" />
      ) : (
        <>
          <div className="hidden md:block">
            <TableWrap>
              <thead>
                <tr>
                  <th className={th}>Quote</th>
                  <th className={th}>Producer · product</th>
                  <th className={th}>Producer price</th>
                  <th className={th}>Margin</th>
                  <th className={th}>Buyer price</th>
                  <th className={th}>Total</th>
                  <th className={th}>Valid until</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((q) => (
                  <tr key={q.id}>
                    <td className={td}>
                      <p className="font-bold">{q.id}</p>
                      <Link href={`/admin/requirements/${q.requirementId}`} className="text-xs font-bold text-olive">
                        {q.requirementId}
                      </Link>
                    </td>
                    <td className={td}>
                      <p className="font-bold">{name(q.producerSlug)}</p>
                      <p className="text-xs text-muted">{getProduct(q.productSlug)?.name}</p>
                    </td>
                    <td className={td}>{formatINR(q.producerPrice)}</td>
                    <td className={td}>{q.marginPct}%</td>
                    <td className={`${td} font-bold`}>{formatINR(q.buyerPrice)}</td>
                    <td className={`${td} whitespace-nowrap`}>
                      {formatINR(q.buyerPrice * q.quantity)}
                      <p className="text-xs text-muted">{formatNumber(q.quantity)} units</p>
                    </td>
                    <td className={`${td} whitespace-nowrap`}>{q.validUntil}</td>
                    <td className={td}>
                      <StatusPill status={q.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </div>

          <ul className="space-y-3 md:hidden">
            {list.map((q) => (
              <li key={q.id} className="rounded-xl border border-cream-2 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-ink">
                    {q.id} ·{" "}
                    <Link href={`/admin/requirements/${q.requirementId}`} className="text-olive">
                      {q.requirementId}
                    </Link>
                  </span>
                  <StatusPill status={q.status} />
                </div>
                <p className="mt-1 font-bold text-ink">{name(q.producerSlug)}</p>
                <p className="text-xs text-muted">{getProduct(q.productSlug)?.name}</p>
                <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-cream p-2 text-center text-xs">
                  <div>
                    <p className="text-muted">Producer</p>
                    <p className="font-bold text-ink">{formatINR(q.producerPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted">Margin</p>
                    <p className="font-bold text-ink">{q.marginPct}%</p>
                  </div>
                  <div>
                    <p className="text-muted">Buyer</p>
                    <p className="font-bold text-ink">{formatINR(q.buyerPrice)}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted">
                  Total {formatINR(q.buyerPrice * q.quantity)} · valid until {q.validUntil}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
