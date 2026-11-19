"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Flame,
  Leaf,
  MessageCircle,
  Palette,
  Recycle,
  Shirt,
  Sofa,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { Card, PageTitle } from "@/components/dashboard/widgets";
import { Button, ButtonLink } from "@/components/site/ui";
import { categories, formatINR, getProduct } from "@/lib/mock/data";
import type { CategorySlug } from "@/lib/types";
import { MultiFileDrop, WHATSAPP_URL, bigInputClass } from "@/components/producer/shared";

const categoryIcons: Record<CategorySlug, LucideIcon> = {
  handloom: Shirt,
  handicrafts: Palette,
  spices: Flame,
  grains: Wheat,
  organic: Leaf,
  "home-decor": Sofa,
  "jute-eco": Recycle,
};

const UNITS = ["piece", "metre", "kg", "set", "dozen"] as const;
const STEPS = ["Photos", "Name", "Price", "Quantity", "Check"] as const;

interface FormState {
  files: string[];
  name: string;
  category: CategorySlug | "";
  priceMin: string;
  priceMax: string;
  unit: string;
  moq: string;
  capacity: string;
  stock: string;
  leadTime: string;
}

const empty: FormState = {
  files: [],
  name: "",
  category: "",
  priceMin: "",
  priceMax: "",
  unit: "piece",
  moq: "",
  capacity: "",
  stock: "",
  leadTime: "",
};

const digits = (v: string) => v.replace(/[^0-9]/g, "");

function NumberField({
  label,
  hint,
  value,
  onChange,
  suffix,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-base font-black text-ink">{label}</span>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => onChange(digits(e.target.value))}
          className={`${bigInputClass} ${suffix ? "pr-20" : ""}`}
          placeholder="0"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function NewProductForm() {
  const params = useSearchParams();
  const editing = getProduct(params.get("edit") ?? "");

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [f, setF] = useState<FormState>(() =>
    editing
      ? {
          files: editing.images.map((src) => src.split("/").pop() ?? src),
          name: editing.name,
          category: editing.category,
          priceMin: String(editing.priceMin),
          priceMax: String(editing.priceMax),
          unit: editing.unit,
          moq: String(editing.moq),
          capacity: String(editing.monthlyCapacity),
          stock: String(editing.stock),
          leadTime: String(editing.leadTimeDays),
        }
      : empty,
  );
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setF((s) => ({ ...s, [key]: value }));

  const canNext = [
    f.files.length > 0,
    f.name.trim().length > 1 && f.category !== "",
    Number(f.priceMin) > 0 && Number(f.priceMax) >= Number(f.priceMin),
    Number(f.moq) > 0 && Number(f.capacity) > 0,
    true,
  ][step];

  const categoryName = categories.find((c) => c.slug === f.category)?.name ?? "—";

  if (done) {
    return (
      <div className="mx-auto max-w-lg py-6 text-center">
        <span className="blob mx-auto flex h-24 w-24 items-center justify-center bg-sage text-olive-dark">
          <CircleCheck size={48} />
        </span>
        <h1 className="mt-4 font-hand text-4xl text-ink">Submitted for ANOVEL review</h1>
        <p className="mt-2 text-base text-muted">
          Our team will check your photos and price. We will call you on WhatsApp within 2 days.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <ButtonLink href="/producer/products" size="lg">
            See my products
          </ButtonLink>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setF(empty);
              setStep(0);
              setDone(false);
            }}
          >
            Add another product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle title={editing ? "Edit product" : "Add product"} subtitle={`Step ${step + 1} of ${STEPS.length} — ${STEPS[step]}`} />

      {/* Step dots */}
      <ol className="mb-5 grid grid-cols-5 gap-1.5" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s} className="text-center">
            <span className={`block h-2 rounded-full ${i <= step ? "bg-olive" : "bg-cream-2"}`} />
            <span className={`mt-1 block text-[11px] font-bold ${i === step ? "text-olive" : "text-muted"}`}>{s}</span>
          </li>
        ))}
      </ol>

      <Card className="space-y-5">
        {step === 0 && (
          <>
            <p className="text-lg font-black text-ink">Add photos or videos of your product</p>
            <MultiFileDrop
              label="Take photo / video"
              accept="image/*,video/*"
              files={f.files}
              onChange={(names) => set("files", names)}
            />
            <p className="text-xs text-muted">Tip: use daylight. Show the full product and a close-up of the work.</p>
          </>
        )}

        {step === 1 && (
          <>
            <label className="block">
              <span className="mb-1.5 block text-lg font-black text-ink">Product name</span>
              <input
                value={f.name}
                onChange={(e) => set("name", e.target.value)}
                className={bigInputClass}
                placeholder="e.g. Ikat silk saree"
              />
            </label>
            <div>
              <p className="mb-2 text-lg font-black text-ink">What type?</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {categories.map((c) => {
                  const Icon = categoryIcons[c.slug];
                  const active = f.category === c.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => set("category", c.slug)}
                      aria-pressed={active}
                      className={`relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition ${
                        active ? "border-olive bg-sage/40" : "border-cream-2 bg-white hover:border-sage"
                      }`}
                    >
                      {active && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-olive text-white">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                      <span className="blob flex h-12 w-12 items-center justify-center bg-sage text-olive-dark">
                        <Icon size={24} />
                      </span>
                      <span className="text-sm font-bold text-ink">{c.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <p className="mb-2 text-lg font-black text-ink">Sold by</p>
              <div className="flex flex-wrap gap-2">
                {UNITS.map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => set("unit", u)}
                    aria-pressed={f.unit === u}
                    className={`min-h-12 rounded-full border-2 px-5 text-base font-bold capitalize ${
                      f.unit === u ? "border-olive bg-olive text-white" : "border-cream-2 bg-white text-ink"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Lowest price ₹" value={f.priceMin} onChange={(v) => set("priceMin", v)} suffix={`/ ${f.unit}`} />
              <NumberField label="Highest price ₹" value={f.priceMax} onChange={(v) => set("priceMax", v)} suffix={`/ ${f.unit}`} />
            </div>
            {f.priceMin && f.priceMax && Number(f.priceMax) < Number(f.priceMin) && (
              <p className="text-sm font-bold text-orange">Highest price must be more than lowest price.</p>
            )}
            <p className="text-xs text-muted">This is the price YOU receive. ANOVEL adds its service fee for the buyer separately.</p>
          </>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Minimum order" hint="Smallest order you accept" value={f.moq} onChange={(v) => set("moq", v)} suffix={f.unit} />
            <NumberField label="Can make per month" value={f.capacity} onChange={(v) => set("capacity", v)} suffix={f.unit} />
            <NumberField label="Ready stock now" value={f.stock} onChange={(v) => set("stock", v)} suffix={f.unit} />
            <NumberField label="Days to make an order" value={f.leadTime} onChange={(v) => set("leadTime", v)} suffix="days" />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <p className="text-lg font-black text-ink">Check and send</p>
            <dl className="divide-y divide-cream-2 rounded-xl border border-cream-2">
              {[
                ["Photos", `${f.files.length} file${f.files.length === 1 ? "" : "s"}`],
                ["Name", f.name],
                ["Type", categoryName],
                ["Price", `${formatINR(Number(f.priceMin))} – ${formatINR(Number(f.priceMax))} / ${f.unit}`],
                ["Minimum order", `${f.moq} ${f.unit}`],
                ["Per month", `${f.capacity} ${f.unit}`],
                ["Stock", `${f.stock || 0} ${f.unit}`],
                ["Days to make", `${f.leadTime || "—"} days`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-3 px-4 py-2.5">
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="text-right text-sm font-bold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          {step > 0 && (
            <Button type="button" variant="outline" size="lg" onClick={() => setStep((s) => s - 1)} className="flex-1">
              <ArrowLeft size={20} /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button type="button" size="lg" disabled={!canNext} onClick={() => setStep((s) => s + 1)} className="flex-[2]">
              Next <ArrowRight size={20} />
            </Button>
          ) : (
            <Button type="button" variant="orange" size="lg" onClick={() => setDone(true)} className="flex-[2]">
              <Check size={20} /> Send for review
            </Button>
          )}
        </div>
      </Card>

      <a
        href={WHATSAPP_URL}
        className="mt-4 flex items-center gap-3 rounded-2xl bg-[#25D366]/15 p-4 text-ink hover:bg-[#25D366]/25"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
          <MessageCircle size={22} />
        </span>
        <span>
          <span className="block text-base font-black">Can&apos;t type?</span>
          <span className="block text-sm text-muted">Send details on WhatsApp — a voice note and photos are enough.</span>
        </span>
      </a>
      <p className="mt-3 text-center text-sm">
        <Link href="/producer/products" className="font-bold text-olive underline">
          Cancel
        </Link>
      </p>
    </div>
  );
}
