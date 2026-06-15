# Amazon Loop - Authentication & Authorization Design

Version: 1.0

---

# Purpose

This document defines:

* Authentication Architecture
* Authorization Model
* User Identity Management
* Role Based Access Control (RBAC)
* Session Management
* Clerk Integration
* Backend Security

This document serves as the source of truth for user authentication and access control.

---

# Authentication Architecture

Amazon Loop uses:

```text
Clerk Authentication
```

for identity management.

Authentication Responsibilities:

* User Registration
* User Login
* Session Management
* OAuth Providers
* User Verification
* Password Management

Authorization Responsibilities:

* Role Management
* Route Protection
* API Access Control
* Portal Access Control

---

# Technology Stack

Authentication Provider:

```text
Clerk
```

Database:

```text
Neon PostgreSQL
```

ORM:

```text
Prisma
```

Backend:

```text
NestJS
```

Frontend:

```text
Next.js
```

---

# Authentication Flow

```text
User
  ↓
Clerk Sign In
  ↓
Clerk Session Created
  ↓
JWT Generated
  ↓
Backend Verification
  ↓
User Synced To Database
  ↓
Role Resolution
  ↓
Application Access
```

---

# Supported Authentication Methods

## Email & Password

Users can:

* Register
* Login
* Reset Password
* Change Password

---

## Google OAuth

Supported Provider:

```text
Google
```

Capabilities:

* One-click login
* Automatic account creation

---

## GitHub OAuth

Supported Provider:

```text
GitHub
```

Capabilities:

* One-click login
* Automatic account creation

---

# User Synchronization

Clerk manages identity.

Amazon Loop manages business data.

After successful authentication:

```text
Clerk User
       ↓
Prisma User Record
       ↓
Role Assignment
       ↓
Portal Access
```

---

# Synchronization Rules

If user exists:

```text
Update profile information
```

If user does not exist:

```text
Create user record
Create wallet
Create sustainability profile
```

---

# User Model

Clerk stores:

```text
Email

Password

OAuth Information

Verification Status

Session Information
```

Application Database stores:

```text
Role

Profile

Credits

Sustainability Metrics

Business Data
```

---

# User Roles

## CUSTOMER

Capabilities:

```text
Browse Marketplace

Create Returns

Create Listings

Purchase Products

Donate Products

Recycle Products

View Credits
```

---

## SELLER

Capabilities:

```text
Manage Inventory

Manage Listings

View Sales Analytics

Track Returns
```

---

## NGO

Capabilities:

```text
View Donations

Accept Donations

Verify Donations

Generate Reports
```

---

## KIRANA_PARTNER

Capabilities:

```text
Verify Products

Manage Pickups

Manage Inventory

Track Earnings
```

---

## RECYCLER

Capabilities:

```text
Accept Recycling Requests

Update Recycling Status

Generate Recycling Reports
```

---

## ADMIN

Capabilities:

```text
Manage Users

Manage Partners

Manage Products

Override AI Decisions

View Analytics

Manage Platform Settings
```

---

# Portal Access Matrix

| Portal          | Customer | Seller | NGO | Kirana | Recycler | Admin |
| --------------- | -------- | ------ | --- | ------ | -------- | ----- |
| Customer Portal | Yes      | No     | No  | No     | No       | Yes   |
| Seller Portal   | No       | Yes    | No  | No     | No       | Yes   |
| NGO Portal      | No       | No     | Yes | No     | No       | Yes   |
| Kirana Portal   | No       | No     | No  | Yes    | No       | Yes   |
| Recycler Portal | No       | No     | No  | No     | Yes      | Yes   |
| Admin Portal    | No       | No     | No  | No     | No       | Yes   |

---

# Frontend Route Protection

Framework:

```text
Clerk Middleware
```

Protected Routes:

```text
/customer/**

/seller/**

/ngo/**

/kirana/**

/recycler/**

/admin/**
```

---

# Route Authorization

After authentication:

```text
User
   ↓
Role Check
   ↓
Route Permission Check
   ↓
Allow Access
```

Unauthorized users:

```text
Redirect To Access Denied Page
```

---

# Backend Authentication

NestJS validates:

```text
Clerk JWT
```

Every protected request must include:

```http
Authorization: Bearer <token>
```

---

# Backend Authorization

Framework:

```text
NestJS Guards
```

Example:

```text
@Roles(ADMIN)

@Roles(SELLER)

@Roles(CUSTOMER)
```

---

# Session Management

Managed by:

```text
Clerk
```

Features:

```text
Session Persistence

Multi Device Sessions

Session Revocation

Session Expiration
```

---

# User Lifecycle

Registration

```text
Register
↓
Verify Email
↓
Create User
↓
Assign Role
↓
Initialize Wallet
↓
Initialize Sustainability Profile
```

---

Login

```text
Login
↓
Validate Credentials
↓
Create Session
↓
Load User Role
↓
Access Portal
```

---

Logout

```text
Logout
↓
Destroy Session
↓
Redirect To Landing Page
```

---

# Security Controls

## Email Verification

Required:

```text
Yes
```

Before access:

```text
User must verify email
```

---

## Password Policy

Minimum:

```text
8 Characters
```

Require:

```text
Uppercase

Lowercase

Number
```

---

## MFA

Future Support:

```text
Multi-Factor Authentication
```

Methods:

```text
Authenticator App

SMS OTP
```

---

# API Security

Every protected endpoint requires:

```http
Authorization Header
```

Authentication Process:

```text
Verify Clerk Token
↓
Load User
↓
Load Role
↓
Validate Permissions
↓
Execute Request
```

---

# Audit Logging

Log Events:

```text
Login

Logout

Role Changes

Permission Changes

Failed Login Attempts

Admin Actions
```

---

# Error Handling

Unauthorized:

```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

Forbidden:

```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

---

# Future Enhancements

Phase 2

```text
MFA

SSO

Organization Accounts
```

Phase 3

```text
Enterprise Identity Providers

Azure AD

Okta

SAML Authentication
```

---

# Critical Implementation Instructions

Use Clerk as the single authentication provider.

Do not implement custom authentication.

Do not implement custom password storage.

Do not implement custom session management.

Clerk is responsible for:

* Identity
* Sessions
* OAuth
* Verification

The application database is responsible for:

* Roles
* Business Permissions
* User Profiles
* Credits
* Sustainability Data

All authorization must be role-based and enforced in both frontend and backend.
