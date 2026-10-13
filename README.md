# Food Connect

**Share. Rescue. Connect.**

Food Connect is a surplus food redistribution platform that connects event organizers, caterers, verified non-governmental organizations (NGOs), and volunteers. The platform facilitates the donation, collection, and distribution of surplus cooked food, helping reduce food waste and improve access to food for communities in need.

## Features

- Surplus food donation management for events and gatherings
- Connection between donors and verified NGOs
- Discovery and acceptance of available food donations
- Volunteer coordination for food collection and delivery
- Donation and delivery status tracking
- Role-based dashboards for donors, NGOs, volunteers, and administrators
- NGO registration verification and approval
- In-app and email notification support
- User profiles and account management
- Password reset functionality
- Platform impact metrics and administrative dashboards
- Responsive interface for desktop and mobile devices

## How It Works

### 1. Donors

Donors, including event organizers and caterers, can:

1. Register for a donor account.
2. Publish details of available surplus food.
3. Provide meal quantities, preparation time, pickup location, and relevant food information.
4. Wait for a verified NGO to accept the donation.
5. Coordinate food collection with an assigned volunteer.
6. Track the donation through delivery.

### 2. Verified NGOs

NGOs can:

1. Register and submit their organization details.
2. Await administrator verification.
3. Browse available food donations.
4. Accept suitable donations.
5. Coordinate collection with volunteers.
6. Receive donations and distribute food to people in need.

### 3. Volunteers

Volunteers can:

1. View available pickup assignments.
2. Accept suitable assignments.
3. Collect surplus food from donors.
4. Transport food to the designated NGO.
5. Update delivery status after handover.

## User Roles

| Role | Responsibilities |
|---|---|
| Donor | Create and manage food donations and track their status. |
| NGO | Complete verification, accept donations, and coordinate distribution. |
| Volunteer | Manage pickup assignments and delivery progress. |
| Administrator | Review NGO applications and monitor platform activity. |

## Technology Stack

**Frontend**
- React
- React Router
- Vite
- Tailwind CSS
- Framer Motion
- React Icons

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Helmet
- CORS
- Express Rate Limit

## Project Structure

```text
FoodConnect/
├── public/                    # Static assets and images
├── src/
│   ├── components/            # Reusable UI components
│   ├── context/               # Application state and authentication
│   ├── data/                  # Static and mock data
│   ├── pages/                 # Application pages
│   ├── routes/                # Frontend routing
│   ├── services/              # API communication
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── backend/
│   ├── src/
│   │   ├── models/            # Database models
│   │   ├── routes/            # Backend routes
│   │   ├── services/          # Backend services
│   │   ├── middleware/        # Request middleware
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── package.json
├── render.yaml
└── vite.config.js
```

## Prerequisites

Ensure the following are installed:

- Node.js 18 or later
- npm
- MongoDB, locally or through MongoDB Atlas
- Git

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FoodConnect
```

Replace `<repository-url>` with the repository's public URL or an authorized clone URL.

### 2. Install Dependencies

Install the frontend dependencies from the project root:

```bash
npm install
```

Install the backend dependencies:

```bash
cd backend
npm install
cd ..
```

## Environment Configuration

Configure the required environment variables for your local development environment.

- Create the necessary local environment files based on the project's configuration.
- Configure the database connection and authentication settings.
- Set the frontend and backend URLs as required.
- Configure email services if email notifications are enabled.

Use placeholder values in public examples. Never commit real passwords, database connection strings containing credentials, authentication secrets, API keys, access tokens, or private environment files to GitHub.

## Running the Application

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in a separate terminal from the project root:

```bash
npm run dev
```

The application uses the configured local frontend and backend addresses. Confirm the ports and environment settings in your local configuration.

## Available Scripts

### Frontend

Run these commands from the project root:

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

### Backend

Run these commands from the `backend` directory:

| Command | Description |
|---|---|
| `npm run dev` | Start the backend in development mode |
| `npm start` | Start the backend |
| `npm test` | Run backend tests |

Refer to the project's package configuration for the available scripts.

## Testing

The backend includes a test suite. Configure a dedicated test database before running tests.

Use a separate test environment to avoid modifying development or production data. Confirm that the test configuration is correct before executing the test suite.

## Deployment

The project includes configuration for deployment using Render, with MongoDB Atlas for database hosting and Resend as an email delivery option.

Deployment requires environment-specific configuration for database connectivity, authentication, application URLs, and any enabled external services.

Configure these values securely through the relevant hosting platforms. Do not include production credentials or private configuration files in the repository.

## Security Considerations

The project uses or documents security-related mechanisms such as:

- Password hashing
- JWT-based authentication
- Authentication middleware
- Role-based access control
- NGO verification workflows
- HTTP security headers
- API rate limiting
- Cross-origin request configuration

Security controls should be reviewed and tested against the actual implementation. Keep dependencies updated, validate configuration, and protect credentials and sensitive data.

## Expected Impact

Food Connect aims to:

- Reduce avoidable food waste
- Redistribute surplus cooked meals
- Support local NGOs
- Enable volunteer-led food collection and delivery
- Improve access to food for people in need
- Strengthen coordination between donors and recipient organizations

## License

This project is intended for educational and development purposes. Add an appropriate open-source license before authorizing redistribution or commercial use.

---

**Food Connect — Share. Rescue. Connect.**