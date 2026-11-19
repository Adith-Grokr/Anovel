"use client";

import {
  BarChart3,
  Boxes,
  Building2,
  ClipboardCheck,
  FileText,
  Inbox,
  LayoutDashboard,
  MessageSquareWarning,
  Package,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";

const nav: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/requirements", label: "Requirements", icon: Inbox },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/producers", label: "Producers", icon: Users },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/quotations", label: "Quotations", icon: FileText },
  { href: "/admin/quality", label: "Quality", icon: ClipboardCheck },
  { href: "/admin/logistics", label: "Logistics", icon: Truck },
  { href: "/admin/payments", label: "Payments", icon: Wallet },
  { href: "/admin/buyers", label: "Buyers", icon: Building2 },
  { href: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="Admin" userName="Priya Reddy" userSub="Operations lead, ANOVEL" nav={nav}>
      {children}
    </DashboardShell>
  );
}
