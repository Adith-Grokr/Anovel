"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, UserRound, X } from "lucide-react";
import { Logo } from "./Logo";
import { CategoryIcon } from "./HandIcons";
import { categories } from "@/lib/mock/data";

const nav = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/products", label: "Products", mega: true },
  { href: "/villages", label: "Our villages" },
  { href: "/stories", label: "Stories" },
];

export function Header() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="relative z-30 bg-cream">
      <div className="gutter flex items-center justify-between gap-4 py-3">
        <Logo size="sm" />

        <nav className="hidden md:flex items-center gap-7 text-[13px] font-bold uppercase tracking-wide">
          {nav.map((item) =>
            item.mega ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <Link
                  href={item.href}
                  className={`py-2 transition-colors ${isActive(item.href) || megaOpen ? "text-orange" : "text-ink hover:text-orange"}`}
                  aria-expanded={megaOpen}
                >
                  {item.label}
                </Link>
                {megaOpen && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                    <div className="flex gap-1 bg-plum px-3 py-3 shadow-xl">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/products?category=${c.slug}`}
                          className="group flex w-[78px] flex-col items-center gap-1.5 rounded px-1 py-1 text-[11px] font-bold uppercase text-white/90 hover:text-orange"
                          onClick={() => setMegaOpen(false)}
                        >
                          <span className="whitespace-nowrap">{c.short}</span>
                          <CategoryIcon slug={c.slug} size={30} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`py-2 transition-colors ${isActive(item.href) ? "text-orange" : "text-ink hover:text-orange"}`}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link href="/products" aria-label="Search products" className="text-ink hover:text-orange">
            <Search size={17} strokeWidth={2.6} />
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/post-requirement"
            className="hidden lg:inline-block brush bg-olive px-3 py-1.5 text-xs font-bold text-white hover:bg-olive-dark"
          >
            Post a requirement
          </Link>
          <Link
            href="/login"
            aria-label="Log in or join"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink hover:text-orange"
          >
            <UserRound size={22} />
            <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-orange ring-2 ring-cream" />
          </Link>
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center text-ink"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-cream-2 bg-cream px-4 pb-5">
          <nav className="flex flex-col py-2 text-sm font-bold uppercase">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`py-3 border-b border-cream-2 ${isActive(item.href) ? "text-orange" : "text-ink"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-4 gap-2 bg-plum p-3 text-white">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase"
              >
                <CategoryIcon slug={c.slug} size={28} />
                {c.short}
              </Link>
            ))}
          </div>
          <Link
            href="/post-requirement"
            onClick={() => setMobileOpen(false)}
            className="mt-4 block brush bg-olive py-3 text-center text-sm font-bold text-white"
          >
            Post a requirement
          </Link>
        </div>
      )}
    </header>
  );
}
