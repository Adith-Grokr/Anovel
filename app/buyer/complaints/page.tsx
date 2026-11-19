"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Send } from "lucide-react";
import { Card, EmptyState, FileDrop, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { Button, Field, inputClass } from "@/components/site/ui";
import { fmtDate, useBuyerData } from "@/components/buyer/buyer-data";
import { demoActions } from "@/lib/demo-store";
import { getProduct } from "@/lib/mock/data";

const ISSUE_TYPES = ["Quality issue", "Damaged in transit", "Short quantity", "Delay", "Documentation", "Other"] as const;

function ComplaintForm() {
  const params = useSearchParams();
  const { orders } = useBuyerData();
  const preselect = params.get("order") ?? "";
  const [orderId, setOrderId] = useState(preselect);
  const [type, setType] = useState<string>(ISSUE_TYPES[0]);
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);

  const selected = orderId || orders[0]?.id || "";

  if (orders.length === 0) {
    return <p className="text-sm text-muted">You can raise an issue once you have an order.</p>;
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !details.trim()) return;
    demoActions.addComplaint({ orderId: selected, raisedBy: "buyer", subject: `${type}: ${details.trim()}` });
    setDetails("");
    setDone(true);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {done && (
        <p role="status" className="rounded-lg bg-sage/40 p-3 text-sm text-ink">
          Issue logged. Your ANOVEL account manager will respond within 24 hours.
        </p>
      )}
      <Field label="Order">
        <select className={inputClass} value={selected} onChange={(e) => setOrderId(e.target.value)}>
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              {o.id} — {getProduct(o.productSlug)?.name ?? o.productSlug}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Issue type">
        <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
          {ISSUE_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field label="What happened?">
        <textarea
          className={inputClass}
          rows={4}
          required
          value={details}
          onChange={(e) => {
            setDetails(e.target.value);
            setDone(false);
          }}
          placeholder="e.g. 2 rolls have a colour shade difference from the approved swatch"
        />
      </Field>
      <FileDrop label="Add photos (optional)" accept="image/*" />
      <Button type="submit" variant="orange" className="w-full sm:w-auto">
        <Send size={16} /> Submit issue
      </Button>
    </form>
  );
}

function ComplaintList() {
  const { complaints, orders } = useBuyerData();
  if (complaints.length === 0) {
    return <EmptyState title="No issues raised" hint="We hope it stays that way!" />;
  }
  return (
    <ul className="space-y-3">
      {complaints.map((c) => {
        const order = orders.find((o) => o.id === c.orderId);
        return (
          <li key={c.id}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-xs font-bold text-muted">
                  {c.id} · {fmtDate(c.date)} · raised by {c.raisedBy === "buyer" ? "you" : "producer"}
                </p>
                <StatusPill status={c.status} />
              </div>
              <p className="mt-1 font-bold text-ink">{c.subject}</p>
              <Link href={`/buyer/orders/${c.orderId}`} className="text-xs font-bold text-olive">
                {c.orderId}
                {order ? ` — ${getProduct(order.productSlug)?.name ?? ""}` : ""} →
              </Link>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

export default function BuyerComplaintsPage() {
  return (
    <>
      <PageTitle title="Complaints & issues" subtitle="ANOVEL stands between you and the producer — we resolve it, not you." />
      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="mb-3 font-hand text-2xl text-ink">Your issues</h2>
          <ComplaintList />
        </section>
        <section className="lg:col-span-2">
          <Card>
            <h2 className="mb-3 font-hand text-2xl text-ink">Raise a new issue</h2>
            <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
              <ComplaintForm />
            </Suspense>
          </Card>
        </section>
      </div>
    </>
  );
}
