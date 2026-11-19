"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { MapPin, Star, X } from "lucide-react";
import { Badge, VerifiedBadge } from "@/components/site/ui";
import { getVillage, productsByProducer } from "@/lib/mock/data";
import type { CategorySlug, Producer } from "@/lib/types";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="font-hand text-3xl leading-none text-ink">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-ink">
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Compact producer identity: name, village, verification. */
export function ProducerLine({ producer, link = true }: { producer?: Producer; link?: boolean }) {
  if (!producer) return <span className="text-sm text-muted">Producer being confirmed</span>;
  const village = getVillage(producer.villageSlug);
  return (
    <div className="min-w-0">
      {link ? (
        <Link href={`/producers/${producer.slug}`} className="font-bold text-ink hover:text-olive">
          {producer.name}
        </Link>
      ) : (
        <span className="font-bold text-ink">{producer.name}</span>
      )}
      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <MapPin size={12} />
          {village ? `${village.name}, ${village.state}` : producer.villageSlug}
        </span>
        {producer.verification === "verified" ? <VerifiedBadge /> : <Badge tone="orange">Verification {producer.verification}</Badge>}
      </div>
    </div>
  );
}

export function ProducerCard({ producer, category }: { producer: Producer; category?: CategorySlug }) {
  const village = getVillage(producer.villageSlug);
  const items = productsByProducer(producer.slug).filter((p) => !category || p.category === category);
  const capacity = items[0];
  return (
    <div className="flex h-full flex-col rounded-xl border border-cream-2 bg-cream/40 p-4">
      <ProducerLine producer={producer} />
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-muted">Type</dt>
          <dd className="font-bold text-ink">
            {producer.type} · {producer.members} members
          </dd>
        </div>
        <div>
          <dt className="text-muted">Rating</dt>
          <dd className="inline-flex items-center gap-1 font-bold text-ink">
            <Star size={12} className="fill-orange text-orange" /> {producer.rating}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Monthly capacity</dt>
          <dd className="font-bold text-ink">
            {capacity ? `${capacity.monthlyCapacity.toLocaleString("en-IN")} ${capacity.unit}` : "On request"}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Cluster</dt>
          <dd className="font-bold text-ink">{village?.clusterName ?? "—"}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-1">
        {Object.entries(producer.kyc)
          .filter(([, ok]) => ok)
          .map(([k]) => (
            <Badge key={k} tone="sage">
              {k.toUpperCase()} checked
            </Badge>
          ))}
      </div>
      <Link href={`/producers/${producer.slug}`} className="mt-auto pt-3 text-sm font-bold text-olive hover:text-olive-dark">
        View producer profile →
      </Link>
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-3 inline-block text-sm font-bold text-olive hover:text-olive-dark">
      ← {label}
    </Link>
  );
}

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);
  useEffect(() => {
    const t = window.setTimeout(() => done.current(), 2800);
    return () => window.clearTimeout(t);
  }, [message]);
  return (
    <div role="status" className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm rounded-lg bg-plum px-4 py-3 text-center text-sm font-bold text-white shadow-lg lg:bottom-8">
      {message}
    </div>
  );
}
