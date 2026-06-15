# 🌿 Amazon Second Chance — Complete Project Status Report
> **HackOn Hackathon | Team Progress Document**
> Last Updated: June 14, 2026

---

## 🚀 Latest UI & UX Updates (For Teammates)
- **Rebranding**: Globally renamed "Second Life" to **"Amazon Second Chance"** for 100% brand consistency.
- **Unified Navigation**: Replaced the cluttered portal links with a unified **"Account & Lists" dropdown** in the main navbar. Customers and Partners can now cleanly access their specific dashboards from one place.
- **Premium Typography**: Upgraded the app to use the authentic **Amazon Ember** font globally, with rounded **Nunito** for classy headers.
- **Amazon Aesthetics**: Partner cards and buttons now exactly match the real Amazon B2B aesthetic.
- **Unified Dashboards**: Squared off all corners and removed vibrant borders across Kirana, NGO, Seller, and Customer dashboards for a professional, flat UI.
- **Custom Icons**: Generated and integrated minimalist, pencil-drawn icons with Amazon yellow accents for portals.

---

## 📌 Table of Contents

1. [Problem Statement](#problem-statement)
2. [What We Are Building](#what-we-are-building)
3. [Technology Stack](#technology-stack)
4. [Project Folder Structure (A–Z)](#project-folder-structure)
5. [✅ What Is DONE](#what-is-done)
6. [🔨 What Is IN PROGRESS](#what-is-in-progress)
7. [❌ What Is NOT DONE YET](#what-is-not-done-yet)
8. [Feature Completion Table](#feature-completion-table)
9. [Docs vs Code Coverage](#docs-vs-code-coverage)
10. [How Close Are We?](#how-close-are-we)
11. [What Needs to Be Done Next (Priority Order)](#what-needs-to-be-done-next)

---

## Problem Statement

> *"Millions of products bought online are returned, unused, or discarded despite being perfectly usable. Returns are expensive for customers, sellers, and the planet. Customers also struggle to trust refurbished or second-hand products.*
>
> *What if Amazon could create an intelligent ecosystem where returned or unused products automatically find their next best owner?"*

### The 6 Core Features Demanded by the Problem:
| # | Feature | Status |
|---|---------|--------|
| 1 | AI deciding whether an item should be resold, refurbished, donated, recycled, or exchanged | 🟡 Partial |
| 2 | Smart quality grading through image/video analysis | 🟡 Partial |
| 3 | Personalized recommendations for certified refurbished products | 🟡 Partial |
| 4 | Sustainable incentives and "green credits" for customers | 🟢 Done |
| 5 | Easy peer-to-peer resale inside Amazon's trusted ecosystem | 🟢 Done |
| 6 | Predictive return prevention before a purchase is even made | 🟢 Done |

---

## What We Are Building

**Amazon Second Chance** — An AI-powered circular commerce platform built on top of Amazon's ecosystem that:
- Lets customers **buy** certified refurbished / pre-owned products
- Lets customers **sell** their unused products (P2P Marketplace)
- Uses **AI (Google Gemini)** to grade product condition from images
- Uses an **AI Disposition Engine** to route products → resell / refurbish / donate / recycle / exchange
- Rewards sustainable behavior with **Green Credits**
- Has **5 role-based portals**: Customer, Seller, NGO, Kirana Partner, Admin

---

## Technology Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Frontend** | Next.js 15 + TypeScript + TailwindCSS | ✅ Set up |
| **Backend** | NestJS + TypeScript | ✅ Set up |
| **Database** | PostgreSQL + Prisma ORM | ✅ Set up |
| **Authentication** | Clerk (webhooks to sync users) | ✅ Working |
| **AI – Grading** | Google Gemini API (`gemini.service.ts`) | 🟡 Wired but uses placeholder images |
| **Image Storage** | Cloudinary (`cloudinary.service.ts`) | 🟡 Set up, not wired to uploads |
| **Caching** | Redis | ❌ Not implemented |
| **Messaging** | SQS / Event-Driven (EventEmitter2) | 🟡 Partial (local EventEmitter only) |
| **Deployment** | Docker / AWS | ❌ Not done |
| **Monitoring** | CloudWatch / Prometheus / Grafana | ❌ Not done |

---

## Project Folder Structure

```
amahawk/
├── apps/
│   ├── api/                        ← NestJS Backend
│   │   └── src/
│   │       ├── app.module.ts       ← Root module (all modules registered)
│   │       ├── main.ts             ← App bootstrap + Swagger setup
│   │       ├── common/
│   │       │   ├── decorators/     ← Custom decorators (e.g. @CurrentUser)
│   │       │   ├── filters/        ← Global exception filters
│   │       │   ├── guards/         ← Auth guards (Clerk JWT)
│   │       │   ├── repositories/   ← Base repository pattern
│   │       │   └── services/
│   │       │       ├── gemini.service.ts     ← Google Gemini AI integration
│   │       │       └── cloudinary.service.ts ← Image upload service
│   │       └── modules/
│   │           ├── database/       ← Prisma service
│   │           ├── users/          ← User CRUD
│   │           ├── products/       ← Product catalog
│   │           ├── returns/        ← Return request workflow
│   │           ├── grading/        ← AI product grading
│   │           ├── disposition/    ← AI disposition engine
│   │           ├── listings/       ← Marketplace listings
│   │           ├── refurbishments/ ← Refurbishment workflow
│   │           ├── trade-ins/      ← Trade-in / exchange workflow
│   │           └── webhooks/       ← Clerk webhook → user sync
│   │
│   └── web/                        ← Next.js 15 Frontend
│       └── src/
│           ├── app/
│           │   ├── page.tsx                    ← Amazon homepage (main shop)
│           │   ├── second-life/
│           │   │   ├── page.tsx                ← Second Chance landing hub
│           │   │   ├── buy/page.tsx            ← Refurbished catalogue browser
│           │   │   └── sell/page.tsx           ← P2P sell listing form
│           │   ├── shop-refurbished/page.tsx   ← Refurbished shop page
│           │   ├── dp/                         ← Product Detail Page (PDP)
│           │   ├── cart/                       ← Shopping cart
│           │   ├── checkout/                   ← Checkout flow
│           │   ├── search/                     ← Search results
│           │   ├── (portals)/
│           │   │   ├── customer/               ← Customer dashboard + returns + credits
│           │   │   ├── seller/                 ← Seller Central dashboard
│           │   │   ├── ngo/                    ← NGO donation portal
│           │   │   ├── kirana/                 ← Kirana partner hub
│           │   │   └── admin/                  ← Admin dashboard
│           │   ├── actions/
│           │   │   └── secondLifeActions.ts    ← Server actions for second-life
│           │   └── api/                        ← Next.js API routes
│           ├── components/
│           │   ├── shared/
│           │   │   ├── AmazonNavbar.tsx        ← Main Amazon-style navbar
│           │   │   ├── AmazonFooter.tsx        ← Amazon-style footer
│           │   │   ├── ClientPDP.tsx           ← Product detail page component
│           │   │   ├── GiftCardClient.tsx      ← Gift card redemption UI
│           │   │   ├── DashboardNavbar.tsx     ← Portal dashboard navbar
│           │   │   ├── StatCard.tsx            ← Stat display card
│           │   │   ├── LocationModal.tsx       ← Delivery location modal
│           │   │   ├── AddToCartButton.tsx     ← Cart button
│           │   │   ├── RedeemButton.tsx        ← Credit redemption button
│           │   │   └── ImageWithFallback.tsx   ← Image with error fallback
│           │   └── ui/                         ← Shadcn UI components
│           ├── context/                        ← React context providers
│           ├── hooks/                          ← Custom React hooks
│           └── lib/
│               ├── api-client.ts              ← API base client
│               └── utils.ts                   ← Utility functions
│
├── prisma/
│   ├── schema.prisma               ← Full database schema (32KB — very detailed)
│   ├── seed.ts                     ← Main seed data
│   ├── seed-epicsum.ts             ← Product image seed data
│   ├── seed-2nd-life.ts            ← Second-life listings seed
│   └── seed-reviews.ts             ← Product reviews seed
│
├── docs/                           ← Project documentation
│   ├── 00-project-context.md       ← Vision + objectives
│   ├── 01-product-requirements.md  ← Full PRD
│   ├── 02-system-architecture.md   ← System design
│   ├── 03-domain-model.md          ← Domain entities
│   ├── 04-database-design.md       ← DB schema design
│   ├── 05-api-specification.md     ← API contracts
│   ├── 06-authentication-design.md ← Auth + RBAC design
│   ├── 07-ui-specification.md      ← UI/UX specs
│   └── 11-implementation-plan.md   ← 20-phase build plan
│
├── designs/                        ← Design mockups / assets
├── reference-html/                 ← Reference HTML pages
└── public/                         ← Static assets (logos, product images)
```

---

## ✅ What Is DONE

### 🗄️ Database Layer — DONE ✅
- [x] Full Prisma schema written (`schema.prisma` — 32KB, very comprehensive)
- [x] Models: `User`, `Product`, `ProductImage`, `Listing`, `ReturnRequest`, `ProductGrade`, `DispositionDecision`, `Refurbishment`, `TradeIn`, `GreenCreditWallet`, `GreenCreditTransaction`, `SustainabilityProfile`, `UserInteraction`
- [x] Seed files for products, listings, and reviews
- [x] Enum types: `UserRole`, `DispositionType`, `ProductGradeValue`, `ListingType`, `ListingStatus`, `ReturnStatus`, etc.

---

### 🔐 Authentication — DONE ✅
- [x] Clerk authentication integrated on frontend
- [x] Clerk webhook handler (`webhooks.service.ts`) — syncs user creation/update/deletion to DB
- [x] On new user: auto-creates `GreenCreditWallet` and `SustainabilityProfile`
- [x] JWT guard wired up in NestJS backend
- [x] Middleware protecting portal routes

---

### 🤖 AI Grading (Backend) — DONE ✅ *(with placeholder input)*
- [x] `gemini.service.ts` — calls Google Gemini API to evaluate product damage
- [x] `grading.service.ts` — generates grade, confidence score, damage summary
- [x] Grades stored in DB: A (Like New), B (Excellent), C (Good), D (Fair), F (Unrecoverable)
- [x] Event emitted (`grading.completed`) after grading is done
- **⚠️ Limitation:** Currently uses a hardcoded placeholder image URL — not wired to real image uploads yet

---

### 🧠 AI Disposition Engine (Backend) — DONE ✅ *(mocked)*
- [x] `disposition.service.ts` — listens to `grading.completed` event, triggers disposition
- [x] Stores decision: `RESELL / REFURBISH / DONATE / RECYCLE / EXCHANGE`
- [x] Admin can override any AI decision
- **⚠️ Limitation:** Currently returns a hardcoded `REFURBISH` decision — real AI logic not yet implemented

---

### 🏪 Backend API Modules — DONE ✅
- [x] **Users module** — `GET /users`, `GET /users/:id`, `PATCH /users/:id`
- [x] **Products module** — CRUD for products
- [x] **Returns module** — Create return request, get by ID, list all
- [x] **Grading module** — Trigger AI grade, get latest grade for a product
- [x] **Disposition module** — Trigger decision, get decision, admin override
- [x] **Listings module** — Create listing, browse listings, get by ID
- [x] **Refurbishments module** — Create refurbishment job, update status
- [x] **Trade-Ins module** — Create trade-in request, get status
- [x] **Webhooks module** — Clerk user sync

---

### 🌐 Frontend — Core Pages — DONE ✅

#### Amazon Shopping Experience
- [x] **Homepage** (`page.tsx`) — Full Amazon-style homepage with product carousels, hero banners, categories
- [x] **Amazon Navbar** (`AmazonNavbar.tsx`) — Full Amazon-style navigation with cart, search, department menu
- [x] **Amazon Footer** (`AmazonFooter.tsx`) — Multi-column footer matching Amazon style
- [x] **Product Detail Page** (`dp/` + `ClientPDP.tsx`) — Full PDP with images, reviews, add-to-cart
- [x] **Search page** (`search/`) — Search results page
- [x] **Cart** (`cart/`) — Shopping cart
- [x] **Checkout** (`checkout/`) — Checkout flow

#### Second Chance Hub
- [x] **Second Chance Landing** (`second-life/page.tsx`) — Landing page with animated decision flow diagram, AI certification section, catalogue link
- [x] **Refurbished Catalogue** (`second-life/buy/page.tsx` + `CatalogueClient.tsx`) — Browse and filter refurbished/pre-owned listings from DB
- [x] **Sell Your Item** (`second-life/sell/page.tsx`) — P2P listing form (multi-step)
- [x] **Shop Refurbished** (`shop-refurbished/page.tsx`) — Refurbished product shop page

#### Customer Portal
- [x] **Customer Dashboard** (`/customer/page.tsx`) — Shows refurbished listings, recent activity, green credits balance, action cards
- [x] **Returns List** (`/customer/returns/page.tsx`) — View all returns
- [x] **New Return** (`/customer/returns/new/`) — Start a return request
- [x] **Green Credits** (`/customer/credits/page.tsx` + `GreenCreditsClient.tsx`) — View balance, transaction history, redeem credits
- [x] **Gift Card** (`/customer/credits/gift-card/`) — Gift card redemption UI

#### Seller Portal
- [x] **Seller Central Dashboard** (`/seller/page.tsx`) — Inventory table, KPI stats (open orders, today's sales), sidebar with balance

#### NGO Portal
- [x] **NGO Dashboard** (`/ngo/page.tsx`) — Donation inventory view

#### Kirana Partner Portal
- [x] **Kirana Dashboard** (`/kirana/page.tsx`) — Partner hub dashboard

#### Admin Portal
- [x] **Admin Dashboard** (`/admin/page.tsx`) — Admin overview dashboard

---

### 🌱 Green Credits System — DONE ✅
- [x] `GreenCreditWallet` model in DB
- [x] Credits UI in Customer Portal (balance, history, redeem button)
- [x] Gift card redemption flow
- [x] Wallet auto-created on user signup

---

### 🌍 Second Chance Server Actions — DONE ✅
- [x] `secondLifeActions.ts` — Server actions to fetch second-life listings, create listings, track interactions

---

## 🔨 What Is IN PROGRESS

### 🖼️ Real Image Upload for AI Grading — IN PROGRESS 🟡
- `cloudinary.service.ts` exists and is set up
- The sell/return form exists — but it doesn't yet send images to Cloudinary and pass real URLs to the Gemini grading API
- **Gap:** The grading pipeline uses a hardcoded `https://example.com/product_image.jpg`

### 🤖 Real AI Disposition Logic — IN PROGRESS 🟡
- The disposition service structure is complete
- But the actual logic is mocked — always returns `REFURBISH`
- **Gap:** Needs to use product grade + category + demand signals to make a real AI decision (or call Gemini for this)

### 📊 Sustainability Profile — IN PROGRESS 🟡
- `SustainabilityProfile` model exists in DB
- Wallet auto-created on signup
- **Gap:** The sustainability metrics (CO₂ saved, products reused, recycled) are not yet being updated based on real user actions

### 🔗 API ↔ Frontend Integration — IN PROGRESS 🟡
- Frontend currently reads directly from Prisma (server components) — this is the MVP approach
- The NestJS API is built but the frontend doesn't yet consume it via HTTP calls
- **Gap:** Long-term the frontend should call the NestJS REST API, not Prisma directly

---

## ❌ What Is NOT DONE YET

### 🔮 Predictive Return Prevention — 🟢 DONE
- **What it is:** Before a customer buys something, show them the return risk score
- **What's needed:** AI model that reads purchase history, product reviews, and behavior to predict if this customer will return this item
- **Where to add:** Product Detail Page (PDP) — show a "Return Risk" indicator
- **Status:** Implemented via `ReturnRiskWidget` on the PDP, utilizing a smart algorithm based on product category, price, and customer review sentiment.

### 📦 Real Return Workflow (End-to-End) — ❌ NOT COMPLETE
- A return form exists on the frontend
- But the end-to-end flow (submit → AI grades → disposition decision shown to user) is not connected
- The backend can do it — the frontend doesn't trigger it

### 📬 Notification System — ❌ NOT STARTED
- Docs define: Email + SMS + in-app notifications for return updates, credit awards, listing updates
- Nothing built yet

### 🔒 Full RBAC in Frontend — ❌ NOT DONE
- Backend has guards
- Frontend portals exist but there's no real role-check on the frontend to prevent a customer from accessing the admin portal URL directly

### 🧾 Trade-In Exchange Program — ❌ NOT COMPLETE
- Backend module exists (`trade-ins`)
- No frontend UI for trade-in flow (valuation → credit → new purchase)

### 🏭 Refurbishment Partner Portal — ❌ NOT COMPLETE
- Backend module exists
- No dedicated frontend for refurbishment partners to manage jobs

### 📈 Analytics Dashboards — ❌ NOT STARTED
- Docs define: Revenue charts, disposition breakdown, partner performance, sustainability analytics
- None of these charts are implemented

### 🔴 Redis Caching — ❌ NOT STARTED
- Not implemented anywhere

### 🐳 Docker / Deployment — ❌ NOT STARTED
- No Dockerfile, no CI/CD pipeline

### 🛡️ Fraud Detection — ❌ NOT STARTED
- Docs define: image comparison, serial number verification, risk scoring
- Nothing built

### 🔔 Real-Time Events (SQS/Queue) — ❌ NOT STARTED
- Currently using NestJS `EventEmitter2` (in-process only)
- Docs call for Amazon SQS for production reliability

---

## Feature Completion Table

| Feature | Backend | Frontend | AI/Logic | Overall |
|---------|---------|----------|----------|---------|
| User Auth (Clerk) | ✅ | ✅ | — | ✅ **Done** |
| Database Schema | ✅ | — | — | ✅ **Done** |
| Product Catalog | ✅ | ✅ | — | ✅ **Done** |
| Amazon Homepage | — | ✅ | — | ✅ **Done** |
| Second Chance Hub | — | ✅ | — | ✅ **Done** |
| Refurbished Marketplace (Browse) | ✅ | ✅ | — | ✅ **Done** |
| P2P Sell Listing | ✅ | ✅ | — | ✅ **Done** |
| AI Product Grading | ✅ | ❌ | 🟡 Partial | 🟡 **60%** |
| AI Disposition Engine | ✅ | ❌ | 🟡 Mocked | 🟡 **50%** |
| Green Credits System | ✅ | ✅ | — | ✅ **Done** |
| Customer Dashboard | ✅ | ✅ | — | ✅ **Done** |
| Seller Central | ✅ | ✅ | — | ✅ **Done** |
| NGO Portal | 🟡 | ✅ | — | 🟡 **70%** |
| Kirana Partner Hub | 🟡 | ✅ | — | 🟡 **60%** |
| Admin Dashboard | 🟡 | ✅ | — | 🟡 **60%** |
| Return Request Flow | ✅ | 🟡 | — | 🟡 **60%** |
| Return → Grade → Disposition Pipeline | ✅ | ❌ | 🟡 | 🟡 **40%** |
| Trade-In / Exchange | ✅ | ❌ | — | 🔴 **30%** |
| Sustainability Dashboard | 🟡 | ❌ | — | 🔴 **25%** |
| Predictive Return Prevention | — | ✅ | 🟡 Partial | ✅ **Done** |
| Notification System | ❌ | ❌ | — | 🔴 **0%** |
| Analytics Charts | ❌ | ❌ | — | 🔴 **0%** |
| Fraud Detection | ❌ | ❌ | ❌ | 🔴 **0%** |
| RBAC Frontend Guards | ✅ | ❌ | — | 🟡 **50%** |
| Redis Caching | ❌ | — | — | 🔴 **0%** |
| Real Image Uploads (Cloudinary) | 🟡 | ❌ | — | 🔴 **20%** |
| Docker / Deployment | ❌ | — | — | 🔴 **0%** |

---

## Docs vs Code Coverage

| Document | What It Describes | Implemented? |
|----------|-------------------|-------------|
| `00-project-context.md` | Vision, objectives, tech stack | ✅ Fully matches |
| `01-product-requirements.md` | 25 feature sections | 🟡 ~55% built |
| `02-system-architecture.md` | System components and data flow | 🟡 Structure built, infra missing |
| `03-domain-model.md` | Domain entities and relationships | ✅ Prisma schema covers this |
| `04-database-design.md` | Full DB schema | ✅ Prisma schema matches |
| `05-api-specification.md` | All API endpoints | 🟡 ~70% of endpoints exist in NestJS |
| `06-authentication-design.md` | Auth flows, RBAC, JWT | 🟡 Backend done, frontend RBAC missing |
| `07-ui-specification.md` | All portal UI designs | 🟡 ~60% of pages exist |
| `11-implementation-plan.md` | 20 build phases | 🟡 Phase 1–10 mostly done, 11–20 not started |

---

## How Close Are We?

```
Overall Completion Estimate: ~55–60%
```

### What's Strong ✅
- The **database schema** is production-grade and covers nearly everything in the docs
- The **Amazon shopping experience** (homepage, PDP, cart, checkout) is polished and functional
- The **Second Chance hub** with animated landing page, catalogue, and sell form is built
- The **NestJS backend** has all core modules with proper architecture (repository pattern, DTOs, guards, exception filters)
- The **AI grading pipeline** exists end-to-end — just needs real image inputs
- The **5 portals** (Customer, Seller, NGO, Kirana, Admin) all have dashboard UIs

### What's Missing for Hackathon Judges ⚠️
The **most impressive things judges want to see** that are NOT yet connected:

1. **Real AI grading from a photo** — The Gemini API is wired but uses a placeholder. Connecting the sell/return form's image upload to Cloudinary → Gemini would make this magical
2. **End-to-end journey demo** — Return item → AI grades it → AI says "Refurbish" → shows in portal. This chain isn't connected in the UI
3. **Predictive return prevention on PDP** — Show "85% return risk" badge on a product before purchase
4. **Sustainability dashboard with real numbers** — CO₂ saved, items diverted from landfill

---

## What Needs to Be Done Next (Priority Order)

### 🔥 CRITICAL — Do These First (For Demo)
1. **Wire real image upload to Gemini grading** — In `second-life/sell/page.tsx`, upload image to Cloudinary, pass URL to `/api/grading/generate/:productId`
2. **Connect Return → Grade → Disposition in UI** — After submitting a return, show the AI grade and disposition decision on the confirmation screen
3. **Fix Disposition Logic** — Instead of always returning `REFURBISH`, use the grade value to make a real decision (Grade A → Resell, Grade D/F → Recycle, etc.)

### 🟡 HIGH — Makes the Project 75% Complete
4. **Trade-In UI** — Build the frontend for trade-in (user submits item, gets credit voucher)
5. **Sustainability Dashboard** — Show real numbers from the DB (products reused, CO₂ saved formula)
6. **Full Return Flow UI** — Connect the existing backend return API to the frontend form properly

### 🟢 NICE TO HAVE — Bonus Points
8. **Notification toasts** — In-app notification when green credits are earned
9. **Frontend RBAC** — Redirect users to correct portal based on their role
10. **Analytics charts** — Add basic charts to seller/admin dashboards

---

## Summary for Teammates

> **The foundation is solid.** Database, auth, backend API modules, and core shopping experience are all done. The second-life ecosystem (buy, sell, portals) is built and visible.
>
> **The gap is in connecting the AI pipeline end-to-end and building the missing feature UIs (trade-in, sustainability dashboard, return prevention).**
>
> If we focus on: (1) real image → Gemini grading, (2) end-to-end return demo, (3) disposition logic fix — we'll have a very strong hackathon demo.

---

*This file is auto-generated from code analysis. Update as features are completed.*
