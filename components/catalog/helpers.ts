// Small formatting + data-joining helpers shared by the catalogue pages.
import { getProducer, getVillage } from "@/lib/mock/data";
import type { Product } from "@/lib/types";

const num = new Intl.NumberFormat("en-IN");

export const formatNumber = (n: number) => num.format(n);

/** "metre" -> "metres", "kg" stays "kg". */
export function unitLabel(unit: string, n = 2) {
  if (n === 1 || unit === "kg") return unit;
  return `${unit}s`;
}

/** "₹450–620 / metre" */
export function priceRange(p: Pick<Product, "priceMin" | "priceMax" | "unit">) {
  return `₹${num.format(p.priceMin)}–${num.format(p.priceMax)} / ${p.unit}`;
}

/** "3,000 metres" */
export const qty = (n: number, unit: string) => `${num.format(n)} ${unitLabel(unit, n)}`;

/** Product joined with its producer + village, flattened for listing and filtering. */
export interface CatalogItem {
  product: Product;
  producerName: string;
  producerSlug: string;
  villageName: string;
  villageSlug: string;
  state: string;
}

export function toCatalogItem(product: Product): CatalogItem {
  const producer = getProducer(product.producerSlug);
  const village = producer ? getVillage(producer.villageSlug) : undefined;
  return {
    product,
    producerName: producer?.name ?? "Independent producer",
    producerSlug: producer?.slug ?? "",
    villageName: village?.name ?? "",
    villageSlug: village?.slug ?? "",
    state: village?.state ?? "India",
  };
}

export const quoteHref = (slug: string, sample = false) =>
  `/post-requirement?product=${slug}${sample ? "&sample=1" : ""}`;

export const WHATSAPP_URL = "https://wa.me/919010325138";
