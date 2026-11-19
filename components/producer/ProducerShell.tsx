"use client";

import { ClipboardList, House, Inbox, LifeBuoy, MapPin, Package, ShieldCheck, Wallet } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";

const nav: NavItem[] = [
  { href: "/producer", label: "Home", icon: House },
  { href: "/producer/products", label: "Products", icon: Package },
  { href: "/producer/orders", label: "Orders", icon: ClipboardList },
  { href: "/producer/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/producer/payments", label: "Payments", icon: Wallet },
  { href: "/producer/profile", label: "Profile & KYC", icon: ShieldCheck },
  { href: "/producer/village", label: "Village", icon: MapPin },
  { href: "/producer/support", label: "Support", icon: LifeBuoy },
];

export function ProducerShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="Producer" userName="Sri Lakshmi Weavers" userSub="SHG · Pochampally, Telangana" nav={nav}>
      {children}
    </DashboardShell>
  );
}
