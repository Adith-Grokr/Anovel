// "anovel" wordmark in the Groundy logo style: white brush script on an orange badge with a green leaf.
// Swap this component's contents for ANOVEL's real logo file when it arrives.
import Link from "next/link";

export function Logo({
  size = "md",
  href = "/",
}: {
  size?: "sm" | "md" | "lg";
  href?: string | null;
}) {
  const dims = {
    sm: "text-2xl px-3 pt-0.5 pb-1.5",
    md: "text-[28px] px-4 pt-0.5 pb-2",
    lg: "text-5xl sm:text-6xl px-8 pt-1 pb-4",
  }[size];
  const leaf = { sm: 14, md: 16, lg: 30 }[size];

  const badge = (
    <span
      className={`relative inline-flex items-center bg-orange text-white font-logo leading-none shadow-sm ${dims}`}
      style={{ borderRadius: "46% 54% 40% 60% / 60% 46% 54% 40%" }}
    >
      anovel
      <svg
        width={leaf}
        height={leaf}
        viewBox="0 0 20 20"
        className="absolute -right-1 top-0 -translate-y-1/4"
        aria-hidden
      >
        <path d="M2 18C4 8 10 3 19 2c-1 9-6 15-17 16z" fill="#7a9a3c" />
        <path d="M3 17c4-4 8-8 12-11" stroke="#5f7a3a" strokeWidth="1.4" fill="none" />
      </svg>
    </span>
  );

  if (!href) return badge;
  return (
    <Link href={href} aria-label="ANOVEL home" className="inline-block">
      {badge}
    </Link>
  );
}
