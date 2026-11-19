// Shared dashboard widgets. Reuse across producer / buyer / admin pages.
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ORDER_STAGES, type OrderEvent, type OrderStage } from "@/lib/types";

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-hand text-4xl leading-none text-ink">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-cream-2 bg-white p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function StatCard({
  label,
  value,
  target,
  icon: Icon,
  tone = "olive",
}: {
  label: string;
  value: string | number;
  target?: string;
  icon?: LucideIcon;
  tone?: "olive" | "orange" | "plum";
}) {
  const toneCls = { olive: "bg-sage text-olive-dark", orange: "bg-orange/15 text-orange", plum: "bg-mauve text-plum" }[tone];
  return (
    <Card className="flex items-start gap-3">
      {Icon && (
        <span className={`blob flex h-11 w-11 shrink-0 items-center justify-center ${toneCls}`}>
          <Icon size={20} />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 text-2xl font-black text-ink">{value}</p>
        {target && <p className="text-xs text-muted">{target}</p>}
      </div>
    </Card>
  );
}

/** Big icon tile — used on the producer home for low-literacy friendly navigation. */
export function BigTile({ icon: Icon, label, hint, badge }: { icon: LucideIcon; label: string; hint?: string; badge?: number }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-cream-2 bg-white p-5 text-center transition hover:border-olive hover:shadow-md">
      {badge ? (
        <span className="absolute right-3 top-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-orange px-1.5 text-xs font-black text-white">
          {badge}
        </span>
      ) : null}
      <span className="blob flex h-16 w-16 items-center justify-center bg-sage text-olive-dark">
        <Icon size={30} />
      </span>
      <span className="text-base font-black text-ink">{label}</span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}

/** Horizontal order tracker: Order placed → In production → Quality check → Shipped → Delivered */
export function StatusTimeline({ stage, events = [] }: { stage: OrderStage; events?: OrderEvent[] }) {
  const current = ORDER_STAGES.indexOf(stage);
  return (
    <ol className="flex w-full items-start">
      {ORDER_STAGES.map((s, i) => {
        const done = i <= current;
        const ev = events.find((e) => e.stage === s);
        return (
          <li key={s} className="relative flex flex-1 flex-col items-center text-center">
            {i > 0 && (
              <span className={`absolute right-1/2 top-3.5 h-0.5 w-full ${i <= current ? "bg-olive" : "bg-cream-2"}`} />
            )}
            <span
              className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-black ${
                done ? "border-olive bg-olive text-white" : "border-cream-2 bg-white text-muted"
              } ${i === current ? "ring-4 ring-olive/20" : ""}`}
            >
              {done ? <Check size={14} strokeWidth={3} /> : i + 1}
            </span>
            <span className={`mt-1.5 text-[10px] sm:text-xs font-bold leading-tight ${done ? "text-ink" : "text-muted"}`}>{s}</span>
            {ev && <span className="hidden sm:block text-[10px] text-muted">{ev.date}</span>}
          </li>
        );
      })}
    </ol>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-orange/15 text-orange",
    matching: "bg-plum/10 text-plum",
    quoted: "bg-sage text-olive-dark",
    closed: "bg-mauve text-ink",
    draft: "bg-mauve text-ink",
    sent: "bg-plum/10 text-plum",
    accepted: "bg-olive text-white",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-orange/15 text-orange",
    verified: "bg-olive text-white",
    open: "bg-orange/15 text-orange",
    resolved: "bg-sage text-olive-dark",
    "advance-received": "bg-plum/10 text-plum",
    paid: "bg-sage text-olive-dark",
    settled: "bg-olive text-white",
    due: "bg-orange/15 text-orange",
    partial: "bg-plum/10 text-plum",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${map[status] ?? "bg-cream text-ink"}`}>
      {status.replace("-", " ")}
    </span>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-cream-2 p-8 text-center">
      <p className="font-hand text-2xl text-ink">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}

/** Demo file picker — shows chosen file names, nothing is uploaded. */
export function FileDrop({ label, accept }: { label: string; accept?: string }) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-sage bg-cream/50 p-5 text-center hover:border-olive">
      <span className="text-sm font-bold text-olive">{label}</span>
      <span className="text-xs text-muted">Tap to choose a file (demo — not uploaded)</span>
      <input type="file" accept={accept} className="sr-only" />
    </label>
  );
}
