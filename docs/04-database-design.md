# Amazon Second Chance - Database Design

Version: 1.0

---

# Purpose

This document defines:

* Database Schema
* Tables
* Relationships
* Foreign Keys
* Constraints
* Indexing Strategy
* PostgreSQL Design


Database:
- Neon PostgreSQL
- Prisma ORM

---

# Database Architecture

The database follows:

* Normalized Design (3NF)
* UUID Primary Keys
* Soft Delete Support
* Audit Timestamps
* Foreign Key Integrity

---

# Common Columns

Every table must include:

```sql
id UUID PRIMARY KEY

created_at TIMESTAMP

updated_at TIMESTAMP
```

Optional:

```sql
deleted_at TIMESTAMP NULL
```

---

# Identity & Access Context

## users

```sql
id UUID PK

first_name VARCHAR(100)

last_name VARCHAR(100)

email VARCHAR(255) UNIQUE

phone VARCHAR(30)

password_hash TEXT

role ENUM

status ENUM

created_at

updated_at
```

Indexes:

```sql
email UNIQUE

role INDEX
```

---

## user_profiles

```sql
id UUID PK

user_id UUID FK

avatar_url TEXT

address TEXT

city VARCHAR(100)

state VARCHAR(100)

country VARCHAR(100)

postal_code VARCHAR(20)

created_at

updated_at
```

Relationship:

```text
User 1 → 1 UserProfile
```

---

# Product Context

## product_categories

```sql
id UUID PK

name VARCHAR(150)

description TEXT
```

---

## products

```sql
id UUID PK

sku VARCHAR(100)

name VARCHAR(255)

description TEXT

brand VARCHAR(100)

category_id UUID FK

original_price DECIMAL(12,2)

current_value DECIMAL(12,2)

status ENUM

created_at

updated_at
```

Indexes:

```sql
sku UNIQUE

category_id INDEX

status INDEX
```

---

## product_images

```sql
id UUID PK

product_id UUID FK

image_url TEXT

sort_order INTEGER
```

Relationship:

```text
Product 1 → Many Images
```

---

# AI Grading Context

## product_grades

```sql
id UUID PK

product_id UUID FK

grade ENUM

confidence_score DECIMAL(5,2)

damage_summary TEXT

graded_by VARCHAR(50)

created_at
```

Indexes:

```sql
product_id INDEX

grade INDEX
```

---

# Product History Context

## product_history

```sql
id UUID PK

product_id UUID FK

event_type ENUM

description TEXT

event_time TIMESTAMP
```

Indexes:

```sql
product_id INDEX
```

---

# Return Context

## return_requests

```sql
id UUID PK

user_id UUID FK

product_id UUID FK

reason TEXT

status ENUM

requested_at TIMESTAMP

approved_at TIMESTAMP NULL

completed_at TIMESTAMP NULL

created_at

updated_at
```

Indexes:

```sql
user_id INDEX

product_id INDEX

status INDEX
```

---

## return_media

```sql
id UUID PK

return_request_id UUID FK

media_url TEXT

media_type ENUM
```

Values:

```text
IMAGE

VIDEO
```

---

# AI Disposition Context

## disposition_decisions

```sql
id UUID PK

product_id UUID FK

decision ENUM

confidence DECIMAL(5,2)

reason TEXT

created_at
```

Indexes:

```sql
product_id INDEX

decision INDEX
```

---

# Marketplace Context

## listings

```sql
id UUID PK

seller_id UUID FK

product_id UUID FK

price DECIMAL(12,2)

listing_type ENUM

status ENUM

created_at

updated_at
```

Indexes:

```sql
seller_id INDEX

product_id INDEX

status INDEX
```

---

## marketplace_transactions

```sql
id UUID PK

listing_id UUID FK

buyer_id UUID FK

seller_id UUID FK

amount DECIMAL(12,2)

status ENUM

completed_at TIMESTAMP

created_at
```

Indexes:

```sql
buyer_id INDEX

seller_id INDEX
```

---

# Refurbishment Context

## refurbishment_records

```sql
id UUID PK

product_id UUID FK

partner_id UUID FK

status ENUM

repair_cost DECIMAL(12,2)

inspection_report TEXT

completed_at TIMESTAMP
```

Indexes:

```sql
product_id INDEX

partner_id INDEX
```

---

# Trade-In Context

## trade_in_requests

```sql
id UUID PK

user_id UUID FK

product_id UUID FK

estimated_value DECIMAL(12,2)

final_value DECIMAL(12,2)

status ENUM

created_at
```

Indexes:

```sql
user_id INDEX
```

---

# Green Credits Context

## green_credit_wallets

```sql
id UUID PK

user_id UUID UNIQUE FK

balance INTEGER

lifetime_earned INTEGER

lifetime_redeemed INTEGER

created_at

updated_at
```

---

## green_credit_transactions

```sql
id UUID PK

wallet_id UUID FK

amount INTEGER

type ENUM

reason TEXT

created_at
```

Indexes:

```sql
wallet_id INDEX
```

---

# Sustainability Context

## sustainability_profiles

```sql
id UUID PK

user_id UUID UNIQUE FK

co2_saved DECIMAL(12,2)

products_reused INTEGER

products_recycled INTEGER

donations_made INTEGER

sustainability_score INTEGER

updated_at
```

---

# Partner Context

## partners

```sql
id UUID PK

name VARCHAR(255)

type ENUM

email VARCHAR(255)

phone VARCHAR(50)

address TEXT

status ENUM

created_at

updated_at
```

Indexes:

```sql
type INDEX

status INDEX
```

---

# Donation Context

## donation_records

```sql
id UUID PK

product_id UUID FK

ngo_id UUID FK

status ENUM

donated_at TIMESTAMP

verified_at TIMESTAMP
```

Indexes:

```sql
ngo_id INDEX
```

---

# Recycling Context

## recycling_records

```sql
id UUID PK

product_id UUID FK

recycler_id UUID FK

status ENUM

material_recovered TEXT

completed_at TIMESTAMP
```

Indexes:

```sql
recycler_id INDEX
```

---

# Notification Context

## notifications

```sql
id UUID PK

user_id UUID FK

title VARCHAR(255)

message TEXT

type ENUM

is_read BOOLEAN

created_at
```

Indexes:

```sql
user_id INDEX

is_read INDEX
```

---

# Analytics Context

## kpi_records

```sql
id UUID PK

metric_name VARCHAR(255)

metric_value DECIMAL(18,2)

recorded_at TIMESTAMP
```

Indexes:

```sql
metric_name INDEX
```

---

# Relationship Summary

```text
User
 ├── UserProfile
 ├── ReturnRequests
 ├── Listings
 ├── TradeIns
 ├── Wallet
 └── SustainabilityProfile

Product
 ├── ProductGrade
 ├── ProductHistory
 ├── Listing
 ├── ReturnRequest
 ├── DispositionDecision
 ├── RefurbishmentRecord
 ├── DonationRecord
 └── RecyclingRecord

Partner
 ├── RefurbishmentRecord
 ├── DonationRecord
 └── RecyclingRecord
```

---

# Performance Indexes

High Priority:

```sql
users(email)

products(sku)

products(category_id)

return_requests(status)

listings(status)

marketplace_transactions(status)

partners(type)

notifications(user_id)
```

---

# Future Tables

Phase 2:

```text
recommendations

fraud_cases

ai_model_versions

audit_logs

carbon_certificates

partner_earnings

kirana_pickups
```

Phase 3:

```text
inventory_forecasting

dynamic_pricing_history

global_resale_marketplace
```

This schema serves as the foundation for the Prisma schema and all backend repositories.
