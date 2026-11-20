# PropertyHub — Unified Mentor Project

A web-based property rental operations platform focused on the requirements in the supplied technical documentation:

- Secure user registration and login with tenant/owner roles.
- Maintenance request creation and status tracking (Pending, In Progress, Completed).
- Amenity availability and date/time-based bookings.
- Booking check-in/check-out status tracking.
- Dashboard overview of maintenance and amenity activity.
- Responsive web interface.

Out of scope: native mobile applications, online rental payments, AI predictive maintenance, and IoT integrations.

## Requirements

- Node.js 20.19+ (Node.js 22 LTS recommended for Vite 8)
- MongoDB Atlas or a reachable MongoDB deployment

## Configuration

1. Copy `server/.env.example` to `server/.env`.
2. Set `MONGO_URI` to your MongoDB connection string, using a MongoDB database user (not your Atlas website login).
3. Set `JWT_SECRET` to a long, private random value.
4. Keep `.env` private; do not commit or share it.

Example local configuration:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_private_secret
MONGO_URI=mongodb+srv://DB_USERNAME:DB_PASSWORD@YOUR_CLUSTER.mongodb.net/propertyhub?retryWrites=true&w=majority
```

If the MongoDB password contains reserved URI characters, URL-encode them. In Atlas, add your current public IP under Security → Network Access and ensure the database user has read/write access to the project database.

## Run locally

Open two PowerShell terminals.

Terminal 1 — backend:

```powershell
cd "PATH_TO_PROJECT\PropertyHub\server"
npm.cmd install
npm.cmd run dev
```

Terminal 2 — frontend:

```powershell
cd "PATH_TO_PROJECT\PropertyHub"
npm.cmd install
npm.cmd run dev
```

Open the Vite URL printed in the frontend terminal (normally `http://localhost:5173`).

## API health check

Open `http://localhost:5000/api/health` while the backend is running.

## Functional verification before submission

1. Register a tenant account and sign in.
2. Register an owner account and sign in.
3. As owner, create an amenity with its Property ID.
4. As tenant, create a maintenance request with its Property ID and issue description.
5. Confirm the maintenance request starts as Pending.
6. As owner, change its status to In Progress and then Completed; verify the resolution date.
7. Book an available amenity for a date and time range.
8. Attempt an overlapping booking for the same amenity/date; it should be rejected.
9. Update booking status to Checked In and then Completed.
10. Confirm dashboard counts and recent activity reflect the saved records.

## Important implementation notes

- Dashboard and activity pages use periodic API polling for near-real-time refresh; this is not instant server-push delivery.
- The project requires a valid MongoDB connection and credentials supplied by the developer. Those credentials are not included in this archive.
- Verify tenant/owner data access and simultaneous booking-conflict behavior against the configured database before public deployment. Do not describe the system as production-secure or fully acceptance-tested until those tests pass.
