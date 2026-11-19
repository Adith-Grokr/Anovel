// Cream "anovel, from village to world!" band: 4 hand-drawn steps joined by olive arrows (Groundy's
// "Semina → Raccolta → Confezionamento → Spedizione").
import Link from "next/link";
import { Fragment } from "react";
import { BoxIcon, SackIcon, SeedlingIcon, TruckIcon } from "@/components/site/HandIcons";

const steps = [
  {
    title: "Produce",
    Icon: SeedlingIcon,
    text: "Weavers, farmers and artisans make your goods in their own villages, using skills passed down for generations.",
  },
  {
    title: "Verify & QC",
    Icon: SackIcon,
    text: "Every producer is KYC-verified, and each batch is inspected against your specification before it leaves.",
  },
  {
    title: "Pack",
    Icon: BoxIcon,
    text: "Goods are graded, labelled and packed to export standard, with the paperwork your market requires.",
  },
  {
    title: "Ship worldwide",
    Icon: TruckIcon,
    text: "We handle pickup, customs and freight, and you can track your order from the village to your door.",
  },
];

function StepArrow() {
  return (
    <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden className="mt-10 hidden shrink-0 text-olive md:block">
      <path
        d="M2 7.5c9-.6 18-.4 28-.4M24 2.5l6 4.6-6 4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProcessSteps() {
  return (
    <section className="bg-cream px-4 py-10 sm:px-10 md:py-12">
      <h2 className="text-center font-hand text-[28px] leading-tight text-olive sm:text-[34px]">
        <span className="font-logo">anovel</span>, from{" "}
        <span className="mx-0.5 inline-flex h-[44px] w-[44px] -rotate-6 items-center justify-center rounded-full bg-olive align-middle font-sans text-[9px] font-black uppercase tracking-wide text-white sm:h-[50px] sm:w-[50px] sm:text-[10px]">
          village
        </span>{" "}
        to world!
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:flex md:items-start md:justify-between md:gap-2">
        {steps.map(({ title, Icon, text }, i) => (
          <Fragment key={title}>
            {i > 0 && <StepArrow />}
            <div className="flex flex-col items-center text-center md:w-[200px]">
              <div className="blob flex h-[90px] w-[90px] items-center justify-center bg-sage text-olive">
                <Icon size={62} />
              </div>
              <h3 className="mt-3 font-hand text-xl text-olive">{title}</h3>
              <p className="mt-1 text-[11px] leading-snug text-muted">{text}</p>
              <Link
                href="/how-it-works"
                className="brush mt-3 bg-olive px-3 py-1 text-[11px] font-bold text-white transition-colors hover:bg-olive-dark"
              >
                Learn more
              </Link>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
