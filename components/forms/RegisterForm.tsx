"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, FileText, Mail } from "lucide-react";
import { Button, Field, inputClass } from "@/components/site/ui";
import { PlaneIcon, SackIcon } from "@/components/site/HandIcons";
import { ErrorText, OtpInput, bigInputClass, isEmail, isPhone } from "./fields";

type Role = "producer" | "buyer";

const PRODUCER_TYPES = ["Farmer", "Weaver", "Artisan", "SHG", "FPO", "Rural MSME"] as const;
const STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
  "Odisha",
  "West Bengal",
  "Maharashtra",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Bihar",
  "Assam",
  "Other",
];
const COUNTRIES = ["USA", "UAE", "UK", "Singapore", "Canada", "Australia", "Germany", "India", "Other"];
const BUYER_TYPES = ["Importer", "Wholesaler", "Retailer", "Fashion brand", "Designer", "Distributor", "Other"];

export function RegisterForm() {
  const params = useSearchParams();
  const initial = params.get("role");
  const [role, setRole] = useState<Role | null>(initial === "producer" || initial === "buyer" ? initial : null);

  if (!role) return <RoleChoice onPick={setRole} />;
  return (
    <div>
      <button
        type="button"
        onClick={() => setRole(null)}
        className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-olive hover:underline"
      >
        <ArrowLeft size={14} /> Change account type
      </button>
      {role === "producer" ? <ProducerForm /> : <BuyerForm />}
    </div>
  );
}

function RoleChoice({ onPick }: { onPick: (r: Role) => void }) {
  const cards = [
    {
      role: "producer" as const,
      Icon: SackIcon,
      title: "I’m a producer",
      sub: "Farmer · Weaver · Artisan · SHG · FPO",
      tone: "bg-olive text-white",
      blob: "bg-sage text-olive-dark",
    },
    {
      role: "buyer" as const,
      Icon: PlaneIcon,
      title: "I’m a buyer",
      sub: "Importer · Wholesaler · Retailer · Brand",
      tone: "bg-white text-ink border-2 border-sage",
      blob: "bg-cream text-plum",
    },
  ];
  return (
    <div>
      <h1 className="font-hand text-4xl sm:text-5xl">Join ANOVEL</h1>
      <p className="mt-1 text-sm text-muted">Free during the pilot. Who are you?</p>
      <div className="mt-6 grid gap-4">
        {cards.map(({ role, Icon, title, sub, tone, blob }) => (
          <button
            key={role}
            type="button"
            onClick={() => onPick(role)}
            className={`brush flex items-center gap-4 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${tone}`}
          >
            <span className={`blob flex h-20 w-20 shrink-0 items-center justify-center ${blob}`}>
              <Icon size={48} />
            </span>
            <span>
              <span className="block font-hand text-3xl leading-tight">{title}</span>
              <span className="mt-1 block text-sm opacity-85">{sub}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="mt-6 text-center text-sm">
        Already registered?{" "}
        <Link href="/login" className="font-bold text-olive hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

/* ---------------- Producer: big inputs, simple words ---------------- */

type PErrors = Partial<Record<"name" | "mobile" | "otp" | "village" | "district" | "state" | "type", string>>;

function ProducerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [type, setType] = useState("");
  const [errors, setErrors] = useState<PErrors>({});

  const sendOtp = () => {
    if (!isPhone(mobile)) return setErrors((e) => ({ ...e, mobile: "Please type your 10-digit mobile number." }));
    setErrors((e) => ({ ...e, mobile: undefined }));
    setOtpSent(true);
  };
  const verifyOtp = () => {
    if (otp.length !== 6) return setErrors((e) => ({ ...e, otp: "Type all 6 numbers." }));
    setErrors((e) => ({ ...e, otp: undefined }));
    setVerified(true);
  };

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const errs: PErrors = {};
        if (!name.trim()) errs.name = "Please type your name.";
        if (!verified) errs.mobile = "Please verify your mobile number.";
        if (!village.trim()) errs.village = "Please type your village.";
        if (!district.trim()) errs.district = "Please type your district.";
        if (!state) errs.state = "Please choose your state.";
        if (!type) errs.type = "Please choose what you do.";
        setErrors(errs);
        if (Object.keys(errs).length === 0) router.push("/producer/profile");
      }}
    >
      <div>
        <h1 className="font-hand text-4xl">Join as a producer</h1>
        <p className="mt-1 text-base text-muted">It is free. It takes 2 minutes.</p>
      </div>

      <BigField label="Your name">
        <input className={bigInputClass} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        <ErrorText>{errors.name}</ErrorText>
      </BigField>

      <BigField label="Mobile number">
        <div className="flex gap-2">
          <span className="flex items-center rounded-lg border-2 border-cream-2 bg-white px-3 text-base font-bold">+91</span>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            className={bigInputClass}
            value={mobile}
            disabled={verified}
            onChange={(e) => {
              setMobile(e.target.value);
              setOtpSent(false);
              setOtp("");
            }}
            placeholder="98765 43210"
          />
        </div>
        <ErrorText>{errors.mobile}</ErrorText>
        {verified ? (
          <span className="mt-2 inline-flex items-center gap-1 text-base font-bold text-olive">
            <BadgeCheck size={20} /> Mobile verified
          </span>
        ) : !otpSent ? (
          <Button type="button" size="lg" variant="outline" className="mt-2 w-full" onClick={sendOtp}>
            Send OTP
          </Button>
        ) : (
          <div className="mt-3 space-y-3 rounded-xl bg-white p-3">
            <p className="text-base">
              Type the 6 numbers we sent by SMS. <span className="text-sm text-muted">(Demo: any 6 numbers.)</span>
            </p>
            <OtpInput value={otp} onChange={setOtp} big />
            <ErrorText>{errors.otp}</ErrorText>
            <Button type="button" size="lg" className="w-full" onClick={verifyOtp}>
              Verify
            </Button>
          </div>
        )}
      </BigField>

      <BigField label="Village">
        <input className={bigInputClass} value={village} onChange={(e) => setVillage(e.target.value)} />
        <ErrorText>{errors.village}</ErrorText>
      </BigField>
      <div className="grid gap-5 sm:grid-cols-2">
        <BigField label="District">
          <input className={bigInputClass} value={district} onChange={(e) => setDistrict(e.target.value)} />
          <ErrorText>{errors.district}</ErrorText>
        </BigField>
        <BigField label="State">
          <select className={bigInputClass} value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">Choose…</option>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ErrorText>{errors.state}</ErrorText>
        </BigField>
      </div>

      <fieldset>
        <legend className="mb-2 text-lg font-bold">What do you do?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PRODUCER_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => setType(t)}
              className={`brush border-2 px-3 py-4 text-base font-bold transition-colors ${
                type === t ? "border-olive bg-olive text-white" : "border-cream-2 bg-white text-ink hover:border-sage"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <ErrorText>{errors.type}</ErrorText>
      </fieldset>

      <div className="flex gap-3 rounded-xl bg-sage/50 p-4 text-sm text-olive-dark">
        <FileText size={22} className="shrink-0" />
        <p>
          <b>Papers come later.</b> After you join, you can add PAN, Aadhaar (DigiLocker), GSTIN and bank details in
          your dashboard. Our team will help you.
        </p>
      </div>

      <Button type="submit" size="lg" variant="orange" className="w-full py-4 text-lg">
        Join ANOVEL
      </Button>
    </form>
  );
}

function BigField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-lg font-bold text-ink">{label}</span>
      {children}
    </div>
  );
}

/* ---------------- Buyer ---------------- */

type BErrors = Partial<Record<"company" | "name" | "email" | "code" | "country" | "buyerType" | "gstin", string>>;

function BuyerForm() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [country, setCountry] = useState("");
  const [buyerType, setBuyerType] = useState("");
  const [gstin, setGstin] = useState("");
  const [errors, setErrors] = useState<BErrors>({});

  const sendCode = () => {
    if (!isEmail(email)) return setErrors((e) => ({ ...e, email: "Enter a valid work email." }));
    setErrors((e) => ({ ...e, email: undefined }));
    setCodeSent(true);
  };
  const verifyCode = () => {
    if (code.length !== 6) return setErrors((e) => ({ ...e, code: "Enter the 6-digit code." }));
    setErrors((e) => ({ ...e, code: undefined }));
    setVerified(true);
  };

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const errs: BErrors = {};
        if (!company.trim()) errs.company = "Company name is required.";
        if (!name.trim()) errs.name = "Your name is required.";
        if (!verified) errs.email = "Please verify your email.";
        if (!country) errs.country = "Choose your country.";
        if (!buyerType) errs.buyerType = "Choose your buyer type.";
        if (country === "India" && gstin && !/^[0-9A-Z]{15}$/.test(gstin.trim().toUpperCase()))
          errs.gstin = "GSTIN has 15 letters and numbers.";
        setErrors(errs);
        if (Object.keys(errs).length === 0) router.push("/buyer");
      }}
    >
      <div>
        <h1 className="font-hand text-4xl">Create a buyer account</h1>
        <p className="mt-1 text-sm text-muted">Source verified products straight from Indian villages.</p>
      </div>

      <Field label="Company">
        <input className={inputClass} autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
        <ErrorText>{errors.company}</ErrorText>
      </Field>
      <Field label="Your name">
        <input className={inputClass} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        <ErrorText>{errors.name}</ErrorText>
      </Field>

      <div>
        <span className="mb-1 block text-sm font-bold text-ink">Work email</span>
        <div className="flex gap-2">
          <input
            type="email"
            autoComplete="email"
            aria-label="Work email"
            className={inputClass}
            value={email}
            disabled={verified}
            onChange={(e) => {
              setEmail(e.target.value);
              setCodeSent(false);
              setCode("");
            }}
            placeholder="you@company.com"
          />
          {!verified && (
            <Button type="button" variant="outline" className="shrink-0" onClick={sendCode}>
              <Mail size={16} /> {codeSent ? "Resend" : "Verify"}
            </Button>
          )}
        </div>
        <ErrorText>{errors.email}</ErrorText>
        {verified && (
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-olive">
            <BadgeCheck size={16} /> Email verified
          </span>
        )}
        {codeSent && !verified && (
          <div className="mt-3 space-y-2 rounded-xl bg-white p-3">
            <p className="text-sm">
              Enter the code sent to <b className="break-all">{email}</b>{" "}
              <span className="text-muted">(demo: any 6 digits)</span>
            </p>
            <OtpInput value={code} onChange={setCode} />
            <ErrorText>{errors.code}</ErrorText>
            <Button type="button" className="w-full" onClick={verifyCode}>
              Confirm code
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Country">
          <select className={inputClass} value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">Select…</option>
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <ErrorText>{errors.country}</ErrorText>
        </Field>
        <Field label="Buyer type">
          <select className={inputClass} value={buyerType} onChange={(e) => setBuyerType(e.target.value)}>
            <option value="">Select…</option>
            {BUYER_TYPES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <ErrorText>{errors.buyerType}</ErrorText>
        </Field>
      </div>

      {country === "India" && (
        <Field label="GSTIN (optional)" hint="Add it now or later from your dashboard.">
          <input
            className={`${inputClass} uppercase`}
            value={gstin}
            maxLength={15}
            onChange={(e) => setGstin(e.target.value)}
            placeholder="36ABCDE1234F1Z5"
          />
          <ErrorText>{errors.gstin}</ErrorText>
        </Field>
      )}

      <Button type="submit" size="lg" className="w-full">
        Create buyer account
      </Button>
      <p className="text-center text-xs text-muted">
        By continuing you agree to ANOVEL’s terms and privacy policy.
      </p>
    </form>
  );
}
