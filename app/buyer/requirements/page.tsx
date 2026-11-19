"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Plus } from "lucide-react";
import { EmptyState, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { ButtonLink } from "@/components/site/ui";
import { fmtDate, useBuyerData } from "@/components/buyer/buyer-data";
import { getCategory } from "@/lib/mock/data";

export default function BuyerRequirementsPage() {
  const { requirements, quotations } = useBuyerData();

  return (
    <>
      <PageTitle
        title="My requirements"
        subtitle="What you asked for, and how far ANOVEL has got in matching it."
        action={
          <ButtonLink href="/post-requirement" variant="orange">
            <Plus size={16} /> New requirement
          </ButtonLink>
        }
      />

      {requirements.length === 0 ? (
        <EmptyState title="No requirements yet" hint="Post one and ANOVEL will match you with verified producers." />
      ) : (
        <ul className="space-y-3">
          {requirements.map((r) => {
            const quoteCount = quotations.filter((q) => q.requirementId === r.id).length;
            return (
              <li key={r.id}>
                <Link
                  href={`/buyer/requirements/${r.id}`}
                  className="block rounded-xl border border-cream-2 bg-white p-4 transition hover:border-olive sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-muted">
                        {r.id} · {getCategory(r.category)?.name}
                      </p>
                      <p className="font-bold text-ink">{r.title}</p>
                    </div>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="font-bold text-ink">
                      {r.quantity.toLocaleString("en-IN")} {r.unit}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {r.destination}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={12} /> Needed by {fmtDate(r.neededBy)}
                    </span>
                    <span>{r.matchedProducerSlugs.length} producers matched</span>
                    {quoteCount > 0 && <span className="font-bold text-olive">{quoteCount} quotations</span>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
