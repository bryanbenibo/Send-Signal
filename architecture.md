# Send Signal — System Architecture Specification

## 1. Purpose

This document defines the system architecture for Send Signal.

Send Signal is a full-stack web application for automating personalized WhatsApp outreach campaigns. The system includes a public marketing website, a sign-up and authentication flow, an authenticated dashboard, lead management, template management, campaign execution, reply tracking, and analytics.

This architecture is designed for:

- Next.js
- Prisma
- PostgreSQL
- server-side WhatsApp API communication
- database-driven execution without Redis

The architecture must prioritize:

- simplicity
- security
- maintainability
- production readiness
- clear server boundaries
- compatibility with a unified Next.js application

---

## 2. Core Architecture Principles

### Principle 1: One unified full-stack application
Send Signal should be built as a single Next.js application that contains:

- public marketing pages
- authentication pages
- authenticated dashboard pages
- server routes and handlers
- webhook endpoints
- server-side business logic

Avoid splitting the project into unnecessary microservices in the first version.

---

### Principle 2: Server-side control of sensitive operations
All sensitive logic must run server-side, including:

- authentication
- lead import processing
- campaign execution
- template rendering
- WhatsApp API communication
- webhook handling
- analytics aggregation

No WhatsApp credential or secret may be exposed in the browser.

---

### Principle 3: Database-driven execution
Redis is not part of this architecture.

All campaign execution and operational tracking must be driven by:

- PostgreSQL records
- Prisma models
- message status transitions
- campaign lead execution states
- scheduled database queries
- database-backed retry logic

The database acts as the operational source of truth.

---

### Principle 4: Public and private product surfaces must be clearly separated
The product has two surfaces:

#### Public surface
Used for:
- product marketing
- conversion
- landing pages
- pricing
- feature education
- sign-up entry

#### Private surface
Used for:
- dashboard workflows
- leads
- templates
- campaigns
- conversations
- analytics
- settings

This separation must be reflected in folder structure, layout structure, and route protection.

---

### Principle 5: Schema-first architecture
The application should be built from the database schema upward.

Priority order:

1. `database_schema.md`
2. `architecture.md`
3. `agents.md`

The database schema defines the relational truth of the system.

---

## 3. High-Level System Overview

The system consists of the following layers:

### Layer A: Marketing layer
Responsible for:

- public landing page
- feature pages
- pricing page
- conversion messaging
- get started call to action

### Layer B: Authentication layer
Responsible for:

- sign up
- sign in
- session creation
- protected route access

### Layer C: Application layer
Responsible for:

- dashboard
- lead management
- template management
- campaign creation
- campaign monitoring
- conversations
- analytics
- settings

### Layer D: Server application layer
Responsible for:

- API route handling
- server actions
- business logic
- CSV ingestion
- WhatsApp integration
- webhook ingestion
- campaign execution
- analytics computation

### Layer E: Persistence layer
Responsible for:

- data storage in PostgreSQL
- Prisma relations
- idempotency constraints
- auditability
- execution state tracking

---

## 4. Technology Stack

### Frontend
- Next.js
- React
- CSS powered by `design-tokens.css`
- Server Components where appropriate
- Client Components only where interactivity is needed

### Backend
- Next.js Route Handlers
- Next.js Server Actions where appropriate
- server-only utility modules
- Prisma ORM

### Database
- PostgreSQL

### ORM
- Prisma

### Messaging integration
- WhatsApp Business API

### File processing
- CSV parsing on the server

### Authentication
Use secure server-side authentication compatible with Next.js.