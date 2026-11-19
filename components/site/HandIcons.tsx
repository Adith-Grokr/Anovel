// Hand-drawn line icons in the Groundy style: thick rounded strokes, slightly wobbly lines.
import type { SVGProps } from "react";
import type { CategorySlug } from "@/lib/types";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 48, props: P) => ({
  width: size,
  height: size,
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const SeedlingIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M32 50c.4-8 .2-15-.4-22" />
    <path d="M31.6 30c-2-7-9-11.5-19-11 .6 8.6 7.8 13.6 19 11z" />
    <path d="M32 26c2.6-8 10-12.5 20-11.6-.8 9-8.6 14-20 11.6z" />
    <path d="M38 22.5c-2.4 1.6-4.4 3-6 3.8M20 22c3 2.2 7 5 11 7.4" />
    <ellipse cx="32" cy="54" rx="7" ry="4.2" />
    <path d="M27.5 54c2.6-1 6.4-1 9 0" />
  </svg>
);

export const SackIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M24 14c2.6 2 13.6 2 16.2-.2" />
    <path d="M25 17c-7 6-12 14-12 23 0 9 8 12.6 19 12.6s19-3.6 19-12.6c0-9-5-17-12-23" />
    <path d="M24 14l-3-5.4M40.2 13.8l3-5.2" />
    <path d="M26 34l5 5 9-10" />
    <path d="M44 22c4-3 9-3 12 0-3 3.6-8 4-12 0z" />
  </svg>
);

export const BoxIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M10 22l22-10 22 10-22 10z" />
    <path d="M10 22v21l22 11V32" />
    <path d="M54 22v21L32 54" />
    <path d="M21 17l22 10v8" />
  </svg>
);

export const TruckIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M18 18h26v24H18z" />
    <path d="M44 26h8l6 8v8h-14" />
    <circle cx="25" cy="45" r="4.4" />
    <circle cx="50" cy="45" r="4.4" />
    <path d="M4 22h9M2 29h11M6 36h7" />
    <path d="M47 29h6" />
  </svg>
);

export const PlaneIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6 30L58 10 46 54 32 38z" />
    <path d="M58 10L32 38v14l7-8" />
  </svg>
);

export const SpoolIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M18 10h28M18 54h28" />
    <path d="M20 10c0 4 2 5 2 5h20s2-1 2-5M20 54c0-4 2-5 2-5h20s2 1 2 5" />
    <path d="M22 15v34M42 15v34" />
    <path d="M22 20l20 6M22 28l20 6M22 36l20 6M22 44l12 3.5" />
    <path d="M42 30c6 2 10 8 14 16" />
  </svg>
);

export const TopToyIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M32 6v10" />
    <path d="M24 16h16" />
    <path d="M14 30c0-8 8-14 18-14s18 6 18 14c0 6-8 14-18 26C22 44 14 36 14 30z" />
    <path d="M15 30h34M18 38h28" />
  </svg>
);

export const ChilliIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M44 16c-2 14-10 30-34 38 4-6 6-10 10-14 8-8 12-14 16-22" />
    <path d="M36 18c2-3 6-4 8-2 3 2 3 6 0 8" />
    <path d="M44 16c2-4 6-7 10-8" />
  </svg>
);

export const WheatIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M32 58V14" />
    <path d="M32 14c-3-3-3-7 0-10 3 3 3 7 0 10z" />
    {[22, 31, 40].map((y) => (
      <g key={y}>
        <path d={`M32 ${y}c-4 0-8-3-9-7 4 0 8 3 9 7z`} />
        <path d={`M32 ${y}c4 0 8-3 9-7-4 0-8 3-9 7z`} />
      </g>
    ))}
    <path d="M22 18l-4-6M42 18l4-6" />
  </svg>
);

export const EggplantIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M40 22c8 6 10 18 4 26-7 9-22 10-30 4-6-5-4-12 4-16 6-3 10-6 12-12 2-4 6-4 10-2z" />
    <path d="M36 20c2-3 6-4 10-2 2 2 1 6-2 8" />
    <path d="M44 18c2-4 5-7 9-9" />
    <path d="M20 44c4 2 10 1 14-3" />
  </svg>
);

export const PotIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M24 8h16M26 8c0 4-2 6-2 8h16c0-2-2-4-2-8" />
    <path d="M24 16c-10 4-14 12-14 20 0 12 10 20 22 20s22-8 22-20c0-8-4-16-14-20" />
    <path d="M13 30c6 3 32 3 38 0M12 40c6 3 34 3 40 0" />
    <path d="M22 35l3 3 3-3 3 3 3-3 3 3 3-3 3 3" />
  </svg>
);

export const BasketIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M18 26c0-10 6-16 14-16s14 6 14 16" />
    <path d="M8 26h48l-6 26H14z" />
    <path d="M10 34h44M12 43h40" />
    <path d="M22 26l2 26M32 26v26M42 26l-2 26" />
  </svg>
);

export const JuteLeafIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M18 18h22l4 34H14z" />
    <path d="M18 18c0-6 4-10 11-10s11 4 11 10" />
    <path d="M22 28c4 2 12 2 16 0M20 38c6 2 14 2 20 0" />
    <path d="M44 30c4-6 10-8 16-6-2 6-8 10-16 6z" />
    <path d="M44 30l8-3" />
  </svg>
);

export const ShieldCheckIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M32 6l20 8v14c0 14-9 24-20 30C21 52 12 42 12 28V14z" />
    <path d="M23 31l7 7 12-14" />
  </svg>
);

export const HandshakeIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 26l10-8 10 4 8-4 8 2 8-2 12 8" />
    <path d="M14 18l-4 18 10 10M50 18l4 18-14 14" />
    <path d="M24 22l-6 8c2 2 6 2 8 0l6-6 14 14" />
    <path d="M26 46l4 4M32 42l5 5M38 38l4 4" />
  </svg>
);

export const QuoteIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M14 8h28l10 10v38H14z" />
    <path d="M42 8v10h10" />
    <path d="M22 26h20M22 34h20M22 42h12" />
    <circle cx="44" cy="46" r="6" />
    <path d="M44 43v6M42 46h4" />
  </svg>
);

export const categoryIcons: Record<CategorySlug, (p: P) => React.JSX.Element> = {
  handloom: SpoolIcon,
  handicrafts: TopToyIcon,
  spices: ChilliIcon,
  grains: WheatIcon,
  organic: EggplantIcon,
  "home-decor": PotIcon,
  "jute-eco": JuteLeafIcon,
};

export function CategoryIcon({ slug, ...p }: P & { slug: CategorySlug }) {
  const Icon = categoryIcons[slug];
  return <Icon {...p} />;
}
