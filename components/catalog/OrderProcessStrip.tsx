// "How ANOVEL handles your order": Verify -> Quality check -> Ship, with Groundy blob icons.
import { ArrowRight } from "lucide-react";
import { SackIcon, ShieldCheckIcon, TruckIcon } from "@/components/site/HandIcons";

const steps = [
  {
    Icon: ShieldCheckIcon,
    title: "Verify",
    text: "We visit the producer and check KYC, bank and capacity before any order.",
  },
  {
    Icon: SackIcon,
    title: "Quality check",
    text: "An ANOVEL inspector checks every lot against your sample and specs.",
  },
  {
    Icon: TruckIcon,
    title: "Ship",
    text: "We pack, document and ship to your door with tracking, export paperwork included.",
  },
];

export function OrderProcessStrip({ className = "" }: { className?: string }) {
  return (
    <section className={`bg-cream px-4 py-8 sm:px-8 ${className}`}>
      <h2 className="text-center font-hand text-3xl text-olive">How ANOVEL handles your order</h2>
      <ol className="mx-auto mt-6 grid max-w-4xl gap-6 sm:grid-cols-3 sm:gap-8">
        {steps.map(({ Icon, title, text }, i) => (
          <li key={title} className="relative flex flex-col items-center text-center">
            <span className="blob flex h-20 w-24 items-center justify-center bg-sage text-olive">
              <Icon size={46} />
            </span>
            <h3 className="mt-2 font-hand text-xl text-olive">
              {i + 1}. {title}
            </h3>
            <p className="mt-1 max-w-[16rem] text-xs leading-relaxed text-muted">{text}</p>
            {i < steps.length - 1 && (
              <ArrowRight
                className="absolute -right-7 top-8 hidden h-6 w-6 text-olive sm:block"
                aria-hidden
                strokeWidth={2.4}
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
