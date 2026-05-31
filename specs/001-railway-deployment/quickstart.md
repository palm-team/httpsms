# Quickstart: Deploy httpSMS to Railway

**Date**: 2026-04-24
**Feature**: 001-railway-deployment

## Prerequisites

- A [Railway](https://railway.app) account
- A Firebase project with:
  - Web SDK credentials (API key, auth domain, project ID, etc.)
  - Service account JSON credentials
- SMTP credentials for email delivery
- This repository cloned and pushed to GitHub

## Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your fork of the httpsms repository

## Step 2: Add Infrastructure Plugins

1. In the project, click **+ New** → **Database** → **Add PostgreSQL**
2. In the project, click **+ New** → **Database** → **Add Redis**
3. Wait for both plugins to show **ACTIVE** status

## Step 3: Deploy the API Service

1. Click **+ New** → **GitHub Repo** → select the repo
2. Rename the service to **api**
3. Go to **Settings** → set **Root Directory** to `/` (repo root)
4. Go to **Variables** → add the following:

### Required API Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `APP_PORT` | `${{PORT}}` | Maps Railway's PORT to API's listen port |
| `APP_HOST` | `0.0.0.0` | Must listen on all interfaces |
| `ENV` | `production` | |
| `GCP_PROJECT_ID` | your-firebase-project-id | |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Auto-ref from PostgreSQL plugin |
| `DATABASE_URL_DEDICATED` | `${{Postgres.DATABASE_URL}}` | Same as DATABASE_URL |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` | Auto-ref from Redis plugin |
| `FIREBASE_CREDENTIALS` | (paste JSON) | Firebase service account JSON |
| `SMTP_FROM_NAME` | `httpSMS` | |
| `SMTP_FROM_EMAIL` | your@email.com | |
| `SMTP_USERNAME` | (your SMTP user) | |
| `SMTP_PASSWORD` | (your SMTP pass) | |
| `SMTP_HOST` | smtp.example.com | |
| `SMTP_PORT` | `587` | |
| `APP_URL` | your-web-railway-url | Set after web service is deployed |
| `APP_NAME` | `httpSMS` | |
| `EVENTS_QUEUE_TYPE` | `emulator` | |
| `EVENTS_QUEUE_NAME` | `events-local` | |
| `EVENTS_QUEUE_ENDPOINT` | your-api-railway-url/v1/events | |
| `EVENTS_QUEUE_USER_API_KEY` | (system user API key) | See Step 5 |
| `EVENTS_QUEUE_USER_ID` | (system user ID) | See Step 5 |

5. Railway will detect `api/railway.toml` and build using the API Dockerfile.
6. Wait for the build and deploy to complete.

## Step 4: Deploy the Web Service

1. Click **+ New** → **GitHub Repo** → select the repo
2. Rename the service to **web**
3. Go to **Variables** → add the following:

### Required Web Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `API_BASE_URL` | your-api-railway-url | e.g., `https://api-production.up.railway.app` |
| `APP_URL` | your-web-railway-url | e.g., `https://web-production.up.railway.app` |
| `APP_NAME` | `httpSMS` | |
| `APP_ENV` | `production` | |
| `FIREBASE_API_KEY` | (your key) | |
| `FIREBASE_AUTH_DOMAIN` | (your domain) | |
| `FIREBASE_PROJECT_ID` | (your project) | |
| `FIREBASE_STORAGE_BUCKET` | (your bucket) | |
| `FIREBASE_MESSAGING_SENDER_ID` | (your sender ID) | |
| `FIREBASE_APP_ID` | (your app ID) | |

4. Railway will detect `web/railway.toml` and build using the Web Dockerfile.
5. Wait for the build and deploy to complete.

## Step 5: Create the System User

1. Go to the PostgreSQL plugin → **Query** tab
2. Run the following SQL:

```sql
INSERT INTO users (id, api_key, email)
VALUES ('your-system-user-id', 'your-system-api-key', 'system@domain.com');
```

3. Set `EVENTS_QUEUE_USER_ID` and `EVENTS_QUEUE_USER_API_KEY` in the API
   service variables to match the values inserted above.
4. Redeploy the API service for the variables to take effect.

## Step 6: Verify

1. Visit the API URL — you should see the Swagger UI
2. Visit the Web URL — you should see the httpSMS landing page
3. Try signing up/logging in via Firebase authentication
4. Send a test API request with your API key

## Troubleshooting

- **API shows unhealthy**: Check that `APP_PORT` is set to `${{PORT}}` and
  `APP_HOST` is `0.0.0.0`
- **Database connection errors**: Verify `DATABASE_URL` references the
  PostgreSQL plugin correctly
- **Web shows 502**: Check that the nginx container is listening on `PORT`
  (check logs for `envsubst` errors)
- **Firebase auth not working**: Verify all `FIREBASE_*` env vars match your
  Firebase project configuration
