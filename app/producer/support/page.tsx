"use client";

import { useState } from "react";
import { CircleCheck, MessageCircle, Phone } from "lucide-react";
import { Card, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { Button } from "@/components/site/ui";
import { demoActions, useDemo } from "@/lib/demo-store";
import { getProduct } from "@/lib/mock/data";
import { CALL_URL, WHATSAPP_URL, bigInputClass, formatDate, useMyOrders } from "@/components/producer/shared";

const FAQ = [
  { q: "When do I get paid?", a: "ANOVEL pays to your bank account after the quality check is passed, usually in 3 days." },
  { q: "Who talks to the buyer?", a: "ANOVEL talks to the buyer for you. You only make the goods and send updates." },
  { q: "Who packs and ships?", a: "ANOVEL picks up from your village, checks quality, packs and ships to the buyer." },
  { q: "I can't type. What do I do?", a: "Send a voice note or photos on WhatsApp. Our team will fill the form for you." },
  { q: "How do I get the verified badge?", a: "Upload PAN, Aadhaar and bank details in Profile & KYC. Our team visits and verifies." },
];

export default function ProducerSupport() {
  const orders = useMyOrders();
  const { complaints } = useDemo();
  const myComplaints = complaints.filter((c) => c.raisedBy === "producer" && orders.some((o) => o.id === c.orderId));

  const [orderId, setOrderId] = useState("");
  const [subject, setSubject] = useState("");
  const [sent, setSent] = useState(false);

  const selectedOrder = orderId || orders[0]?.id || "";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !subject.trim()) return;
    demoActions.addComplaint({ orderId: selectedOrder, raisedBy: "producer", subject: subject.trim() });
    setSubject("");
    setSent(true);
  };

  return (
    <div className="space-y-5">
      <PageTitle title="Help" subtitle="We are here for you, in Telugu, Hindi and English." />

      <div className="grid grid-cols-2 gap-3">
        <a
          href={WHATSAPP_URL}
          className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl bg-[#25D366] p-4 text-center text-white shadow-sm active:brightness-95"
        >
          <MessageCircle size={36} />
          <span className="text-lg font-black">WhatsApp</span>
        </a>
        <a
          href={CALL_URL}
          className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl bg-plum p-4 text-center text-white shadow-sm active:bg-plum-dark"
        >
          <Phone size={36} />
          <span className="text-lg font-black">Call us</span>
        </a>
      </div>
      <p className="text-center text-xs text-muted">Mon – Sat, 9 am to 7 pm</p>

      <Card>
        <h2 className="mb-2 font-hand text-2xl text-ink">Common questions</h2>
        <div className="divide-y divide-cream-2">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 font-bold text-ink">
                {f.q}
                <span className="text-xl text-olive transition group-open:rotate-45">+</span>
              </summary>
              <p className="pb-3 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 font-hand text-2xl text-ink">Raise a complaint</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-muted">You have no orders yet. Use WhatsApp for any other problem.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-base font-black text-ink">Which order?</span>
              <select
                value={selectedOrder}
                onChange={(e) => setOrderId(e.target.value)}
                className={bigInputClass}
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} — {getProduct(o.productSlug)?.name ?? o.productSlug}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-base font-black text-ink">What is the problem?</span>
              <textarea
                rows={3}
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setSent(false);
                }}
                className={bigInputClass}
                placeholder="e.g. Yarn delivery is late"
              />
            </label>
            <Button type="submit" variant="orange" size="lg" className="w-full" disabled={!subject.trim()}>
              Send complaint
            </Button>
            {sent && (
              <p className="flex items-center gap-2 rounded-xl bg-olive px-4 py-3 text-sm font-bold text-white" role="status">
                <CircleCheck size={18} /> Sent. ANOVEL will call you within 24 hours.
              </p>
            )}
          </form>
        )}
      </Card>

      {myComplaints.length > 0 && (
        <Card>
          <h2 className="mb-2 font-hand text-2xl text-ink">My complaints</h2>
          <ul className="divide-y divide-cream-2">
            {myComplaints.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">{c.subject}</p>
                  <p className="text-xs text-muted">
                    {c.id} · {c.orderId} · {formatDate(c.date)}
                  </p>
                </div>
                <StatusPill status={c.status} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
