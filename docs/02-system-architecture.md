# Amazon Second Chance - System Architecture

Version: 2.0

## Architecture Style

Amazon Second Chance follows a:

* Modular Monolith (MVP)
* Domain Driven Design (DDD)
* Event Driven Architecture
* Clean Architecture
* API First Architecture

The system is designed so that each major module can later be extracted into independent microservices.

---

# System Overview

Amazon Second Chance consists of five major portals:

1. Customer Portal
2. Seller Central
3. Kirana Partner Hub
4. NGO Donation Portal
5. Admin Portal

All portals operate on a shared backend platform.

```text
Frontend (Next.js)

├── Customer Portal
├── Seller Portal
├── Kirana Portal
├── NGO Portal
└── Admin Portal

                ↓

Backend API Layer

                ↓

Business Modules

├── User Module
├── Product Module
├── Return Module
├── AI Grading Module
├── Disposition Module
├── Marketplace Module
├── Refurbishment Module
├── Donation Module
├── Recycling Module
├── Exchange Module
├── Green Credits Module
├── Recommendation Module
├── Sustainability Module
├── Partner Module
├── Notification Module
├── Fraud Detection Module
└── Analytics Module

                ↓

PostgreSQL + Redis + S3
```

---

# Portal Architecture

## Customer Portal

Features:

* Browse AI-certified refurbished products
* Buy pre-owned products
* View recommendations
* Exchange products
* Track returns
* View Green Credits
* View Sustainability Score

Routes:

```text
/customer/dashboard
/customer/orders
/customer/returns
/customer/marketplace
/customer/credits
/customer/sustainability
```

---

## Seller Central

Features:

* Manage listings
* Manage refurbished inventory
* View sales analytics
* View AI insights

Routes:

```text
/seller/dashboard
/seller/listings
/seller/orders
/seller/analytics
```

---

## Kirana Partner Hub

Features:

* Accept product drop-offs
* Verify products
* Temporary storage
* Pickup management

Routes:

```text
/kirana/dashboard
/kirana/inventory
/kirana/pickups
/kirana/earnings
```

---

## NGO Portal

Features:

* Receive donations
* Verify donations
* Track donation inventory

Routes:

```text
/ngo/dashboard
/ngo/inventory
/ngo/requests
/ngo/reports
```

---

## Admin Portal

Features:

* Manage users
* Manage partners
* Override AI decisions
* Monitor KPIs

Routes:

```text
/admin/dashboard
/admin/users
/admin/partners
/admin/returns
/admin/analytics
```

---

# Core Business Modules

## User Module

Responsibilities:

* Authentication
* Authorization
* RBAC
* User Profiles

Roles:

* CUSTOMER
* SELLER
* KIRANA_PARTNER
* NGO
* RECYCLER
* ADMIN

---

## Product Module

Responsibilities:

* Product Catalog
* Product Metadata
* Product Lifecycle

---

## Return Module

Responsibilities:

* Return Requests
* Return Tracking
* Return Status

Lifecycle:

```text
Requested
→ Approved
→ Collected
→ Graded
→ Dispositioned
→ Completed
```

---

## AI Grading Module

Responsibilities:

* Image Analysis
* Video Analysis
* Product Condition Detection

Outputs:

* Grade
* Confidence Score
* Damage Report

Grades:

```text
A
B
C
D
F
```

---

## AI Disposition Module

Responsibilities:

Determine optimal outcome:

```text
Resell
Refurbish
Donate
Recycle
Exchange
```

Decision Inputs:

* Grade
* Market Demand
* Repair Cost
* Logistics Cost
* Product Value

---

## Marketplace Module

Responsibilities:

* Refurbished Marketplace
* Peer-to-Peer Marketplace

Features:

* Listings
* Reviews
* Ratings
* Buyer Protection

---

## Refurbishment Module

Responsibilities:

* Refurbishment Workflow
* Inspection
* Certification

Workflow:

```text
Received
→ Inspected
→ Repaired
→ Certified
→ Listed
```

---

## Donation Module

Responsibilities:

* NGO Matching
* Donation Tracking
* Verification

---

## Recycling Module

Responsibilities:

* Recycler Assignment
* Recycling Verification

---

## Exchange Module

Responsibilities:

* Product Valuation
* Trade-In Processing
* Voucher Generation

---

## Green Credits Module

Responsibilities:

* Reward Allocation
* Credit Redemption
* Sustainability Scoring

---

## Recommendation Module

Responsibilities:

* Product Recommendations
* Refurbished Suggestions
* Alternative Product Suggestions

---

## Sustainability Module

Responsibilities:

Track:

* CO₂ Saved
* Waste Diverted
* Products Reused
* Products Recycled

---

## Partner Module

Partner Types:

* Kirana
* NGO
* Recycler
* Refurbishment Center

Responsibilities:

* Onboarding
* Verification
* Assignment
* Performance Tracking

---

## Fraud Detection Module

Responsibilities:

Detect:

* Fake Returns
* Wrong Product Returns
* Counterfeit Products
* Marketplace Fraud

Methods:

* Image Matching
* Serial Number Verification
* Risk Scoring

---

# Event Architecture

Core Events:

```text
RETURN_CREATED

PRODUCT_GRADED

DISPOSITION_DECIDED

PRODUCT_REFURBISHED

PRODUCT_LISTED

PRODUCT_SOLD

DONATION_ASSIGNED

DONATION_CONFIRMED

RECYCLE_ASSIGNED

RECYCLE_CONFIRMED

TRADEIN_COMPLETED

GREEN_CREDITS_AWARDED
```

---

# Storage Architecture

PostgreSQL

Stores:

* Users
* Products
* Listings
* Returns
* Transactions
* Credits

Redis

Stores:

* Sessions
* Cache
* Recommendations

Amazon S3

Stores:

* Product Images
* Product Videos
* Inspection Reports
* Certifications

---

# Security Architecture

Authentication:
- Clerk

Authentication Methods:
- Email/Password
- Google OAuth
- GitHub OAuth

Authorization:
- Role Based Access Control (RBAC)

Roles:
- CUSTOMER
- SELLER
- NGO
- KIRANA_PARTNER
- ADMIN

User Synchronization:

Clerk User
↓
Prisma User Record
↓
Role Resolution
↓
Application Access

Authorization:

RBAC

Security Controls:

* Encryption At Rest
* Encryption In Transit
* Audit Logging
* Rate Limiting

---

# Scalability Strategy

Current:

Modular Monolith

Future Extraction Order:

1. AI Grading Service
2. Marketplace Service
3. Recommendation Service
4. Analytics Service
5. Green Credits Service

This allows rapid MVP development while preserving future scalability.
