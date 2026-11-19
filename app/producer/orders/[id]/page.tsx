"use client";

import { useParams } from "next/navigation";
import { OrderDetail } from "@/components/producer/OrderDetail";

export default function ProducerOrderPage() {
  const { id } = useParams<{ id: string }>();
  return <OrderDetail id={decodeURIComponent(id)} />;
}
