// Compact olive strip inviting producers (and buyers) to register.
import Link from "next/link";
import { btnClass } from "@/components/site/ui";

export function ProducerCta() {
  return (
    <section className="flex flex-col items-center gap-4 bg-olive px-4 py-7 text-center sm:px-10 md:flex-row md:justify-between md:text-left">
      <p className="font-hand text-xl leading-tight text-white sm:text-2xl">
        Are you a farmer, weaver or artisan? Sell to the world with ANOVEL
      </p>
      <div className="flex shrink-0 flex-wrap justify-center gap-3">
        <Link href="/register?role=producer" className={btnClass("orange", "md")}>
          Register as producer
        </Link>
        <Link
          href="/register?role=buyer"
          className="brush inline-flex items-center justify-center border-2 border-white px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-olive"
        >
          I&apos;m a buyer
        </Link>
      </div>
    </section>
  );
}
