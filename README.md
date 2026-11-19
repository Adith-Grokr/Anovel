# ANOVEL — From India's villages to the world

> **ANOVEL connects the production power of Indian villages with the demand of the world.**

ANOVEL (Anovel Technologies, Hyderabad) is a **B2B marketplace**. It connects rural producers (farmers, weavers, artisans, self-help groups, FPOs and rural MSMEs) with **Indian and international bulk buyers**: importers, wholesalers, retailers, fashion brands, designers and distributors in the USA, UAE, UK, Singapore, Canada, Australia, Germany and India.

This repository holds the **Phase 1 clickable UI demo**. It is a complete front-end of the website and the three dashboards, built to show clients and investors how the platform works. It uses **sample data only**: there is no backend, database, login system or payment processing yet. Those come in later phases (see [Roadmap](#roadmap)).

---

## Table of contents

1. [How ANOVEL works](#how-anovel-works)
2. [What's in this demo](#whats-in-this-demo)
3. [Quick start](#quick-start)
4. [Client demo walkthrough](#client-demo-walkthrough)
5. [All pages](#all-pages)
6. [Tech stack](#tech-stack)
7. [Project structure](#project-structure)
8. [How the demo data works](#how-the-demo-data-works)
9. [Design system](#design-system)
10. [Common changes: how to…](#common-changes-how-to)
11. [Placeholders to replace before launch](#placeholders-to-replace-before-launch)
12. [Deploying the demo online](#deploying-the-demo-online)
13. [Roadmap](#roadmap)
14. [Running costs as ANOVEL grows](#running-costs-as-anovel-grows)
15. [Troubleshooting](#troubleshooting)
16. [Credits](#credits)

---

## How ANOVEL works

Unlike a normal online shop, buyers don't add to cart and check out. **ANOVEL sits in the middle** and manages every step:

```
Village producer ──► ANOVEL ──► Buyer
  registers,         verifies,     posts a requirement,
  lists products     matches,      receives quotations,
  & capacity         quality-      orders, tracks delivery
                     checks, ships
```

**The core journey (the most important flow in V1):**

```
Buyer requirement → ANOVEL matching → Quotation → Sample → Order → Quality check → Delivery → Feedback → Reorder
```

**Three types of users:**

| User | Who | What they do |
|---|---|---|
| 🌾 **Producer** | Farmers, weavers, artisans, SHGs, FPOs, rural MSMEs | Register → get verified → list products and monthly capacity → receive enquiries → accept orders → upload production updates → get paid |
| 🌍 **Buyer** | Importers, wholesalers, retailers, brands, designers, distributors | Search → post requirements → compare quotations → request samples → order → track QC and delivery → give feedback, reorder |
| 🏢 **ANOVEL team (Admin)** | Operations, quality, sales, logistics, management | Verify producers → match requirements to producers → build quotations (producer price + ANOVEL margin) → run quality checks → arrange shipping → record payments → resolve complaints |

**Pricing privacy:** buyers see only ANOVEL's quoted price, and producers see only what they will be paid. The ANOVEL margin is visible to the admin team only.

---

## What's in this demo

- **Public website** in the visual style of the "Groundy" reference design: cream, olive, sage, orange and plum colours, handwritten headings and hand-drawn icons.
- **Producer dashboard**: deliberately very simple for rural users, with big icon tiles, few words, large buttons and a WhatsApp help button.
- **Buyer dashboard**: requirements, quotation comparison, samples, order tracking with QC reports, complaints and account settings.
- **Admin dashboard**: KPIs against the 6-month targets, producer verification, manual matching, a quotation builder, an order pipeline, quality checks, logistics, a payments ledger, complaints, and reports with CSV export.
- **A connected demo**: actions in one dashboard show up in the others. For example, an admin sends a quote, the buyer accepts it, and the producer sees the order.
- **Mobile-first**: built for phones first, from 360px wide upwards, and also works on desktop.

---

## Quick start

### Requirements

- **Node.js 18.18 or newer** (developed on Node 22). Check with `node -v`. Download from https://nodejs.org.
- **npm**, which comes with Node.
- **git**, to clone the repository.

### Run it on your computer

```bash
# 1. Download the code
git clone https://github.com/Adith-Grokr/Anovel.git
cd Anovel

# 2. Install dependencies (first time only, takes 1–2 minutes)
npm install

# 3. Start the development server
npm run dev
```

Then open **http://localhost:3000** in your browser.

### Available commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts the site locally with live reload while you edit (http://localhost:3000) |
| `npm run build` | Creates an optimised production build (run this to check everything compiles) |
| `npm run start` | Serves the production build (run `npm run build` first) |
| `npm run lint` | Checks the code for common mistakes |
| `npx tsc --noEmit` | Checks all TypeScript types |

### Viewing the phone layout on a computer

In Chrome, press `F12`, then the phone/tablet icon (or `Ctrl+Shift+M` / `Cmd+Shift+M`), and choose a phone such as "iPhone SE" or "Galaxy S8".

---

## Client demo walkthrough

Use this script to show the complete village-to-buyer journey in about 10 minutes. Demo changes are saved in the browser, so do the steps in order in **the same browser**.

| # | Who | Where | What to do |
|---|---|---|---|
| 1 | Visitor | `/` | Show the home page: the village-to-world steps, village clusters, how sourcing works and village stories. |
| 2 | Buyer | `/products` | Filter by a category (e.g. Spices), open a product, and point out the verified badge, MOQ and monthly capacity. Click **Request quotation**. |
| 3 | Buyer | `/post-requirement` | Complete the 4 steps (product → quantity and price → delivery → contact) and submit. Note the new `REQ-…` number. |
| 4 | Admin | `/login` → **Demo: ANOVEL Admin** → Requirements | Open the new requirement. **Match** one or more producers and save. In the **quotation builder**, set the producer price and ANOVEL margin, then **Send to buyer**. |
| 5 | Buyer | `/buyer` → Quotations | Compare the quotes side by side, then **Accept & place order**. A new order is created. |
| 6 | Producer | `/producer` → Orders | Open the order, **upload a production update**, then mark it **Ready for quality check**. Show that the producer sees only their own payout. |
| 7 | Admin | Quality → Logistics | Fill in the QC checklist and **Pass** it. Then dispatch it with a carrier and tracking number, and later **Mark delivered**. |
| 8 | Buyer | `/buyer` → Orders | Open the order: show the timeline, QC report and tracking, then leave **feedback** and click **Reorder**. |
| 9 | Admin | Reports | Show the 6 key metrics and **Export CSV**. |

**To start the demo fresh:** go to **Admin → Overview → Reset demo data**.

**Ready-made examples, if you're short on time:**

- `/buyer/orders/ORD-2190`: a delivered order with QC report, DHL tracking and feedback.
- `/admin/requirements/REQ-1044`: a new requirement ready to match.
- `/producer`: the producer home screen with big tiles.

---

## All pages

### Public website

| Page | URL |
|---|---|
| Home | `/` |
| Product catalogue (filters, sort, category band) | `/products`, `/products?category=spices` |
| Product detail | `/products/[slug]`, e.g. `/products/pochampally-double-ikat-silk-saree` |
| Producer profile | `/producers/[slug]`, e.g. `/producers/sri-lakshmi-weavers` |
| Villages and clusters | `/villages`, `/villages/[slug]` |
| Village stories | `/stories` |
| Post a requirement (4-step form) | `/post-requirement` (also accepts `?product=<slug>&sample=1`) |
| How it works, with FAQ | `/how-it-works` |
| About | `/about` |
| Contact | `/contact` |
| Login (with demo shortcuts) | `/login` |
| Register (producer or buyer) | `/register`, `/register?role=producer`, `/register?role=buyer` |

### Producer dashboard (demo user: Sri Lakshmi Handloom Weavers, Pochampally)

`/producer` (home tiles) · `/producer/products` · `/producer/products/new` · `/producer/enquiries` · `/producer/orders` · `/producer/orders/[id]` · `/producer/payments` · `/producer/profile` (KYC) · `/producer/village` · `/producer/support`

### Buyer dashboard (demo user: Anna Weber, Hanse Textil GmbH, Germany)

`/buyer` · `/buyer/requirements` · `/buyer/requirements/[id]` · `/buyer/quotations` · `/buyer/orders` · `/buyer/orders/[id]` · `/buyer/samples` · `/buyer/saved` · `/buyer/complaints` · `/buyer/account`

### Admin dashboard (demo user: ANOVEL operations)

`/admin` · `/admin/requirements` · `/admin/requirements/[id]` (matching + quotation builder) · `/admin/orders` · `/admin/orders/[id]` · `/admin/producers` · `/admin/products` · `/admin/quotations` · `/admin/quality` · `/admin/logistics` · `/admin/payments` · `/admin/buyers` · `/admin/complaints` · `/admin/reports`

---

## Tech stack

| Part | Technology | Why |
|---|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) | One codebase for the website and dashboards. Fast, SEO-friendly for international buyers, and easy to host. |
| Language | TypeScript | Catches mistakes early. The data types become the database design in Phase 2. |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) | Fast to build with and easy to keep consistent with the design tokens. |
| Icons | Hand-drawn SVGs (website) + [lucide-react](https://lucide.dev) (dashboards) | Groundy-style illustration plus clear UI icons. |
| Fonts | Google Fonts: Patrick Hand, Kaushan Script, Lato | The closest free matches to the reference design. |
| Images | `next/image` | Automatically resized and compressed, so pages load fast on budget phones and slow 4G. |
| Demo data | TypeScript files + browser `localStorage` | No server needed for the demo. |

---

## Project structure

```
anovel/
├── app/                         # Pages (each folder = a URL)
│   ├── layout.tsx               # Root layout: fonts, page title
│   ├── globals.css              # Colours, fonts, layout rules, brush/blob shapes
│   ├── (public)/                # Public website (shares header + footer)
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Home page
│   │   ├── products/  producers/  villages/  stories/
│   │   ├── post-requirement/  how-it-works/  about/  contact/
│   ├── (auth)/                  # Login and register (split photo layout)
│   ├── producer/                # Producer dashboard
│   ├── buyer/                   # Buyer dashboard
│   └── admin/                   # Admin dashboard
│
├── components/
│   ├── site/                    # Shared website pieces
│   │   ├── Logo.tsx             # "anovel" logo badge (swap for the real logo here)
│   │   ├── HandIcons.tsx        # Hand-drawn icons (steps + 7 categories)
│   │   ├── Header.tsx           # Top navigation + plum product mega-menu
│   │   ├── Footer.tsx
│   │   ├── SiteFrame.tsx        # Full-width page frame (header + content + footer)
│   │   └── ui.tsx               # Buttons, badges, headings, form fields
│   ├── home/                    # Home page sections (hero, steps, clusters, banner, band, stories)
│   ├── catalog/                 # Product, producer, village and story cards, filters
│   ├── forms/                   # Post-requirement wizard, login, register, contact
│   ├── dashboard/               # Shared dashboard shell + widgets (timeline, stat cards…)
│   ├── producer/  buyer/  admin/  # Dashboard-specific components
│
├── lib/
│   ├── types.ts                 # Data types: Producer, Product, Requirement, Quotation, Order…
│   ├── mock/data.ts             # All sample data (villages, producers, products, buyers, orders…)
│   └── demo-store.ts            # Shared demo state (saved in the browser) + actions
│
├── public/images/               # Photos (free-licence, see CREDITS.md)
├── CREDITS.md                   # Photo authors and licences
└── README.md                    # This file
```

---

## How the demo data works

- **`lib/mock/data.ts`** holds all starting data:
  - 6 villages/clusters: Pochampally, Guntur, Kondapalli, Channapatna, Vasmat, Purulia
  - 8 producers and 15 products across 7 categories
  - 5 buyers: Germany, UAE, USA, UK, Singapore
  - requirements, quotations, orders, complaints and stories
- **`lib/demo-store.ts`** copies that data into the browser's `localStorage` the first time it's used. Every dashboard reads from and writes to this shared store, which is why actions carry across Producer, Buyer and Admin.
- **Changes are saved per browser.** Another device or an incognito window starts from the original data.
- **To reset:** use **Admin → Overview → Reset demo data**, or clear the site's storage in your browser.
- **Some actions are page-only and reset on reload:** product stock +/−, newly added products, KYC uploads, the product verified toggle, samples and saved items. They're for showing the interface only.
- **File uploads are not uploaded.** The demo shows the chosen file name only.

In **Phase 2**, `lib/mock/data.ts` and `lib/demo-store.ts` are replaced by a real database (Supabase). The page designs stay the same because they already use the types in `lib/types.ts`.

---

## Design system

The look matches the "Groundy" reference design, adapted for ANOVEL.

**Colours** (defined in `app/globals.css`, used as Tailwind classes such as `bg-olive`, `text-plum`):

| Name | Hex | Used for |
|---|---|---|
| `cream` | `#f1eddd` | Section backgrounds, card panels |
| `olive` | `#5f7a3a` | Main buttons, step boxes, headings |
| `sage` | `#c8cfae` | Icon blobs |
| `orange` | `#e2632a` | Logo, active links, accents |
| `plum` | `#5a3a45` | Mega-menu, dark buttons, footer, dashboard sidebar |
| `mauve` | `#d8cfd1` | Category icon band |
| `ink` | `#4a3b3f` | Body text |

**Fonts:**

- *Patrick Hand* for handwritten headings (`font-hand`).
- *Kaushan Script* for the logo (`font-logo`).
- *Lato* for body text (the default).

**Shapes:**

- `.brush` for irregular hand-made boxes and buttons.
- `.blob` for organic icon backgrounds.
- `.heading-swash` for the brush stroke behind section headings.

**Layout:**

- Every section's background spans the full screen width.
- Content stays in a centred column up to **1200px** wide, with 16px side margins on phones.
- Add the class `bleed` to make a band inside a page span the full width.

**Reusable components:**

- `components/site/ui.tsx`: `SectionHeading`, `Button`, `ButtonLink`, `Badge`, `VerifiedBadge`, `Field`, `inputClass`.
- `components/dashboard/widgets.tsx`: `PageTitle`, `Card`, `StatCard`, `BigTile`, `StatusTimeline`, `StatusPill`, `EmptyState`, `FileDrop`.

---

## Common changes: how to…

| I want to… | Do this |
|---|---|
| **Use the real ANOVEL logo** | Put the file in `public/` (e.g. `public/logo.svg`) and replace the contents of `components/site/Logo.tsx` with an `<Image src="/logo.svg" …/>`. It updates everywhere. |
| **Replace photos** | Put your photos in `public/images/`, keeping the same file names (e.g. `hero-weaver.jpg`) or updating the names in `lib/mock/data.ts` and `components/home/HeroCarousel.tsx`. Landscape photos about 1600px wide work best. Update `CREDITS.md`. |
| **Change home page text** | Edit the files in `components/home/`: `HeroCarousel.tsx` (slides), `ProcessSteps.tsx`, `SourcingBanner.tsx`, `ProducerCta.tsx`. |
| **Add or edit products, producers or villages** | Edit `lib/mock/data.ts`. Follow the shape of the existing entries; TypeScript will flag mistakes. Then use **Reset demo data** in Admin. |
| **Change a colour** | Edit the colour value in `app/globals.css` (the `@theme` block). It updates site-wide. |
| **Change the WhatsApp number** | Search the project for `919010325138` and replace it. |
| **Change menu links** | Edit `components/site/Header.tsx` (website) or the shell files `components/producer/ProducerShell.tsx`, `components/buyer/BuyerShell.tsx`, `components/admin/AdminShell.tsx` (dashboards). |
| **Change categories** | Edit `categories` in `lib/mock/data.ts` and the `CategorySlug` type in `lib/types.ts`, and add an icon in `components/site/HandIcons.tsx`. |

---

## Placeholders to replace before launch

These are invented for the demo and must be replaced with real details:

- **Photos**: currently free-licence Wikimedia Commons images (see `CREDITS.md`). Replace them with ANOVEL's own photos of real producers, with their consent.
- **Logo**: a styled text badge. Replace it with the real logo file.
- **Email addresses** on the Contact page (`hello@anovel.in`, `partners@anovel.in`).
- **All producers, buyers, orders, prices, team members, bank details and addresses** in the sample data.
- **The testimonial quote** on the login page and the example clusters on the About page.
- **Legal pages**: Terms, Privacy Policy (DPDP Act), Refund & Cancellation, Shipping and Grievance Officer. The footer links are placeholders. These should come from your CA or lawyer.

---

## Deploying the demo online

To share a link with clients, the easiest free option is **Vercel**, made by the creators of Next.js:

1. Sign in at https://vercel.com with the GitHub account that owns this repository.
2. Click **Add New → Project**, choose the `Anovel` repository, and click **Deploy**. No settings need changing.
3. After about 2 minutes you get a link like `https://anovel.vercel.app` to share on WhatsApp.
4. Every new push to the `main` branch redeploys automatically.

Vercel's free "Hobby" plan is for **non-commercial use**. It is fine for a demo, but switch to Vercel Pro (about $20/month) or Cloudflare Pages when ANOVEL launches commercially. Later you can connect your own domain (e.g. `anovel.in`) in the project settings.

---

## Roadmap

| Phase | What | Status |
|---|---|---|
| **0: Business setup** | Register the company, GST, buy the domain, Razorpay account, SMS DLT registration, legal pages from CA/lawyer, name a Grievance Officer, collect real producer photos and data | Runs alongside development |
| **1: Clickable UI demo** | Public website + Producer, Buyer and Admin dashboards with sample data | ✅ **This repository** |
| **2: Backend foundation** | Supabase database (Mumbai region, data stays in India), real login (email, Google, phone OTP), roles and permissions, private KYC document storage, producer onboarding, admin verification | Next |
| **3: Core journey live** | Real requirements → matching → quotations → samples → orders → QC → logistics → delivery → feedback. Email and WhatsApp notifications at every step. CSV exports and analytics. | |
| **4: Payments** | Razorpay (UPI, cards, net banking, NEFT/RTGS), receipts, then GST invoices, commission tracking, producer payouts, international payments | |
| **5: Scale (V2)** | Hindi, Telugu, Tamil, Kannada, Gujarati and Punjabi; automatic matching; village intelligence map; mobile apps; advanced analytics; demand forecasting; logistics integrations; traceability | |

---

## Running costs as ANOVEL grows

The platform is designed to cost almost nothing at the start and grow with usage:

| Stage | Usage | Approx. monthly cost |
|---|---|---|
| Client demo (now) | This demo on Vercel | **₹0** (domain about ₹1,000 per year) |
| Pilot | Up to ~50 producers, ~300 buyers | **₹0–1,500** (free tiers + per-message SMS/WhatsApp) |
| Live orders | 100–500 producers, real payments | **₹5,000–8,000** (database + hosting plans + messaging) |
| Scale | Multiple states, apps, multiple languages | **₹20,000–50,000+** |

Payment gateway fees (Razorpay, about 2% per transaction) are charged per payment and are separate from these.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm: command not found` | Install Node.js from https://nodejs.org, then reopen the terminal. |
| `Port 3000 is already in use` | Run `npm run dev -- --port 3001` and open http://localhost:3001. |
| Changes in one dashboard don't show in another | Use the same browser (not incognito) for all dashboards. |
| The demo is in a strange state | **Admin → Overview → Reset demo data**. |
| Fonts look wrong | Check you are online: fonts load from Google Fonts during build. |
| `npm install` fails | Delete the `node_modules` folder and `package-lock.json`, then run `npm install` again. Make sure Node is version 18.18+. |

---

## Credits

- Design inspired by the "Groundy" concept by Riccardo Rivieccio. Layout and style were adapted, and no assets were copied.
- Photos are from [Wikimedia Commons](https://commons.wikimedia.org) under free licences. The authors and licences for each photo are in [`CREDITS.md`](./CREDITS.md).
- Built for **Anovel Technologies**, Hyderabad, Telangana, India.
