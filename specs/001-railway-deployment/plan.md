# Implementation Plan: Railway Deployment

**Branch**: `001-railway-deployment` | **Date**: 2026-04-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-railway-deployment/spec.md`

## Summary

Adapt the httpSMS project for deployment on Railway.app. The project currently
deploys to Google Cloud Run and self-hosts via Docker Compose. Railway requires
services to listen on a dynamic `PORT` env var, uses standard PostgreSQL (not
CockroachDB), and uses `railway.toml` for config-as-code. The approach prioritizes
**additive changes** (new config files, env var mappings) over modifying existing
code, per Constitution Principle I.

## Technical Context

**Language/Version**: Go 1.x (API), Node.js LTS (Web UI)
**Primary Dependencies**: Fiber (Go HTTP), Nuxt.js 2 (Vue SPA), GORM (ORM), nginx (static serving)
**Storage**: PostgreSQL (Railway plugin), Redis (Railway plugin)
**Testing**: Docker Compose local validation, Railway deploy verification
**Target Platform**: Railway.app (Linux containers)
**Project Type**: Web service (API + static frontend)
**Performance Goals**: Same as existing Cloud Run deployment
**Constraints**: Must listen on Railway-provided PORT; must not break Docker Compose
**Scale/Scope**: 2 services (api, web), 2 plugins (postgres, redis), ~30 env vars

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Minimal Code Changes | ✅ PASS (justified) | 3 config files modified (Dockerfiles, nginx.conf), 0 Go/JS code changes. All justified below. |
| II. Security & Privacy First | ✅ PASS | All secrets via env vars; no hardcoded credentials |
| III. API-First Design | ✅ PASS | No API contract changes; Railway is a deployment target only |
| IV. Reliability & Back Pressure | ✅ PASS | No changes to rate limiting, expiration, or async flow |
| V. Simplicity & Self-Containment | ✅ PASS | Docker Compose still works; Railway is an additional deployment option |

**Principle I Justification** (post-design re-evaluation):

After research, the API requires **zero Go code changes** — it already reads
`APP_PORT` from env. Only 3 config/build files need modification:

- `api/Dockerfile`: Remove `EXPOSE 8000` and `root.crt` copy.
  **Justification**: `EXPOSE` is informational but misleading for Railway.
  `root.crt` is CockroachDB-specific and unused with standard PostgreSQL.
  No alternative: Dockerfile must not copy unused cert files.

- `web/nginx.conf`: Use `${PORT}` placeholder and add proxy headers.
  **Justification**: nginx cannot read env vars natively; Railway requires
  listening on dynamic `PORT`. No alternative: the static port 3000 config
  cannot work with Railway's port assignment.

- `web/Dockerfile`: Change CMD to use `envsubst` for nginx template rendering.
  **Justification**: Required to substitute `${PORT}` into nginx.conf at startup.
  No alternative: nginx has no native env var support.

All new files (`railway.toml`, `.env.railway`) are additive — no existing
files are replaced. Docker Compose compatibility is preserved by adding
`PORT=3000` to the web service environment.

## Project Structure

### Documentation (this feature)

```text
specs/001-railway-deployment/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
api/
├── Dockerfile           # MODIFIED: remove EXPOSE 8000, remove root.crt copy
├── railway.toml         # NEW: Railway config for API service
├── .env.railway         # NEW: Railway env reference for API
└── pkg/di/              # UNCHANGED: reads APP_PORT from env already

web/
├── Dockerfile           # MODIFIED: CMD uses envsubst for PORT substitution
├── nginx.conf           # MODIFIED: dynamic PORT, proxy headers
├── railway.toml         # NEW: Railway config for Web service
├── .env.railway         # NEW: Railway env reference for Web
└── nuxt.config.js       # UNCHANGED

docker-compose.yml       # MODIFIED: add PORT=3000 to web service environment
```

**Structure Decision**: Existing `api/` + `web/` + `android/` monorepo. Railway
services are configured via `railway.toml` files placed in each service directory,
using `RAILWAY_DOCKERFILE_PATH` to point to the existing Dockerfiles.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Modify `api/Dockerfile` | Remove CockroachDB-specific `root.crt` copy; Railway doesn't use it | Cannot skip — file copy causes startup error with standard PostgreSQL |
| Modify `web/nginx.conf` | Must listen on dynamic `PORT` and handle proxy headers | Cannot use env substitution in nginx without template — Dockerfile `CMD` with `envsubst` is the minimal approach |
