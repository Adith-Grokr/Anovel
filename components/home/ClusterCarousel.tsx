"use client";

// Groundy "subscription cards" carousel, reused for village clusters. A snap-scroll track that works
// with touch on mobile and with the outside arrows / dots on desktop.
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ClusterCard {
  slug: string;
  name: string;
  craft: string;
  image: string;
  href: string;
  price: string; // formatted, e.g. "₹450"
  unit: string;
}

/** Cream wave laid over the top of the photo, giving the curved edge from the reference. */
function Wave() {
  return (
    <svg
      viewBox="0 0 300 40"
      preserveAspectRatio="none"
      aria-hidden
      className="absolute inset-x-0 top-0 z-10 h-7 w-full text-cream"
    >
      <path d="M0 0h300v14C240 40 190 6 140 18S50 36 0 16z" fill="currentColor" />
    </svg>
  );
}

function Card({ card }: { card: ClusterCard }) {
  return (
    <Link
      href={card.href}
      className="group relative block h-[320px] overflow-hidden bg-cream"
      aria-label={`${card.name} ${card.craft}, from ${card.price} per ${card.unit}. Request quote`}
    >
      <div className="relative z-0 px-5 pt-4 text-center">
        <h3 className="font-hand text-[22px] leading-[1.05] text-ink">
          {card.name}
          <br />
          <span className="uppercase">{card.craft}</span>
        </h3>
        <div className="mx-auto mt-2 h-px w-4/5 bg-ink/30" />
        <p className="mt-2 flex items-baseline justify-center gap-1 text-ink transition-opacity duration-300 md:group-hover:opacity-0">
          <span className="text-[11px] font-bold">from</span>
          <span className="font-hand text-[38px] leading-none">{card.price}</span>
          <span className="text-[11px] font-bold">/ {card.unit}</span>
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[56%] transition-[height] duration-300 ease-out md:group-hover:h-[76%]">
        <Wave />
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(min-width: 768px) 360px, 80vw"
          className="object-cover transition-transform duration-500 md:group-hover:scale-105"
        />
        <span className="brush absolute left-1/2 top-[58%] z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-plum px-4 py-1.5 text-xs font-bold text-white opacity-0 shadow-md transition-opacity duration-300 md:group-hover:opacity-100">
          Request quote
        </span>
      </div>
    </Link>
  );
}

export function ClusterCarousel({ cards }: { cards: ClusterCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [positions, setPositions] = useState(1);

  const measure = useCallback(() => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    const visible = Math.max(1, Math.round((el.clientWidth + 1) / step));
    setPositions(Math.max(1, cards.length - visible + 1));
    setActive(Math.round(el.scrollLeft / step));
  }, [cards.length]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    const target = Math.min(Math.max(i, 0), positions - 1);
    el.scrollTo({ left: target * step, behavior: "smooth" });
  };

  return (
    <div className="mt-7">
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollTo(active - 1)}
          disabled={active === 0}
          aria-label="Previous clusters"
          className="absolute -left-9 top-1/2 hidden -translate-y-1/2 p-1 text-ink transition-opacity disabled:opacity-25 sm:block"
        >
          <ChevronLeft size={30} strokeWidth={1.5} />
        </button>

        <div
          ref={trackRef}
          onScroll={measure}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto"
        >
          {cards.map((c) => (
            <div key={c.slug} className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/3)]">
              <Card card={c} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollTo(active + 1)}
          disabled={active >= positions - 1}
          aria-label="Next clusters"
          className="absolute -right-9 top-1/2 hidden -translate-y-1/2 p-1 text-ink transition-opacity disabled:opacity-25 sm:block"
        >
          <ChevronRight size={30} strokeWidth={1.5} />
        </button>
      </div>

      {positions > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: positions }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Show clusters from ${i + 1}`}
              aria-current={i === active}
              className={`h-2.5 w-2.5 rounded-full border border-ink/60 transition-colors ${i === active ? "bg-ink/70" : "bg-transparent"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
