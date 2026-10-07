# FOOD CONNECT API

Initial Express and MongoDB API foundation. It provides account registration/login and protected donation listing, creation, acceptance, and cancellation.

## Run locally

1. Copy `.env.example` to `.env` and set a private `JWT_SECRET` (at least 32 characters).
2. Start MongoDB locally or set `MONGODB_URI` to a MongoDB deployment.
3. Run `npm install`, then `npm run dev`.

The API listens on port 4000 by default. Routes are under `/api/v1`; `GET /api/v1/health` checks process health.

## Authentication

`POST /api/v1/auth/register` accepts `{ "fullName", "email", "password", "role", "phone", "organization" }` and returns a bearer token. `POST /api/v1/auth/login` accepts email and password. Send `Authorization: Bearer <token>` to protected routes. Registration is limited to donor, NGO, and volunteer roles; admin accounts must be provisioned by an operator.

`GET /api/v1/auth/me` returns the current profile.

## Donations

- `POST /api/v1/donations` — donor only; creates a donation.
- `GET /api/v1/donations?page=1&limit=20&status=AVAILABLE&city=Mangalore` — authenticated, role scoped.
- `GET /api/v1/donations/:id` — authenticated, role scoped.
- `POST /api/v1/donations/:id/accept` — NGO only; atomic claim of an available donation.
- `POST /api/v1/donations/:id/cancel` — owning donor only; cancels an available donation.
- `POST /api/v1/donations/:id/assign-volunteer` — volunteer only; atomically claims an unassigned pickup.
- `PATCH /api/v1/donations/:id/status` — assigned volunteer only; advances one valid lifecycle step.
- `GET /api/v1/notifications` — lists notifications visible to the current user.
- `PATCH /api/v1/notifications/:id/read` and `PATCH /api/v1/notifications/read-all` — marks notifications read for the current user.

Success and error responses use the shared `{ success, data, message }` / `{ success, error: { code, message } }` envelope. This is an initial backend slice; NGO verification, password reset, profile editing, and production deployment configuration remain future work.
