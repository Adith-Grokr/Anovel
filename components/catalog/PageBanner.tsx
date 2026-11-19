// Groundy-style page banner: cream strip with a handwritten title, optional photo on the right.
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-muted ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />}
            {c.href ? (
              <Link href={c.href} className="hover:text-orange">
                {c.label}
              </Link>
            ) : (
              <span className="truncate font-bold text-ink">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageBanner({
  title,
  subtitle,
  crumbs,
  image,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  crumbs?: Crumb[];
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="relative z-10 px-4 py-8 sm:px-8 sm:py-10 md:max-w-[62%]">
        {crumbs && <Breadcrumbs items={crumbs} className="mb-3" />}
        <h1 className="font-hand text-4xl leading-tight text-olive sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/80">{subtitle}</p>}
      </div>
      {image && (
        <div className="absolute inset-y-0 right-0 hidden w-[40%] md:block">
          <Image src={image} alt="" fill sizes="480px" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/40 to-transparent" />
        </div>
      )}
    </section>
  );
}
