# Feature Specification: Railway Deployment

**Feature Branch**: `001-railway-deployment`
**Created**: 2026-04-24
**Status**: Draft
**Input**: User description: "prepare for railway deployment. it is planned to deploy the project in railway. make necessary changes and provide required env to get it ready"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Deploy API to Railway (Priority: P1)

A developer wants to deploy the httpSMS Go API as a Railway service. They
connect the GitHub repo, Railway detects the Dockerfile in `api/`, builds
the container, and the API starts successfully on the Railway-assigned port.
The API connects to a Railway-provisioned PostgreSQL database and Redis
instance using environment variables.

**Why this priority**: The API is the core of httpSMS — without it running,
no other component functions. It must be deployed first.

**Independent Test**: After deployment, `GET /v1/health` (or any API
endpoint) returns a valid HTTP response from the Railway URL.

**Acceptance Scenarios**:

1. **Given** a Railway project with a PostgreSQL and Redis service, **When**
   the API service is deployed from the `api/` directory, **Then** it builds
   successfully and starts listening on the Railway-assigned `PORT`.
2. **Given** the API is running on Railway, **When** environment variables
   are set for `DATABASE_URL`, `REDIS_URL`, `FIREBASE_CREDENTIALS`, and
   SMTP config, **Then** the API connects to all external services without
   errors.
3. **Given** the API is running, **When** a request is sent to the API
   endpoint, **Then** it responds with the expected JSON payload.

---

### User Story 2 - Deploy Web UI to Railway (Priority: P2)

A developer wants to deploy the httpSMS Nuxt.js web frontend as a Railway
service. Railway builds the static site from `web/`, serves it via the
nginx container, and the web UI is accessible at the Railway URL. The web
UI communicates with the API deployed in User Story 1.

**Why this priority**: The web UI depends on the API being available; it
is the user-facing component but non-functional without the API.

**Independent Test**: After deployment, navigating to the Railway web URL
shows the httpSMS landing page with Firebase authentication working.

**Acceptance Scenarios**:

1. **Given** the API is deployed on Railway, **When** the web service is
   deployed from the `web/` directory, **Then** it builds successfully and
   serves the static site on the Railway-assigned `PORT`.
2. **Given** the web UI is running, **When** `API_BASE_URL` is set to the
   Railway API URL, **Then** the web UI makes API calls to the correct
   backend.
3. **Given** the web UI is running, **When** Firebase env vars are
   configured, **Then** the login/signup flow works correctly.

---

### User Story 3 - Configure Railway Infrastructure (Priority: P3)

A developer provisions PostgreSQL and Redis as Railway plugin services and
configures all required environment variables for both API and web services.
They also set up a system user in the database for async event processing.

**Why this priority**: Infrastructure provisioning is a prerequisite for
both P1 and P2, but it is documented separately because it involves
Railway-specific configuration that is not code-level.

**Independent Test**: The PostgreSQL and Redis services show "ACTIVE" status
in the Railway dashboard, and the API can connect to them using the
auto-provided `DATABASE_URL` and `REDIS_URL` connection strings.

**Acceptance Scenarios**:

1. **Given** a Railway project, **When** PostgreSQL is added as a plugin,
   **Then** Railway provides a `DATABASE_URL` environment variable that the
   API service can consume.
2. **Given** a Railway project, **When** Redis is added as a plugin, **Then**
   Railway provides a `REDIS_URL` environment variable that the API service
   can consume.
3. **Given** the database is running, **When** a system user is inserted via
   SQL, **Then** the events queue processes messages successfully.

---

### Edge Cases

- What happens when Railway assigns a dynamic `PORT` that differs from the
  hardcoded `8000` in the current Dockerfile/API config?
- How does the API handle the CockroachDB `root.crt` when connecting to a
  standard PostgreSQL instance on Railway (which doesn't use client certs)?
- What happens if the `DATABASE_URL` provided by Railway uses a different
  format than the current `postgresql://user:pass@host:port/db` expected by
  the API?
- How does the web nginx config handle Railway's proxy headers (X-Forwarded-*)
  for correct URL generation?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The API Dockerfile MUST accept the `PORT` environment variable
  from Railway and listen on that port instead of hardcoded `8000`.
- **FR-002**: The API MUST connect to PostgreSQL using the `DATABASE_URL`
  environment variable provided by Railway without requiring a `root.crt`
  client certificate.
- **FR-003**: The API MUST connect to Redis using the `REDIS_URL`
  environment variable provided by Railway.
- **FR-004**: The web Dockerfile MUST accept the `PORT` environment variable
  from Railway and serve traffic on that port.
- **FR-005**: The web nginx config MUST properly handle X-Forwarded-*
  headers from Railway's reverse proxy.
- **FR-006**: A Railway configuration file (`railway.toml` or
  `nixpacks.toml`) MUST be provided for each service to specify build
  context, build commands, and start commands.
- **FR-007**: All required environment variables MUST be documented in a
  Railway-specific env reference file so developers can configure them in
  the Railway dashboard.
- **FR-008**: The API MUST function correctly with standard PostgreSQL
  (not just CockroachDB) for Railway deployments.
- **FR-009**: The `DATABASE_URL_DEDICATED` env var MUST be set in the
  Railway dashboard to the same value as `DATABASE_URL` (i.e.,
  `${{Postgres.DATABASE_URL}}`). No code change is required — the
  existing `DedicatedDB()` method reads this variable directly.

### Key Entities

- **Railway Service**: A deployable unit (API or Web) with its own build
  context, environment variables, and assigned port.
- **Railway Plugin**: A managed infrastructure service (PostgreSQL, Redis)
  provisioned by Railway with auto-generated connection strings.
- **Environment Variable Set**: The complete collection of env vars
  required for each service to function, derived from existing `.env.docker`
  and `.env.production` files.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The API service builds and deploys on Railway within 5
  minutes of pushing to the connected branch.
- **SC-002**: The API responds to HTTP requests on the Railway-assigned
  port without manual port configuration.
- **SC-003**: The web UI loads and renders correctly at the Railway URL
  with Firebase authentication functional.
- **SC-004**: All environment variables are documented in a single
  reference file with clear descriptions and which service requires each.
- **SC-005**: No existing Docker Compose functionality is broken — the
  project still runs locally via `docker compose up --build`.

## Assumptions

- Railway will be used with its built-in PostgreSQL and Redis plugins
  rather than external managed databases.
- The developer has a Firebase project already configured (per existing
  README instructions) with web SDK credentials and service account JSON.
- The developer has SMTP credentials available for email functionality.
- Railway's free/hobby tier is sufficient for initial deployment testing.
- The existing Dockerfiles are largely compatible with Railway's build
  system — only port and minor config changes are needed.
- The `root.crt` in the API directory is specific to CockroachDB and is
  not needed for standard PostgreSQL on Railway.
- Railway provides `PORT` as an environment variable that the application
  MUST respect for HTTP traffic routing.
