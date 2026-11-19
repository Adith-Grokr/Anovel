"use client";

import { formatINR } from "@/lib/mock/data";
import { createLocalStore } from "./local-store";

/** Fixed demo exchange rates (INR per unit of foreign currency). */
export const FX_RATES = { USD: 84, EUR: 91, GBP: 108, AED: 22.9 } as const;
export type Currency = keyof typeof FX_RATES;
export const CURRENCIES = Object.keys(FX_RATES) as Currency[];

export const currencyStore = createLocalStore<Currency>("anovel-buyer-currency", "EUR");

export function convert(inr: number, currency: Currency) {
  const value = inr / FX_RATES[currency];
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value);
}

/** INR amount with an approximate conversion hint in the buyer's preferred currency. */
export function Money({
  inr,
  suffix,
  className = "",
  block = false,
}: {
  inr: number;
  suffix?: string;
  className?: string;
  block?: boolean;
}) {
  const currency = currencyStore.use();
  return (
    <span className={`${block ? "block" : "inline"} ${className}`}>
      <span className="font-bold text-ink">
        {formatINR(inr)}
        {suffix && <span className="font-normal text-muted">{suffix}</span>}
      </span>
      <span className={`${block ? "block" : "ml-1"} text-xs text-muted`} title={`Demo rate: 1 ${currency} = ₹${FX_RATES[currency]}`}>
        ≈ {convert(inr, currency)}
      </span>
    </span>
  );
}

export function FxNote() {
  const currency = currencyStore.use();
  return (
    <p className="text-xs text-muted">
      Prices are quoted in INR. Conversions are indicative only (demo rate 1 {currency} = ₹{FX_RATES[currency]}).
    </p>
  );
}
