"use client";

import {
  CircleAlert,
  CircleUser,
  ClipboardList,
  FileText,
  FlaskConical,
  Heart,
  LayoutDashboard,
  Package,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";
import { DEMO_BUYER_ID, getBuyer } from "@/lib/mock/data";

const nav: NavItem[] = [
  { href: "/buyer", label: "Overview", icon: LayoutDashboard },
  { href: "/buyer/requirements", label: "Requirements", icon: ClipboardList },
  { href: "/buyer/quotations", label: "Quotations", icon: FileText },
  { href: "/buyer/orders", label: "Orders", icon: Package },
  { href: "/buyer/samples", label: "Samples", icon: FlaskConical },
  { href: "/buyer/saved", label: "Saved producers", icon: Heart },
  { href: "/buyer/complaints", label: "Complaints", icon: CircleAlert },
  { href: "/buyer/account", label: "Account", icon: CircleUser },
];

export function BuyerShell({ children }: { children: React.ReactNode }) {
  const buyer = getBuyer(DEMO_BUYER_ID);
  return (
    <DashboardShell
      role="Buyer"
      userName={buyer?.contactName ?? "Buyer"}
      userSub={buyer ? `${buyer.company} · ${buyer.country}` : ""}
      nav={nav}
    >
      {children}
    </DashboardShell>
  );
}
