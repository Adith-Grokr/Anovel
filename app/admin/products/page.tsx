"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { EmptyState, PageTitle } from "@/components/dashboard/widgets";
import { inputClass } from "@/components/site/ui";
import { TableWrap, td, th } from "@/components/admin/ui";
import { formatNumber } from "@/components/admin/helpers";
import { useDemo } from "@/lib/demo-store";
import { formatINR, getCategory, products } from "@/lib/mock/data";

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${on ? "bg-olive" : "bg-cream-2"}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function AdminProductsPage() {
  const { producers } = useDemo();
  const [q, setQ] = useState("");
  const [verified, setVerified] = useState<Record<string, boolean>>(() => Object.fromEntries(products.map((p) => [p.slug, p.verified])));

  const producerName = (slug: string) => producers.find((p) => p.slug === slug)?.name ?? slug;
  const needle = q.trim().toLowerCase();
  const list = products.filter(
    (p) =>
      !needle ||
      p.name.toLowerCase().includes(needle) ||
      producerName(p.producerSlug).toLowerCase().includes(needle) ||
      (getCategory(p.category)?.name.toLowerCase().includes(needle) ?? false),
  );
  const toggle = (slug: string) => setVerified((v) => ({ ...v, [slug]: !v[slug] }));
  const verifiedCount = Object.values(verified).filter(Boolean).length;

  return (
    <>
      <PageTitle title="Product moderation" subtitle={`${products.length} listings · ${verifiedCount} verified by ANOVEL`} />
      <div className="relative mb-4">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input className={`${inputClass} pl-9`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product, producer or category" />
      </div>

      {list.length === 0 ? (
        <EmptyState title="No products match" />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <TableWrap>
              <thead>
                <tr>
                  <th className={th}>Product</th>
                  <th className={th}>Producer</th>
                  <th className={th}>Price</th>
                  <th className={th}>MOQ</th>
                  <th className={th}>Capacity / mo</th>
                  <th className={th}>Export-ready</th>
                  <th className={th}>Verified</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.slug}>
                    <td className={td}>
                      <p className="font-bold">{p.name}</p>
                      <p className="text-xs text-muted">{getCategory(p.category)?.short}</p>
                    </td>
                    <td className={td}>{producerName(p.producerSlug)}</td>
                    <td className={`${td} whitespace-nowrap`}>
                      {formatINR(p.priceMin)}–{formatINR(p.priceMax)}
                      <span className="text-xs text-muted">/{p.unit}</span>
                    </td>
                    <td className={`${td} whitespace-nowrap`}>
                      {formatNumber(p.moq)} {p.unit}
                    </td>
                    <td className={`${td} whitespace-nowrap`}>{formatNumber(p.monthlyCapacity)}</td>
                    <td className={td}>{p.exportReady ? <span className="font-bold text-olive">Yes</span> : <span className="text-muted">No</span>}</td>
                    <td className={td}>
                      <Toggle on={verified[p.slug]} onChange={() => toggle(p.slug)} label={`Verified: ${p.name}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {list.map((p) => (
              <li key={p.slug} className="rounded-xl border border-cream-2 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">{p.name}</p>
                    <p className="text-xs text-muted">
                      {producerName(p.producerSlug)} · {getCategory(p.category)?.short}
                    </p>
                  </div>
                  <Toggle on={verified[p.slug]} onChange={() => toggle(p.slug)} label={`Verified: ${p.name}`} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink">
                  <span>
                    {formatINR(p.priceMin)}–{formatINR(p.priceMax)}/{p.unit}
                  </span>
                  <span>MOQ {formatNumber(p.moq)}</span>
                  <span>{formatNumber(p.monthlyCapacity)}/mo</span>
                  <span className={p.exportReady ? "font-bold text-olive" : "text-muted"}>{p.exportReady ? "Export-ready" : "Domestic only"}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
