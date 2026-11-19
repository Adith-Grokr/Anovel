"use client";

import { Check } from "lucide-react";
import { Card, EmptyState, PageTitle } from "@/components/dashboard/widgets";
import { Badge, Button } from "@/components/site/ui";
import { SAMPLE_STAGES, advanceSample, fmtDate, sampleStore } from "@/components/buyer/buyer-data";
import { ProducerLine } from "@/components/buyer/ui";
import { getProduct } from "@/lib/mock/data";
import { useDemo } from "@/lib/demo-store";

function SampleStepper({ stage }: { stage: (typeof SAMPLE_STAGES)[number] }) {
  const current = SAMPLE_STAGES.indexOf(stage);
  return (
    <ol className="flex w-full items-start">
      {SAMPLE_STAGES.map((s, i) => {
        const done = i <= current;
        return (
          <li key={s} className="relative flex flex-1 flex-col items-center text-center">
            {i > 0 && <span className={`absolute right-1/2 top-3 h-0.5 w-full ${done ? "bg-olive" : "bg-cream-2"}`} />}
            <span
              className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-black ${
                done ? "border-olive bg-olive text-white" : "border-cream-2 bg-white text-muted"
              }`}
            >
              {done ? <Check size={12} strokeWidth={3} /> : i + 1}
            </span>
            <span className={`mt-1 text-[10px] font-bold sm:text-xs ${done ? "text-ink" : "text-muted"}`}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function BuyerSamplesPage() {
  const samples = sampleStore.use();
  const { producers } = useDemo();

  return (
    <>
      <PageTitle
        title="Samples"
        subtitle="Check quality in your hands before committing to bulk. Samples ship by express courier."
      />

      {samples.length === 0 ? (
        <EmptyState title="No sample requests" hint="Request a sample from any quotation marked 'Sample available'." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {samples.map((s) => {
            const product = getProduct(s.productSlug);
            return (
              <Card key={s.id} className="flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted">
                      {s.id}
                      {s.quotationId ? ` · for ${s.quotationId}` : ""} · requested {fmtDate(s.requestedOn)}
                    </p>
                    <p className="font-bold text-ink">{product?.name ?? s.productSlug}</p>
                  </div>
                  <Badge tone={s.stage === "Approved" ? "olive" : s.stage === "Received" ? "orange" : "plum"}>{s.stage}</Badge>
                </div>
                <div className="mt-2">
                  <ProducerLine producer={producers.find((p) => p.slug === s.producerSlug)} />
                </div>
                <p className="mt-2 text-sm text-ink">Quantity: {s.qty}</p>
                {s.courier && (
                  <p className="text-xs text-muted">
                    {s.courier} · <span className="font-mono">{s.trackingNo}</span>
                  </p>
                )}
                {s.note && <p className="mt-2 rounded-lg bg-cream/60 p-2 text-xs text-ink">{s.note}</p>}
                <div className="mt-4">
                  <SampleStepper stage={s.stage} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.stage === "Received" && (
                    <Button size="sm" onClick={() => advanceSample(s.id)}>
                      <Check size={14} /> Approve sample
                    </Button>
                  )}
                  {s.stage === "Dispatched" && (
                    <Button size="sm" variant="outline" onClick={() => advanceSample(s.id)}>
                      Mark as received
                    </Button>
                  )}
                  {s.stage === "Requested" && <p className="text-xs text-muted">ANOVEL is arranging dispatch from the village.</p>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <p className="mt-6 text-xs text-muted">
        Sample cost and courier charges are adjusted against your first bulk order.
      </p>
    </>
  );
}
