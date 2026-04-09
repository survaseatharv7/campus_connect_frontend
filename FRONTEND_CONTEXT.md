# CampusNexus Frontend Context

## Overview
- **Project Structure:** React with Vite
- **Language:** JavaScript (`.js`, `.jsx`)
- **Styling:** Tailwind CSS, Framer Motion
- **State Management:** Zustand (`authStore`, `uiStore`)
- **Data Fetching:** React Query (`@tanstack/react-query`), Axios
- **Routing:** React Router DOM (Role-based access control)
- **Forms & Validation:** React Hook Form, Zod

## Folder Structure
- `src/api/`: API integration services using Axios.
  - Includes role-specific API files like `admin.api.js`, `auth.api.js`, `hod.api.js`, `principal.api.js`, `professor.api.js`, `student.api.js`.
  - Also includes `axios.js` for base configuration and interceptors.
- `src/components/`: Reusable React components categorized into:
  - `layout/`: Shared layouts like `DashboardLayout`.
  - `shared/`: Generic components (e.g. `ProtectedRoute`).
  - `ui/`: UI building blocks (e.g. `Spinner`).
- `src/hooks/`: Custom React hooks for abstracted logic.
- `src/pages/`: Page components organized by user roles. Each inner directory matches a specific role in the system:
  - `admin/`: Campus Admin pages (Dashboard, Colleges, Events, Broadcasts, Seminar Halls)
  - `principal/`: Principal pages (Dashboard, Departments, Professors, Club Requests, Events, Broadcasts, etc.)
  - `hod/`: HOD pages (Dashboard, Timetable, Club Requests, Events, Broadcasts, etc.)
  - `professor/`: Professor pages (Dashboard, Batches, Submissions, Notes, Availability, Events, Progress)
  - `student/`: Student pages (Dashboard, Events, Clubs, Timetable, Notes, Submissions, Progress, Broadcasts)
  - `public/`: Public pages (Landing, Login, Register)
- `src/store/`: Zustand global stores (`authStore.js`, `uiStore.js`).
- `src/utils/`: Utility functions and application-wide constants.

## Key Libraries
- `@tanstack/react-query`: Server state management, caching, and synchronization.
- `zustand`: Lightweight client state management.
- `axios`: Promise-based HTTP client for API requests.
- `react-hook-form` & `@hookform/resolvers`: Performant form handling and validation coupling.
- `zod`: TypeScript-first schema validation logic.
- `framer-motion`: Powerful declarative animations for React.
- `lucide-react`: SVG icon library.
- `recharts`: Composable charting library.

## Routing System
The application uses strict role-based protected routes defined in `App.jsx`. Access to specific URL paths is restricted based on the user's role:
- `CAMPUS_ADMIN`
- `PRINCIPAL`
- `HOD`
- `PROFESSOR`
- `STUDENT`

Fallback loading states are managed via React Suspense and lazy-loading components (`lazy()`). Unauthorized users attempting to access protected routes are redirected to their appropriate dashboard or the login page.

## API Integration Architecture
The `src/api/` directory encapsulates all backend REST API calls using `axios`. It contains separated modules for different roles, ensuring robust modularity when interacting with the respective Spring Boot backend controllers. The endpoints are strictly mapped from the `API_ENDPOINTS.md` specification.