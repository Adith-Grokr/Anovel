import { ProducerShell } from "@/components/producer/ProducerShell";

export const metadata = { title: "Producer dashboard — ANOVEL" };

export default function ProducerLayout({ children }: { children: React.ReactNode }) {
  return <ProducerShell>{children}</ProducerShell>;
}
