"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/dashboard/widgets";
import { Button, Field, inputClass } from "@/components/site/ui";
import { demoActions } from "@/lib/demo-store";
import { ORDER_STAGES, type Order } from "@/lib/types";

export const CARRIERS = ["Maersk", "CMA CGM", "MSC", "Hapag-Lloyd", "DHL Express", "FedEx", "Blue Dart", "Delhivery"];

/** Moves an order to its next stage. Shipping requires carrier + tracking number. */
export function AdvanceOrder({ order }: { order: Order }) {
  const idx = ORDER_STAGES.indexOf(order.stage);
  const next = ORDER_STAGES[idx + 1];
  const [note, setNote] = useState("");
  const [carrier, setCarrier] = useState(order.carrier ?? CARRIERS[0]);
  const [tracking, setTracking] = useState(order.trackingNo ?? "");

  if (!next) {
    return (
      <Card>
        <p className="font-bold text-olive">Delivered. This order is complete.</p>
      </Card>
    );
  }

  const shipping = next === "Shipped";
  const qcBlocked = shipping && !order.qc?.passed;
  const canSubmit = !qcBlocked && (!shipping || tracking.trim().length > 0);

  const submit = () => {
    const finalNote = note.trim() || (shipping ? `Dispatched via ${carrier}, tracking ${tracking.trim()}` : `Moved to ${next}`);
    demoActions.advanceOrder(order.id, finalNote, shipping ? { carrier, trackingNo: tracking.trim() } : {});
    setNote("");
  };

  return (
    <Card>
      <p className="mb-3 font-bold text-ink">
        Advance to <span className="text-orange">{next}</span>
      </p>
      {qcBlocked && (
        <p className="mb-3 rounded-lg bg-orange/10 p-3 text-sm text-ink">
          A passed QC report is needed before shipping.{" "}
          <Link href="/admin/quality" className="font-bold text-olive underline">
            Record QC
          </Link>
        </p>
      )}
      <div className="space-y-3">
        {shipping && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Carrier">
              <select className={inputClass} value={carrier} onChange={(e) => setCarrier(e.target.value)}>
                {CARRIERS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Tracking / container no.">
              <input className={inputClass} value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. MSKU4410023" />
            </Field>
          </div>
        )}
        <Field label="Note (shared with buyer and producer)">
          <textarea className={inputClass} rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What happened at this stage?" />
        </Field>
        <Button onClick={submit} disabled={!canSubmit}>
          Advance to {next} <ArrowRight size={14} />
        </Button>
      </div>
    </Card>
  );
}
