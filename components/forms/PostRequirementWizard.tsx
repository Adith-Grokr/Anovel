"use client";

// The key buyer flow: a 4-step wizard + review that saves a requirement to the demo store.
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Pencil, Send } from "lucide-react";
import { categories, DEMO_BUYER_ID, getProduct } from "@/lib/mock/data";
import { demoActions } from "@/lib/demo-store";
import type { CategorySlug } from "@/lib/types";
import { Button, ButtonLink, Field, inputClass } from "@/components/site/ui";
import { CategoryIcon, HandshakeIcon, QuoteIcon, SackIcon, TruckIcon } from "@/components/site/HandIcons";
import { CheckChip, ErrorText, Segmented, StepProgress, isEmail, isPhone } from "./fields";

const STEPS = ["What you need", "Quantity & price", "Delivery", "Your details", "Review"];
const UNITS = ["piece", "kg", "tonne", "metre", "set", "dozen", "litre"];
const COUNTRIES = ["USA", "UAE", "UK", "Singapore", "Canada", "Australia", "Germany", "India", "Other"];
const CERTS = ["Organic", "GI Tag", "Handloom Mark", "FSSAI", "APEDA", "EN-71", "Azo-free", "Fair trade"];
const BUYER_TYPES = ["Importer", "Wholesaler", "Retailer", "Fashion brand", "Designer", "Distributor", "Other"];
const USD_TO_INR = 84;

type Currency = "INR" | "USD";

interface FormState {
  category: CategorySlug | "";
  title: string;
  description: string;
  quantity: string;
  unit: string;
  currency: Currency;
  targetPrice: string;
  sample: "yes" | "no";
  country: string;
  otherCountry: string;
  city: string;
  neededBy: string;
  certifications: string[];
  company: string;
  name: string;
  email: string;
  phone: string;
  buyerType: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

function initialState(productSlug: string | null, sample: boolean): FormState {
  const p = productSlug ? getProduct(productSlug) : undefined;
  return {
    category: p?.category ?? "",
    title: p?.name ?? "",
    description: "",
    quantity: p ? String(p.moq) : "",
    unit: p?.unit ?? "piece",
    currency: "INR",
    targetPrice: "",
    sample: sample ? "yes" : "no",
    country: "",
    otherCountry: "",
    city: "",
    neededBy: "",
    certifications: p ? p.certifications.filter((c) => CERTS.includes(c)) : [],
    company: "",
    name: "",
    email: "",
    phone: "",
    buyerType: "",
  };
}

function validate(step: number, f: FormState): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!f.category) e.category = "Please pick a category.";
    if (f.title.trim().length < 3) e.title = "Tell us the product you need.";
  }
  if (step === 1) {
    const q = Number(f.quantity);
    if (!f.quantity || !Number.isFinite(q) || q <= 0) e.quantity = "Enter a quantity greater than 0.";
    if (f.targetPrice && !(Number(f.targetPrice) > 0)) e.targetPrice = "Enter a valid price or leave it empty.";
  }
  if (step === 2) {
    if (!f.country) e.country = "Choose a destination country.";
    if (f.country === "Other" && !f.otherCountry.trim()) e.otherCountry = "Which country?";
    if (!f.city.trim()) e.city = "Enter a city or port.";
    if (!f.neededBy) e.neededBy = "Pick a date.";
    else if (f.neededBy < new Date().toISOString().slice(0, 10)) e.neededBy = "Date must be in the future.";
  }
  if (step === 3) {
    if (!f.company.trim()) e.company = "Company name is required.";
    if (!f.name.trim()) e.name = "Your name is required.";
    if (!isEmail(f.email)) e.email = "Enter a valid email.";
    if (!isPhone(f.phone)) e.phone = "Enter a phone / WhatsApp number with country code.";
    if (!f.buyerType) e.buyerType = "Choose your buyer type.";
  }
  return e;
}

export function PostRequirementWizard() {
  const params = useSearchParams();
  const [form, setForm] = useState<FormState>(() =>
    initialState(params.get("product"), params.get("sample") === "1"),
  );
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const next = () => {
    const e = validate(step, form);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const destination = `${form.city.trim()}, ${form.country === "Other" ? form.otherCountry.trim() : form.country}`;
  const priceINR = form.targetPrice
    ? Math.round(Number(form.targetPrice) * (form.currency === "USD" ? USD_TO_INR : 1))
    : undefined;

  const submit = () => {
    for (let s = 0; s < 4; s++) {
      const e = validate(s, form);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(s);
        return;
      }
    }
    const notes = [
      form.description.trim(),
      form.sample === "yes" ? "Sample needed before bulk order." : "",
      form.targetPrice && form.currency === "USD" ? `Target price quoted as USD ${form.targetPrice}/${form.unit}.` : "",
      `Contact: ${form.name} (${form.buyerType}, ${form.company}) · ${form.email} · ${form.phone}`,
    ]
      .filter(Boolean)
      .join(" ");

    demoActions.addRequirement({
      buyerId: DEMO_BUYER_ID,
      title: form.title.trim(),
      category: form.category as CategorySlug,
      quantity: Number(form.quantity),
      unit: form.unit,
      targetPrice: priceINR,
      destination,
      neededBy: form.neededBy,
      certifications: form.certifications,
      notes,
    });
    // addRequirement prepends to the list; read the new ID back from storage-backed state.
    setSubmittedId(readNewestRequirementId());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submittedId !== null) return <SuccessScreen id={submittedId} title={form.title} />;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <StepProgress steps={STEPS} current={step} />
      <p className="mt-3 text-center text-sm font-bold text-olive-dark sm:hidden">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </p>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 4) next();
          else submit();
        }}
        className="mt-6 rounded-2xl bg-cream p-4 sm:p-8"
      >
        {step === 0 && (
          <div className="space-y-5">
            <StepTitle>What do you need?</StepTitle>
            <fieldset>
              <legend className="mb-2 text-sm font-bold">Category</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {categories.map((c) => {
                  const active = form.category === c.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() => set("category", c.slug)}
                      className={`brush flex flex-col items-center gap-1 border-2 bg-white px-2 py-3 text-center transition-colors ${
                        active ? "border-olive text-olive-dark" : "border-transparent text-ink hover:border-sage"
                      }`}
                    >
                      <span className={`blob flex h-14 w-14 items-center justify-center ${active ? "bg-sage" : "bg-cream"}`}>
                        <CategoryIcon slug={c.slug} size={36} className="text-olive" />
                      </span>
                      <span className="text-xs font-bold leading-tight">{c.name}</span>
                    </button>
                  );
                })}
              </div>
              <ErrorText>{errors.category}</ErrorText>
            </fieldset>
            <Field label="Product name">
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Guntur Teja red chilli, stemless"
              />
              <ErrorText>{errors.title}</ErrorText>
            </Field>
            <Field label="Specifications (optional)" hint="Size, colour, grade, packaging, design references…">
              <textarea
                rows={3}
                className={inputClass}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <StepTitle>Quantity & price</StepTitle>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <Field label="Quantity">
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  className={inputClass}
                  value={form.quantity}
                  onChange={(e) => set("quantity", e.target.value)}
                  placeholder="e.g. 500"
                />
              </Field>
              <Field label="Unit">
                <select className={inputClass} value={form.unit} onChange={(e) => set("unit", e.target.value)}>
                  {UNITS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </Field>
            </div>
            <ErrorText>{errors.quantity}</ErrorText>
            <div>
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold">Target price per {form.unit} (optional)</span>
                <Segmented<Currency>
                  label="Currency"
                  value={form.currency}
                  onChange={(v) => set("currency", v)}
                  options={[
                    { value: "INR", label: "₹ INR" },
                    { value: "USD", label: "$ USD" },
                  ]}
                />
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted">
                  {form.currency === "INR" ? "₹" : "$"}
                </span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  className={`${inputClass} pl-8`}
                  value={form.targetPrice}
                  onChange={(e) => set("targetPrice", e.target.value)}
                  placeholder="Leave empty if you want ANOVEL to quote"
                />
              </div>
              {form.currency === "USD" && priceINR !== undefined && (
                <span className="mt-1 block text-xs text-muted">
                  ≈ ₹{priceINR.toLocaleString("en-IN")} per {form.unit} (at ₹{USD_TO_INR}/USD)
                </span>
              )}
              <ErrorText>{errors.targetPrice}</ErrorText>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold">Do you need a sample first?</span>
              <Segmented<"yes" | "no">
                label="Sample needed"
                value={form.sample}
                onChange={(v) => set("sample", v)}
                options={[
                  { value: "yes", label: "Yes, sample first" },
                  { value: "no", label: "No" },
                ]}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <StepTitle>Delivery</StepTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Destination country">
                <select className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)}>
                  <option value="">Select…</option>
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <ErrorText>{errors.country}</ErrorText>
              </Field>
              {form.country === "Other" && (
                <Field label="Country name">
                  <input
                    className={inputClass}
                    value={form.otherCountry}
                    onChange={(e) => set("otherCountry", e.target.value)}
                  />
                  <ErrorText>{errors.otherCountry}</ErrorText>
                </Field>
              )}
              <Field label="City / port">
                <input
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="e.g. New York, Jebel Ali, Mumbai"
                />
                <ErrorText>{errors.city}</ErrorText>
              </Field>
              <Field label="Needed by">
                <input
                  type="date"
                  className={inputClass}
                  value={form.neededBy}
                  onChange={(e) => set("neededBy", e.target.value)}
                />
                <ErrorText>{errors.neededBy}</ErrorText>
              </Field>
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-bold">Certifications required</legend>
              <div className="flex flex-wrap gap-2">
                {CERTS.map((c) => (
                  <CheckChip
                    key={c}
                    checked={form.certifications.includes(c)}
                    onChange={(on) =>
                      set(
                        "certifications",
                        on ? [...form.certifications, c] : form.certifications.filter((x) => x !== c),
                      )
                    }
                  >
                    {c}
                  </CheckChip>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <StepTitle>Your details</StepTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company">
                <input
                  className={inputClass}
                  autoComplete="organization"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                />
                <ErrorText>{errors.company}</ErrorText>
              </Field>
              <Field label="Your name">
                <input
                  className={inputClass}
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                <ErrorText>{errors.name}</ErrorText>
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className={inputClass}
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                <ErrorText>{errors.email}</ErrorText>
              </Field>
              <Field label="Phone / WhatsApp">
                <input
                  type="tel"
                  className={inputClass}
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+1 555 010 2000"
                />
                <ErrorText>{errors.phone}</ErrorText>
              </Field>
              <Field label="Buyer type">
                <select
                  className={inputClass}
                  value={form.buyerType}
                  onChange={(e) => set("buyerType", e.target.value)}
                >
                  <option value="">Select…</option>
                  {BUYER_TYPES.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                <ErrorText>{errors.buyerType}</ErrorText>
              </Field>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <StepTitle>Review your requirement</StepTitle>
            <ReviewBlock title="What you need" onEdit={() => setStep(0)}>
              <Row k="Category" v={categories.find((c) => c.slug === form.category)?.name ?? "—"} />
              <Row k="Product" v={form.title} />
              {form.description && <Row k="Specs" v={form.description} />}
            </ReviewBlock>
            <ReviewBlock title="Quantity & price" onEdit={() => setStep(1)}>
              <Row k="Quantity" v={`${Number(form.quantity).toLocaleString("en-IN")} ${form.unit}`} />
              <Row
                k="Target price"
                v={
                  form.targetPrice
                    ? `${form.currency === "INR" ? "₹" : "$"}${form.targetPrice} / ${form.unit}`
                    : "ANOVEL to quote"
                }
              />
              <Row k="Sample" v={form.sample === "yes" ? "Yes, sample first" : "No"} />
            </ReviewBlock>
            <ReviewBlock title="Delivery" onEdit={() => setStep(2)}>
              <Row k="Destination" v={destination} />
              <Row k="Needed by" v={form.neededBy} />
              <Row k="Certifications" v={form.certifications.join(", ") || "None"} />
            </ReviewBlock>
            <ReviewBlock title="Your details" onEdit={() => setStep(3)}>
              <Row k="Company" v={`${form.company} (${form.buyerType})`} />
              <Row k="Contact" v={form.name} />
              <Row k="Email" v={form.email} />
              <Row k="Phone" v={form.phone} />
            </ReviewBlock>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={back}>
              <ArrowLeft size={16} /> Back
            </Button>
          ) : (
            <span />
          )}
          {step < 4 ? (
            <Button type="submit" size="lg">
              Next <ArrowRight size={18} />
            </Button>
          ) : (
            <Button type="submit" size="lg" variant="orange">
              <Send size={18} /> Submit requirement
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function readNewestRequirementId(): string {
  try {
    const raw = window.localStorage.getItem("anovel-demo-v1");
    const id = raw ? (JSON.parse(raw) as { requirements?: { id: string }[] }).requirements?.[0]?.id : undefined;
    if (id) return id;
  } catch {
    // fall through to a generated ID
  }
  return `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-hand text-3xl text-olive-dark">{children}</h2>;
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <section className="brush bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-hand text-xl text-ink">{title}</h3>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 text-xs font-bold text-olive">
          <Pencil size={12} /> Edit
        </button>
      </div>
      <dl className="space-y-1 text-sm">{children}</dl>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2">
      <dt className="text-muted">{k}</dt>
      <dd className="break-words font-bold">{v}</dd>
    </div>
  );
}

function SuccessScreen({ id, title }: { id: string; title: string }) {
  const next = [
    { Icon: HandshakeIcon, t: "Matching within 48h", d: "ANOVEL matches your requirement with verified producers." },
    { Icon: QuoteIcon, t: "Quotations", d: "You receive clear quotations with price, MOQ and lead time." },
    { Icon: SackIcon, t: "Samples", d: "Approve a sample before you commit to bulk." },
    { Icon: TruckIcon, t: "Order & delivery", d: "Pay securely, we quality-check and ship to you." },
  ];
  return (
    <div className="mx-auto max-w-3xl text-center">
      <CheckCircle2 size={44} className="mx-auto text-olive" />
      <h2 className="mt-2 font-hand text-5xl text-olive-dark sm:text-6xl">Thank you!</h2>
      <p className="mt-2 text-muted">Your requirement for “{title}” has been received.</p>
      <p className="brush mx-auto mt-4 inline-block bg-olive px-5 py-2 font-hand text-2xl text-white">
        Requirement ID: {id}
      </p>

      <h3 className="mt-10 font-hand text-2xl">What happens next</h3>
      <ol className="mt-4 grid gap-4 text-left sm:grid-cols-2">
        {next.map(({ Icon, t, d }, i) => (
          <li key={t} className="flex items-start gap-3 rounded-xl bg-cream p-4">
            <span className="blob flex h-14 w-14 shrink-0 items-center justify-center bg-sage text-olive-dark">
              <Icon size={34} />
            </span>
            <span>
              <span className="font-hand text-xl text-olive-dark">
                {i + 1}. {t}
              </span>
              <span className="block text-sm text-muted">{d}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/buyer/requirements" size="lg">
          Track in your buyer dashboard
        </ButtonLink>
        <ButtonLink href="/products" size="lg" variant="outline">
          Browse products
        </ButtonLink>
      </div>
    </div>
  );
}
