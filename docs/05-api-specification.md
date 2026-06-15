# Amazon Second Chance - API Specification

Version: 1.0

---

# API Standards

Base URL

```text
/api/v1
```
# Authentication

Authentication Provider:
Clerk

The frontend uses Clerk SDK for:

- Sign Up
- Sign In
- Sign Out
- Session Management
- OAuth Authentication

The backend validates Clerk JWT tokens.

Protected endpoints require:

Authorization: Bearer <clerk-token>
---

# Authentication Module

## Register User

POST

```text
/api/v1/auth/register
```

Request

```json
{
  "firstName": "Abir",
  "lastName": "Roy",
  "email": "abir@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

Response

```json
{
  "success": true,
  "userId": "uuid"
}
```

---

## Login

POST

```text
/api/v1/auth/login
```

Request

```json
{
  "email": "abir@example.com",
  "password": "password123"
}
```

Response

```json
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

---

## Current User

GET

```text
/api/v1/auth/me
```

Response

```json
{
  "id": "uuid",
  "name": "Abir Roy",
  "role": "CUSTOMER"
}
```

---

# Product Module

## Get Products

GET

```text
/api/v1/products
```

Query Params

```text
page
limit
category
status
search
```

---

## Get Product

GET

```text
/api/v1/products/:id
```

---

## Create Product

POST

```text
/api/v1/products
```

Permission

```text
SELLER
ADMIN
```

---

## Update Product

PUT

```text
/api/v1/products/:id
```

---

## Delete Product

DELETE

```text
/api/v1/products/:id
```

---

# Return Module

## Create Return

POST

```text
/api/v1/returns
```

Request

```json
{
  "productId": "uuid",
  "reason": "Damaged Item"
}
```

---

## Upload Return Media

POST

```text
/api/v1/returns/:id/media
```

Multipart Upload

```text
image
video
```

---

## Get Return

GET

```text
/api/v1/returns/:id
```

---

## Get My Returns

GET

```text
/api/v1/returns/my
```

---

## Update Return Status

PATCH

```text
/api/v1/returns/:id/status
```

Permission

```text
ADMIN
```

---

# AI Grading Module

## Grade Product

POST

```text
/api/v1/grading/:productId
```

Response

```json
{
  "grade": "GRADE_A",
  "confidence": 96.4,
  "damageSummary": "Minor scratches"
}
```

---

## Get Product Grade

GET

```text
/api/v1/grading/:productId
```

---

# AI Disposition Module

## Generate Decision

POST

```text
/api/v1/disposition/:productId
```

Response

```json
{
  "decision": "REFURBISH",
  "confidence": 94.2,
  "reason": "High resale value"
}
```

---

## Get Decision

GET

```text
/api/v1/disposition/:productId
```

---

# Marketplace Module

## Create Listing

POST

```text
/api/v1/listings
```

Request

```json
{
  "productId": "uuid",
  "price": 12000,
  "listingType": "PRE_OWNED"
}
```

---

## Get Listings

GET

```text
/api/v1/listings
```

---

## Get Listing

GET

```text
/api/v1/listings/:id
```

---

## Update Listing

PUT

```text
/api/v1/listings/:id
```

---

## Delete Listing

DELETE

```text
/api/v1/listings/:id
```

---

## Purchase Listing

POST

```text
/api/v1/listings/:id/purchase
```

---

# Refurbishment Module

## Create Refurbishment Record

POST

```text
/api/v1/refurbishments
```

---

## Get Refurbishment

GET

```text
/api/v1/refurbishments/:id
```

---

## Update Refurbishment Status

PATCH

```text
/api/v1/refurbishments/:id/status
```

---

# Trade-In Module

## Create Trade-In Request

POST

```text
/api/v1/trade-ins
```

Request

```json
{
  "productId": "uuid"
}
```

---

## Get Trade-In

GET

```text
/api/v1/trade-ins/:id
```

---

## Approve Trade-In

PATCH

```text
/api/v1/trade-ins/:id/approve
```

Permission

```text
ADMIN
```

---

# Green Credits Module

## Wallet

GET

```text
/api/v1/credits/wallet
```

---

## Transactions

GET

```text
/api/v1/credits/transactions
```

---

## Redeem Credits

POST

```text
/api/v1/credits/redeem
```

Request

```json
{
  "amount": 500
}
```

---

# Sustainability Module

## Sustainability Profile

GET

```text
/api/v1/sustainability/profile
```

Response

```json
{
  "co2Saved": 21.5,
  "productsReused": 8,
  "productsRecycled": 2,
  "score": 950
}
```

---

# Partner Module

## Get Partners

GET

```text
/api/v1/partners
```

Query

```text
type=NGO

type=KIRANA_HUB

type=RECYCLER

type=REFURBISHMENT_CENTER
```

---

## Create Partner

POST

```text
/api/v1/partners
```

Permission

```text
ADMIN
```

---

## Update Partner

PUT

```text
/api/v1/partners/:id
```

---

# NGO Portal APIs

## Available Donations

GET

```text
/api/v1/ngo/donations
```

---

## Accept Donation

POST

```text
/api/v1/ngo/donations/:id/accept
```

---

## Verify Donation

POST

```text
/api/v1/ngo/donations/:id/verify
```

---

# Kirana Portal APIs

## Inventory

GET

```text
/api/v1/kirana/inventory
```

---

## Verify Product

POST

```text
/api/v1/kirana/products/:id/verify
```

---

## Pickup Requests

GET

```text
/api/v1/kirana/pickups
```

---

# Admin Module

## Dashboard Metrics

GET

```text
/api/v1/admin/dashboard
```

Response

```json
{
  "totalUsers": 12000,
  "totalReturns": 3500,
  "totalListings": 1800,
  "co2Saved": 1520
}
```

---

## AI Decisions

GET

```text
/api/v1/admin/decisions
```

---

## Override Decision

POST

```text
/api/v1/admin/decisions/:id/override
```

Request

```json
{
  "newDecision": "DONATE",
  "reason": "Manual Review"
}
```

---

## User Management

GET

```text
/api/v1/admin/users
```

---

## Suspend User

PATCH

```text
/api/v1/admin/users/:id/suspend
```

---

# Notification Module

## Get Notifications

GET

```text
/api/v1/notifications
```

---

## Mark As Read

PATCH

```text
/api/v1/notifications/:id/read
```

---

# Analytics Module

## Platform Analytics

GET

```text
/api/v1/analytics/platform
```

---

## Marketplace Analytics

GET

```text
/api/v1/analytics/marketplace
```

---

## Sustainability Analytics

GET

```text
/api/v1/analytics/sustainability
```

---

# Error Response Format

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

# Success Response Format

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

---

# API Versioning Strategy

Current Version

```text
v1
```

Future

```text
/ api / v2
/ api / v3
```

Backward compatibility must be maintained for at least one major version.
