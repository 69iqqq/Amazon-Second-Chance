# Amazon Second Chance - UI Specification

Version: 2.0

---

# 1. Purpose

This document defines the complete UI/UX specification for Amazon Second Chance.

The UI MUST closely follow the supplied design mockups.

Reference Screens:

* Landing Page
* Customer Portal Dashboard
* Seller Central Dashboard
* NGO Portal Dashboard

These mockups are the source of truth.

AI code generators must prioritize matching these designs over introducing new layouts or visual patterns.

---

# 2. Design Philosophy

Amazon Second Chance should feel like a natural Amazon product.

Design Principles:

* Trust
* Simplicity
* Professionalism
* Sustainability
* Transparency
* Operational Efficiency

The experience should resemble:

* Amazon
* Amazon Seller Central
* Amazon Marketplace

Not:

* Startup dashboards
* Glassmorphism interfaces
* Neon UI systems
* Social media applications

---

# 3. Visual Design Language

Theme:

```text
Amazon Inspired
Enterprise Grade
Data Driven
Professional
```

Visual Style:

```text
Light Theme

White Backgrounds

Dark Navigation Bar

Orange Accent Colors

Subtle Borders

Minimal Shadows

Dense Information Layout
```

Avoid:

```text
Emojis

Glassmorphism

Neon Effects

Heavy Animations

Oversized Rounded Components

Dark Mode First Design
```

---

# 4. Color System

Primary

```css
#FF9900
```

Amazon Orange

---

Secondary

```css
#131A22
```

Amazon Navy

---

Success

```css
#22C55E
```

---

Warning

```css
#F59E0B
```

---

Error

```css
#EF4444
```

---

Info

```css
#3B82F6
```

---

Background

```css
#FFFFFF
```

---

Border

```css
#E5E7EB
```

---

# 5. Typography

Primary Font

```text
Amazon Ember
```

Fallback

```text
Inter

Roboto

Arial
```

---

# 6. Application Structure

The application consists of five portals:

```text
Landing Portal

Customer Portal

Seller Central

Kirana Partner Hub

NGO Donation Portal

Admin Portal
```

All portals share:

* Header
* Navigation
* Search
* Notifications
* User Profile
* Footer

---

# 7. Landing Page

Route

```text
/
```

Purpose

Public entry point into Amazon Second Chance.

---

## Header

Contains:

```text
Amazon 2nd Chance Logo

Search Bar

Navigation Links

Orders

Cart

Customer Account
```

Navigation:

```text
Customer Portal

Returns & Orders

Resale Hub

Green Credits

Donations

Recycle & Exchange

Support
```

---

## Portal Selection Section

Display large portal buttons:

```text
Customer Portal

Seller Central

Kirana Partner Hub

NGO Donation Portal
```

Each button routes to respective portal.

---

## AI Certified Products Section

Layout:

```text
3 Columns

2 Rows
```

Each Product Card Contains:

```text
Product Image

AI Certified Badge

Product Name

Rating

Green Credits Label
```

Purpose:

Showcase trusted refurbished inventory.

---

## Hero Banner

Large central banner.

Content:

```text
AI Powered Returns

Sustainable Resale

Refurbishment Ecosystem
```

CTA:

```text
Shop Now
```

---

## Service Cards

Display:

```text
Shop Pre-Owned

Sell Your Item

Partner As Kirana Hub

Receive Product Donations
```

Each card links to a workflow.

---

## Vision Section

Purpose:

Explain Amazon Second Chance mission.

Content:

```text
Circular Commerce

Sustainability

Product Reuse

Waste Reduction
```

---

## AI Decision Core Section

Visual Decision Flow

```text
Resell

Refurbish

Donate

Recycle

Exchange
```

This section explains AI-powered disposition decisions.

---

# 8. Customer Portal

Route

```text
/customer
```

Purpose

Allow customers to manage returns, resale, donations, recycling, and rewards.

---

## Dashboard Layout

Three-column hero section.

Components:

```text
Impact Summary

Hero Banner

Quick Actions
```

---

## Impact Summary Card

Display:

```text
Items Resold

Items Donated

Items Recycled

CO₂ Saved
```

---

## Hero Banner

Message:

```text
Give Products A Second Chance
```

Actions:

```text
Start Return
```

---

## Quick Actions

Display:

```text
Start Return

List Item For Resale

Donate Item

Recycle Item

Exchange Item
```

---

## Recent Activity Section

Card Layout

Activities:

```text
Return Request

Resale Listing

Donation

Recycling
```

Each card displays:

```text
Status

Date

Action Button
```

---

## Recommended Products Section

Horizontal Product Grid

Each Card Contains:

```text
Product Image

Price

Rating

Condition Grade

Green Certified Label

Savings Percentage
```

---

## Green Credits Widget

Display:

```text
Current Balance

Earned Credits

Redeemed Credits
```

---

# 9. Seller Central

Route

```text
/seller
```

Purpose

Allow sellers to manage inventory and resale operations.

---

## KPI Section

Metrics:

```text
Total Items Received

Items Resold

Total Earnings

Green Credits Earned
```

---

## Inventory Analytics

Display Doughnut Chart

Categories:

```text
Ready For Resale

Under Inspection

Refurbishing

Not Resellable
```

---

## Category Performance

Display:

```text
Category Name

Revenue

Percentage Contribution
```

---

## Returns Table

Columns:

```text
Product

Order ID

Condition

Received Date

Action
```

Actions:

```text
List For Resale

Inspect Product
```

---

## Seller Insights

Cards:

```text
AI Listing Assistant

Trust Insights

Payout Summary
```

---

# 10. NGO Portal

Route

```text
/ngo
```

Purpose

Allow NGOs to receive and manage donated products.

---

## KPI Section

Display:

```text
Total Donations Received

Communities Supported

People Impacted

CO₂ Saved
```

---

## Donation Table

Columns:

```text
Item

Donated By

Received Date

Condition

Status

Action
```

---

## Impact Dashboard

Metrics:

```text
Items Distributed

Communities Reached

People Supported

CO₂ Saved
```

---

## Top Needed Items

Display:

```text
Laptops

School Supplies

Winter Wear

Furniture
```

---

## Request Banner

CTA:

```text
Submit Request
```

Purpose:

Allow NGOs to request specific products.

---

# 11. Kirana Partner Hub

Route

```text
/kirana
```

Purpose

Enable local Kirana stores to participate in Amazon Second Chance.

---

## KPI Widgets

Display:

```text
Today's Pickups

Pending Verifications

Stored Inventory

Partner Earnings
```

---

## Inventory Table

Columns:

```text
Product

Status

Pickup Date

Storage Location

Action
```

---

## Pickup Requests

Display:

```text
Request ID

Customer

Pickup Date

Status
```

---

## Earnings Dashboard

Display:

```text
Monthly Earnings

Completed Pickups

Verification Rewards
```

---

# 12. Admin Portal

Route

```text
/admin
```

Purpose

Provide operational visibility and system control.

---

## KPI Widgets

Display:

```text
Total Users

Total Returns

Revenue Recovered

Waste Diverted

CO₂ Saved
```

---

## Analytics Section

Charts:

```text
Return Trends

Disposition Breakdown

Marketplace Revenue

Partner Performance
```

---

## AI Decision Monitor

Columns:

```text
Product

Grade

Decision

Confidence

Override
```

---

# 13. Shared Components

Buttons

```text
Primary

Secondary

Ghost

Danger
```

---

Cards

```text
Metric Card

Product Card

Analytics Card

Activity Card
```

---

Tables

```text
Sortable

Paginated

Filterable
```

---

Charts

```text
Line Chart

Bar Chart

Area Chart

Doughnut Chart
```

---

Modals

```text
Confirmation Modal

Create Listing Modal

Return Modal

Donation Modal
```

---

# 14. Responsive Design

Primary Target

```text
Desktop
1440px - 1920px
```

Secondary

```text
Tablet
768px - 1024px
```

Mobile

```text
Optional For MVP
```

---

# 15. Accessibility

Requirements:

```text
WCAG AA Compliance

Keyboard Navigation

Screen Reader Support

Focus States

High Contrast Support
```

---

# 16. Critical Implementation Instructions

The provided design mockups are the source of truth.

Developers and AI coding agents must:

* Match layout hierarchy
* Match card structure
* Match dashboard composition
* Match navigation patterns
* Match portal organization

Do not redesign the interface.

Do not introduce alternative visual structures.

Do not add emojis.

Do not convert the dashboards into generic SaaS templates.

The final implementation should closely resemble the supplied Amazon Second Chance mockups while remaining responsive and production-ready.
