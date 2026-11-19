import { Suspense } from "react";
import { NewProductForm } from "@/components/producer/NewProductForm";

export default function NewProductPage() {
  return (
    <Suspense fallback={null}>
      <NewProductForm />
    </Suspense>
  );
}
