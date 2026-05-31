# Research: Railway Deployment

**Date**: 2026-04-24
**Feature**: 001-railway-deployment

## Research Tasks

### 1. Railway PORT handling for Dockerfile deploys

**Decision**: Railway sets a `PORT` environment variable (e.g., `PORT=8080`) at
runtime. The application MUST listen on this port. The `EXPOSE` directive in the
Dockerfile is informational only — Railway ignores it for routing.

**Rationale**: Railway's reverse proxy routes external traffic to the container's
`PORT`. If the app listens on a different port, health checks fail and the
deployment shows as unhealthy.

**Alternatives considered**:
- Setting `APP_PORT` to `${PORT}` in Railway env vars — works for the API since
  it reads `APP_PORT` from env, but requires the user to set `APP_PORT=${{PORT}}`
  in the Railway dashboard. This is the preferred approach (no code change).
- Modifying `main.go` to check `PORT` first — unnecessary since `APP_PORT` is
  already env-driven.

**For the API**: Set `APP_PORT=${{PORT}}` and `APP_HOST=0.0.0.0` in Railway
service variables. No code change needed — the API already reads `APP_PORT`
via `os.Getenv("APP_PORT")` in `main.go:46`.

**For the Web (nginx)**: nginx cannot read env vars natively. The Dockerfile
CMD must use `envsubst` to substitute `PORT` into the nginx config template
at container startup. This requires modifying `nginx.conf` to use `${PORT}`
placeholder and changing the Dockerfile CMD.

### 2. PostgreSQL vs CockroachDB compatibility

**Decision**: The API uses GORM with the `postgres` driver, which is compatible
with both CockroachDB and standard PostgreSQL. Railway's PostgreSQL plugin
provides a standard `DATABASE_URL` connection string.

**Rationale**: GORM's `postgres.Open(dsn)` uses `lib/pq` under the hood, which
works with standard PostgreSQL. The `root.crt` file in the API directory is a
CockroachDB client certificate — it is NOT needed for Railway PostgreSQL and
should not be copied in the Dockerfile for Railway deployments.

**Alternatives considered**:
- Keeping `root.crt` and making it optional — the file is never referenced by
  GORM code; it's only present because the original CockroachDB deployment
  required it. Removing the copy step is cleaner.
- Using a separate Dockerfile for Railway — unnecessary complexity; the `root.crt`
  is not referenced at runtime by the Go binary.

**Action**: Remove the `COPY --from=builder /http-sms/root.crt ./` line from the
Dockerfile. The `root.crt` file can remain in the repo for Cloud Run deployments
that reference it externally.

### 3. DATABASE_URL_DEDICATED fallback

**Decision**: The `DedicatedDB()` method in `container.go:260` reads
`DATABASE_URL_DEDICATED` directly with no fallback. If this env var is empty,
GORM will fail to connect.

**Rationale**: For Railway, only one PostgreSQL instance is needed. The
`DATABASE_URL_DEDICATED` is a CockroachDB-specific concept for isolating
heartbeat monitoring queries to a separate connection.

**Action**: Set `DATABASE_URL_DEDICATED` to the same value as `DATABASE_URL` in
the Railway env vars. No code change needed — this is a configuration concern.
The user sets `DATABASE_URL_DEDICATED=${{Postgres.DATABASE_URL}}` in Railway.

### 4. Redis connection with TLS

**Decision**: The API's Redis client in `container.go:419-427` already parses
`REDIS_URL` via `redis.ParseURL()` and sets `TLSConfig` with MinVersion TLS 1.2.
Railway's Redis plugin provides a `REDIS_URL` with rediss:// scheme (TLS-enabled).

**Rationale**: The existing code handles TLS Redis connections. Railway's
`REDIS_URL` will work as-is.

**Action**: Set `REDIS_URL=${{Redis.REDIS_URL}}` in Railway API service variables.
No code change needed.

### 5. railway.toml configuration

**Decision**: Use `railway.toml` config-as-code files in each service directory
to specify Dockerfile path, builder type, and health check configuration.

**Rationale**: Railway auto-detects Dockerfiles at the repo root, but httpSMS
has Dockerfiles in `api/` and `web/` subdirectories. The `railway.toml` file
tells Railway where to find each Dockerfile and how to build it.

**Alternatives considered**:
- Using `RAILWAY_DOCKERFILE_PATH` env var instead of `railway.toml` — less
  visible, not version-controlled. `railway.toml` is preferred for IaC.
- Using Nixpacks builder — would bypass existing Dockerfiles, adding risk.

**API railway.toml**:
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

**Web railway.toml**:
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "web/Dockerfile"

[deploy]
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### 6. Web nginx dynamic PORT and proxy headers

**Decision**: Replace the static `nginx.conf` with a template that uses `${PORT}`
and `${API_BASE_URL}` placeholders. The Dockerfile CMD uses `envsubst` to render
the template at startup.

**Rationale**: nginx cannot read environment variables at runtime. The standard
pattern for Docker + nginx is to use `envsubst` in the entrypoint to substitute
env vars into the config before starting nginx.

**Action**: 
1. Create `web/nginx-railway.conf.template` (new file) with `${PORT}` and
   proxy header handling.
2. Modify `web/Dockerfile` CMD to use `envsubst` when `PORT` is set, falling
   back to the original `nginx.conf` for Docker Compose (no `PORT` env var).

Wait — per Constitution Principle I, we should minimize modifications. Let me
reconsider:

**Revised Decision**: Instead of modifying the existing Dockerfile, create a
separate `web/Dockerfile.railway` that extends the build stage but uses a
different production stage with `envsubst`. The original `web/Dockerfile`
remains untouched for Docker Compose.

Actually, the simplest approach: modify the existing `web/nginx.conf` to use
`${PORT}` and add proxy headers, then modify the `web/Dockerfile` CMD to run
`envsubst` before nginx. For Docker Compose, set `PORT=3000` in the compose
file. This is a single, minimal change that works for both environments.

**Final Decision**: Modify `web/nginx.conf` to use `${PORT}` placeholder and add
proxy headers. Modify `web/Dockerfile` CMD to `envsubst` the template. Add
`PORT=3000` to `docker-compose.yml` web service environment. This is the minimal
change that supports both Railway and Docker Compose.

### 7. Environment variable reference

**Decision**: Create `.env.railway` files in both `api/` and `web/` directories
as documentation references (not loaded by the app — Railway injects env vars
via its dashboard). These files list all required env vars with descriptions
and which Railway plugin references to use.

**Rationale**: Developers need a single reference when configuring Railway
services. The existing `.env.docker` and `.env.production` files are incomplete
for Railway (missing `PORT`, `DATABASE_URL_DEDICATED` fallback, etc.).

**Action**: Create `api/.env.railway` and `web/.env.railway` as documentation
files with comments explaining each variable and Railway-specific references
like `${{Postgres.DATABASE_URL}}`.
