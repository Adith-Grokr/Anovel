"use client";

// Catalogue filtering UI: category band, filter sidebar (desktop) / drawer (mobile), sort, results.
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CategoryIcon } from "@/components/site/HandIcons";
import { Button, ButtonLink, inputClass } from "@/components/site/ui";
import type { Category, CategorySlug } from "@/lib/types";
import type { CatalogItem } from "./helpers";
import { ProductCard } from "./ProductCard";

type SortKey = "relevance" | "price" | "capacity";

interface Filters {
  category: CategorySlug | "all";
  state: string;
  verifiedOnly: boolean;
  exportReady: boolean;
  moqMax: number; // 0 = any
  q: string;
}

const MOQ_OPTIONS = [
  { value: 0, label: "Any MOQ" },
  { value: 50, label: "Up to 50 units" },
  { value: 200, label: "Up to 200 units" },
  { value: 1000, label: "Up to 1,000 units" },
  { value: 5000, label: "Up to 5,000 units" },
];

const emptyFilters = (category: Filters["category"]): Filters => ({
  category,
  state: "all",
  verifiedOnly: false,
  exportReady: false,
  moqMax: 0,
  q: "",
});

export function CatalogBrowser({
  items,
  categories,
  initialCategory,
}: {
  items: CatalogItem[];
  categories: Category[];
  initialCategory: CategorySlug | "all";
}) {
  const [filters, setFilters] = useState<Filters>(() => emptyFilters(initialCategory));
  const [sort, setSort] = useState<SortKey>("relevance");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const states = useMemo(() => [...new Set(items.map((i) => i.state))].sort(), [items]);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  // Keep ?category= in the address bar in sync so the page can be shared.
  const selectCategory = (category: Filters["category"]) => {
    set("category", category);
    const url = category === "all" ? "/products" : `/products?category=${category}`;
    window.history.replaceState(null, "", url);
  };

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const list = items.filter(({ product: p, ...meta }) => {
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (filters.state !== "all" && meta.state !== filters.state) return false;
      if (filters.verifiedOnly && !p.verified) return false;
      if (filters.exportReady && !p.exportReady) return false;
      if (filters.moqMax > 0 && p.moq > filters.moqMax) return false;
      if (q) {
        const hay = `${p.name} ${p.description} ${meta.producerName} ${meta.villageName} ${meta.state}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const score = (i: CatalogItem) => (i.product.verified ? 2 : 0) + (i.product.exportReady ? 1 : 0);
    return [...list].sort((a, b) => {
      if (sort === "price") return a.product.priceMin - b.product.priceMin;
      if (sort === "capacity") return b.product.monthlyCapacity - a.product.monthlyCapacity;
      return score(b) - score(a);
    });
  }, [items, filters, sort]);

  const activeCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.state !== "all" ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.exportReady ? 1 : 0) +
    (filters.moqMax > 0 ? 1 : 0) +
    (filters.q.trim() ? 1 : 0);

  const reset = () => {
    setFilters(emptyFilters("all"));
    window.history.replaceState(null, "", "/products");
  };

  const panel = (
    <div className="space-y-5">
      <div>
        <label htmlFor="catalog-q" className="mb-1 block text-sm font-bold text-ink">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="catalog-q"
            type="search"
            value={filters.q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Ikat, turmeric, toys…"
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="catalog-category" className="mb-1 block text-sm font-bold text-ink">
          Category
        </label>
        <select
          id="catalog-category"
          value={filters.category}
          onChange={(e) => selectCategory(e.target.value as Filters["category"])}
          className={inputClass}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="catalog-state" className="mb-1 block text-sm font-bold text-ink">
          State
        </label>
        <select
          id="catalog-state"
          value={filters.state}
          onChange={(e) => set("state", e.target.value)}
          className={inputClass}
        >
          <option value="all">All states</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="catalog-moq" className="mb-1 block text-sm font-bold text-ink">
          Maximum MOQ
        </label>
        <select
          id="catalog-moq"
          value={filters.moqMax}
          onChange={(e) => set("moqMax", Number(e.target.value))}
          className={inputClass}
        >
          {MOQ_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-bold text-ink">Trust</legend>
        <Toggle
          label="ANOVEL verified only"
          checked={filters.verifiedOnly}
          onChange={(v) => set("verifiedOnly", v)}
        />
        <Toggle label="Export ready" checked={filters.exportReady} onChange={(v) => set("exportReady", v)} />
      </fieldset>

      {activeCount > 0 && (
        <button type="button" onClick={reset} className="text-sm font-bold text-orange hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Category band, like Groundy's mauve icon strip */}
      <div className="bleed bg-mauve">
        <div className="no-scrollbar overflow-x-auto px-3 py-3 sm:px-6">
          <div className="mx-auto flex w-max gap-1">
          <CategoryChip
            active={filters.category === "all"}
            label="All"
            onClick={() => selectCategory("all")}
            icon={<span className="font-hand text-2xl leading-none">all</span>}
          />
          {categories.map((c) => (
            <CategoryChip
              key={c.slug}
              active={filters.category === c.slug}
              label={c.short}
              onClick={() => selectCategory(c.slug)}
              icon={<CategoryIcon slug={c.slug} size={34} />}
            />
          ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:flex lg:gap-8 lg:px-8 lg:py-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filters">
          <div className="sticky top-4 brush bg-cream p-5">
            <h2 className="mb-4 font-hand text-2xl text-olive">Filter producers&apos; goods</h2>
            {panel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              <span className="font-bold text-ink">{results.length}</span>{" "}
              {results.length === 1 ? "product" : "products"} from verified village producers
            </p>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="py-1.5 lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                Filters{activeCount > 0 && ` (${activeCount})`}
              </Button>
              <label htmlFor="catalog-sort" className="sr-only">
                Sort by
              </label>
              <select
                id="catalog-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="min-w-0 flex-1 rounded-md border border-cream-2 bg-white px-3 py-2 text-sm text-ink focus:border-olive focus:outline-none sm:flex-none"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price">Sort: Price, low to high</option>
                <option value="capacity">Sort: Monthly capacity</option>
              </select>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((item, i) => (
                <ProductCard key={item.product.slug} item={item} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="brush bg-cream px-6 py-12 text-center">
              <p className="font-hand text-3xl text-olive">Nothing on the loom yet…</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink/80">
                No products match these filters. Clear a few filters, or tell us what you need and ANOVEL will
                find a village producer for you.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button type="button" variant="outline" onClick={reset}>
                  Clear filters
                </Button>
                <ButtonLink href="/post-requirement" variant="orange">
                  Post a requirement
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-ink/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-cream px-4 py-3">
              <h2 className="font-hand text-2xl text-olive">Filters</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded p-1 text-ink hover:text-orange"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{panel}</div>
            <div className="border-t border-cream-2 p-4">
              <Button type="button" className="w-full" onClick={() => setDrawerOpen(false)}>
                Show {results.length} {results.length === 1 ? "product" : "products"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CategoryChip({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-[72px] shrink-0 flex-col items-center gap-1 brush px-1 py-2 text-[11px] font-bold uppercase transition-colors sm:w-[84px] ${
        active ? "bg-plum text-white" : "text-plum hover:bg-white/50 hover:text-orange"
      }`}
    >
      <span className="flex h-9 items-center">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-olive"
      />
      {label}
    </label>
  );
}
