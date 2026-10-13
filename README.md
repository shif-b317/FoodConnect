# Food Connect

### Share Food. Share Hope.

Food Connect is a surplus food redistribution platform that connects event hosts, caterers, verified NGOs, and volunteers. The platform helps reduce food waste by coordinating the donation, acceptance, pickup, delivery, and distribution of surplus cooked food.

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Administrator Setup](#administrator-setup)
- [NGO Verification](#ngo-verification)
- [Email Notifications](#email-notifications)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Impact](#impact)
- [License](#license)

---

## Features

- Food donation management for events, weddings, conferences, and gatherings.
- Integration with verified NGOs for food redistribution.
- Browsing nearby available food donations.
- Role-based workflows for accepting donations.
- Volunteer assignment for food pickup and delivery.
- Donation and delivery status tracking.
- Dedicated dashboards for donors, NGOs, volunteers, and administrators.
- NGO verification and approval workflow.
- In-app notifications.
- Email notification support.
- User profile and account settings.
- Password reset functionality.
- Public impact metrics.
- Administrative metrics and NGO management.
- Responsive design for desktop and mobile devices.

---

## How It Works

### 1. Donors

Donors, including event hosts and caterers, can:

1. Create an account as a donor.
2. Post details about available surplus food.
3. Specify the number of meals, preparation time, pickup location, and food information.
4. Wait for a verified NGO to accept the donation.
5. Hand over the food to an assigned volunteer.
6. Track the donation until delivery is completed.

### 2. Verified NGOs

NGOs can:

1. Register and submit their organization details.
2. Wait for administrator verification.
3. Browse nearby available donations.
4. Accept suitable food donations.
5. Coordinate with volunteers for pickup.
6. Receive the food and distribute it to people in need.

### 3. Volunteers

Volunteers can:

1. View available pickup assignments.
2. Accept a suitable route.
3. Collect surplus food from the donor.
4. Transport food safely to the NGO.
5. Update delivery status after handover.

---

## User Roles

### Donor

- Create and manage food donations.
- View donation history.
- Track donation status.
- Cancel eligible donations.
- Manage profile and notification preferences.

### NGO

- Submit organization verification details.
- Browse nearby donations after approval.
- Accept available donations.
- Manage accepted donations.
- Coordinate food distribution.

### Volunteer

- View available pickup assignments.
- Accept pickup requests.
- Track assigned deliveries.
- Update delivery progress.

### Administrator

- Manage NGO verification requests.
- Approve or reject NGO registrations.
- View platform metrics.
- Monitor donation and user activity.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | User interface development |
| React Router | Frontend routing |
| Vite | Development server and build tooling |
| Tailwind CSS | Styling and responsive layouts |
| Framer Motion | Animations and transitions |
| React Icons | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express | Backend API framework |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JSON Web Tokens (JWT) | Authentication |
| bcrypt | Password hashing |
| Helmet | HTTP security headers |
| CORS | Cross-origin request configuration |
| Express Rate Limit | API rate limiting |

---

## Project Structure

```text
FoodConnect/
├── public/                    # Static assets and images
├── src/
│   ├── components/            # Reusable UI components
│   ├── context/               # Authentication and application state
│   ├── data/                  # Mock and static data
│   ├── pages/                 # Application pages by user role
│   ├── routes/                # Frontend route definitions
│   ├── services/              # API communication helpers
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── backend/
│   ├── src/
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Backend services
│   │   ├── middleware/        # Authentication middleware
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── package.json
├── render.yaml
└── vite.config.js
```

---

## Prerequisites

Ensure the following are installed:

- Node.js 18 or later.
- npm.
- MongoDB, either locally or through MongoDB Atlas.

---

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd FoodConnect
```

Replace `<repository-url>` with the public or authorized URL of the repository.

### Step 2: Install Frontend Dependencies

From the project root, run:

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

---

## Environment Configuration

Configuration values should be stored in local environment files or your deployment platform's environment settings. Do not commit actual credentials or secrets to GitHub.

### Backend Configuration

Create a `.env` file inside the `backend` directory.

Use the following example and adjust it to match the application's configuration:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-random-secret>
CLIENT_ORIGIN=http://localhost:5173
PUBLIC_APP_URL=http://localhost:5173
TRUST_PROXY_HOPS=0
EMAIL_PROVIDER=console
RESEND_API_KEY=
EMAIL_FROM=
```

For local development, the console email provider can be used. Password reset links will be displayed in the backend terminal.

The values shown above are example development settings, not production credentials.

### Frontend Configuration

If the backend runs at a different URL, create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:4000
```

If `VITE_API_URL` is not configured, the frontend uses the relative API path:

```text
/api/v1
```

Never place private API keys, database credentials, or other secrets in frontend environment variables prefixed with `VITE_`, because those values may be exposed in the client-side build.

---

## Running the Application

Run the backend and frontend in separate terminals.

### Start the Backend

From the project root:

```bash
cd backend
npm run dev
```

The backend API runs by default at:

```text
http://localhost:4000
```

### Start the Frontend

Open another terminal in the project root:

```bash
npm run dev
```

The frontend runs by default at:

```text
http://localhost:5173
```

---

## Available Scripts

### Frontend Scripts

Run these commands from the project root.

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

### Backend Scripts

Run these commands from the `backend` directory.

| Command | Description |
|---|---|
| `npm run dev` | Start the backend in watch mode |
| `npm start` | Start the backend |
| `npm test` | Run backend tests |
| `npm run admin:create` | Create an administrator account |

---

## API Documentation

The backend API is versioned under:

```text
/api/v1
```

### Health Checks

| Method | Endpoint |
|---|---|
| GET | `/api/v1/live` |
| GET | `/api/v1/health` |

### Authentication

| Method | Endpoint |
|---|---|
| POST | `/api/v1/auth/register` |
| POST | `/api/v1/auth/login` |
| GET | `/api/v1/auth/me` |
| PATCH | `/api/v1/auth/me` |
| PATCH | `/api/v1/auth/me/preferences` |
| PATCH | `/api/v1/auth/me/password` |
| POST | `/api/v1/auth/forgot-password` |
| POST | `/api/v1/auth/reset-password` |

### Donations

| Method | Endpoint |
|---|---|
| POST | `/api/v1/donations` |
| GET | `/api/v1/donations` |
| GET | `/api/v1/donations/:id` |
| POST | `/api/v1/donations/:id/accept` |
| POST | `/api/v1/donations/:id/cancel` |
| POST | `/api/v1/donations/:id/assign-volunteer` |
| PATCH | `/api/v1/donations/:id/status` |

### Notifications

| Method | Endpoint |
|---|---|
| GET | `/api/v1/notifications` |
| PATCH | `/api/v1/notifications/:id/read` |
| PATCH | `/api/v1/notifications/read-all` |

### Metrics and Administration

| Method | Endpoint |
|---|---|
| GET | `/api/v1/impact` |
| GET | `/api/v1/admin/metrics` |
| GET | `/api/v1/admin/ngos` |
| PATCH | `/api/v1/admin/ngos/:id/verification` |

---

## Administrator Setup

To create an administrator account, navigate to the `backend` directory and run:

```bash
npm run admin:create
```

Follow the prompts to enter an administrator email address and password. Use a secure, unique password and avoid sharing administrator credentials in the repository.

---

## NGO Verification

New NGO accounts remain in a pending state until an administrator reviews their registration details.

Administrators can:

- View pending NGO applications.
- Review organization information.
- Review registration numbers.
- Review optional HTTPS verification evidence.
- Approve or reject NGO applications.
- Add notes to rejected applications.

Only verified NGOs can browse and accept available donations.

---

## Email Notifications

### Local Development

For local development, use the console email provider:

```env
EMAIL_PROVIDER=console
```

Password reset links will be displayed in the backend terminal.

### Production Email Delivery

For production email delivery using Resend, configure the following environment variables in your deployment settings:

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=<your-resend-api-key>
EMAIL_FROM=<your-verified-sender-address>
PUBLIC_APP_URL=<your-frontend-url>
```

The sender domain or address must be verified with Resend before sending emails.

Do not publish actual API keys or private email service credentials.

---

## Testing

The backend test suite uses a separate MongoDB database.

Configure a dedicated test database using PowerShell:

```powershell
$env:MONGODB_TEST_URI = "mongodb://127.0.0.1:27017/food_connect_test"
npm test
```

Use a database whose name ends with `_test` to avoid accidentally modifying development or production data.

---

## Deployment

The project includes a `render.yaml` configuration for deploying:

- **Render:** Backend web service and frontend static site.
- **MongoDB Atlas:** Database hosting.
- **Resend:** Email delivery.

Before deploying, configure the following environment variables through the appropriate service settings:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- `PUBLIC_APP_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`

Use secure production values and the correct deployed application URLs.

Never commit production credentials, private keys, access tokens, or `.env` files to the repository.

---

## Security

The project documentation describes the following security measures:

- Passwords are hashed before storage.
- Authentication uses JWT access tokens.
- Protected routes require authentication.
- Role-based access control protects user workflows.
- Unverified NGOs cannot accept donations.
- Helmet provides HTTP security headers.
- Rate limiting helps protect API endpoints.
- CORS restricts frontend access to approved origins.
- Production configuration validates secure URLs and secrets.

These measures should be verified against the actual implementation before making security claims about a production deployment.

---

## Impact

Food Connect aims to help communities:

- Reduce food waste.
- Redistribute surplus cooked meals.
- Support local NGOs.
- Enable volunteer-led delivery.
- Improve access to food for people in need.
- Track measurable community impact.

---

## License

This project is currently available for educational and development purposes. Add an appropriate license before distributing or using it commercially.

---

**Food Connect — Share Food. Share Hope.**
