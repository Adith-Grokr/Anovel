"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { FileDrop } from "@/components/dashboard/widgets";
import { Button, Field, inputClass } from "@/components/site/ui";
import { todayISO } from "@/components/admin/helpers";
import { demoActions } from "@/lib/demo-store";
import type { Order, Product } from "@/lib/types";

const AGRI = new Set(["spices", "grains", "organic"]);

type Check = "ok" | "issue" | "";

/** Pre-shipment QC checklist. Pass records `qc` on the order and leaves it ready to ship. */
export function QcForm({ order, product }: { order: Order; product?: Product }) {
  const isAgri = product ? AGRI.has(product.category) : false;
  const items = [
    { key: "quantity", label: `Quantity count (${order.quantity} ${order.unit})` },
    { key: "dimensions", label: isAgri ? "Weight per bag / moisture" : "Dimensions / weight" },
    { key: "colour", label: "Colour / shade match vs approved sample" },
    { key: "packaging", label: "Packaging & labelling" },
    ...(isAgri ? [{ key: "lab", label: "Lab report (aflatoxin, pesticide, moisture)" }] : []),
  ];
  const [checks, setChecks] = useState<Record<string, Check>>({});
  const [defects, setDefects] = useState("0");
  const [inspector, setInspector] = useState("");
  const [notes, setNotes] = useState("");

  const allChecked = items.every((i) => checks[i.key]);
  const ready = allChecked && inspector.trim().length > 0;
  const defectPct = Number(defects) || 0;

  const record = (passed: boolean) => {
    const summary = items.map((i) => `${i.label.split(" (")[0]}: ${checks[i.key] === "ok" ? "OK" : "issue"}`).join("; ");
    demoActions.updateOrder(order.id, {
      qc: {
        passed,
        inspector: inspector.trim(),
        date: todayISO(),
        notes: `${notes.trim() ? notes.trim() + " · " : ""}Defects ${defectPct}% · ${summary}`,
      },
    });
  };

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-ink">Checklist</legend>
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.key} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-cream/70 px-3 py-2">
              <span className="min-w-0 flex-1 text-sm text-ink">{i.label}</span>
              <span className="flex gap-1">
                {(["ok", "issue"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setChecks((c) => ({ ...c, [i.key]: v }))}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      checks[i.key] === v ? (v === "ok" ? "bg-olive text-white" : "bg-red-600 text-white") : "bg-white text-ink ring-1 ring-cream-2"
                    }`}
                  >
                    {v === "ok" ? "OK" : "Issue"}
                  </button>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Defects %" hint="Above 2% usually fails the lot">
          <input type="number" min={0} max={100} step={0.1} className={inputClass} value={defects} onChange={(e) => setDefects(e.target.value)} />
        </Field>
        <Field label="Inspector name">
          <input className={inputClass} value={inspector} onChange={(e) => setInspector(e.target.value)} placeholder="e.g. Priya R." />
        </Field>
      </div>
      <Field label="Notes">
        <textarea className={inputClass} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observations, batch numbers, rework needed…" />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <FileDrop label="Add inspection photos" accept="image/*" />
        {isAgri && <FileDrop label="Attach lab report (PDF)" accept="application/pdf" />}
      </div>

      {!ready && <p className="text-xs text-muted">Mark every checklist item and add the inspector name to record the result.</p>}
      <div className="flex flex-wrap gap-2">
        <Button disabled={!ready} onClick={() => record(true)}>
          <CheckCircle2 size={15} /> Pass
        </Button>
        <Button disabled={!ready} variant="outline" className="!border-red-600 !text-red-700 hover:!bg-red-600 hover:!text-white" onClick={() => record(false)}>
          <XCircle size={15} /> Fail
        </Button>
      </div>
    </div>
  );
}
