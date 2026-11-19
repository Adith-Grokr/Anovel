// Village cluster card: photo with handwritten cluster name on a cream panel.
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import type { Village } from "@/lib/types";

export function VillageCard({ village }: { village: Village }) {
  const href = `/villages/${village.slug}`;
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden bg-cream shadow-sm transition-shadow hover:shadow-md">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
        <Image
          src={village.image}
          alt={village.clusterName}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-plum">
          <MapPin className="h-3 w-3" aria-hidden />
          {village.state}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-hand text-2xl leading-snug text-olive">
          <Link href={href} className="hover:text-orange">
            {village.clusterName}
          </Link>
        </h3>
        <p className="text-xs text-muted">
          {village.name}, {village.district} district
        </p>
        <p className="mt-2 text-sm text-ink/90">{village.specialty}</p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-dashed border-sage pt-3 text-xs">
          <span className="flex items-center gap-1 font-bold text-ink">
            <Users className="h-3.5 w-3.5 text-olive" aria-hidden />
            {village.producersCount} producers
          </span>
          <Link href={href} className="font-bold text-orange hover:underline">
            Visit village →
          </Link>
        </div>
      </div>
    </article>
  );
}
