# ANOVEL — Phase 1 clickable UI demo

From India's villages to the world. A front-end-only demo of the ANOVEL B2B marketplace
(public website plus Producer, Buyer and Admin dashboards), using sample data.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
```

## Demo script (for client meetings)

1. **Home** `/`: show the village → world story, the clusters, and how sourcing works.
2. **Products** `/products`: filter by category, open a product, then click **Request quotation**.
3. **Post a requirement** `/post-requirement`: complete the 4 steps and submit. A new `REQ-…` is created.
4. **Admin** (`/login` → "Demo: ANOVEL Admin") → Requirements: open the new requirement, match producers, build a quotation (producer price + margin) and send it.
5. **Buyer** (`/buyer`) → Quotations: compare and accept. An order is created.
6. **Producer** (`/producer`) → Orders: upload a production update, then mark it ready for QC.
7. **Admin** → Quality: pass the QC. Logistics: ship with tracking, then mark delivered.
8. **Buyer** → Orders: view the QC report and tracking, leave feedback, reorder.

Demo data is saved in the browser (localStorage). Use **Admin → Reset demo data** to start fresh.

## Structure

- `app/(public)`: public site (home, products, producers, villages, stories, post requirement, how it works, about, contact)
- `app/(auth)`: login and register
- `app/producer`, `app/buyer`, `app/admin`: dashboards
- `components/site`: Groundy-style design system (logo, hand-drawn icons, header, footer, buttons)
- `components/dashboard`: shared dashboard shell and widgets
- `lib/types.ts`: domain types. Phase 2 turns these into the Supabase schema.
- `lib/mock/data.ts`: sample data. `lib/demo-store.ts` holds the demo state shared across dashboards.

## Next phases

See the project plan: Phase 2 adds the Supabase backend (Mumbai region), auth and KYC storage. Phase 3 makes the core journey live with
email and WhatsApp notifications. Phase 4 adds Razorpay payments. Phase 5 adds multi-language, auto-matching and apps.

Photos are from Wikimedia Commons under free licences (see `CREDITS.md`). Replace them with ANOVEL's own photos before launch.
