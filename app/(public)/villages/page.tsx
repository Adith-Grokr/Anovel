import type { Metadata } from "next";
import Link from "next/link";
import { PageBanner } from "@/components/catalog/PageBanner";
import { VillageCard } from "@/components/catalog/VillageCard";
import { SectionHeading } from "@/components/site/ui";
import { villages } from "@/lib/mock/data";

export const metadata: Metadata = {
  title: "Our villages | ANOVEL",
  description:
    "Meet the village clusters behind ANOVEL: ikat weavers of Pochampally, Guntur chilli farmers, Channapatna toy makers and more.",
};

export default function VillagesPage() {
  // Group clusters by state for the map panel.
  const byState = new Map<string, { villages: typeof villages; producers: number }>();
  for (const v of villages) {
    const entry = byState.get(v.state) ?? { villages: [], producers: 0 };
    entry.villages.push(v);
    entry.producers += v.producersCount;
    byState.set(v.state, entry);
  }
  const states = [...byState.entries()].sort((a, b) => b[1].producers - a[1].producers);
  const maxProducers = Math.max(...states.map(([, s]) => s.producers));
  const totalProducers = villages.reduce((n, v) => n + v.producersCount, 0);

  return (
    <>
      <PageBanner
        title="Our villages"
        subtitle="ANOVEL works cluster by cluster. Each village has a craft or crop it has perfected over generations, and a local team that knows every loom, kiln and farm by name."
        crumbs={[{ href: "/", label: "Home" }, { label: "Villages" }]}
        image="/images/hero-village.jpg"
      />

      <section className="px-4 py-10 sm:px-8">
        <SectionHeading
          title="Village clusters"
          subtitle={`${villages.length} clusters · ${totalProducers} producer groups · ${states.length} states`}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {villages.map((v) => (
            <VillageCard key={v.slug} village={v} />
          ))}
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-8">
        <div className="brush bg-cream p-5 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-hand text-3xl text-olive">Where we source</h2>
            <span className="rounded-full bg-plum px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Village map coming soon
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">Producer groups by state</p>

          <ul className="mt-6 space-y-4">
            {states.map(([state, s]) => (
              <li key={state} className="grid gap-2 sm:grid-cols-[180px_1fr] sm:items-center">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-orange" aria-hidden />
                  <span className="font-bold text-ink">{state}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-olive"
                        style={{ width: `${Math.max(8, (s.producers / maxProducers) * 100)}%` }}
                      />
                    </div>
                    <span className="w-24 shrink-0 text-right text-xs font-bold text-olive">
                      {s.producers} producers
                    </span>
                  </div>
                  <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted">
                    {s.villages.map((v) => (
                      <Link key={v.slug} href={`/villages/${v.slug}`} className="hover:text-orange">
                        • {v.name}
                      </Link>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
