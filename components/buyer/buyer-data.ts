"use client";

import { useMemo } from "react";
import { setDemoState, useDemo, type DemoState } from "@/lib/demo-store";
import { DEMO_BUYER_ID } from "@/lib/mock/data";
import { createLocalStore } from "./local-store";

/** Everything the demo buyer is allowed to see. Producer price / margin are never rendered. */
export function useBuyerData() {
  const demo = useDemo();
  return useMemo(() => {
    const requirements = demo.requirements.filter((r) => r.buyerId === DEMO_BUYER_ID);
    const reqIds = new Set(requirements.map((r) => r.id));
    const quotations = demo.quotations.filter((q) => reqIds.has(q.requirementId) && q.status !== "draft");
    const orders = demo.orders.filter((o) => o.buyerId === DEMO_BUYER_ID);
    const orderIds = new Set(orders.map((o) => o.id));
    const complaints = demo.complaints.filter((c) => orderIds.has(c.orderId));
    return { requirements, quotations, orders, complaints, producers: demo.producers };
  }, [demo]);
}

/** Synchronously read the latest shared demo state (e.g. right after an action). */
export function readDemoState(): DemoState {
  let snapshot: DemoState | undefined;
  setDemoState((s) => {
    snapshot = s;
    return s;
  });
  return snapshot as DemoState;
}

export function declineQuotation(qId: string) {
  setDemoState((s) => ({
    ...s,
    quotations: s.quotations.map((q) => (q.id === qId ? { ...q, status: "rejected" } : q)),
  }));
}

export function fmtDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(d);
}

// ---- Samples (buyer-local demo state) ----
export const SAMPLE_STAGES = ["Requested", "Dispatched", "Received", "Approved"] as const;
export type SampleStage = (typeof SAMPLE_STAGES)[number];

export interface SampleRequest {
  id: string;
  quotationId?: string;
  productSlug: string;
  producerSlug: string;
  qty: string;
  requestedOn: string;
  stage: SampleStage;
  courier?: string;
  trackingNo?: string;
  note?: string;
}

const seedSamples: SampleRequest[] = [
  {
    id: "SMP-501",
    quotationId: "QT-301",
    productSlug: "ikat-cotton-running-fabric",
    producerSlug: "ramesh-ikat-works",
    qty: "2 swatches (indigo, rust) · 1 m each",
    requestedOn: "2026-10-16",
    stage: "Received",
    courier: "DHL Express",
    trackingNo: "DHL 4471 2290 18",
    note: "Arrived in Hamburg 24 Oct. Please approve or share feedback.",
  },
  {
    id: "SMP-498",
    productSlug: "sambalpuri-ikat-dupatta",
    producerSlug: "sri-lakshmi-weavers",
    qty: "3 pieces",
    requestedOn: "2026-09-20",
    stage: "Approved",
    courier: "FedEx International",
    trackingNo: "FX 7781 0042 551",
    note: "Approved — colour fastness good.",
  },
  {
    id: "SMP-503",
    productSlug: "channapatna-stacking-toy",
    producerSlug: "channapatna-toys-coop",
    qty: "2 sets",
    requestedOn: "2026-10-27",
    stage: "Dispatched",
    courier: "DHL Express",
    trackingNo: "DHL 4471 3315 02",
  },
];

export const sampleStore = createLocalStore<SampleRequest[]>("anovel-buyer-samples", seedSamples);

export function requestSample(input: Omit<SampleRequest, "id" | "requestedOn" | "stage">) {
  sampleStore.set((prev) => [
    { ...input, id: `SMP-${504 + prev.length - 3}`, requestedOn: new Date().toISOString().slice(0, 10), stage: "Requested" },
    ...prev,
  ]);
}

export function advanceSample(id: string) {
  sampleStore.set((prev) =>
    prev.map((s) => {
      if (s.id !== id) return s;
      const i = SAMPLE_STAGES.indexOf(s.stage);
      return i < SAMPLE_STAGES.length - 1 ? { ...s, stage: SAMPLE_STAGES[i + 1] } : s;
    }),
  );
}

// ---- Saved products (buyer-local demo state) ----
export const savedStore = createLocalStore<string[]>("anovel-buyer-saved", [
  "pochampally-double-ikat-silk-saree",
  "channapatna-stacking-toy",
  "bamboo-storage-baskets",
  "kerala-green-cardamom",
]);
