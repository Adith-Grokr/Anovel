// Small pure helpers shared by the admin pages.
import type { Order, Producer } from "@/lib/types";

/** Days from today until an ISO date (negative when in the past). */
export function daysUntil(iso: string): number {
  const now = new Date();
  const start = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((new Date(iso).getTime() - start) / 86_400_000);
}

export function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const commission = (o: Order) => o.amount - o.producerAmount;

export const isInternational = (destination: string) => !/india/i.test(destination);

/** "Ready to ship": QC passed but the order has not been dispatched yet. */
export const isReadyToShip = (o: Order) => o.stage === "Quality check" && o.qc?.passed === true;

export function findProducer(list: Producer[], slug: string) {
  return list.find((p) => p.slug === slug);
}

export const formatNumber = (n: number) => new Intl.NumberFormat("en-IN").format(n);

// ---- CSV export ----
type Cell = string | number | boolean | undefined | null;

function escapeCell(v: Cell): string {
  const s = v === undefined || v === null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCSV(headers: string[], rows: Cell[][]): string {
  return [headers, ...rows].map((r) => r.map(escapeCell).join(",")).join("\n");
}

export function downloadCSV(filename: string, headers: string[], rows: Cell[][]) {
  const blob = new Blob(["﻿" + toCSV(headers, rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
