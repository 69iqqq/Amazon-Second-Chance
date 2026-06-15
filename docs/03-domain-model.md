# Amazon Second Chance - Domain Model

Version: 1.0

---

# Purpose

This document defines:

* Domain Entities
* Aggregates
* Relationships
* Enums
* Bounded Contexts

The domain model acts as the source of truth for:

* Database Design
* Prisma Schema
* Backend Services
* API Contracts

---

# Bounded Contexts

Amazon Second Chance is divided into the following domains:

```text
Identity & Access

Product Lifecycle

Returns

AI Decision Engine

Marketplace

Trade-In

Green Credits

Sustainability

Partners

Notifications

Analytics
```

---

# Core Entity Diagram

```text
User
│
├── ReturnRequest
├── Listing
├── GreenCreditWallet
├── SustainabilityProfile
└── TradeInRequest

Product
│
├── ProductGrade
├── DispositionDecision
├── Listing
├── ProductHistory
└── RefurbishmentRecord

Partner
│
├── NGO
├── Recycler
├── KiranaHub
└── RefurbishmentCenter
```

---

# User Aggregate

## User

Represents any platform user.

Attributes:

```text
id
firstName
lastName
email
phone
passwordHash
role
status
createdAt
updatedAt
```

Relationships:

```text
User
├── Listings
├── Returns
├── Credits
├── TradeIns
├── Notifications
└── SustainabilityProfile
```

---

## User Roles

```text
CUSTOMER

SELLER

KIRANA_PARTNER

NGO

RECYCLER

REFURBISHMENT_CENTER

ADMIN
```

---

## User Status

```text
ACTIVE

INACTIVE

BLOCKED

PENDING_VERIFICATION
```

---

# Product Aggregate

## Product

Represents a physical product.

Attributes:

```text
id
sku
name
description
brand
categoryId
originalPrice
currentValue
status
createdAt
updatedAt
```

Relationships:

```text
Product
├── ProductGrade
├── ProductHistory
├── DispositionDecision
├── Listing
├── ReturnRequest
└── RefurbishmentRecord
```

---

## Product Category

Attributes:

```text
id
name
description
```

Examples:

```text
Electronics

Mobile Phones

Laptops

Home Appliances

Furniture

Clothing
```

---

## Product Status

```text
NEW

USED

REFURBISHED

DONATED

RECYCLED

TRADED_IN

SOLD
```

---

# Product Grading Aggregate

## ProductGrade

Represents AI evaluation.

Attributes:

```text
id
productId
grade
confidenceScore
damageSummary
gradedBy
createdAt
```

---

## Product Grade Enum

```text
GRADE_A

GRADE_B

GRADE_C

GRADE_D

GRADE_F
```

---

# Product History Aggregate

## ProductHistory

Tracks ownership and lifecycle.

Attributes:

```text
id
productId
eventType
description
timestamp
```

Examples:

```text
PURCHASED

RETURNED

REFURBISHED

LISTED

SOLD

DONATED

RECYCLED
```

---

# Return Aggregate

## ReturnRequest

Represents a product return.

Attributes:

```text
id
userId
productId
reason
status
requestedAt
approvedAt
completedAt
```

Relationships:

```text
ReturnRequest
├── Product
├── User
├── ReturnImages
└── DispositionDecision
```

---

## Return Status

```text
REQUESTED

APPROVED

PICKUP_SCHEDULED

COLLECTED

UNDER_REVIEW

COMPLETED

REJECTED
```

---

# AI Decision Aggregate

## DispositionDecision

Represents AI outcome.

Attributes:

```text
id
productId
decision
confidence
reason
createdAt
```

---

## Disposition Types

```text
RESELL

REFURBISH

DONATE

RECYCLE

EXCHANGE
```

---

# Refurbishment Aggregate

## RefurbishmentRecord

Tracks refurbishment.

Attributes:

```text
id
productId
partnerId
status
repairCost
inspectionReport
completedAt
```

---

## Refurbishment Status

```text
PENDING

IN_PROGRESS

INSPECTION

CERTIFIED

COMPLETED
```

---

# Marketplace Aggregate

## Listing

Represents a marketplace listing.

Attributes:

```text
id
sellerId
productId
price
listingType
status
createdAt
```

Relationships:

```text
Listing
├── Product
├── Seller
└── MarketplaceTransaction
```

---

## Listing Type

```text
REFURBISHED

PRE_OWNED

TRADE_IN
```

---

## Listing Status

```text
DRAFT

ACTIVE

SOLD

EXPIRED

REMOVED
```

---

## MarketplaceTransaction

Represents completed sale.

Attributes:

```text
id
listingId
buyerId
sellerId
amount
status
completedAt
```

---

## Transaction Status

```text
PENDING

PAID

SHIPPED

DELIVERED

COMPLETED

REFUNDED
```

---

# Trade-In Aggregate

## TradeInRequest

Represents exchange request.

Attributes:

```text
id
userId
productId
estimatedValue
finalValue
status
```

---

## TradeIn Status

```text
SUBMITTED

VALUATED

APPROVED

REJECTED

COMPLETED
```

---

# Green Credits Aggregate

## GreenCreditWallet

Stores user credits.

Attributes:

```text
id
userId
balance
lifetimeEarned
lifetimeRedeemed
```

---

## GreenCreditTransaction

Tracks credit movement.

Attributes:

```text
id
walletId
amount
type
reason
createdAt
```

---

## Credit Transaction Type

```text
EARNED

REDEEMED

EXPIRED
```

---

# Sustainability Aggregate

## SustainabilityProfile

Stores environmental impact.

Attributes:

```text
id
userId
co2Saved
productsReused
productsRecycled
donationsMade
sustainabilityScore
```

---

# Partner Aggregate

## Partner

Base entity for all partners.

Attributes:

```text
id
name
type
email
phone
address
status
```

---

## Partner Types

```text
NGO

RECYCLER

KIRANA_HUB

REFURBISHMENT_CENTER
```

---

## Partner Status

```text
ACTIVE

INACTIVE

SUSPENDED
```

---

# Donation Aggregate

## DonationRecord

Tracks product donation.

Attributes:

```text
id
productId
ngoId
status
donatedAt
verifiedAt
```

---

## Donation Status

```text
PENDING

ASSIGNED

SHIPPED

RECEIVED

VERIFIED
```

---

# Recycling Aggregate

## RecyclingRecord

Tracks recycling workflow.

Attributes:

```text
id
productId
recyclerId
status
materialRecovered
```

---

## Recycling Status

```text
PENDING

ASSIGNED

PROCESSING

COMPLETED
```

---

# Notification Aggregate

## Notification

Attributes:

```text
id
userId
title
message
type
isRead
createdAt
```

---

## Notification Types

```text
EMAIL

SMS

PUSH
```

---

# Analytics Aggregate

## KPIRecord

Stores platform metrics.

Attributes:

```text
id
metricName
metricValue
recordedAt
```

Examples:

```text
Revenue Recovered

Products Recycled

Products Donated

CO2 Saved

Marketplace GMV
```

---

# Domain Events

```text
USER_REGISTERED

RETURN_CREATED

PRODUCT_GRADED

DISPOSITION_DECIDED

PRODUCT_REFURBISHED

LISTING_CREATED

PRODUCT_SOLD

DONATION_CONFIRMED

RECYCLE_CONFIRMED

TRADEIN_COMPLETED

GREEN_CREDITS_AWARDED

SUSTAINABILITY_UPDATED
```

---

# Aggregate Ownership Rules

```text
User owns:
- Listings
- Returns
- Wallet
- Sustainability Profile

Product owns:
- Grade
- History
- Disposition
- Refurbishment Records

Partner owns:
- Donation Records
- Recycling Records
- Refurbishment Records
```

This domain model serves as the blueprint for the database schema, Prisma models, API contracts, and service-layer implementation.
