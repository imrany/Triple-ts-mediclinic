

## Triple TS Mediclinic — Full Frontend Rebuild

Rebuild the entire hospital management system frontend with a clean, clinical design (blues/grays) while connecting to the existing Go API at `api.triple-ts-mediclinic.com`.

---

### 1. Foundation & Layout
- Create a professional sidebar layout using Shadcn Sidebar with navigation for all modules (Dashboard, Patients, Appointments, Staff, Pharmacy, Lab, Calendar, Settings)
- Medical-themed color scheme: primary blues, neutral grays, clean white backgrounds
- Fully responsive — works well on desktop, tablet, and mobile
- App context provider for auth state, API URL, and shared data

### 2. Authentication Pages
- **Sign In** page with email/password, clean form validation, error handling
- **Forgot Password** page
- **Landing Page** — professional homepage with clinic info and sign-in CTA
- Proper token management via localStorage with error recovery for failed fetches

### 3. Dashboard (with Analytics)
- Overview cards: total patients, today's appointments, active staff, pending lab tests
- **Charts** (using Recharts): patient visits over time, appointments by department, revenue trends
- Recent activity feed and quick action buttons

### 4. Patients Module
- Searchable, filterable patient table with pagination
- Add/edit patient dialog with form validation
- Patient detail view with medical history
- **Document management**: upload and view patient documents (X-rays, lab results, reports)

### 5. Appointments Module
- Appointments table with status filters (scheduled, completed, cancelled)
- Create/edit appointment dialog with doctor and patient selection
- **Notifications**: visual indicators for upcoming appointments (in-app toast alerts)

### 6. Staff Management
- Staff directory with role/department filters
- Add/edit staff dialog with role and speciality selection
- Staff detail cards

### 7. Pharmacy Module
- Medication inventory table with search
- Add/edit medication dialog
- Low stock alerts

### 8. Laboratory Module
- Lab tests table with status tracking
- Create/edit test dialog
- Results entry and viewing

### 9. Calendar Page
- Visual calendar showing appointments and events
- Day/week/month views
- Click-to-create new appointments

### 10. Billing & Invoices (New)
- Generate invoices linked to patient visits
- Invoice list with status (paid, pending, overdue)
- Print/export invoice as PDF-styled view

### 11. Settings Page
- Profile settings for logged-in staff
- Organization name and preferences

### 12. Data Loading Fixes
- Proper error handling with retry buttons on all API calls
- Loading skeletons instead of blank states
- Graceful fallbacks when API is unavailable
- Fix snake_case to camelCase conversion across the app

