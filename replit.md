# Triple Ts Mediclinic

A full-stack medical clinic management system with a React frontend and Go backend API.

## Architecture

- **Frontend**: React + TypeScript + Vite, Tailwind CSS, Shadcn UI components (in `client/`)
- **Backend**: Go with Fiber framework (in `web-service/`)
- **Database**: PostgreSQL (Replit built-in)

## Project Structure

```
client/          # React frontend (Vite + TypeScript)
  src/
    components/  # Reusable UI components
    contexts/    # React contexts (AuthContext)
    hooks/       # Custom hooks
    lib/         # API client (api.ts)
    pages/       # Page components (Dashboard, Staff, Patients, Appointments)
web-service/     # Go backend API
  config/        # Environment config loader
  database/      # PostgreSQL connection (pgx/v5)
  internal/
    handlers/    # Route handlers (staff, patients, appointments)
    middleware/  # JWT auth middleware
    router/      # Route definitions
  migrations/    # SQL migration files
```

## Ports

- **Frontend**: port 5000 (webview)
- **Backend API**: port 8000 (console)

## Environment Variables

The backend reads from `web-service/.env`:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — JWT secret for staff auth
- `JWT_ADMIN` — JWT secret for admin auth
- `CLIENT_URL` — Frontend URL for CORS
- `PORT` — Backend port (default 8000)

## Database Schema

Tables: `staff`, `patients`, `appointments`, `notifications`, `pharmacy`, `laboratory`, `billing`, `medical_records`

## API Endpoints

- `POST /api/signin` — Staff login
- `GET/POST /api/staff` — Staff management
- `GET/POST/PATCH/DELETE /api/staff/:id` — Individual staff
- `GET/POST /api/appointments` — Appointments
- `GET/POST/PATCH/DELETE /api/patients` — Patients
- `DELETE /admin/staff` — Admin: delete all staff

## Workflows

- **Start application**: `cd client && npm run dev` (port 5000)
- **Backend API**: `cd web-service && go run . 2>&1` (port 8000)
