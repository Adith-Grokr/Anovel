// Small shared UI primitives in the Groundy style. Reuse these on every page.
import Link from "next/link";
import type { ComponentProps } from "react";

/** Handwritten section heading with the cream brush swash behind it (as in Groundy). */
export function SectionHeading({
  title,
  subtitle,
  className = "",
  align = "center",
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <h2 className="heading-swash font-hand text-3xl sm:text-[34px] leading-tight text-ink">{title}</h2>
      {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
    </div>
  );
}

type BtnVariant = "olive" | "plum" | "orange" | "outline" | "ghost";
const variants: Record<BtnVariant, string> = {
  olive: "bg-olive text-white hover:bg-olive-dark",
  plum: "bg-plum text-white hover:bg-plum-dark",
  orange: "bg-orange text-white hover:brightness-95",
  outline: "border-2 border-olive text-olive hover:bg-olive hover:text-white",
  ghost: "text-olive hover:bg-cream",
};
const sizes = { sm: "px-3 py-1 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };

export function btnClass(variant: BtnVariant = "olive", size: keyof typeof sizes = "md") {
  return `inline-flex items-center justify-center gap-2 brush font-bold transition-colors disabled:opacity-50 ${variants[variant]} ${sizes[size]}`;
}

export function Button({
  variant = "olive",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: BtnVariant; size?: keyof typeof sizes }) {
  return <button className={`${btnClass(variant, size)} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "olive",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: BtnVariant; size?: keyof typeof sizes }) {
  return <Link className={`${btnClass(variant, size)} ${className}`} {...props} />;
}

export function Badge({
  children,
  tone = "olive",
}: {
  children: React.ReactNode;
  tone?: "olive" | "orange" | "plum" | "sage" | "muted";
}) {
  const tones = {
    olive: "bg-olive/10 text-olive",
    orange: "bg-orange/10 text-orange",
    plum: "bg-plum/10 text-plum",
    sage: "bg-sage text-olive-dark",
    muted: "bg-mauve/60 text-ink",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <Badge tone="olive">
      <svg width="12" height="12" viewBox="0 0 20 20" aria-hidden>
        <path d="M10 1l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V4z" fill="currentColor" />
        <path d="M6.5 10l2.5 2.5L13.5 8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      ANOVEL verified
    </Badge>
  );
}

export const inputClass =
  "w-full rounded-md border border-cream-2 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
