import type { Metadata } from "next";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ButtonLink, SectionHeading } from "@/components/site/ui";
import {
  BoxIcon,
  HandshakeIcon,
  PlaneIcon,
  QuoteIcon,
  SackIcon,
  SeedlingIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@/components/site/HandIcons";

export const metadata: Metadata = {
  title: "How it works — ANOVEL",
  description: "How buyers and village producers work with ANOVEL, step by step.",
};

type HandIcon = (p: { size?: number; className?: string }) => React.JSX.Element;
type Step = { Icon: HandIcon; title: string; text: string };

const buyerSteps: Step[] = [
  { Icon: SeedlingIcon, title: "Search", text: "Browse verified products, villages and producers." },
  { Icon: QuoteIcon, title: "Post requirement", text: "Tell us product, quantity, price and destination." },
  { Icon: HandshakeIcon, title: "Get matched", text: "ANOVEL matches you with verified producers within 48h." },
  { Icon: QuoteIcon, title: "Quotation", text: "Compare clear quotes with price, MOQ and lead time." },
  { Icon: SackIcon, title: "Sample", text: "Approve a sample before committing to bulk." },
  { Icon: ShieldCheckIcon, title: "Order & pay", text: "Confirm the order and pay securely through ANOVEL." },
  { Icon: BoxIcon, title: "Quality check", text: "Our team checks goods before they leave the village." },
  { Icon: PlaneIcon, title: "Delivery & tracking", text: "Export docs, freight and live tracking to your door." },
  { Icon: SeedlingIcon, title: "Feedback & reorder", text: "Rate the order and reorder in one click." },
];

const producerSteps: Step[] = [
  { Icon: SeedlingIcon, title: "Register", text: "Sign up with your mobile number. It is free." },
  { Icon: ShieldCheckIcon, title: "Verify", text: "Share ID and business papers. We help you." },
  { Icon: SackIcon, title: "List products & capacity", text: "Add photos, prices and how much you can make." },
  { Icon: QuoteIcon, title: "Receive enquiries", text: "Buyers from India and abroad send requests." },
  { Icon: HandshakeIcon, title: "Accept order", text: "Agree on price and date. ANOVEL confirms it." },
  { Icon: BoxIcon, title: "Produce & upload updates", text: "Share photos as the work moves along." },
  { Icon: ShieldCheckIcon, title: "Quality check", text: "Our team checks the goods with you." },
  { Icon: TruckIcon, title: "Get paid", text: "Money comes straight to your bank account." },
];

const middle: { Icon: HandIcon; title: string; text: string }[] = [
  { Icon: ShieldCheckIcon, title: "Verify", text: "ID, business documents and site visits." },
  { Icon: SeedlingIcon, title: "Organise", text: "Clusters, SHGs and FPOs grouped for bulk supply." },
  { Icon: HandshakeIcon, title: "Match", text: "The right producers for every requirement." },
  { Icon: BoxIcon, title: "Quality-check", text: "Pre-shipment checks against agreed specs." },
  { Icon: TruckIcon, title: "Logistics", text: "Packing, export documents and freight." },
  { Icon: SackIcon, title: "Payments", text: "Secure payments, released on milestones." },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "How does ANOVEL verify producers?",
    a: "Every producer shares ID and business documents (PAN, Aadhaar via DigiLocker, GSTIN where available, bank details). Our field team visits the village or cluster, checks capacity and photographs the work before a producer gets the “ANOVEL verified” badge.",
  },
  {
    q: "Who does the quality checks?",
    a: "ANOVEL’s quality team inspects goods against the approved sample and agreed specification before dispatch. You receive a photo and checklist report; third-party inspection can be arranged on request.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We handle export packing, documentation and freight to the USA, UAE, UK, Singapore, Canada, Australia, Germany and more, by sea or air, with tracking all the way.",
  },
  {
    q: "How do payments work?",
    a: "Buyers pay ANOVEL securely (bank transfer or card; international payments supported). Funds are released to producers in milestones, after production updates and after the quality check, so both sides are protected.",
  },
  {
    q: "What is the minimum order quantity (MOQ)?",
    a: "Each product shows its MOQ. Because ANOVEL can combine several producers in a cluster, we can often meet large volumes, and sometimes trial orders smaller than the listed MOQ.",
  },
  {
    q: "Can I get samples first?",
    a: "Yes. Tick “sample needed” when you post a requirement. Samples are usually dispatched within 7–14 days; the sample cost is adjusted against your bulk order.",
  },
  {
    q: "What are ANOVEL’s fees?",
    a: "ANOVEL is free during the pilot, for both buyers and producers. Later a small service fee will apply only on completed orders, and it will always be shown upfront.",
  },
  {
    q: "Which languages do you support?",
    a: "Our team speaks English, Hindi, Telugu and Tamil, and more regional languages are coming. Producers can call or WhatsApp us in their own language and get help at every step.",
  },
];

function Journey({ title, subtitle, steps, cta }: { title: string; subtitle: string; steps: Step[]; cta: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-cream p-5 sm:p-8">
      <h2 className="font-hand text-3xl text-olive-dark sm:text-4xl">{title}</h2>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
      <ol className="relative mt-6">
        {steps.map(({ Icon, title: t, text }, i) => (
          <li key={t} className="relative flex gap-4 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span aria-hidden className="absolute left-7 top-16 bottom-1 border-l-2 border-dashed border-olive/40" />
            )}
            <span className="relative shrink-0">
              <span className="blob flex h-14 w-14 items-center justify-center bg-sage text-olive-dark">
                <Icon size={34} />
              </span>
              <span className="brush absolute -right-2 -top-1 flex h-6 w-6 items-center justify-center bg-olive font-hand text-sm text-white">
                {i + 1}
              </span>
            </span>
            <span className="pt-1.5">
              <span className="block font-hand text-xl leading-tight text-ink">{t}</span>
              <span className="block text-sm text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-6">{cta}</div>
    </section>
  );
}

export default function HowItWorksPage() {
  return (
    <div>
      <div className="px-4 pt-10 pb-6 text-center sm:px-8 sm:pt-14">
        <h1 className="heading-swash font-hand text-4xl leading-tight sm:text-5xl">How ANOVEL works</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted sm:text-base">
          Village → ANOVEL → Buyer. We verify, organise and match, so buyers get reliable supply and producers get
          fair, steady orders.
        </p>
      </div>

      <div className="grid gap-6 px-4 pb-12 sm:px-8 lg:grid-cols-2">
        <Journey
          title="For buyers"
          subtitle="Importers, wholesalers, retailers, brands & designers"
          steps={buyerSteps}
          cta={
            <ButtonLink href="/post-requirement" size="lg">
              Post a requirement
            </ButtonLink>
          }
        />
        <Journey
          title="For producers"
          subtitle="Farmers, weavers, artisans, SHGs, FPOs & rural MSMEs"
          steps={producerSteps}
          cta={
            <ButtonLink href="/register?role=producer" size="lg" variant="orange">
              Join as a producer
            </ButtonLink>
          }
        />
      </div>

      {/* Photo band with olive brush steps */}
      <section className="relative overflow-hidden px-4 py-10 sm:px-8">
        <Image src="/images/turmeric-farmers.jpg" alt="" fill sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative">
          <h2 className="brush inline-block bg-olive px-4 py-1 font-hand text-2xl text-white sm:text-3xl">
            What ANOVEL does in the middle
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {middle.map(({ Icon, title, text }) => (
              <li key={title} className="brush bg-olive/95 p-3 text-white shadow-md">
                <Icon size={32} className="text-sage" />
                <span className="mt-1 block font-hand text-xl">{title}</span>
                <span className="block text-xs text-white/85">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8">
        <SectionHeading title="Questions people ask" subtitle="Still curious? WhatsApp us anytime." />
        <div className="mx-auto mt-6 max-w-3xl space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl bg-cream px-4 py-3 open:bg-cream-2/70">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown size={18} className="shrink-0 text-olive transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <ButtonLink href="/contact" variant="plum">
            Contact the ANOVEL team
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
