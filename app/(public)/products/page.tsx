import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { PageBanner } from "@/components/catalog/PageBanner";
import { toCatalogItem } from "@/components/catalog/helpers";
import { categories, getCategory, products } from "@/lib/mock/data";
import type { CategorySlug } from "@/lib/types";

export const metadata: Metadata = {
  title: "Products from Indian villages | ANOVEL",
  description:
    "Browse handloom, crafts, spices, grains and eco products from verified Indian village producers. Request quotations and samples in bulk.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const category = raw ? getCategory(raw) : undefined;
  const initialCategory: CategorySlug | "all" = category?.slug ?? "all";

  const items = products.map(toCatalogItem);

  return (
    <>
      <PageBanner
        title="Village-made, export-ready"
        subtitle="Every product comes straight from a weaver, farmer group or artisan collective. Pick what you like and request a quotation or sample: ANOVEL verifies, checks quality and ships."
        crumbs={[{ href: "/", label: "Home" }, { label: "Products" }]}
        image="/images/spice-market.jpg"
      />
      <CatalogBrowser
        key={initialCategory}
        items={items}
        categories={categories}
        initialCategory={initialCategory}
      />
    </>
  );
}
