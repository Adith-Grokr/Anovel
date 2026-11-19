// Mauve band of plum hand-drawn category icons. Hover turns an icon white and reveals its name.
import Link from "next/link";
import { CategoryIcon } from "@/components/site/HandIcons";
import { categories } from "@/lib/mock/data";

export function CategoryBand() {
  return (
    <section className="bg-mauve" aria-label="Browse by category">
      <ul className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-6 sm:px-10 md:justify-between md:gap-0 md:px-[60px] md:py-8">
        {categories.map((c) => (
          <li key={c.slug} className="shrink-0">
            <Link
              href={`/products?category=${c.slug}`}
              className="group flex w-[84px] flex-col items-center gap-1.5 text-plum transition-colors hover:text-white focus-visible:text-white md:w-[100px]"
            >
              <CategoryIcon slug={c.slug} size={44} />
              <span className="text-center text-[11px] font-bold leading-tight md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                {c.short}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
