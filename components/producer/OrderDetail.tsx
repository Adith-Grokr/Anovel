"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CircleCheck, ClipboardCheck, MapPin, Send, Truck } from "lucide-react";
import { Card, EmptyState, StatusPill, StatusTimeline } from "@/components/dashboard/widgets";
import { Button } from "@/components/site/ui";
import { demoActions } from "@/lib/demo-store";
import { formatINR, getProduct } from "@/lib/mock/data";
import { MultiFileDrop, Note, bigInputClass, formatDate, todayISO, useMyOrders } from "@/components/producer/shared";

export function OrderDetail({ id }: { id: string }) {
  const orders = useMyOrders();
  const order = orders.find((o) => o.id === id);
  const [files, setFiles] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [flash, setFlash] = useState("");

  if (!order) {
    return (
      <div className="space-y-4">
        <BackLink />
        <EmptyState title="Order not found" hint="This order is not assigned to you." />
      </div>
    );
  }

  const product = getProduct(order.productSlug);
  const canUpdate = order.stage === "Order placed" || order.stage === "In production";

  const sendUpdate = () => {
    const parts = [note.trim(), files.length ? `${files.length} photo${files.length > 1 ? "s" : ""} shared` : ""].filter(Boolean);
    const text = parts.join(" · ") || "Production update shared";
    if (order.stage === "Order placed") {
      demoActions.advanceOrder(order.id, `Production started — ${text}`);
      setFlash("Great! Order moved to In production.");
    } else {
      demoActions.updateOrder(order.id, {
        events: [...order.events, { stage: order.stage, date: todayISO(), note: text }],
      });
      setFlash("Update sent to ANOVEL.");
    }
    setFiles([]);
    setNote("");
  };

  const readyForQc = () => {
    demoActions.advanceOrder(order.id, "Producer marked goods ready for quality check");
    setFlash("ANOVEL will visit for quality check soon.");
  };

  return (
    <div className="space-y-5">
      <BackLink />

      <div className="flex items-start gap-3">
        {product && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream">
            <Image src={product.images[0]} alt="" fill sizes="80px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{order.id}</p>
          <h1 className="font-hand text-3xl leading-tight text-ink">{product?.name ?? order.productSlug}</h1>
        </div>
      </div>

      <Card>
        <StatusTimeline stage={order.stage} events={order.events} />
      </Card>

      {flash && (
        <div className="flex items-center gap-2 rounded-xl bg-olive px-4 py-3 font-bold text-white" role="status">
          <CircleCheck size={20} /> {flash}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs font-bold uppercase text-muted">Quantity</p>
          <p className="text-xl font-black text-ink sm:text-2xl">
            {order.quantity} <span className="text-sm">{order.unit}</span>
          </p>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase text-muted">You get</p>
          <p className="text-xl font-black text-olive sm:text-2xl">{formatINR(order.producerAmount)}</p>
          <div className="mt-1">
            <StatusPill status={order.payment} />
          </div>
        </Card>
        <Card className="col-span-2 flex items-center gap-3">
          <MapPin className="shrink-0 text-orange" />
          <div>
            <p className="text-xs font-bold uppercase text-muted">Goes to</p>
            <p className="font-black text-ink">{order.destination}</p>
            <p className="text-xs text-muted">ANOVEL picks up from your village and ships it.</p>
          </div>
        </Card>
      </div>

      {canUpdate && (
        <Card className="space-y-4">
          <h2 className="font-hand text-2xl text-ink">Upload production update</h2>
          <MultiFileDrop label="Add photos of the work" accept="image/*,video/*" files={files} onChange={setFiles} />
          <label className="block">
            <span className="mb-1.5 block text-base font-black text-ink">Short note (optional)</span>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={bigInputClass}
              placeholder="e.g. 20 of 40 sarees done"
            />
          </label>
          <Button size="lg" className="w-full" onClick={sendUpdate} disabled={!files.length && !note.trim()}>
            <Send size={20} /> {order.stage === "Order placed" ? "Start production & send" : "Send update"}
          </Button>
          {order.stage === "In production" && (
            <Button variant="orange" size="lg" className="w-full" onClick={readyForQc}>
              <ClipboardCheck size={20} /> Ready for quality check
            </Button>
          )}
        </Card>
      )}

      {order.stage === "Quality check" && (
        <Note tone="plum">ANOVEL quality team is checking your goods. Keep them packed and dry.</Note>
      )}
      {(order.stage === "Shipped" || order.stage === "Delivered") && (
        <Note>
          <span className="flex items-center gap-2">
            <Truck size={18} /> {order.stage === "Shipped" ? "Your goods are on the way to the buyer." : "Delivered to the buyer. Well done!"}
          </span>
        </Note>
      )}

      {order.qc && (
        <Card>
          <h2 className="font-hand text-2xl text-ink">Quality check</h2>
          <p className="mt-1 text-sm">
            <b className={order.qc.passed ? "text-olive" : "text-red-600"}>{order.qc.passed ? "Passed" : "Not passed"}</b> ·{" "}
            {formatDate(order.qc.date)} · {order.qc.inspector}
          </p>
          <p className="mt-1 text-sm text-muted">{order.qc.notes}</p>
        </Card>
      )}

      <Card>
        <h2 className="mb-3 font-hand text-2xl text-ink">History</h2>
        <ol className="space-y-3 border-l-2 border-sage pl-4">
          {[...order.events].reverse().map((e, i) => (
            <li key={`${e.date}-${i}`} className="relative">
              <span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-olive" />
              <p className="text-sm font-black text-ink">
                {e.stage} <span className="font-normal text-muted">· {formatDate(e.date)}</span>
              </p>
              <p className="text-sm text-muted">{e.note}</p>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/producer/orders" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-olive">
      <ArrowLeft size={18} /> All orders
    </Link>
  );
}
