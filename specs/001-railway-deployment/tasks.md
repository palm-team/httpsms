# Tasks: Railway Deployment

**Input**: Design documents from `/specs/001-railway-deployment/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/railway-config.md, quickstart.md

**Tests**: Not applicable — this is an infrastructure/deployment feature with no new application code. Validation is via local Docker Compose and Railway deploy verification.

**Organization**: Tasks are grouped by deployment target (API, Web) and configuration phase. All tasks are additive config changes or minimal Dockerfile modifications.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Verify existing project structure matches the implementation plan

- [ ] T001 Verify api/ and web/ service directories, Dockerfiles, and docker-compose.yml exist per plan.md

**Checkpoint**: Project structure confirmed — all required files exist

---

## Phase 2: Foundational — Railway Service Configuration

**Purpose**: Create Railway config-as-code files and environment variable reference docs required by both API and Web services. These files have no inter-dependencies and can be created in parallel.

**⚠️ CRITICAL**: No service-specific deployment work can begin until this phase is complete

- [ ] T002 [P] Create api/railway.toml with DOCKERFILE builder, api/Dockerfile path, healthcheck, and restart policy
- [ ] T003 [P] Create web/railway.toml with DOCKERFILE builder, web/Dockerfile path, and restart policy
- [ ] T004 [P] Create api/.env.railway documenting all required and optional API environment variables with Railway plugin references
- [ ] T005 [P] Create web/.env.railway documenting all required and optional Web environment variables

**Checkpoint**: Railway configuration files and env references are in place — service deployment can now proceed

---

## Phase 3: User Story 1 — Deploy API to Railway (Priority: P1) 🎯 MVP

**Goal**: The Go API builds and deploys on Railway, listens on the Railway-assigned port, and connects to Railway PostgreSQL and Redis without requiring CockroachDB-specific certificates.

**Independent Test**: After deployment, `GET /v1/health` (or any API endpoint) returns a valid HTTP response from the Railway URL.

- [ ] T006 [US1] Modify api/Dockerfile to remove `EXPOSE 8000` and remove `COPY --from=builder /http-sms/root.crt ./`

**Checkpoint**: API Dockerfile is Railway-compatible — no hardcoded port, no CockroachDB cert copy

---

## Phase 4: User Story 2 — Deploy Web UI to Railway (Priority: P2)

**Goal**: The Nuxt.js web frontend builds and serves via nginx on Railway, listens on the dynamic `PORT`, and correctly handles Railway proxy headers.

**Independent Test**: After deployment, navigating to the Railway web URL shows the httpSMS landing page with Firebase authentication working.

- [ ] T007 [US2] Modify web/nginx.conf: replace `listen 3000;` with `listen ${PORT};`, add `real_ip_header X-Forwarded-For;`, add `set_real_ip_from 0.0.0.0/0;`, and add `proxy_set_header` directives for `X-Forwarded-For`, `X-Forwarded-Proto`, and `X-Forwarded-Host`
- [ ] T008 [US2] Modify web/Dockerfile CMD to render nginx.conf with `envsubst` before starting nginx, falling back to port 3000
- [ ] T009 [US2] Update docker-compose.yml to set `PORT=3000` in the web service environment for Docker Compose compatibility

**Checkpoint**: Web nginx config is Railway-compatible — dynamic port, proxy headers, Docker Compose still works

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validate compatibility and update documentation

- [ ] T010 [P] Run `docker compose up --build` locally to verify Docker Compose functionality is preserved
- [ ] T011 [P] Update README.md with a Railway deployment section referencing specs/001-railway-deployment/quickstart.md

**Checkpoint**: Local Docker Compose works, documentation is updated

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion — no dependencies on US2
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion — optionally integrates with US1 (API must be deployed for full Web functionality, but Web can build independently)
- **Polish (Phase 5)**: Depends on Phase 3 and Phase 4 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — API deploys independently
- **User Story 2 (P2)**: Can build/deploy independently, but full functionality requires US1 API to be running (for `API_BASE_URL` to resolve)
- **User Story 3 (P3)**: Handled via Railway dashboard (add PostgreSQL + Redis plugins, configure env vars) — no code changes. The `.env.railway` reference files (Phase 2) document what needs to be configured.

### Within Each User Story

- Config file changes before Dockerfile changes
- Dockerfile changes before compose file changes
- Each story should be independently verifiable

### Parallel Opportunities

- All Phase 2 tasks (T002–T005) can run in parallel — different files, no dependencies
- T010 and T011 (Phase 5) can run in parallel
- US1 and US2 could be worked on in parallel by different team members once Phase 2 is complete

---

## Parallel Example: Phase 2 (Foundational)

```bash
# All railway.toml and .env.railway files can be created together:
Task: "Create api/railway.toml with DOCKERFILE builder and healthcheck config"
Task: "Create web/railway.toml with DOCKERFILE builder and restart policy"
Task: "Create api/.env.railway documenting all required API environment variables"
Task: "Create web/.env.railway documenting all required Web environment variables"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational — Railway config files
3. Complete Phase 3: User Story 1 — API Dockerfile changes
4. **STOP and VALIDATE**: Build API Docker image locally, verify no EXPOSE/root.crt remain
5. Deploy API to Railway and verify health endpoint

### Incremental Delivery

1. Complete Setup + Foundational → Config files ready
2. Add User Story 1 → API deploys on Railway → Test health endpoint → Deploy/Demo (MVP!)
3. Add User Story 2 → Web deploys on Railway → Test landing page → Deploy/Demo
4. Run Polish phase → Verify Docker Compose, update docs

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (API Dockerfile)
   - Developer B: User Story 2 (Web nginx + Dockerfile)
3. Stories complete and integrate independently

---

## Notes

- **[P] tasks** = different files, no dependencies
- **[Story] label** maps task to specific user story for traceability
- Each user story should be independently completable and verifiable
- No existing Go or JavaScript code is modified — only Dockerfiles, nginx config, and new additive config files
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
