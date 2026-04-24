<!--
  Sync Impact Report
  ==================
  Version change: N/A → 1.0.0
  Modified principles: N/A (initial ratification)
  Added sections:
    - Core Principles (I–V)
    - Technology Stack
    - Development Workflow
    - Governance
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no changes needed (Constitution Check section is generic)
    - .specify/templates/spec-template.md ✅ no changes needed (no constitution-specific references)
    - .specify/templates/tasks-template.md ✅ no changes needed (no constitution-specific references)
  Follow-up TODOs: None
-->

# httpSMS Constitution

## Core Principles

### I. Minimal Code Changes

Existing code MUST NOT be modified unless it is the only viable option to
achieve the required outcome. When a code change is unavoidable, the change
MUST be accompanied by a written justification explaining why no alternative
approach (configuration, extension, new file, environment variable, etc.)
could satisfy the requirement. Prefer adding new code over modifying existing
code. Prefer configuration over code changes. Prefer extension over editing.

Rationale: Reduces regression risk, preserves tested behavior, and keeps the
codebase stable across contributions.

### II. Security & Privacy First

All SMS message content MUST be encrypted end-to-end using AES-256 before
transit or storage. Encryption keys MUST reside exclusively on the user's
Android phone — the server MUST NOT have access to plaintext message content.
API keys and credentials MUST NOT be hardcoded; they MUST be provided via
environment variables or secure secret management.

Rationale: SMS messages contain sensitive personal communications; the
architecture explicitly positions the server as an unaware relay.

### III. API-First Design

Every feature MUST be accessible via the HTTP API. The Android app acts as a
gateway that executes commands received through the API — it MUST NOT contain
business logic beyond sending/receiving SMS and reporting status. The API
MUST return standard HTTP status codes and JSON responses. Breaking API
changes MUST follow semantic versioning.

Rationale: The core value proposition is programmatic SMS access; the API
is the contract between users and the system.

### IV. Reliability & Back Pressure

The system MUST support configurable rate limiting per phone to prevent SMS
API abuse on Android devices. Messages that cannot be delivered within a
configurable timeout MUST expire and notify the caller. All message processing
MUST be asynchronous — the API MUST return 202 Accepted immediately and
communicate results via callbacks or polling.

Rationale: SMS is a rate-limited resource on Android; the system must protect
the phone from being overwhelmed while providing visibility into failures.

### V. Simplicity & Self-Containment

The system MUST be fully self-hostable via Docker Compose with no external
service dependencies beyond Firebase (push notifications) and SMTP (email).
Features MUST follow YAGNI — do not build speculative capabilities. Each
component (API, web, Android) MUST be independently deployable.

Rationale: Users in regions without virtual phone numbers need a simple,
self-contained solution; complexity is the enemy of reliability.

## Technology Stack

- **API**: Go with Fiber framework, serverless on Google Cloud Run
- **Database**: CockroachDB (SQL-compatible, distributed)
- **Web UI**: Nuxt.js (Vue) with Vuetify, hosted as SPA on Firebase
- **Mobile**: Native Kotlin Android app with Material Design
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Email**: SMTP (e.g., Mailtrap for development)
- **Captcha**: Cloudflare Turnstile for search endpoint protection
- **Deployment**: Docker Compose for self-hosting; Cloud Run for managed API
- **License**: GNU AGPL v3

## Development Workflow

1. **Environment Setup**: Copy `.env.docker` to `.env` in both `api/` and
   `web/` directories; configure Firebase, SMTP, and Turnstile credentials.
2. **Local Development**: `docker compose up --build` starts API (port 8000),
   web UI (port 3000), database, and cache.
3. **System User**: A system user MUST be created in the `users` table for
   async event processing; credentials must match `EVENTS_QUEUE_USER_ID`
   and `EVENTS_QUEUE_USER_API_KEY` in `.env`.
4. **Android Build**: Replace `android/app/google-services.json` with
   Firebase config before building in Android Studio.
5. **Code Changes**: Must be justified per Principle I. Prefer additive
   changes over modifications to existing files.

## Governance

This constitution supersedes all other development practices and conventions.
Amendments MUST include: (a) documented rationale, (b) approval from a
project maintainer, and (c) a migration plan for any existing code that
conflicts with the new rule. All PRs and reviews MUST verify compliance
with the principles above. Any deviation from Principle I (Minimal Code
Changes) MUST be explicitly justified in the PR description.

**Version**: 1.0.0 | **Ratified**: 2026-04-24 | **Last Amended**: 2026-04-24
