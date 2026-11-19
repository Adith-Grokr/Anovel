"use client";

// Tiny client-side store for the clickable demo. State lives in localStorage so an action
// in one dashboard (e.g. admin sends a quote) appears in another (buyer sees it).
// Phase 2 replaces this with Supabase.
import { useSyncExternalStore } from "react";
import {
  orders as seedOrders,
  producers as seedProducers,
  quotations as seedQuotations,
  requirements as seedRequirements,
  complaints as seedComplaints,
} from "@/lib/mock/data";
import type { Complaint, Order, Producer, Quotation, Requirement } from "@/lib/types";

export interface DemoState {
  requirements: Requirement[];
  quotations: Quotation[];
  orders: Order[];
  producers: Producer[];
  complaints: Complaint[];
}

const KEY = "anovel-demo-v1";
const seed = (): DemoState => ({
  requirements: seedRequirements,
  quotations: seedQuotations,
  orders: seedOrders,
  producers: seedProducers,
  complaints: seedComplaints,
});

let state: DemoState = seed();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...seed(), ...JSON.parse(raw) };
  } catch {
    /* storage unavailable — use seed data */
  }
}

function emit() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function setDemoState(updater: (s: DemoState) => DemoState) {
  load();
  state = updater(state);
  emit();
}

export function resetDemo() {
  state = seed();
  emit();
}

const serverSnapshot = seed();

/** React hook: `const { orders } = useDemo();` */
export function useDemo(): DemoState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => {
      load();
      return state;
    },
    () => serverSnapshot,
  );
}

// ---- Actions used across dashboards ----
const today = () => new Date().toISOString().slice(0, 10);

export const demoActions = {
  addRequirement(r: Omit<Requirement, "id" | "status" | "createdAt" | "matchedProducerSlugs">) {
    setDemoState((s) => ({
      ...s,
      requirements: [
        { ...r, id: `REQ-${1047 + s.requirements.length - 5}`, status: "new", createdAt: today(), matchedProducerSlugs: [] },
        ...s.requirements,
      ],
    }));
  },
  matchProducers(reqId: string, slugs: string[]) {
    setDemoState((s) => ({
      ...s,
      requirements: s.requirements.map((r) =>
        r.id === reqId ? { ...r, matchedProducerSlugs: slugs, status: slugs.length ? "matching" : r.status } : r,
      ),
    }));
  },
  sendQuotation(q: Omit<Quotation, "id" | "status">) {
    setDemoState((s) => ({
      ...s,
      quotations: [{ ...q, id: `QT-${310 + s.quotations.length}`, status: "sent" }, ...s.quotations],
      requirements: s.requirements.map((r) => (r.id === q.requirementId ? { ...r, status: "quoted" } : r)),
    }));
  },
  acceptQuotation(qId: string, buyerId: string, destination: string, unit: string) {
    setDemoState((s) => {
      const q = s.quotations.find((x) => x.id === qId);
      if (!q) return s;
      const order: Order = {
        id: `ORD-${2205 + s.orders.length - 5}`,
        quotationId: q.id,
        buyerId,
        producerSlug: q.producerSlug,
        productSlug: q.productSlug,
        quantity: q.quantity,
        unit,
        amount: q.buyerPrice * q.quantity,
        producerAmount: q.producerPrice * q.quantity,
        stage: "Order placed",
        events: [{ stage: "Order placed", date: today(), note: "Quotation accepted by buyer" }],
        payment: "pending",
        destination,
        createdAt: today(),
      };
      return {
        ...s,
        quotations: s.quotations.map((x) =>
          x.id === qId ? { ...x, status: "accepted" } : x.requirementId === q.requirementId && x.status === "sent" ? { ...x, status: "rejected" } : x,
        ),
        requirements: s.requirements.map((r) => (r.id === q.requirementId ? { ...r, status: "closed" } : r)),
        orders: [order, ...s.orders],
      };
    });
  },
  advanceOrder(orderId: string, note: string, extra: Partial<Order> = {}) {
    const stages = ["Order placed", "In production", "Quality check", "Shipped", "Delivered"] as const;
    setDemoState((s) => ({
      ...s,
      orders: s.orders.map((o) => {
        if (o.id !== orderId) return o;
        const i = stages.indexOf(o.stage);
        if (i >= stages.length - 1) return { ...o, ...extra };
        const next = stages[i + 1];
        return { ...o, ...extra, stage: next, events: [...o.events, { stage: next, date: today(), note }] };
      }),
    }));
  },
  updateOrder(orderId: string, patch: Partial<Order>) {
    setDemoState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === orderId ? { ...o, ...patch } : o)) }));
  },
  setVerification(slug: string, verification: Producer["verification"]) {
    setDemoState((s) => ({ ...s, producers: s.producers.map((p) => (p.slug === slug ? { ...p, verification } : p)) }));
  },
  addComplaint(c: Omit<Complaint, "id" | "status" | "date">) {
    setDemoState((s) => ({
      ...s,
      complaints: [{ ...c, id: `CMP-${13 + s.complaints.length - 2}`, status: "open", date: today() }, ...s.complaints],
    }));
  },
  resolveComplaint(id: string) {
    setDemoState((s) => ({ ...s, complaints: s.complaints.map((c) => (c.id === id ? { ...c, status: "resolved" } : c)) }));
  },
};
