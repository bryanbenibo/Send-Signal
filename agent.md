# Send Signal - Agent coordination Document 

## 1. Product Definition 
Send Signal is a full-stack web application designed to automate personalized WhatsApp outreach campaigns for businesses, founders, agencies, and institutions. 

The system enables businesses to import leads, organize contacts, create message templates and send personalised whatsapp messages to their leads using the whatsapp business API.

The platform also provides message trackcing, reply monitoring, and campaign analytics.

The application consists of two main surfaces:

Public marketing website

Authenticated product dashboard

The marketing site converts visitors into users, while the dashboard allows users to manage outreach campaigns.

Primary user groups include:
- solo founders running marketing outreach
- educational institutions running bootcamps following up with applicants
- agencies managing outreach campaigns for clients

Core user outcomes : 
- Importing leads via csv
- Organizing and segmenting contacts 
- creating reusable message templates with placeholders
- sending personalised messages at scale
- tracking message delivery and replies
- managing conversations and follow-ups
- analyzing campaign performance 
- respecting opt-in and unsubscribe requirements  


## 2. Product Entry Flow
Marketing Website

The marketing website is the public entry point for the product.

This page must include:
- product headline
- value proposition
- feature explanation
- use cases
- call to action
- Get Started button

Marketing Page Goal
Convert visitors into registered users.

Marketing Page Actions

Visitor actions:
- Visitor lands on marketing page
- Visitor reads product value
- Visitor clicks Get Started
- Visitor is redirected to Sign Up page

## 3. Compliance principles
All messaging activity follows communication compliance requirements especially from the Whatsapp Business API

Key principles include : 

Opt-in requrement
Messaging must only occur for contacts with a valid opt-in or lawful communication basis 

Unsubscribe support 
The app must recognize and enforce unsubscribe keywords such as

- STOP
- UNSUBSCRIBE
- CANCEL
- END
- QUIT

Contacts marked as unsubscribed are excluded from all future messaging unless they explicitly re-opt-in.

Duplicate prevention
Campaign execution must prevent duplicate messages being sent to the same lead

Rate-limit awareness
Outbound messaging must respect platform rate limits and safe send sending intervals 

## 4. Product Scope

### Authentication Flow
The onboarding flow will consist of : 
1. User Authentication
2. Whatsapp business API connection
3. CSV lead import and validation
4. Dashboard Orientation

#### Sign Up
User signs up using:
- company name
- email
- password

The system creates a user record in the database.

Database record created
users

Fields include:
- id
- email
- company name
- password_hash
- created_at
- updated_at

#### Login

User logs into the application.
After login the user is redirected to:
Application Dashboard
Authentication must support:
- secure sessions
- protected routes
- logout

Authentication must be handled server-side within the Next.js application.

### Lead Management
The lead database supports
- CSV import
- Phone validation
- Tagging and segmentation
- Column mapping
- Duplicate detection

lead data fields include :
- phone number (required)
- first name (optional)
- last name (optional)
- email (optional)
- tags (optional)
- custom fields (optional)
- unsubscribed (boolean)
- opt-in (boolean)

lead status include
- New
- Contacted
- Replied
- Interested
- Not Interested
- Unsubscribed
- Converted
- Bounced 

### Message Templates
Templates enable reusable outreach messages with placeholders for dynamic content. 

Templates are to be stored and reused across campaigns. 

Template capabilities include : 
- placeholders such as first name, last name, full name, source.
- Preview generation using sample leads
- Validation of placeholder usage

### Campaign Execution
Campaign creation includes : 
- Selecting a template
- Selecting leads  and lead segments
- Scheduling a send time
- Defining batch size and delay time in between messages

Message delivery occurs through a server side queue system and each message will receive a delivery status which can be
- Queued
- Sending
- Sent
- Failed
- Delivered
- Read
- Replied
- Unsubscribed
- Converted
- Bounced 

### Analytics
Campaign analytics include : 
- queued messages
- Sent messages
- delivered messages
- read messages
- replies
- conversions

lead activity timeline record will record communication events.   

## 5. Technical Guardrails

##

- All outbound WhatsApp communication must occur from the server-side using the WhatsApp Business API
- Frontend must never expose API credentials

## Database model
minimum database entities include : 

- users
- templates 
- Whatsapp accounts
- messages 
- leads
- campaigns
- Analytics data

### Idempotent messaging 
Campaigb messaging requires idemptent behaviour.

Each message will be uniquely identified by a lead id and a campaign id. 

Repeated campaign triggers do not result in duplicate messages being sent to the same lead. 

## 6. User experience principles for lead import
CSV import behavious prioritizes flexibility and validation 

Features include : 
- Flexible column mapping
- Phone number validation
- Duplicate detection

Campaign confirmation screen
- total recipients

## Implementation workflow
Feature implementation should follow this sequence : 
1. clarify user story
2. Verify compliance with product and technical guardrails
3. define data structure
4. define database schema
5. define api endpoints
6. define frontend components
7. define backend logic
8. perform manual and automated testing


## 7. Technology Stack
Send Signal must be implemented using the following stack.

### Frontend
- Next.js
- React
- CSS from design tokens in design-tokens.css
- Server Components where appropriate


### Backend
Backend must run inside the Next.js application.

Use:
- Next.js API routes
- Next.js server actions

Backend responsibilities:
- authentication
- lead import processing
- template rendering
- campaign orchestration
- WhatsApp messaging
- webhook handling
- analytics aggregation

### Database

Use:
- PostgreSQL

ORM:
- Prisma

Prisma must be used for:
- schema definition
- migrations
- database queries
- relational mapping

## 8. Definition of completion
A feature is considered complete when the following conditions are satisfied : 

- the primary workflow is fully implemented
- all edge cases are handled
- all error states are handled
- all user flows are tested
- all accessibility requirements are met
- all performance requirements are met
- all security requirements are met
- all compliance requirements are met