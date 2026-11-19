import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { ButtonLink, SectionHeading } from "@/components/site/ui";
import { CategoryIcon, HandshakeIcon, PlaneIcon, SackIcon, SeedlingIcon, ShieldCheckIcon } from "@/components/site/HandIcons";
import { categories } from "@/lib/mock/data";

export const metadata: Metadata = {
  title: "About — ANOVEL",
  description: "ANOVEL connects the production power of Indian villages with the demand of the world.",
};

const targets = [
  { n: "100+", l: "verified producers" },
  { n: "3–5", l: "village clusters" },
  { n: "300+", l: "buyers onboarded" },
  { n: "50+", l: "buyer enquiries" },
  { n: "25+", l: "orders delivered" },
  { n: "5–10", l: "international orders" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[260px] sm:h-[340px]">
          <Image src="/images/hero-village.jpg" alt="Village producers in India" fill priority sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-center sm:p-10">
            <h1 className="font-hand text-4xl leading-tight text-white sm:text-6xl">About ANOVEL</h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-white/90 sm:text-lg">
              ANOVEL connects the production power of Indian villages with the demand of the world.
            </p>
          </div>
        </div>
      </section>

      {/* Problem / solution */}
      <section className="grid gap-6 px-4 py-12 sm:px-8 md:grid-cols-2">
        <div className="rounded-2xl bg-cream p-6">
          <h2 className="font-hand text-3xl text-plum">The problem</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed">
            <li>India’s villages make world-class textiles, crafts, spices and grains, but most producers sell through long chains of middlemen and earn a small share.</li>
            <li>Buyers abroad want this supply, yet struggle to find producers they can trust, check quality, or ship reliably at volume.</li>
            <li>Small producers rarely have the paperwork, export know-how or online presence to reach these buyers directly.</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-olive p-6 text-white">
          <h2 className="font-hand text-3xl">Our solution</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/90">
            <li><b>Verify</b> every producer with documents and village visits.</li>
            <li><b>Organise</b> them into clusters, SHGs and FPOs that can supply in bulk.</li>
            <li><b>Match</b> each buyer requirement with the right producers, and run quotations, samples and orders.</li>
            <li><b>Quality-check, ship and pay</b>, so both sides can trade with confidence.</li>
          </ul>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-cream px-4 py-12 text-center sm:px-8">
        <SeedlingIcon size={56} className="mx-auto text-olive" />
        <p className="mx-auto mt-3 max-w-3xl font-hand text-3xl leading-snug text-olive-dark sm:text-4xl">
          “Our mission is to make every Indian village a trusted global supplier, with fair prices for the people who
          make the goods.”
        </p>
      </section>

      {/* Mauve category band */}
      <section className="bg-mauve px-4 py-5">
        <ul className="no-scrollbar mx-auto flex max-w-4xl justify-between gap-5 overflow-x-auto">
          {categories.map((c) => (
            <li key={c.slug} className="flex shrink-0 flex-col items-center text-plum">
              <CategoryIcon slug={c.slug} size={40} />
              <span className="mt-1 text-[11px] font-bold">{c.short}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Who it's for */}
      <section className="px-4 py-12 sm:px-8">
        <SectionHeading title="Who ANOVEL is for" subtitle="Two sides, one trusted marketplace" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="overflow-hidden rounded-2xl bg-cream">
            <div className="relative h-44">
              <Image src="/images/weaver-2.jpg" alt="A handloom weaver" fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3">
                <span className="blob flex h-14 w-14 items-center justify-center bg-sage text-olive-dark">
                  <SackIcon size={34} />
                </span>
                <h3 className="font-hand text-2xl">For producers</h3>
              </div>
              <p className="mt-3 text-sm text-muted">
                Farmers, weavers, artisans, self-help groups (SHGs), farmer producer organisations (FPOs) and rural
                MSMEs.
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>✓ Direct orders from India and abroad</li>
                <li>✓ Fair prices, paid to your bank</li>
                <li>✓ Help with papers, quality and shipping</li>
                <li>✓ Simple app in your language</li>
              </ul>
              <ButtonLink href="/register?role=producer" variant="orange" className="mt-5">
                Join as a producer
              </ButtonLink>
            </div>
          </article>
          <article className="overflow-hidden rounded-2xl bg-cream">
            <div className="relative h-44">
              <Image src="/images/port.jpg" alt="Shipping containers at a port" fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3">
                <span className="blob flex h-14 w-14 items-center justify-center bg-sage text-olive-dark">
                  <PlaneIcon size={34} />
                </span>
                <h3 className="font-hand text-2xl">For buyers</h3>
              </div>
              <p className="mt-3 text-sm text-muted">
                Importers, wholesalers, retailers, fashion brands, designers and distributors in India, USA, UAE, UK,
                Singapore, Canada, Australia and Germany.
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>✓ Verified, traceable village supply</li>
                <li>✓ Matched producers within 48 hours</li>
                <li>✓ Samples and quality checks before shipping</li>
                <li>✓ Export documents and logistics handled</li>
              </ul>
              <ButtonLink href="/post-requirement" className="mt-5">
                Post a requirement
              </ButtonLink>
            </div>
          </article>
        </div>
      </section>

      {/* Targets */}
      <section className="bg-cream px-4 py-12 sm:px-8">
        <SectionHeading title="Our first 6 months" subtitle="The pilot targets we are working towards" />
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {targets.map((t, i) => (
            <li
              key={t.l}
              className={`brush p-4 text-center shadow-sm ${i % 2 === 0 ? "bg-olive text-white" : "bg-white text-ink"}`}
              style={{ transform: `rotate(${i % 3 === 0 ? -1.2 : i % 3 === 1 ? 0.8 : -0.4}deg)` }}
            >
              <span className={`block font-hand text-4xl sm:text-5xl ${i % 2 === 0 ? "text-white" : "text-orange"}`}>
                {t.n}
              </span>
              <span className={`text-sm font-bold ${i % 2 === 0 ? "text-white/90" : "text-muted"}`}>{t.l}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Company */}
      <section className="grid items-center gap-8 px-4 py-12 sm:px-8 md:grid-cols-[1fr_1.2fr]">
        <div className="relative h-56 overflow-hidden rounded-2xl sm:h-72">
          <Image src="/images/channapatna-artist.jpg" alt="An artisan painting Channapatna toys" fill sizes="(max-width: 768px) 100vw, 500px" className="object-cover" />
        </div>
        <div>
          <h2 className="font-hand text-3xl text-olive-dark sm:text-4xl">The team behind ANOVEL</h2>
          <p className="mt-3 text-sm leading-relaxed">
            ANOVEL is built by <b>Anovel Technologies Private Limited</b>, a young company based in Hyderabad, Telangana.
            Our team combines technology, export trade and rural development experience, and works on the ground with
            producer clusters such as Pochampally, Guntur and Kondapalli.
          </p>
          <p className="mt-3 inline-flex items-start gap-2 text-sm text-muted">
            <MapPin size={16} className="mt-0.5 shrink-0 text-orange" /> Hyderabad, Telangana, India
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-olive">
              <ShieldCheckIcon size={24} /> Verified supply
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-olive">
              <HandshakeIcon size={24} /> Fair trade
            </span>
          </div>
          <ButtonLink href="/contact" variant="plum" className="mt-6">
            Talk to us
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
