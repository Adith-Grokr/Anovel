"use client";

// Groundy-style hero: full-width photo slides, centred handwritten headline + small plum CTA,
// thin chevrons, ring dots bottom-centre and an olive tab bottom-right.
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlaneIcon } from "@/components/site/HandIcons";

interface Slide {
  image: string;
  alt: string;
  headline: string;
}

const slides: Slide[] = [
  {
    image: "/images/hero-weaver.jpg",
    alt: "A handloom weaver at work in a village workshop",
    headline: "Discover authentic products from India's villages!",
  },
  {
    image: "/images/hero-chilli.jpg",
    alt: "Red chillies drying in the sun in Guntur",
    headline: "Source spices straight from the farm, in bulk!",
  },
  {
    image: "/images/turmeric-farmers.jpg",
    alt: "Farmers harvesting turmeric in Vasmat",
    headline: "Verified producers, quality-checked before shipping!",
  },
];

const INTERVAL_MS = 6000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  return (
    <section
      className="relative h-[300px] w-full overflow-hidden bg-ink sm:h-[380px] md:h-[clamp(420px,34vw,620px)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured"
    >
      {slides.map((s, i) => (
        <div
          key={s.image}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-hidden={i !== index}
        >
          <Image
            src={s.image}
            alt={s.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center">
            <h1 className="font-hand text-[28px] leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] sm:text-4xl md:text-[44px]">
              {s.headline}
            </h1>
            <Link
              href="/post-requirement"
              tabIndex={i === index ? 0 : -1}
              className="brush mt-4 bg-plum px-4 py-1.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-plum-dark"
            >
              Request a quote!
            </Link>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-white/90 hover:text-white md:left-5"
      >
        <ChevronLeft size={34} strokeWidth={1.25} />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/90 hover:text-white md:right-5"
      >
        <ChevronRight size={34} strokeWidth={1.25} />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.image}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-3 w-3 rounded-full border-2 border-white transition-colors ${i === index ? "bg-orange" : "bg-transparent hover:bg-white/50"}`}
          />
        ))}
      </div>

      <Link
        href="/post-requirement"
        className="absolute bottom-3 right-0 flex items-center gap-2 bg-olive/95 py-2 pl-3 pr-3 text-white transition-colors hover:bg-olive-dark md:bottom-8 md:gap-3 md:py-3 md:pl-4 md:pr-6"
        style={{ borderRadius: "10px 0 0 12px / 14px 0 0 8px" }}
      >
        <PlaneIcon size={30} className="shrink-0 md:h-9 md:w-9" />
        <span className="text-[11px] font-bold leading-tight md:text-[13px]">
          Post a<br />requirement
        </span>
      </Link>
    </section>
  );
}
