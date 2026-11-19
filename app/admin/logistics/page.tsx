"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, PackageCheck, Ship, Truck } from "lucide-react";
import { Card, EmptyState, PageTitle, StatusPill } from "@/components/dashboard/widgets";
import { Button, Field, inputClass } from "@/components/site/ui";
import { FilterTabs } from "@/components/admin/ui";
import { CARRIERS } from "@/components/admin/AdvanceOrder";
import { formatNumber, isReadyToShip } from "@/components/admin/helpers";
import { demoActions, useDemo } from "@/lib/demo-store";
import { getBuyer, getProduct } from "@/lib/mock/data";
import type { Order } from "@/lib/types";

const MODES = ["Sea", "Air", "Courier", "Road"] as const;
type Mode = (typeof MODES)[number];

function guessMode(o: Order): Mode {
  const c = o.carrier ?? "";
  if (/maersk|cma|msc|hapag/i.test(c)) return "Sea";
  if (/dhl|fedex/i.test(c)) return "Courier";
  if (/blue dart|delhivery/i.test(c)) return "Road";
  if (o.unit === "kg" && o.quantity >= 1000) return "Sea";
  return o.amount < 100000 ? "Courier" : "Air";
}

type Tab = "ready" | "transit" | "delivered";

export default function AdminLogisticsPage() {
  const { orders } = useDemo();
  const [tab, setTab] = useState<Tab>("transit");
  const [modes, setModes] = useState<Record<string, Mode>>({});

  const ready = orders.filter(isReadyToShip);
  const transit = orders.filter((o) => o.stage === "Shipped");
  const delivered = orders.filter((o) => o.stage === "Delivered");
  const list = { ready, transit, delivered }[tab];
  const modeOf = (o: Order) => modes[o.id] ?? guessMode(o);
  const setMode = (id: string, m: Mode) => setModes((s) => ({ ...s, [id]: m }));

  return (
    <>
      <PageTitle title="Logistics" subtitle="Dispatch, track and confirm delivery for every shipment." />
      <FilterTabs<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: "ready", label: "Ready to ship", count: ready.length },
          { value: "transit", label: "In transit", count: transit.length },
          { value: "delivered", label: "Delivered", count: delivered.length },
        ]}
      />

      {list.length === 0 ? (
        <EmptyState
          title="No shipments here"
          hint={tab === "ready" ? "Orders appear here once they pass QC." : undefined}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((o) =>
            tab === "ready" ? (
              <DispatchCard key={o.id} order={o} mode={modeOf(o)} onMode={(m) => setMode(o.id, m)} />
            ) : (
              <ShipmentCard key={o.id} order={o} mode={modeOf(o)} onMode={(m) => setMode(o.id, m)} />
            ),
          )}
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        Shipping mode is recorded locally in this demo. Carrier and tracking number are saved on the order and shown to the buyer.
      </p>
    </>
  );
}

function ModePicker({ mode, onMode }: { mode: Mode; onMode: (m: Mode) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onMode(m)}
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${mode === m ? "bg-plum text-white" : "bg-cream text-ink"}`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

function Header({ order: o }: { order: Order }) {
  const buyer = getBuyer(o.buyerId);
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/admin/orders/${o.id}`} className="text-xs font-bold text-olive">
          {o.id}
        </Link>
        <StatusPill status={o.payment} />
      </div>
      <p className="font-black text-ink">{getProduct(o.productSlug)?.name}</p>
      <p className="text-xs text-muted">
        {formatNumber(o.quantity)} {o.unit} · {buyer?.flag} {buyer?.company}
      </p>
      <p className="mt-1 flex items-center gap-1 text-sm text-ink">
        <MapPin size={14} className="shrink-0 text-orange" /> {o.destination}
      </p>
    </div>
  );
}

function ShipmentCard({ order: o, mode, onMode }: { order: Order; mode: Mode; onMode: (m: Mode) => void }) {
  const shippedOn = o.events.find((e) => e.stage === "Shipped")?.date;
  const deliveredOn = o.events.find((e) => e.stage === "Delivered")?.date;
  return (
    <Card>
      <Header order={o} />
      <div className="mt-3 space-y-1 rounded-lg bg-cream p-3 text-sm">
        <p className="flex items-center gap-2 text-ink">
          <Ship size={14} className="shrink-0 text-olive" /> {o.carrier ?? "Carrier not set"}
        </p>
        <p className="break-all text-ink">
          Tracking: <b>{o.trackingNo ?? "n/a"}</b>
        </p>
        <p className="text-xs text-muted">
          Shipped {shippedOn ?? "n/a"}
          {deliveredOn ? ` · delivered ${deliveredOn}` : ""}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <ModePicker mode={mode} onMode={onMode} />
        {o.stage === "Shipped" && (
          <Button size="sm" onClick={() => demoActions.advanceOrder(o.id, `Delivered to ${o.destination}`)}>
            <PackageCheck size={14} /> Mark delivered
          </Button>
        )}
      </div>
    </Card>
  );
}

function DispatchCard({ order: o, mode, onMode }: { order: Order; mode: Mode; onMode: (m: Mode) => void }) {
  const [carrier, setCarrier] = useState(CARRIERS[0]);
  const [tracking, setTracking] = useState("");
  return (
    <Card>
      <Header order={o} />
      <div className="mt-3 space-y-3">
        <ModePicker mode={mode} onMode={onMode} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Carrier">
            <select className={inputClass} value={carrier} onChange={(e) => setCarrier(e.target.value)}>
              {CARRIERS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Tracking no.">
            <input className={inputClass} value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="AWB / container" />
          </Field>
        </div>
        <Button
          size="sm"
          variant="orange"
          disabled={!tracking.trim()}
          onClick={() =>
            demoActions.advanceOrder(o.id, `Dispatched by ${mode.toLowerCase()} via ${carrier}, tracking ${tracking.trim()}`, {
              carrier,
              trackingNo: tracking.trim(),
            })
          }
        >
          <Truck size={14} /> Mark shipped
        </Button>
      </div>
    </Card>
  );
}
