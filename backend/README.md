# FOOD CONNECT API

Express and MongoDB API for account access, donations, volunteer pickup, NGO verification, impact metrics, and notifications.

## Local development

1. Copy `.env.example` to `.env` and set a private `JWT_SECRET` with at least 32 characters.
2. Start MongoDB locally and set `MONGODB_URI` to its database URI.
3. Run `npm ci`, then `npm run dev`.

The API listens on port 4000 by default. Routes are under `/api/v1`. `GET /api/v1/live` checks the process; `GET /api/v1/health` also checks MongoDB readiness.

## Admin account

Create an administrator from an interactive terminal in this directory:

```sh
npm run admin:create
```

The command prompts for an email and a password of at least 12 characters. Password input is hidden. Admins review applications through `GET /api/v1/admin/ngos?status=PENDING` and `PATCH /api/v1/admin/ngos/:id/verification` with `{ "status": "VERIFIED" }` or `{ "status": "REJECTED", "note": "..." }`. These routes require an admin JWT.

## Authentication and profile

- `POST /api/v1/auth/register` accepts `{ "fullName", "email", "password", "role", "phone", "organization", "registrationNumber", "verificationEvidenceUrl" }` and returns a bearer token. NGO registration requires an organization name and registration number. An optional evidence link must use HTTPS.
- `POST /api/v1/auth/login` accepts email and password.
- `GET /api/v1/auth/me` returns the current profile; `PATCH /api/v1/auth/me` updates name, phone, and organization details. Changing an NGO's verification details sends it back to pending review.
- `PATCH /api/v1/auth/me/preferences` accepts `{ "email": true }` or `{ "email": false }`.
- `PATCH /api/v1/auth/me/password` accepts `{ "currentPassword", "newPassword" }` and invalidates existing sessions.
- `POST /api/v1/auth/forgot-password` accepts `{ "email" }`; `POST /api/v1/auth/reset-password` accepts `{ "token", "password" }`. Reset links expire after 30 minutes and can only be used once.

New NGO accounts stay `PENDING` until admin review. The API blocks unverified NGOs from browsing available donations or accepting one. Admin review supports a registration number and an optional HTTPS evidence link. Evidence links must be accessible to the reviewer; the service does not fetch or validate their contents.

## Donations, notifications, and metrics

- `POST /api/v1/donations` — donor only; creates a donation.
- `GET /api/v1/donations?page=1&limit=20&status=AVAILABLE&city=Mangalore` — authenticated, role scoped.
- `GET /api/v1/donations/:id` — authenticated, role scoped.
- `POST /api/v1/donations/:id/accept` — verified NGO only; atomic claim of an available donation.
- `POST /api/v1/donations/:id/cancel` — owning donor only; cancels an available donation.
- `POST /api/v1/donations/:id/assign-volunteer` — volunteer only; atomically claims a pickup.
- `PATCH /api/v1/donations/:id/status` — assigned volunteer only; advances a valid lifecycle step.
- `GET /api/v1/notifications` and `PATCH /api/v1/notifications/:id/read` / `PATCH /api/v1/notifications/read-all` — in-app notification operations.
- `GET /api/v1/impact` — public aggregate counts from completed donations and active verified participants.
- `GET /api/v1/admin/metrics` — admin-only aggregate platform metrics.

Direct notifications are stored in MongoDB and sent by email when that user has email notifications enabled. Role-wide notices remain in-app. The UI polls for in-app notification updates; SMS and push delivery are not configured.

## Email configuration

In development, `EMAIL_PROVIDER=console` prints reset links to the API terminal and exposes the link in the local reset response. In production, set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, and `EMAIL_FROM`. Set `PUBLIC_APP_URL` so reset links return to the deployed frontend. Resend requires a sender domain/address authorized for the account; the API uses its [send-email endpoint](https://resend.com/docs/api-reference/emails/send-email).

## Automated integration checks

Tests drop and recreate their configured database. Use a dedicated database whose name ends in `_test`; the test runner refuses other database names:

```powershell
$env:MONGODB_TEST_URI = 'mongodb://127.0.0.1:27017/food_connect_test'
npm test
```

GitHub Actions runs the backend integration suite against an isolated MongoDB service on pushes and pull requests to `main`.

## Containers and operations

The container stack uses an authenticated MongoDB app user, persists the database in a Docker volume, and binds the API to loopback so it can sit behind a TLS reverse proxy. Generate alphanumeric Mongo passwords and a JWT secret, then set them in `backend/.env`. Set `CLIENT_ORIGIN` and `PUBLIC_APP_URL` to HTTPS frontend URLs, and configure the Resend credentials before starting the production stack:

```sh
docker compose up -d --build
```

Keep the MongoDB volume private and enable scheduled backups. For local backup archives, install MongoDB Database Tools and run `scripts/backup-mongo.ps1`; it reads `MONGODB_URI` from the shell or `.env`. On Windows, `scripts/install-backup-task.ps1` registers a daily Task Scheduler job (default 2:30 AM, while the current user is signed in). Store copies off the application host and restrict access to the archive. For a hosted database, enable and verify the provider's managed backup policy as well.

The API emits JSON request/error logs to stdout with request IDs. Set `TRUST_PROXY_HOPS` to the actual number of trusted reverse proxies in front of the API. Production startup rejects local MongoDB URIs, non-HTTPS frontend URLs, weak/missing JWT secrets, and missing email-provider credentials.

Success and error responses use `{ success, data, message }` / `{ success, error: { code, message } }` envelopes.
