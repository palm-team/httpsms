# Contracts: Railway Deployment

**Date**: 2026-04-24
**Feature**: 001-railway-deployment

## Overview

This feature does not introduce new API contracts or external interfaces.
Railway deployment is an infrastructure concern — the existing HTTP API contract
remains unchanged. The contracts here define the **configuration interface**
between the developer and Railway.

## railway.toml Contract

Each service directory contains a `railway.toml` file that Railway reads to
determine build and deploy configuration.

### API Service (`api/railway.toml`)

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "api/Dockerfile"

[deploy]
healthcheckPath = "/v1/messages/search"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Web Service (`web/railway.toml`)

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "web/Dockerfile"

[deploy]
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## Dockerfile Contract

### API Dockerfile Changes

The API Dockerfile MUST:
- Not hardcode `EXPOSE 8000` (removed — port is env-driven via `APP_PORT`)
- Not copy `root.crt` (CockroachDB-specific, not needed for Railway PostgreSQL)
- Accept `GIT_COMMIT` build arg (existing behavior, unchanged)

### Web Dockerfile Changes

The Web Dockerfile MUST:
- Use `envsubst` to render `nginx.conf` with `PORT` substitution before startup
- Fall back to port 3000 if `PORT` is not set (for Docker Compose compatibility)

## nginx Configuration Contract

The `nginx.conf` template MUST:
- Listen on `${PORT}` instead of hardcoded `3000`
- Include `X-Forwarded-For`, `X-Forwarded-Proto`, `X-Forwarded-Host` header handling
- Set `real_ip_header X-Forwarded-For` for correct client IP resolution

## Environment Variable Contract

Railway auto-provides:
- `PORT` — assigned HTTP port for each service
- `${{Postgres.DATABASE_URL}}` — PostgreSQL connection string from plugin
- `${{Redis.REDIS_URL}}` — Redis connection string from plugin

Developer MUST set in Railway dashboard:
- `APP_PORT` = `${{PORT}}` (maps Railway PORT to API's APP_PORT)
- `APP_HOST` = `0.0.0.0` (listen on all interfaces)
- `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
- `DATABASE_URL_DEDICATED` = `${{Postgres.DATABASE_URL}}`
- `REDIS_URL` = `${{Redis.REDIS_URL}}`
- All Firebase, SMTP, and application-specific variables
