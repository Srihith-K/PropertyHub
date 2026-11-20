# PropertyHub — Updated Project

PropertyHub is a responsive web platform for property owners and tenants to manage maintenance requests and shared amenity bookings.

## Included modules

- Secure registration, login and authenticated API access.
- Role-aware operations: tenants can submit maintenance requests and amenity bookings; owners can manage maintenance status, amenity availability and booking status.
- Dashboard with maintenance KPIs, completion rate, active bookings and recent activity.
- Maintenance request creation, request IDs, status tracking, resolution dates, search and status filters.
- Amenity catalogue, availability management, date/time booking, booking overlap validation, check-in/check-out status tracking and booking status filters.
- Profile page showing authenticated account details.
- Responsive workspace navigation and refresh/live polling on operational screens.

## Technology

- Frontend: React, Vite, React Router, Axios, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Run locally

### 1. Backend

Open PowerShell:

```powershell
cd .\PropertyHub\server
npm.cmd install
```

Create `server/.env` using `.env.example` as a template. Set your MongoDB connection string and a long random `JWT_SECRET`. Do not share or commit `.env`.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Start the API:

```powershell
npm.cmd run dev
```

Expected API URL: `http://localhost:5000`

### 2. Frontend

Open a second PowerShell terminal:

```powershell
cd .\PropertyHub
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Notes

- The backend must be running before signing in.
- MongoDB must be reachable and the credentials in `.env` must be correct.
- The application uses session storage for the current browser session.
- Booking overlap checks are enforced by the API. For high-concurrency production deployments, use a database-level reservation/locking strategy or a transaction-based booking workflow to close the small race window between conflict checking and insertion.
- Run `npm.cmd run build` in the frontend folder to verify a production build in your local environment.

## Scope

The implementation remains focused on the supplied technical-document scope: maintenance tracking, amenity availability and booking, check-in/check-out, dashboards, authentication, and responsive usability. It does not add rental payments, AI prediction, IoT, chat, or a native mobile app.
