// Small form building blocks shared by the ANOVEL public/auth forms.
"use client";

import { Check } from "lucide-react";

/** Big, easy-to-tap input class for producer forms (low-literacy friendly). */
export const bigInputClass =
  "w-full rounded-lg border-2 border-cream-2 bg-white px-4 py-3.5 text-base text-ink placeholder:text-muted/70 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20";

export function ErrorText({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <span role="alert" className="mt-1 block text-xs font-bold text-orange">
      {children}
    </span>
  );
}

/** Pill-style toggle group (e.g. ₹ / USD, Yes / No). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-cream p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
              active ? "bg-olive text-white shadow-sm" : "text-ink hover:text-olive"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Checkbox styled as a toggleable chip. */
export function CheckChip({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`brush inline-flex cursor-pointer select-none items-center gap-2 border-2 px-3 py-2 text-sm font-bold transition-colors ${
        checked ? "border-olive bg-olive/10 text-olive-dark" : "border-cream-2 bg-white text-ink hover:border-sage"
      }`}
    >
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border-2 ${
          checked ? "border-olive bg-olive text-white" : "border-muted/50"
        }`}
        aria-hidden
      >
        {checked && <Check size={12} strokeWidth={3} />}
      </span>
      {children}
    </label>
  );
}

/** Groundy-style progress path: olive brush boxes with numbers, joined by arrows. */
export function StepProgress({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-start justify-between gap-1 sm:gap-2" aria-label="Progress">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex min-w-0 flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span className={`h-0.5 flex-1 ${i === 0 ? "invisible" : done || active ? "bg-olive" : "bg-cream-2"}`} />
              <span
                aria-current={active ? "step" : undefined}
                className={`brush flex h-9 w-9 shrink-0 items-center justify-center font-hand text-lg sm:h-11 sm:w-11 sm:text-xl ${
                  done ? "bg-olive text-white" : active ? "bg-olive-dark text-white ring-4 ring-sage" : "bg-cream text-muted"
                }`}
              >
                {done ? <Check size={18} strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={`h-0.5 flex-1 ${i === steps.length - 1 ? "invisible" : done ? "bg-olive" : "bg-cream-2"}`}
              />
            </div>
            <span
              className={`mt-1.5 hidden text-[11px] leading-tight sm:block ${active ? "font-bold text-olive-dark" : "text-muted"}`}
            >
              {s}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Six-box one-time-password input (demo: any 6 digits work). */
export function OtpInput({
  value,
  onChange,
  big = false,
}: {
  value: string;
  onChange: (v: string) => void;
  big?: boolean;
}) {
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");
  const setAt = (i: number, d: string, el: HTMLInputElement) => {
    const clean = d.replace(/\D/g, "");
    if (clean.length > 1) {
      onChange(clean.slice(0, 6));
      return;
    }
    const next = digits.slice();
    next[i] = clean;
    onChange(next.join("").slice(0, 6));
    if (clean && el.nextElementSibling instanceof HTMLInputElement) el.nextElementSibling.focus();
  };
  return (
    <div className="flex justify-between gap-1.5 sm:gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1}`}
          value={d}
          maxLength={6}
          onChange={(e) => setAt(i, e.target.value, e.currentTarget)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !d && e.currentTarget.previousElementSibling instanceof HTMLInputElement) {
              e.currentTarget.previousElementSibling.focus();
            }
          }}
          className={`w-full min-w-0 rounded-lg border-2 border-cream-2 bg-white text-center font-bold text-ink focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20 ${
            big ? "h-14 text-2xl" : "h-12 text-xl"
          }`}
        />
      ))}
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => v.replace(/\D/g, "").length >= 10;
