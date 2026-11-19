"use client";

import { useCallback, useState } from "react";
import { Mail, MessageCircle, Plus, Save, Users } from "lucide-react";
import { Card, PageTitle } from "@/components/dashboard/widgets";
import { Badge, Button, Field, inputClass } from "@/components/site/ui";
import { CURRENCIES, FX_RATES, currencyStore, type Currency } from "@/components/buyer/money";
import { Toast } from "@/components/buyer/ui";
import { DEMO_BUYER_ID, getBuyer } from "@/lib/mock/data";
import type { Buyer } from "@/lib/types";

const COUNTRIES = ["Germany", "UAE", "USA", "UK", "Singapore", "Canada", "Australia", "India", "Other"];
const BUYER_TYPES: Buyer["type"][] = ["Importer", "Wholesaler", "Retailer", "Fashion brand", "Designer", "Distributor"];
const CURRENCY_LABEL: Record<Currency, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  AED: "UAE Dirham",
};

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-olive" : "bg-cream-2"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export default function BuyerAccountPage() {
  const buyer = getBuyer(DEMO_BUYER_ID);
  const currency = currencyStore.use();
  const [profile, setProfile] = useState({
    company: buyer?.company ?? "",
    type: buyer?.type ?? "Importer",
    contactName: buyer?.contactName ?? "",
    email: buyer?.email ?? "",
    phone: "+49 40 5555 0123",
    country: buyer?.country ?? "Germany",
    address: "Speicherstadt 12, 20457 Hamburg",
    vat: "DE 312 456 789",
    gstin: "",
  });
  const [notify, setNotify] = useState({ email: true, whatsapp: true, quotations: true, orders: true, newsletter: false });
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const set = (k: keyof typeof profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setProfile((p) => ({ ...p, [k]: e.target.value }));

  const team = [
    { name: profile.contactName, email: profile.email, role: "Owner" },
    { name: "Jonas Becker", email: "jonas@hanse-textil.de", role: "Purchasing" },
  ];

  return (
    <>
      <PageTitle title="Account" subtitle="Your company profile and how ANOVEL keeps you posted." />

      <form
        className="grid gap-6 lg:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          setToast("Profile saved (demo).");
        }}
      >
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="mb-4 font-hand text-2xl text-ink">Company profile</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name">
                <input className={inputClass} value={profile.company} onChange={set("company")} />
              </Field>
              <Field label="Business type">
                <select className={inputClass} value={profile.type} onChange={set("type")}>
                  {BUYER_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Country">
                <select className={inputClass} value={profile.country} onChange={set("country")}>
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              {profile.country === "India" ? (
                <Field label="GSTIN (optional)" hint="Needed for GST invoices on domestic orders.">
                  <input className={inputClass} value={profile.gstin} onChange={set("gstin")} placeholder="22AAAAA0000A1Z5" />
                </Field>
              ) : (
                <Field label="VAT / Tax ID (optional)">
                  <input className={inputClass} value={profile.vat} onChange={set("vat")} />
                </Field>
              )}
              <div className="sm:col-span-2">
                <Field label="Delivery address">
                  <input className={inputClass} value={profile.address} onChange={set("address")} />
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-hand text-2xl text-ink">Primary contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input className={inputClass} value={profile.contactName} onChange={set("contactName")} />
              </Field>
              <Field label="Email">
                <input type="email" className={inputClass} value={profile.email} onChange={set("email")} />
              </Field>
              <Field label="Phone / WhatsApp">
                <input type="tel" className={inputClass} value={profile.phone} onChange={set("phone")} />
              </Field>
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="inline-flex items-center gap-2 font-hand text-2xl text-ink">
                <Users size={20} className="text-olive" /> Team members
              </h2>
              <Badge tone="plum">Coming in V2</Badge>
            </div>
            <ul className="divide-y divide-cream-2">
              {team.map((m) => (
                <li key={m.email} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">{m.name}</p>
                    <p className="break-all text-xs text-muted">{m.email}</p>
                  </div>
                  <Badge tone="muted">{m.role}</Badge>
                </li>
              ))}
            </ul>
            <Button type="button" size="sm" variant="outline" className="mt-3" disabled>
              <Plus size={14} /> Invite colleague
            </Button>
            <p className="mt-2 text-xs text-muted">Multi-user accounts with roles and approvals arrive in V2.</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 font-hand text-2xl text-ink">Notifications</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-bold text-ink">
                  <Mail size={16} className="text-olive" /> Email
                </span>
                <Toggle label="Email notifications" checked={notify.email} onChange={(v) => setNotify((n) => ({ ...n, email: v }))} />
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-bold text-ink">
                  <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp
                </span>
                <Toggle label="WhatsApp notifications" checked={notify.whatsapp} onChange={(v) => setNotify((n) => ({ ...n, whatsapp: v }))} />
              </li>
              <li className="border-t border-cream-2 pt-3 text-xs font-bold uppercase tracking-wide text-muted">Notify me about</li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-ink">New quotations</span>
                <Toggle label="New quotations" checked={notify.quotations} onChange={(v) => setNotify((n) => ({ ...n, quotations: v }))} />
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-ink">Order &amp; QC updates</span>
                <Toggle label="Order updates" checked={notify.orders} onChange={(v) => setNotify((n) => ({ ...n, orders: v }))} />
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-ink">Village stories newsletter</span>
                <Toggle label="Newsletter" checked={notify.newsletter} onChange={(v) => setNotify((n) => ({ ...n, newsletter: v }))} />
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="mb-2 font-hand text-2xl text-ink">Currency</h2>
            <p className="mb-3 text-xs text-muted">
              ANOVEL quotes and invoices in INR. We show an approximate conversion next to every amount.
            </p>
            <Field label="Show conversions in">
              <select
                className={inputClass}
                value={currency}
                onChange={(e) => currencyStore.set(() => e.target.value as Currency)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c} — {CURRENCY_LABEL[c]} (₹{FX_RATES[c]})
                  </option>
                ))}
              </select>
            </Field>
          </Card>

          <Button type="submit" className="w-full">
            <Save size={16} /> Save changes
          </Button>
        </div>
      </form>

      {toast && <Toast message={toast} onDone={clearToast} />}
    </>
  );
}
