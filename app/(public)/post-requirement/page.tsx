import { Suspense } from "react";
import type { Metadata } from "next";
import { PostRequirementWizard } from "@/components/forms/PostRequirementWizard";
import { ShieldCheckIcon } from "@/components/site/HandIcons";

export const metadata: Metadata = {
  title: "Post a requirement — ANOVEL",
  description: "Tell ANOVEL what you need. We match you with verified Indian village producers within 48 hours.",
};

export default function PostRequirementPage() {
  return (
    <div className="px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="heading-swash font-hand text-4xl leading-tight sm:text-5xl">Post a requirement</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">
          Tell us what you need once. ANOVEL matches you with verified producers, sends quotations and handles
          samples, quality checks and shipping.
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-olive">
          <ShieldCheckIcon size={20} /> Free during pilot · Takes about 2 minutes
        </p>
      </div>
      <div className="mt-8">
        <Suspense fallback={<div className="mx-auto h-96 max-w-3xl animate-pulse rounded-2xl bg-cream" />}>
          <PostRequirementWizard />
        </Suspense>
      </div>
    </div>
  );
}
