"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button, Field, inputClass } from "@/components/site/ui";
import { ErrorText, isEmail } from "./fields";

const TOPICS = ["I'm a buyer", "I'm a producer", "Partnerships", "Press / other"] as const;

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm({ defaultTopic = TOPICS[0] }: { defaultTopic?: (typeof TOPICS)[number] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>(defaultTopic);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl bg-cream p-6 text-center" role="status">
        <CheckCircle2 size={40} className="mx-auto text-olive" />
        <p className="mt-2 font-hand text-4xl text-olive-dark">Message sent!</p>
        <p className="mt-1 text-sm text-muted">
          Thanks {name.split(" ")[0]}. The ANOVEL team will reply to {email} within one working day.
        </p>
        <Button
          variant="outline"
          className="mt-5"
          onClick={() => {
            setSent(false);
            setMessage("");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-4 rounded-2xl bg-cream p-5 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        const errs: Errors = {};
        if (!name.trim()) errs.name = "Please enter your name.";
        if (!isEmail(email)) errs.email = "Please enter a valid email.";
        if (message.trim().length < 10) errs.message = "Tell us a little more (at least 10 characters).";
        setErrors(errs);
        if (Object.keys(errs).length === 0) setSent(true);
      }}
    >
      <h2 className="font-hand text-3xl text-olive-dark">Write to us</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name">
          <input className={inputClass} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          <ErrorText>{errors.name}</ErrorText>
        </Field>
        <Field label="Email">
          <input
            type="email"
            className={inputClass}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ErrorText>{errors.email}</ErrorText>
        </Field>
      </div>
      <Field label="Topic">
        <select className={inputClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field label="Message">
        <textarea rows={5} className={inputClass} value={message} onChange={(e) => setMessage(e.target.value)} />
        <ErrorText>{errors.message}</ErrorText>
      </Field>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <Send size={18} /> Send message
      </Button>
    </form>
  );
}
