"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, CircleCheck, Clock, FileText, Upload, Users } from "lucide-react";
import { Card, PageTitle } from "@/components/dashboard/widgets";
import { Badge, Button, VerifiedBadge } from "@/components/site/ui";
import { getVillage } from "@/lib/mock/data";
import { MultiFileDrop, Note, bigInputClass, useMe } from "@/components/producer/shared";

type DocKey = "pan" | "aadhaar" | "gstin" | "bank" | "registration";

const DOCS: { key: DocKey; label: string; hint: string; optional?: boolean }[] = [
  { key: "pan", label: "PAN card", hint: "Group or leader PAN" },
  { key: "aadhaar", label: "Aadhaar / DigiLocker", hint: "Link DigiLocker or upload photo" },
  { key: "gstin", label: "GSTIN", hint: "Only if you have GST", optional: true },
  { key: "bank", label: "Bank account", hint: "Passbook photo or cancelled cheque" },
  { key: "registration", label: "Business registration", hint: "SHG / FPO / Udyam certificate" },
];

const TEAM = [
  { name: "K. Lakshmi", role: "Group leader" },
  { name: "B. Saritha", role: "Accounts" },
  { name: "M. Padma", role: "Master weaver" },
];

export default function ProducerProfile() {
  const me = useMe();
  const village = me ? getVillage(me.villageSlug) : undefined;
  const [uploads, setUploads] = useState<Record<DocKey, string[]>>({
    pan: [],
    aadhaar: [],
    gstin: [],
    bank: [],
    registration: [],
  });
  const [open, setOpen] = useState<DocKey | null>(null);
  const [saved, setSaved] = useState(false);

  if (!me) return null;

  const verifiedDoc = (k: DocKey) => (k === "registration" ? me.verification === "verified" : me.kyc[k]);
  const stepIndex = me.verification === "verified" ? 2 : 1;
  const steps = ["Submitted", "Under review", "Verified"];

  return (
    <div className="space-y-5">
      <PageTitle title="Profile & KYC" subtitle="Your details help buyers trust you." />

      {/* Verification steps */}
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-hand text-2xl text-ink">Verification</h2>
          {me.verification === "verified" ? <VerifiedBadge /> : <Badge tone="orange">In progress</Badge>}
        </div>
        <ol className="flex items-start">
          {steps.map((s, i) => {
            const done = i <= stepIndex;
            return (
              <li key={s} className="relative flex flex-1 flex-col items-center text-center">
                {i > 0 && <span className={`absolute right-1/2 top-4 h-1 w-full ${done ? "bg-olive" : "bg-cream-2"}`} />}
                <span
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                    done ? "border-olive bg-olive text-white" : "border-cream-2 bg-white text-muted"
                  }`}
                >
                  {done ? <Check size={18} strokeWidth={3} /> : <Clock size={16} />}
                </span>
                <span className={`mt-1.5 text-xs font-bold ${done ? "text-ink" : "text-muted"}`}>{s}</span>
              </li>
            );
          })}
        </ol>
      </Card>

      {/* Basic details */}
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-cream">
            <Image src={me.image} alt="" fill sizes="64px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black leading-tight text-ink">{me.name}</p>
            <p className="text-sm text-muted">
              {me.type} · {me.members} members · since {me.since}
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-black text-ink">Group name</span>
            <input defaultValue={me.name} className={bigInputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-black text-ink">Phone (WhatsApp)</span>
            <input defaultValue={me.phone} inputMode="tel" className={bigInputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-black text-ink">Members</span>
            <input defaultValue={me.members} inputMode="numeric" className={bigInputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-black text-ink">Village</span>
            <input defaultValue={village ? `${village.name}, ${village.state}` : ""} className={bigInputClass} readOnly />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-black text-ink">About your work</span>
          <textarea defaultValue={me.about} rows={3} className={bigInputClass} />
        </label>
        <Button size="lg" className="w-full sm:w-auto" onClick={() => setSaved(true)}>
          {saved ? (
            <>
              <CircleCheck size={20} /> Saved
            </>
          ) : (
            "Save details"
          )}
        </Button>
      </Card>

      {/* Documents */}
      <Card>
        <h2 className="mb-1 font-hand text-2xl text-ink">Documents</h2>
        <p className="mb-4 text-sm text-muted">Tap a document to upload a photo.</p>
        <ul className="space-y-2.5">
          {DOCS.map((d) => {
            const ok = verifiedDoc(d.key);
            const uploaded = uploads[d.key].length > 0;
            const isOpen = open === d.key;
            return (
              <li key={d.key} className="rounded-xl border-2 border-cream-2">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : d.key)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 p-3 text-left"
                >
                  <span
                    className={`blob flex h-11 w-11 shrink-0 items-center justify-center ${
                      ok ? "bg-olive text-white" : uploaded ? "bg-plum/15 text-plum" : "bg-sage text-olive-dark"
                    }`}
                  >
                    {ok ? <Check size={20} strokeWidth={3} /> : <FileText size={20} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-black text-ink">
                      {d.label} {d.optional && <span className="text-xs font-normal text-muted">(optional)</span>}
                    </span>
                    <span className="block text-xs text-muted">{d.hint}</span>
                  </span>
                  {ok ? (
                    <Badge tone="olive">Verified</Badge>
                  ) : uploaded ? (
                    <Badge tone="plum">In review</Badge>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange px-3 py-1.5 text-xs font-bold text-white">
                      <Upload size={14} /> Upload
                    </span>
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-cream-2 p-3">
                    <MultiFileDrop
                      label={ok ? `Replace ${d.label}` : `Upload ${d.label}`}
                      accept="image/*,application/pdf"
                      files={uploads[d.key]}
                      onChange={(names) => setUploads((u) => ({ ...u, [d.key]: names }))}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Team */}
      <Card>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-hand text-2xl text-ink">
            <Users size={22} className="text-olive" /> Team members
          </h2>
          <Badge tone="muted">Coming in V2</Badge>
        </div>
        <ul className="divide-y divide-cream-2">
          {TEAM.map((t) => (
            <li key={t.name} className="flex items-center justify-between py-2.5">
              <span className="font-bold text-ink">{t.name}</span>
              <span className="text-sm text-muted">{t.role}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <Note tone="plum">Soon, each member can log in with their own phone number to share updates.</Note>
        </div>
      </Card>
    </div>
  );
}
