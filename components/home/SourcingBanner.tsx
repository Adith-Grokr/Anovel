// Photo banner "How do I source on ANOVEL?" with three numbered olive brush boxes
// (Groundy's "Come faccio la spesa online?").
import Image from "next/image";

const steps = ["Post your requirement", "Get matched & receive quotations", "Order, we quality-check & ship!"];

export function SourcingBanner() {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-16 sm:px-10 md:flex md:h-[230px] md:items-end md:pb-9 md:pt-0">
      <Image src="/images/spices-kerala.jpg" alt="" fill sizes="(min-width: 1200px) 1200px, 100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/45" />

      <h2
        className="absolute left-0 top-5 bg-olive py-1.5 pl-4 pr-5 font-hand text-xl text-white sm:pl-10 md:top-7 md:text-[22px]"
        style={{ borderRadius: "0 14px 8px 0 / 0 8px 14px 0" }}
      >
        How do I source on ANOVEL?
      </h2>

      <ol className="relative grid w-full gap-4 md:grid-cols-3 md:gap-6">
        {steps.map((text, i) => (
          <li key={text} className="flex items-center gap-2">
            <span className="w-7 shrink-0 text-center font-hand text-[44px] leading-none text-white md:text-[52px]">
              {i + 1}
            </span>
            <span className="brush flex min-h-[64px] flex-1 items-center justify-center bg-olive px-4 py-2 text-center font-hand text-lg leading-tight text-white shadow-md md:text-[19px]">
              {text}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
