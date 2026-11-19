// Shared domain types. Phase 2 reuses these as the database schema (Supabase).

export type CategorySlug =
  | "handloom"
  | "handicrafts"
  | "spices"
  | "grains"
  | "organic"
  | "home-decor"
  | "jute-eco";

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string; // short label for nav / mega-menu
}

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface Village {
  slug: string;
  name: string; // e.g. "Pochampally"
  district: string;
  state: string;
  clusterName: string; // e.g. "Pochampally Ikat Cluster"
  specialty: string;
  producersCount: number;
  image: string;
  story: string;
  lat: number;
  lng: number;
}

export interface Producer {
  slug: string;
  name: string; // person or SHG / FPO name
  type: "Weaver" | "Farmer" | "Artisan" | "SHG" | "FPO" | "Rural MSME";
  villageSlug: string;
  phone: string;
  members: number;
  since: number;
  verification: VerificationStatus;
  kyc: { pan: boolean; aadhaar: boolean; gstin: boolean; bank: boolean };
  rating: number;
  image: string;
  about: string;
  categories: CategorySlug[];
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  producerSlug: string;
  images: string[];
  priceMin: number; // INR per unit
  priceMax: number;
  unit: string; // "metre", "kg", "piece"
  moq: number;
  monthlyCapacity: number;
  stock: number;
  leadTimeDays: number;
  certifications: string[];
  description: string;
  verified: boolean;
  exportReady: boolean;
}

export interface Buyer {
  id: string;
  company: string;
  contactName: string;
  country: string;
  flag: string;
  type: "Importer" | "Wholesaler" | "Retailer" | "Fashion brand" | "Designer" | "Distributor";
  email: string;
}

export type RequirementStatus = "new" | "matching" | "quoted" | "closed";

export interface Requirement {
  id: string;
  buyerId: string;
  title: string;
  category: CategorySlug;
  quantity: number;
  unit: string;
  targetPrice?: number; // INR per unit
  destination: string;
  neededBy: string; // ISO date
  certifications: string[];
  notes: string;
  status: RequirementStatus;
  createdAt: string;
  matchedProducerSlugs: string[];
}

export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected";

export interface Quotation {
  id: string;
  requirementId: string;
  producerSlug: string;
  productSlug: string;
  producerPrice: number; // INR per unit paid to producer
  marginPct: number; // ANOVEL margin
  buyerPrice: number; // INR per unit quoted to buyer
  quantity: number;
  leadTimeDays: number;
  sampleAvailable: boolean;
  validUntil: string;
  status: QuotationStatus;
}

export const ORDER_STAGES = [
  "Order placed",
  "In production",
  "Quality check",
  "Shipped",
  "Delivered",
] as const;
export type OrderStage = (typeof ORDER_STAGES)[number];

export interface OrderEvent {
  stage: OrderStage;
  date: string;
  note: string;
}

export type PaymentStatus = "pending" | "advance-received" | "paid" | "settled";

export interface Order {
  id: string;
  quotationId: string;
  buyerId: string;
  producerSlug: string;
  productSlug: string;
  quantity: number;
  unit: string;
  amount: number; // INR total billed to buyer
  producerAmount: number; // INR to producer
  stage: OrderStage;
  events: OrderEvent[];
  payment: PaymentStatus;
  destination: string;
  trackingNo?: string;
  carrier?: string;
  qc?: { passed: boolean; inspector: string; date: string; notes: string };
  createdAt: string;
}

export interface Complaint {
  id: string;
  orderId: string;
  raisedBy: "buyer" | "producer";
  subject: string;
  status: "open" | "resolved";
  date: string;
}

export interface Story {
  slug: string;
  title: string;
  date: string;
  tag: "village" | "craft" | "export" | "farming";
  image: string;
  excerpt: string;
}
