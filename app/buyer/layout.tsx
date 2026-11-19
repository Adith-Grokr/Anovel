import type { Metadata } from "next";
import { BuyerShell } from "@/components/buyer/BuyerShell";

export const metadata: Metadata = {
  title: "Buyer workspace — ANOVEL",
  description: "Track requirements, compare quotations and follow your orders from Indian villages to your warehouse.",
};

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return <BuyerShell>{children}</BuyerShell>;
}
