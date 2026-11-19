// Admin-only UI primitives (dense tables, filters, progress bars).
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Horizontal progress bar; `value` and `max` in the same unit. */
export function ProgressBar({ value, max, tone = "olive" }: { value: number; max: number; tone?: "olive" | "orange" | "plum" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const bar = { olive: "bg-olive", orange: "bg-orange", plum: "bg-plum" }[tone];
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-cream-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** KPI tile against a 6-month target. */
export function KpiCard({ label, value, target, targetLabel }: { label: string; value: number; target: number; targetLabel: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  return (
    <div className="rounded-xl border border-cream-2 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-ink">
        <span className="text-2xl font-black">{value}</span>
        <span className="text-sm font-bold text-muted"> / {targetLabel}</span>
      </p>
      <div className="mt-2">
        <ProgressBar value={value} max={target} tone={pct >= 100 ? "olive" : pct >= 40 ? "plum" : "orange"} />
      </div>
      <p className="mt-1 text-[11px] text-muted">{pct}% of 6-month target</p>
    </div>
  );
}

/** Pill-style filter tabs that wrap instead of overflowing the page. */
export function FilterTabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; count?: number }[];
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2" role="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
              active ? "bg-plum text-white" : "bg-white text-ink ring-1 ring-cream-2 hover:bg-cream"
            }`}
          >
            {o.label}
            {o.count !== undefined && <span className={`ml-1.5 ${active ? "text-white/70" : "text-muted"}`}>{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Wraps a wide table so it scrolls inside its own container, never the page. */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-xl border border-cream-2 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">{children}</table>
    </div>
  );
}

export const th = "whitespace-nowrap border-b border-cream-2 bg-cream/60 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-muted";
export const td = "border-b border-cream-2/70 px-3 py-2.5 align-top text-ink";

/** A labelled value row used inside mobile cards and detail panels. */
export function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted">{k}</span>
      <span className="text-right font-bold text-ink">{v}</span>
    </div>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="font-hand text-2xl text-ink">{children}</h2>
      {action}
    </div>
  );
}

export function RowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-cream">
      <span className="min-w-0 flex-1">{children}</span>
      <ChevronRight size={16} className="shrink-0 text-muted" />
    </Link>
  );
}

/** Horizontal bar chart made of plain divs. */
export function BarList({ rows, unit = "" }: { rows: { label: string; value: number }[]; unit?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(0,7rem)_1fr_auto] items-center gap-2 text-sm">
          <span className="truncate text-muted">{r.label}</span>
          <span className="h-4 overflow-hidden rounded bg-cream-2/60">
            <span className="block h-full rounded bg-olive" style={{ width: `${(r.value / max) * 100}%` }} />
          </span>
          <span className="w-10 text-right font-bold text-ink">
            {r.value}
            {unit}
          </span>
        </li>
      ))}
    </ul>
  );
}
