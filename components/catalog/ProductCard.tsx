// Product card in the Groundy style: photo on top, cream text panel below.
// No hooks, so it can render from both server and client components.
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge, ButtonLink, VerifiedBadge } from "@/components/site/ui";
import { priceRange, qty, quoteHref, type CatalogItem } from "./helpers";

export function ProductCard({ item, priority = false }: { item: CatalogItem; priority?: boolean }) {
  const { product: p } = item;
  const href = `/products/${p.slug}`;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden bg-cream shadow-sm transition-shadow hover:shadow-md">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-cream-2">
        <Image
          src={p.images[0]}
          alt={p.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {p.verified && (
            <span className="rounded-full bg-white/95 shadow-sm">
              <VerifiedBadge />
            </span>
          )}
          {p.exportReady && (
            <span className="rounded-full bg-white/95 shadow-sm">
              <Badge tone="orange">Export ready</Badge>
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-hand text-xl leading-snug text-ink">
          <Link href={href} className="hover:text-olive">
            {p.name}
          </Link>
        </h3>
        <p className="mt-1 truncate text-xs text-muted">
          by{" "}
          <Link href={`/producers/${item.producerSlug}`} className="font-bold text-plum hover:text-orange">
            {item.producerName}
          </Link>
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden />
          <span className="truncate">
            {item.villageName ? `${item.villageName}, ` : ""}
            {item.state}
          </span>
        </p>

        <p className="mt-3 text-lg font-bold text-olive">{priceRange(p)}</p>

        <dl className="mt-2 grid grid-cols-2 gap-2 border-t border-dashed border-sage pt-2 text-xs">
          <div>
            <dt className="text-muted">MOQ</dt>
            <dd className="font-bold text-ink">{qty(p.moq, p.unit)}</dd>
          </div>
          <div>
            <dt className="text-muted">Monthly capacity</dt>
            <dd className="font-bold text-ink">{qty(p.monthlyCapacity, p.unit)}</dd>
          </div>
        </dl>

        <div className="mt-auto flex gap-2 pt-4">
          <ButtonLink href={quoteHref(p.slug)} size="sm" className="flex-1 py-2">
            Request quote
          </ButtonLink>
          <ButtonLink href={href} variant="outline" size="sm" className="py-1.5">
            View
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
