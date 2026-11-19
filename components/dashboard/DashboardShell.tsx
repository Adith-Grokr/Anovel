"use client";

// Shared shell for Producer / Buyer / Admin dashboards.
// Desktop: left sidebar. Mobile: top bar + bottom tab bar (first 5 items) + "More" sheet.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, MessageCircle, MoreHorizontal, X, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/site/Logo";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardShell({
  role,
  userName,
  userSub,
  nav,
  children,
}: {
  role: "Producer" | "Buyer" | "Admin";
  userName: string;
  userSub: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const root = nav[0].href;
  const isActive = (href: string) => (href === root ? pathname === href : pathname === href || pathname.startsWith(href + "/"));

  const primary = nav.slice(0, 4);
  const rest = nav.slice(4);

  return (
    <div className="min-h-screen bg-cream/60">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-plum text-white lg:flex">
        <div className="px-5 py-5">
          <Logo size="sm" />
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/60">{role} workspace</p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition-colors ${
                  active ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} className={active ? "text-orange" : ""} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/15 p-4">
          <p className="text-sm font-bold">{userName}</p>
          <p className="text-xs text-white/60">{userSub}</p>
          <Link href="/" className="mt-3 inline-flex items-center gap-2 text-xs text-white/70 hover:text-orange">
            <LogOut size={14} /> Back to website
          </Link>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-plum px-4 py-3 text-white lg:hidden">
        <Logo size="sm" />
        <div className="text-right">
          <p className="text-sm font-bold leading-tight">{userName}</p>
          <p className="text-[11px] text-white/60">{role}</p>
        </div>
      </header>

      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:pb-12 lg:pt-8">{children}</main>
      </div>

      {/* WhatsApp help */}
      <a
        href="https://wa.me/919010325138"
        className="fixed bottom-20 right-4 z-30 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg lg:bottom-6"
        aria-label="WhatsApp ANOVEL support"
      >
        <MessageCircle size={18} /> <span className="hidden sm:inline">Help on WhatsApp</span>
      </a>

      {/* Bottom tabs (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-cream-2 bg-white lg:hidden">
        {primary.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold ${active ? "text-orange" : "text-ink/70"}`}
            >
              <Icon size={22} />
              <span className="truncate max-w-[72px]">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex flex-col items-center gap-0.5 py-2 text-[10px] font-bold text-ink/70"
        >
          <MoreHorizontal size={22} /> More
        </button>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-hand text-2xl">More</span>
              <button onClick={() => setMoreOpen(false)} aria-label="Close"><X /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {rest.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex flex-col items-center gap-1 rounded-lg bg-cream p-3 text-xs font-bold text-ink"
                  >
                    <Icon size={22} className="text-olive" />
                    {item.label}
                  </Link>
                );
              })}
              <Link href="/" className="flex flex-col items-center gap-1 rounded-lg bg-cream p-3 text-xs font-bold text-ink">
                <LogOut size={22} className="text-olive" /> Website
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
