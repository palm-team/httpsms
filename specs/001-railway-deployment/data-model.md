# Data Model: Railway Deployment

**Date**: 2026-04-24
**Feature**: 001-railway-deployment

## Overview

This feature does not introduce new database entities. It is a deployment
configuration feature. The data model here describes the **configuration
entities** (not database tables) that Railway requires.

## Entities

### RailwayService

Represents a deployable service on Railway.

| Field | Type | Description |
|-------|------|-------------|
| name | string | Service name (e.g., "api", "web") |
| builder | enum | Build strategy: DOCKERFILE or RAILPACK |
| dockerfilePath | string | Path to Dockerfile relative to repo root |
| startCommand | string | Override start command (null = use Dockerfile ENTRYPOINT/CMD) |
| healthcheckPath | string | HTTP path for health verification |
| healthcheckTimeout | int | Seconds to wait for healthcheck |
| restartPolicyType | enum | ON_FAILURE, ALWAYS, NEVER |
| restartPolicyMaxRetries | int | Max restart attempts |

### RailwayPlugin

Represents a managed infrastructure service provisioned by Railway.

| Field | Type | Description |
|-------|------|-------------|
| name | string | Plugin name (e.g., "Postgres", "Redis") |
| type | enum | Plugin type: postgres, redis |
| connectionVar | string | Env var name auto-provided by Railway (e.g., "DATABASE_URL", "REDIS_URL") |

### EnvironmentVariable

Represents a single environment variable required by a service.

| Field | Type | Description |
|-------|------|-------------|
| name | string | Env var name (e.g., "DATABASE_URL", "APP_PORT") |
| service | string | Which service requires it (api, web, or both) |
| required | boolean | Whether the app fails without it |
| defaultValue | string | Default value if any (e.g., "8000" for APP_PORT) |
| railwayRef | string | Railway variable reference (e.g., "${{Postgres.DATABASE_URL}}") |
| description | string | Human-readable description |

## Relationships

- A **RailwayService** has many **EnvironmentVariables**
- A **RailwayPlugin** provides one or more **EnvironmentVariables** (via railwayRef)
- Both **RailwayService** instances (api, web) depend on **RailwayPlugin** instances

## Environment Variable Catalog

### API Service Variables

| Name | Required | Railway Ref | Description |
|------|----------|-------------|-------------|
| PORT | yes | (auto-provided) | Railway-assigned HTTP port |
| APP_PORT | yes | `${{PORT}}` | Maps Railway PORT to app's APP_PORT |
| APP_HOST | yes | `0.0.0.0` | Listen on all interfaces |
| ENV | yes | `production` | Environment identifier |
| GCP_PROJECT_ID | yes | (user set) | Firebase project ID |
| DATABASE_URL | yes | `${{Postgres.DATABASE_URL}}` | PostgreSQL connection string |
| DATABASE_URL_DEDICATED | yes | `${{Postgres.DATABASE_URL}}` | Same as DATABASE_URL for Railway |
| REDIS_URL | yes | `${{Redis.REDIS_URL}}` | Redis connection string |
| FIREBASE_CREDENTIALS | yes | (user set) | Firebase service account JSON |
| SMTP_FROM_NAME | yes | (user set) | Email sender name |
| SMTP_FROM_EMAIL | yes | (user set) | Email sender address |
| SMTP_USERNAME | yes | (user set) | SMTP auth username |
| SMTP_PASSWORD | yes | (user set) | SMTP auth password |
| SMTP_HOST | yes | (user set) | SMTP server hostname |
| SMTP_PORT | yes | (user set) | SMTP server port |
| APP_URL | yes | (user set) | Public web UI URL |
| APP_NAME | yes | `httpSMS` | Application display name |
| EVENTS_QUEUE_TYPE | no | `emulator` | Queue type |
| EVENTS_QUEUE_NAME | no | `events-local` | Queue name |
| EVENTS_QUEUE_ENDPOINT | no | (user set) | Events callback URL |
| EVENTS_QUEUE_USER_API_KEY | yes | (user set) | System user API key |
| EVENTS_QUEUE_USER_ID | yes | (user set) | System user ID |
| SWAGGER_HOST | no | (user set) | Swagger UI host |
| GCS_BUCKET_NAME | no | (empty) | Google Cloud Storage bucket |
| UPTRACE_DSN | no | (empty) | Uptrace tracing DSN |
| PUSHER_APP_ID | no | (empty) | Pusher app ID |
| PUSHER_KEY | no | (empty) | Pusher key |
| PUSHER_SECRET | no | (empty) | Pusher secret |
| PUSHER_CLUSTER | no | (empty) | Pusher cluster |
| CLOUDFLARE_TURNSTILE_SECRET_KEY | no | (empty) | Turnstile captcha secret |
| CORS_ALLOW_ORIGINS | no | `*` | CORS allowed origins |
| DATABASE_MIGRATION_SKIP | no | (empty) | Skip auto-migration if set |
| DATABASE_MIGRATION_CONSTRAINT_FIX | no | (empty) | Set to "1" for CockroachDB only |

### Web Service Variables

| Name | Required | Railway Ref | Description |
|------|----------|-------------|-------------|
| PORT | yes | (auto-provided) | Railway-assigned HTTP port |
| API_BASE_URL | yes | (user set) | URL of the API service on Railway |
| APP_URL | yes | (user set) | Public web UI URL |
| APP_NAME | yes | `httpSMS` | Application display name |
| APP_GITHUB_URL | no | (default) | GitHub repo URL |
| APP_DOCUMENTATION_URL | no | (default) | Documentation URL |
| APP_DOWNLOAD_URL | no | (default) | APK download URL |
| APP_ENV | yes | `production` | Environment identifier |
| FIREBASE_API_KEY | yes | (user set) | Firebase web API key |
| FIREBASE_AUTH_DOMAIN | yes | (user set) | Firebase auth domain |
| FIREBASE_PROJECT_ID | yes | (user set) | Firebase project ID |
| FIREBASE_STORAGE_BUCKET | yes | (user set) | Firebase storage bucket |
| FIREBASE_MESSAGING_SENDER_ID | yes | (user set) | Firebase messaging sender ID |
| FIREBASE_APP_ID | yes | (user set) | Firebase app ID |
| FIREBASE_MEASUREMENT_ID | no | (empty) | Firebase analytics measurement ID |
| CLOUDFLARE_TURNSTILE_SITE_KEY | no | (empty) | Turnstile captcha site key |
| PUSHER_KEY | no | (empty) | Pusher key for real-time |
| PUSHER_CLUSTER | no | (empty) | Pusher cluster |
| CHECKOUT_URL | no | (empty) | LemonSqueezy checkout URL |
| ENTERPRISE_CHECKOUT_URL | no | (empty) | LemonSqueezy enterprise checkout |
