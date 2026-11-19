"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Eye, EyeOff, LogIn, ShieldCheck, Smartphone, Sprout } from "lucide-react";
import { Button, Field, inputClass } from "@/components/site/ui";
import { ErrorText, GoogleIcon, OtpInput, isEmail, isPhone } from "./fields";

type Mode = "email" | "phone" | "otp";

const DEMOS = [
  { label: "Demo: Producer", href: "/producer", Icon: Sprout },
  { label: "Demo: Buyer", href: "/buyer", Icon: Building2 },
  { label: "Demo: ANOVEL Admin", href: "/admin", Icon: ShieldCheck },
] as const;

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const go = (href: string) => router.push(href);

  return (
    <div>
      <h1 className="font-hand text-4xl text-ink sm:text-5xl">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to your ANOVEL account.</p>

      <button
        type="button"
        className="brush mt-6 flex w-full items-center justify-center gap-2 border-2 border-cream-2 bg-white px-6 py-3 font-bold text-ink transition-colors hover:border-sage"
        onClick={() => go("/buyer")}
      >
        <GoogleIcon /> Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs font-bold text-muted">
        <span className="h-px flex-1 bg-cream-2" /> or <span className="h-px flex-1 bg-cream-2" />
      </div>

      {mode === "email" && (
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isEmail(email)) return setError("Please enter a valid email.");
            if (password.length < 6) return setError("Password must be at least 6 characters.");
            setError("");
            go("/buyer");
          }}
        >
          <Field label="Email">
            <input
              type="email"
              autoComplete="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                className={`${inputClass} pr-10`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>
          <ErrorText>{error}</ErrorText>
          <div className="flex justify-end">
            <button type="button" className="text-xs font-bold text-olive hover:underline">
              Forgot password?
            </button>
          </div>
          <Button type="submit" size="lg" className="w-full">
            <LogIn size={18} /> Log in
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setError("");
              setMode("phone");
            }}
          >
            <Smartphone size={18} /> Login with phone OTP
          </Button>
        </form>
      )}

      {mode === "phone" && (
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isPhone(phone)) return setError("Please enter a 10-digit mobile number.");
            setError("");
            setMode("otp");
          }}
        >
          <Field label="Mobile number">
            <div className="flex gap-2">
              <span className="flex items-center rounded-md border border-cream-2 bg-white px-3 text-sm font-bold">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
              />
            </div>
          </Field>
          <ErrorText>{error}</ErrorText>
          <Button type="submit" size="lg" className="w-full">
            Send OTP
          </Button>
          <BackLink onClick={() => setMode("email")}>Use email instead</BackLink>
        </form>
      )}

      {mode === "otp" && (
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (otp.length !== 6) return setError("Enter the 6-digit code.");
            setError("");
            go("/producer");
          }}
        >
          <p className="text-sm">
            We sent a 6-digit code to <b>+91 {phone}</b>.{" "}
            <span className="text-muted">(Demo: type any 6 digits.)</span>
          </p>
          <OtpInput value={otp} onChange={setOtp} />
          <ErrorText>{error}</ErrorText>
          <Button type="submit" size="lg" className="w-full">
            Verify & log in
          </Button>
          <BackLink onClick={() => setMode("phone")}>Change number</BackLink>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        New to ANOVEL?{" "}
        <Link href="/register" className="font-bold text-olive hover:underline">
          Create an account
        </Link>
      </p>

      <div className="mt-8 rounded-2xl border-2 border-dashed border-sage bg-white/60 p-4">
        <p className="text-center font-hand text-xl text-olive-dark">Try the demo</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {DEMOS.map(({ label, href, Icon }) => (
            <Button key={href} type="button" variant="plum" size="sm" className="py-2" onClick={() => go(href)}>
              <Icon size={14} /> {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BackLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex items-center gap-1 text-sm font-bold text-olive hover:underline"
    >
      <ArrowLeft size={14} /> {children}
    </button>
  );
}
