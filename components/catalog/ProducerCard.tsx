// Compact producer card: photo, name, type, village, members, rating, since.
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users } from "lucide-react";
import { Badge, VerifiedBadge } from "@/components/site/ui";
import { getVillage } from "@/lib/mock/data";
import type { Producer } from "@/lib/types";
import { formatNumber } from "./helpers";

export function VerificationBadge({ status }: { status: Producer["verification"] }) {
  if (status === "verified") return <VerifiedBadge />;
  return <Badge tone="muted">Verification pending</Badge>;
}

export function ProducerCard({ producer, heading }: { producer: Producer; heading?: string }) {
  const village = getVillage(producer.villageSlug);
  const href = `/producers/${producer.slug}`;

  return (
    <article className="flex min-w-0 flex-col overflow-hidden brush bg-cream">
      {heading && <p className="bg-olive px-4 py-2 font-hand text-lg text-white">{heading}</p>}
      <div className="flex gap-4 p-4">
        <Link href={href} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white">
          <Image src={producer.image} alt={producer.name} fill sizes="80px" className="object-cover" />
        </Link>
        <div className="min-w-0">
          <h3 className="font-hand text-xl leading-snug text-ink">
            <Link href={href} className="hover:text-olive">
              {producer.name}
            </Link>
          </h3>
          <p className="text-xs font-bold uppercase tracking-wide text-plum">{producer.type}</p>
          {village && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden />
              <Link href={`/villages/${village.slug}`} className="truncate hover:text-orange">
                {village.name}, {village.state}
              </Link>
            </p>
          )}
          <div className="mt-2">
            <VerificationBadge status={producer.verification} />
          </div>
        </div>
      </div>
      <dl className="grid grid-cols-3 border-t border-dashed border-sage text-center text-xs">
        <div className="px-2 py-3">
          <dt className="text-muted">Members</dt>
          <dd className="mt-0.5 flex items-center justify-center gap-1 font-bold text-ink">
            <Users className="h-3.5 w-3.5 text-olive" aria-hidden />
            {formatNumber(producer.members)}
          </dd>
        </div>
        <div className="px-2 py-3">
          <dt className="text-muted">Rating</dt>
          <dd className="mt-0.5 flex items-center justify-center gap-1 font-bold text-ink">
            <Star className="h-3.5 w-3.5 fill-orange text-orange" aria-hidden />
            {producer.rating.toFixed(1)}
          </dd>
        </div>
        <div className="px-2 py-3">
          <dt className="text-muted">Since</dt>
          <dd className="mt-0.5 font-bold text-ink">{producer.since}</dd>
        </div>
      </dl>
      <Link
        href={href}
        className="mt-auto border-t border-cream-2 px-4 py-2.5 text-center text-sm font-bold text-olive hover:bg-cream-2"
      >
        View producer profile →
      </Link>
    </article>
  );
}
