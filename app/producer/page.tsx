"use client";

import Link from "next/link";
import {
  CircleHelp,
  ClipboardList,
  Gauge,
  Inbox,
  Package,
  PackagePlus,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { BigTile, Card, StatusTimeline } from "@/components/dashboard/widgets";
import { VerifiedBadge } from "@/components/site/ui";
import { useDemo } from "@/lib/demo-store";
import { DEMO_PRODUCER_SLUG, getProduct, productsByProducer } from "@/lib/mock/data";
import { useMe, useMyOrders } from "@/components/producer/shared";

export default function ProducerHome() {
  const me = useMe();
  const orders = useMyOrders();
  const { requirements } = useDemo();

  const newEnquiries = requirements.filter(
    (r) => r.matchedProducerSlugs.includes(DEMO_PRODUCER_SLUG) && r.status !== "closed",
  ).length;
  const active = orders.filter((o) => o.stage !== "Delivered");

  // Capacity: total monthly capacity of my products vs units booked on active orders.
  const myProducts = productsByProducer(DEMO_PRODUCER_SLUG);
  const capacity = myProducts.reduce((sum, p) => sum + p.monthlyCapacity, 0);
  const used = active
    .filter((o) => o.stage === "Order placed" || o.stage === "In production")
    .reduce((sum, o) => sum + o.quantity, 0);
  const usedPct = capacity ? Math.min(100, Math.round((used / capacity) * 100)) : 0;

  const tiles: { href: string; icon: LucideIcon; label: string; hint?: string; badge?: number }[] = [
    { href: "/producer/products/new", icon: PackagePlus, label: "Add product", hint: "Photo + price" },
    { href: "/producer/products", icon: Package, label: "My products", hint: `${myProducts.length} items` },
    { href: "/producer/enquiries", icon: Inbox, label: "New enquiries", badge: newEnquiries },
    { href: "/producer/orders", icon: ClipboardList, label: "Orders", badge: active.length },
    { href: "/producer/payments", icon: Wallet, label: "Payments" },
    { href: "/producer/products", icon: Gauge, label: "Update capacity", hint: "Stock & monthly" },
    { href: "/producer/profile", icon: ShieldCheck, label: "Profile & KYC" },
    { href: "/producer/support", icon: CircleHelp, label: "Help" },
  ];

  const verified = me?.verification === "verified";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-hand text-4xl leading-tight text-ink">Namaste, Sri Lakshmi Weavers 🙏</h1>
        <p className="mt-1 text-sm text-muted">What do you want to do today?</p>
      </div>

      <div
        className={`flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 ${
          verified ? "bg-sage/60 text-olive-dark" : me?.verification === "rejected" ? "bg-red-100 text-red-700" : "bg-orange/15 text-ink"
        }`}
      >
        <ShieldCheck size={28} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-base font-black">
            {verified ? "You are verified" : me?.verification === "rejected" ? "Verification needs attention" : "Verification under review"}
          </p>
          <p className="text-xs">
            {verified ? "Buyers see the ANOVEL verified badge on your products." : "ANOVEL team is checking your documents."}
          </p>
        </div>
        {verified ? (
          <VerifiedBadge />
        ) : (
          <Link href="/producer/profile" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-olive">
            Check
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="block">
            <BigTile icon={t.icon} label={t.label} hint={t.hint} badge={t.badge} />
          </Link>
        ))}
      </div>

      <section>
        <h2 className="mb-3 font-hand text-3xl text-ink">Orders in progress</h2>
        {active.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">No orders right now. New orders will appear here.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {active.map((o) => (
              <Link key={o.id} href={`/producer/orders/${o.id}`} className="block">
                <Card className="transition hover:border-olive">
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-black text-ink">{getProduct(o.productSlug)?.name ?? o.productSlug}</p>
                    <p className="text-sm text-muted">
                      {o.quantity} {o.unit} · {o.id}
                    </p>
                  </div>
                  <StatusTimeline stage={o.stage} events={o.events} />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-hand text-3xl text-ink">Your capacity this month</h2>
        <Card>
          <div className="flex items-end justify-between gap-2">
            <p className="text-sm text-muted">
              <span className="text-2xl font-black text-ink">{used}</span> of {capacity} pieces booked
            </p>
            <p className="text-sm font-bold text-olive">{capacity - used} free</p>
          </div>
          <div
            className="mt-3 h-5 w-full overflow-hidden rounded-full bg-cream"
            role="progressbar"
            aria-valuenow={usedPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Capacity used"
          >
            <div className={`h-full rounded-full ${usedPct > 85 ? "bg-orange" : "bg-olive"}`} style={{ width: `${usedPct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs font-bold">
            <span className="text-olive">Used {usedPct}%</span>
            <Link href="/producer/products" className="text-orange underline">
              Change capacity
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
