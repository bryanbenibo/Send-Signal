# Send Signal — Database Schema Specification

## 1. Purpose

This document defines the database structure for Send Signal.

Send Signal is a full-stack web application for managing and automating personalized WhatsApp outreach campaigns.

The database must support:

- user authentication
- WhatsApp account connection
- lead storage and segmentation
- template storage
- campaign creation and execution
- idempotent messaging
- inbound and outbound message tracking
- webhook event persistence
- analytics reporting
- activity timelines
- unsubscribe enforcement

This schema is designed for:

- PostgreSQL
- Prisma ORM
- Next.js full-stack architecture

The schema must prioritize:

- relational clarity
- strong constraints
- idempotency
- auditability
- analytics accuracy
- production readiness

---

## 2. General Database Principles

### Primary database
- PostgreSQL

### ORM
- Prisma

### Required principles
- all important relations must be explicit
- all core tables must use stable primary keys
- all important state changes must be persisted
- all messaging actions must be auditable
- duplicate sends must be prevented by database constraints
- phone numbers must be normalized before persistence
- timestamps must exist on all major entities

### ID strategy
Use UUIDs for all major entity identifiers.

---

## 3. Core Entities Overview

The minimum core entities are:

- users
- sessions
- whatsapp_accounts
- leads
- lead_tags
- lead_tag_assignments
- templates
- campaigns
- campaign_leads
- messages
- message_events
- conversations
- conversation_messages
- activity_logs
- analytics_snapshots

---

## 4. Enum Definitions

The following enums should exist in Prisma schema form.

### UserRole
- OWNER
- ADMIN
- MEMBER

### LeadStatus
- NEW
- CONTACTED
- REPLIED
- INTERESTED
- NOT_INTERESTED
- CONVERTED
- BOUNCED
- UNSUBSCRIBED

### CampaignStatus
- DRAFT
- SCHEDULED
- RUNNING
- PAUSED
- COMPLETED
- CANCELLED
- FAILED

### MessageStatus
- QUEUED
- SENDING
- SENT
- FAILED
- DELIVERED
- READ
- REPLIED
- UNSUBSCRIBED
- CONVERTED
- BOUNCED

### MessageDirection
- OUTBOUND
- INBOUND

### EventType
- CAMPAIGN_CREATED
- CAMPAIGN_STARTED
- CAMPAIGN_PAUSED
- CAMPAIGN_COMPLETED
- LEAD_IMPORTED
- LEAD_UPDATED
- LEAD_UNSUBSCRIBED
- TEMPLATE_CREATED
- TEMPLATE_UPDATED
- MESSAGE_QUEUED
- MESSAGE_SENT
- MESSAGE_FAILED
- MESSAGE_DELIVERED
- MESSAGE_READ
- REPLY_RECEIVED
- CONVERSION_RECORDED

### ConversationSource
- CAMPAIGN
- MANUAL
- WEBHOOK

---

## 5. users

Represents authenticated product users.

### Fields
- id
- company_name
- email
- password_hash
- role
- is_active
- created_at
- updated_at

### Constraints
- email must be unique

### Notes
Each user owns leads, templates, campaigns, and WhatsApp account connections.

---

## 6. sessions

Represents authenticated user sessions if session persistence is stored in database.

### Fields
- id
- user_id
- token_hash
- expires_at
- created_at
- updated_at

### Relations
- belongs to users

### Constraints
- token_hash must be unique

---

## 7. whatsapp_accounts

Represents a connected WhatsApp Business configuration for a user.

### Fields
- id
- user_id
- account_name
- phone_number_id
- business_account_id
- access_token_encrypted
- webhook_verify_token_encrypted
- display_phone_number
- is_active
- created_at
- updated_at

### Relations
- belongs to users

### Constraints
- phone_number_id must be unique
- business_account_id should be indexed

### Notes
All WhatsApp credentials must be stored securely and never exposed client-side.

---

## 8. leads

Represents an individual contact that may receive outreach.

### Fields
- id
- user_id
- whatsapp_account_id
- phone_number
- first_name
- last_name
- email
- source
- custom_fields_json
- opt_in
- unsubscribed
- unsubscribed_at
- status
- notes
- created_at
- updated_at

### Relations
- belongs to users
- optionally belongs to whatsapp_accounts
- has many campaign_leads
- has many messages
- has many activity_logs
- has many conversation_messages
- has many lead_tag_assignments

### Constraints
- phone_number must be stored in E.164 format
- composite uniqueness recommended on:
  - user_id + phone_number

### Notes
This prevents duplicate lead storage for the same workspace owner.

---

## 9. lead_tags

Represents reusable tags for lead segmentation.

### Fields
- id
- user_id
- name
- color
- created_at
- updated_at

### Relations
- belongs to users
- has many lead_tag_assignments

### Constraints
- composite unique:
  - user_id + name

---

## 10. lead_tag_assignments

Join table between leads and tags.

### Fields
- id
- lead_id
- tag_id
- created_at

### Relations
- belongs to leads
- belongs to lead_tags

### Constraints
- composite unique:
  - lead_id + tag_id

---

## 11. templates

Represents reusable message templates.

### Fields
- id
- user_id
- name
- body
- placeholder_schema_json
- preview_example_json
- is_archived
- version
- created_at
- updated_at

### Relations
- belongs to users
- has many campaigns

### Constraints
- composite unique recommended:
  - user_id + name + version

### Notes
Template rendering must happen server-side.

---

## 12. campaigns

Represents an outreach campaign.

### Fields
- id
- user_id
- whatsapp_account_id
- template_id
- name
- description
- status
- scheduled_at
- started_at
- completed_at
- batch_size
- delay_in_seconds
- total_recipients
- total_queued
- total_sent
- total_delivered
- total_read
- total_replied
- total_converted
- total_failed
- total_unsubscribed
- created_at
- updated_at

### Relations
- belongs to users
- belongs to whatsapp_accounts
- belongs to templates
- has many campaign_leads
- has many messages
- has many analytics_snapshots
- has many activity_logs

### Notes
Counter columns are optional but useful for performance and dashboard summaries.

---

## 13. campaign_leads

Represents the selection of a lead into a campaign before or during sending.

This table is critical.

### Fields
- id
- campaign_id
- lead_id
- status
- excluded_reason
- scheduled_for
- processed_at
- created_at
- updated_at

### Relations
- belongs to campaigns
- belongs to leads

### Constraints
- composite unique:
  - campaign_id + lead_id

### Notes
This table prevents duplicate recipient inclusion for the same campaign.



## 14. messages

Represents a single outbound or inbound message record.

### Fields
- id
- user_id
- whatsapp_account_id
- campaign_id
- lead_id
- campaign_lead_id
- direction
- status
- whatsapp_message_id
- template_snapshot
- rendered_body
- failure_reason
- queued_at
- sending_at
- sent_at
- delivered_at
- read_at
- replied_at
- bounced_at
- created_at
- updated_at

### Relations
- belongs to users
- belongs to whatsapp_accounts
- belongs to campaigns
- belongs to leads
- belongs to campaign_leads
- has many message_events

### Constraints
- composite unique:
  - campaign_id + lead_id + direction
  for outbound campaign sends, if direction is OUTBOUND
- whatsapp_message_id should be unique when present

### Notes
For outbound campaign sends, one lead should not receive the same campaign message twice.
This table is central to idempotency.

---

## 15. message_events

Represents state transitions and webhook events related to a message.

### Fields
- id
- message_id
- event_type
- event_payload_json
- occurred_at
- created_at

### Relations
- belongs to messages

### Notes
Examples of events:

- queued
- sending
- sent
- failed
- delivered
- read
- inbound_reply
- unsubscribe_detected

This table is essential for analytics accuracy and audit trails.

---

## 16. conversations

Represents a conversation thread with a lead.

### Fields
- id
- user_id
- lead_id
- whatsapp_account_id
- source
- last_message_at
- created_at
- updated_at

### Relations
- belongs to users
- belongs to leads
- belongs to whatsapp_accounts
- has many conversation_messages

### Constraints
- composite unique recommended:
  - user_id + lead_id + whatsapp_account_id

### Notes
A lead should normally have one main conversation thread per connected WhatsApp account.

---

## 17. conversation_messages

Represents chronological chat messages shown in the conversation view.

### Fields
- id
- conversation_id
- lead_id
- campaign_id
- direction
- body
- whatsapp_message_id
- message_id
- sent_at
- received_at
- created_at
- updated_at

### Relations
- belongs to conversations
- belongs to leads
- optionally belongs to campaigns
- optionally belongs to messages

### Notes
This table powers the chat-like UI.
It may overlap conceptually with messages, but is useful when building a dedicated conversation interface.

If desired, the product can simplify by using only `messages` as the source of truth and generating the conversation view from it.  
If simplicity is preferred, remove `conversation_messages` and use `messages` directly.

---

## 18. activity_logs

Represents product-level timeline activity.

### Fields
- id
- user_id
- lead_id
- campaign_id
- message_id
- event_type
- description
- metadata_json
- created_at

### Relations
- belongs to users
- optionally belongs to leads
- optionally belongs to campaigns
- optionally belongs to messages

### Notes
Use this for timeline events such as:

- lead imported
- template updated
- campaign launched
- unsubscribe recorded
- reply received

---

## 19. analytics_snapshots

Represents denormalized analytics records for dashboard performance.

### Fields
- id
- user_id
- campaign_id
- snapshot_date
- total_recipients
- total_sent
- total_delivered
- total_read
- total_replied
- total_converted
- total_failed
- total_unsubscribed
- created_at
- updated_at

### Relations
- belongs to users
- belongs to campaigns

### Constraints
- composite unique:
  - campaign_id + snapshot_date

### Notes
This table is optional but recommended if analytics pages need to load quickly over time ranges.

---

## 20. Required Relationship Map

### users has many
- sessions
- whatsapp_accounts
- leads
- lead_tags
- templates
- campaigns
- messages
- conversations
- activity_logs
- analytics_snapshots

### leads has many
- campaign_leads
- messages
- conversation_messages
- activity_logs
- lead_tag_assignments

### campaigns has many
- campaign_leads
- messages
- analytics_snapshots
- activity_logs

### messages has many
- message_events

---

## 21. Idempotency Rules

The database must enforce idempotent campaign sending.

### Rule 1
A lead must not be added to the same campaign more than once.

Enforce with:

- unique(campaign_id, lead_id) on campaign_leads

### Rule 2
A campaign must not send multiple outbound messages to the same lead for the same execution context.

Enforce with:

- unique constraint on outbound campaign message identity

### Rule 3
Webhook events should not create duplicate state transitions when the same webhook is retried.

Approaches:
- store external event identifiers if available
- deduplicate repeated event payloads
- ensure webhook handlers are idempotent

---

## 22. Phone Number Rules

All phone numbers must be stored in E.164 format.

### Example
+2348012345678

### Requirements
- normalize during CSV import
- normalize during manual creation
- validate before persistence
- reject invalid numbers

### Constraint guidance
- store normalized phone number only
- never store raw phone number as the primary operational field

Optional:
- raw_phone_number may be stored separately for debugging

---

## 23. Soft Delete vs Hard Delete

Recommended strategy:

### Soft delete
Use soft delete for:
- leads
- templates
- campaigns

Suggested field:
- deleted_at

### Hard delete
Use hard delete only for:
- temporary invalid imports
- expired sessions
- development cleanup

This preserves analytics and auditability.

---

## 24. Indexing Strategy

Recommended indexes:

### leads
- index(user_id)
- index(phone_number)
- index(status)
- index(unsubscribed)
- index(opt_in)

### campaigns
- index(user_id)
- index(status)
- index(scheduled_at)

### campaign_leads
- index(campaign_id)
- index(lead_id)
- unique(campaign_id, lead_id)

### messages
- index(campaign_id)
- index(lead_id)
- index(status)
- index(direction)
- index(sent_at)
- unique(whatsapp_message_id) when present

### message_events
- index(message_id)
- index(occurred_at)

### conversations
- index(lead_id)
- index(last_message_at)

### analytics_snapshots
- index(snapshot_date)
- unique(campaign_id, snapshot_date)

---

## 25. Background Execution Without Redis

Redis is not part of this architecture.

Therefore:

- pending outbound work must be represented in database state
- campaign_leads and messages should act as the operational queue source
- scheduled sends must be selected from database records
- execution state must be persisted in database fields
- retries must also be tracked in database fields

Recommended additional optional fields for operational reliability:

### campaign_leads
- attempt_count
- last_attempt_at
- next_attempt_at

### messages
- retry_count
- last_retry_at

This preserves a database-driven execution model compatible with Next.js and Prisma.


## 26. Recommended Prisma Modeling Notes

### JSON fields
Use JSON fields for:
- custom_fields_json
- placeholder_schema_json
- preview_example_json
- event_payload_json
- metadata_json

### Enums
Use Prisma enums for:
- LeadStatus
- CampaignStatus
- MessageStatus
- MessageDirection
- UserRole
- EventType
- ConversationSource

### Timestamps
Use:
- created_at
- updated_at

Where state transitions matter, include explicit event timestamps such as:
- sent_at
- delivered_at
- read_at
- unsubscribed_at

---

## 27. Minimum Viable Schema vs Preferred Schema

### Minimum viable schema
If reducing complexity for first build, the minimum recommended tables are:

- users
- whatsapp_accounts
- leads
- templates
- campaigns
- campaign_leads
- messages
- message_events
- activity_logs

### Preferred production schema
For stronger product quality, use:

- users
- sessions
- whatsapp_accounts
- leads
- lead_tags
- lead_tag_assignments
- templates
- campaigns
- campaign_leads
- messages
- message_events
- conversations
- conversation_messages
- activity_logs
- analytics_snapshots

---

## 28. Final Build Rules

The final database design must ensure:

- one user can manage many campaigns
- one campaign can target many leads
- one lead can belong to many campaigns
- one campaign-lead pair is unique
- one outbound campaign message is not duplicated
- webhook events are auditable
- analytics can be derived reliably
- unsubscribe enforcement is permanent until explicit re-opt-in
- all messaging logic remains compatible with Next.js + Prisma and does not depend on Redis

---

## 29. Placement Recommendation

Place this file in the project root.

Correct location:

`/database_schema.md`

Do not place this file inside `skills/`.

### Why
This is a core system-definition document, not a narrow reusable UI or styling skill.

Correct root-level documents:

- `agents.md`
- `architecture.md`
- `database_schema.md`

Correct skills examples:

- `skills/forms.md`
- `skills/tables.md`
- `skills/empty-states.md`
- `skills/toasts.md`

---

## 30. Source of Truth Priority

When the AI agent is building Send Signal, schema decisions should follow this order:

1. `database_schema.md`
2. `architecture.md`
3. `agents.md`