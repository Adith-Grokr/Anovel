"use client";

// Small helpers shared by the producer pages.
import { useMemo } from "react";
import { Camera, X } from "lucide-react";
import { useDemo } from "@/lib/demo-store";
import { DEMO_PRODUCER_SLUG } from "@/lib/mock/data";
import type { Order } from "@/lib/types";

export const WHATSAPP_URL = "https://wa.me/919010325138";
export const CALL_URL = "tel:+919010325138";

/** Large input style for low-literacy, touch-first forms. */
export const bigInputClass =
  "w-full rounded-xl border-2 border-cream-2 bg-white px-4 py-3.5 text-lg text-ink placeholder:text-muted/70 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20";

export const todayISO = () => new Date().toISOString().slice(0, 10);

export function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function addDays(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Orders belonging to the demo producer. */
export function useMyOrders(): Order[] {
  const { orders } = useDemo();
  return useMemo(() => orders.filter((o) => o.producerSlug === DEMO_PRODUCER_SLUG), [orders]);
}

/** The demo producer record from the shared store. */
export function useMe() {
  const { producers } = useDemo();
  return producers.find((p) => p.slug === DEMO_PRODUCER_SLUG);
}

/** File picker that supports multiple files and lists the chosen names (demo only — nothing uploads). */
export function MultiFileDrop({
  label,
  accept,
  multiple = true,
  files,
  onChange,
}: {
  label: string;
  accept?: string;
  multiple?: boolean;
  files: string[];
  onChange: (names: string[]) => void;
}) {
  return (
    <div>
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-sage bg-cream/50 p-5 text-center hover:border-olive">
        <span className="blob flex h-12 w-12 items-center justify-center bg-sage text-olive-dark">
          <Camera size={22} />
        </span>
        <span className="text-base font-bold text-olive">{label}</span>
        <span className="text-xs text-muted">Tap to choose (demo — not uploaded)</span>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            const picked = Array.from(e.target.files ?? []).map((f) => f.name);
            onChange(multiple ? [...files, ...picked] : picked);
            e.target.value = "";
          }}
        />
      </label>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((name, i) => (
            <li key={`${name}-${i}`} className="flex items-center justify-between gap-2 rounded-lg bg-cream px-3 py-2 text-sm">
              <span className="min-w-0 truncate font-bold text-ink">{name}</span>
              <button
                type="button"
                aria-label={`Remove ${name}`}
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-white"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Simple coloured note box. */
export function Note({ children, tone = "sage" }: { children: React.ReactNode; tone?: "sage" | "orange" | "plum" }) {
  const cls = { sage: "bg-sage/50 text-olive-dark", orange: "bg-orange/10 text-ink", plum: "bg-plum/10 text-plum" }[tone];
  return <div className={`rounded-xl px-4 py-3 text-sm ${cls}`}>{children}</div>;
}
