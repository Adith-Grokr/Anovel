import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = { title: "Join ANOVEL" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-cream-2" />}>
      <RegisterForm />
    </Suspense>
  );
}
