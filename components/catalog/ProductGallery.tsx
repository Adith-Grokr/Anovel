"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden brush bg-cream-2">
        <Image
          key={current}
          src={current}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Product photos">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              onClick={() => setActive(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden brush border-2 transition-opacity sm:h-20 sm:w-24 ${
                i === active ? "border-orange" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
