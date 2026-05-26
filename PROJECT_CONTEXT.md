# CampusNexus — Project Context & Change Log

## Project Overview
- Name: CampusNexus
- Type: Multi-College Campus Management System
- Backend: Spring Boot 4.0.3, Java 17, PostgreSQL (Frontend Repository: React + Vite)
- Started: 2026-03-31

---

## Architecture Summary
- Package: com.campusnexus (Frontend context)
- Database: PostgreSQL (campus_nexus)
- Auth: JWT (jjwt 0.12.6) with Spring Security 7
- File Storage: Firebase Storage
- Notifications: Firebase FCM + Spring Mail
- Payments: Stripe
- API Docs: Springdoc OpenAPI / Swagger UI at /swagger-ui.html

---

## Modules
| Module | Role | Base Path |
|--------|------|-----------|
| Campus Admin | CAMPUS_ADMIN | /api/admin |
| Principal | PRINCIPAL | /api/principal |
| HOD | HOD | /api/hod |
| Professor | PROFESSOR | /api/professor |
| Student | STUDENT | /api/student |
| Auth | All | /api/auth |
| Webhook | System | /api/webhook |

---

## File Registry
| # | File Path | Type | Status | Description |
|---|-----------|------|--------|-------------|
| 1 | PROJECT_CONTEXT.md | Config | ✅ Created | Project documentation and change log tracker |
| 77 | src/pages/professor/AvailabilityPage.jsx | Component | ✏️ Modified | Enhanced with Edit/Delete CRUD, time validation, and premium UI |
| 2 | src/constants/enums.js | Config | ✅ Created | Source of truth for frontend enums |
| 3 | src/pages/admin/EventsPage.jsx | Component | ✏️ Modified | Updated to use EVENT_TYPE |
| 4 | src/pages/principal/EventsPage.jsx | Component | ✏️ Modified | Integrated EventManagementModal |
| 5 | src/pages/hod/EventsPage.jsx | Component | ✏️ Modified | Integrated EventManagementModal |
| 6 | src/pages/professor/EventsPage.jsx | Component | ✏️ Modified | Updated to use EVENT_TYPE |
| 7 | src/utils/formatters.js | Utils | ✏️ Modified | Updated formatEnumLabel |
| 8 | src/pages/student/StudentDashboard.jsx | Component | ✏️ Modified | Sorted events in descending order by startDateTime |
| 9 | src/pages/student/EventsPage.jsx | Component | ✏️ Modified | Updated registration cache mapping |
| 10 | src/components/shared/EventCard.jsx | Component | ✏️ Modified | Handled UI changes for event registration |
| 11 | campus_connect_backend/src/main/java/com/campusnexus/dto/EventRegistrationResponse.java | DTO | ✏️ Modified | Added eventId to response |
| 12 | campus_connect_backend/src/main/java/com/campusnexus/service/impl/EventRegistrationServiceImpl.java | ServiceImpl | ✏️ Modified | Mapped eventId in response builder |
| 13 | src/api/student.api.js | API | ✏️ Modified | Renamed getMyEvents to getMyRegistrations |
| 14 | src/api/admin.api.js | API | ✏️ Modified | Added getEventParticipants and updateEventStatus |
| 15 | src/api/professor.api.js | API | ✏️ Modified | Added CRUD for batches, sections, and availability |
| 16 | src/api/student.api.js | API | ✏️ Modified | Added getEventParticipants and updateEventStatus |
| 17 | src/components/shared/EventManagementModal.jsx | Component | ✅ Created | Created modal for viewing participants and updating event status |
| 18 | src/pages/professor/EventsPage.jsx | Component | ✏️ Modified | Integrated EventManagementModal |
| 19 | src/pages/admin/EventsPage.jsx | Component | ✏️ Modified | Integrated EventManagementModal |
| 20 | src/pages/student/EventsPage.jsx | Component | ✏️ Modified | Integrated EventManagementModal |
| 21 | src/api/principal.api.js | API | ✏️ Modified | Updated getClubRequests to support status filtering |
| 22 | src/api/hod.api.js | API | ✏️ Modified | Updated getClubRequests to support status filtering |
| 23 | src/pages/hod/SeminarHallsPage.jsx | Component | ✏️ Modified | Fixed hallType enum mismatch (DEPARTMENT -> PRIVATE) |
| 24 | src/pages/hod/ClubRequestsPage.jsx | Component | ✏️ Modified | Enhanced with status-based tabs and API filtering |
| 24 | src/pages/hod/ClubRequestsPage.jsx | Component | ✏️ Modified | Enhanced with status-based tabs and API filtering |
| 25 | src/pages/principal/ClubRequestsPage.jsx | Component | ✏️ Modified | Enhanced with status-based tabs and API filtering |
| 26 | src/api/student.api.js | API | ✏️ Modified | Added getProfessors endpoint |
| 27 | src/components/ui/SearchSelect.jsx | Component | ✅ Created | Reusable searchable dropdown component |
| 28 | src/pages/student/ClubsPage.jsx | Component | ✏️ Modified | Fixed club visibility logic and club card action buttons |
| 29 | src/components/shared/BroadcastCard.jsx | Component | ✏️ Modified | Enhanced UI to display sender's role |
| 30 | src/pages/professor/BatchesPage.jsx | Component | ✏️ Modified | Enhanced with full Batch and Section CRUD, expandable views, and safety checks |
| 31 | src/utils/enums.js | Config | ✅ Created | Local enums for batch section types |
| 32 | src/api/student.api.js | API | ✏️ Modified | Added getProfile and updated updateProfile |
| 33 | src/pages/student/SubmissionsPage.jsx | Component | ✏️ Modified | Overhauled UI with automated IDs and available sections list |
| 34 | campus_connect_backend/src/main/java/com/campusnexus/controller/StudentController.java | Controller | ✏️ Modified | Added getProfessors and getStudents endpoints |
| 35 | src/pages/professor/SubmissionsPage.jsx | Component | ✏️ Modified | Enhanced UI to display team members and leader label |
| 36 | src/pages/student/TeacherAvailabilityPage.jsx | Component | ✏️ Modified | Real-time teacher availability dashboard with teaching schedule placeholder |
| 37 | src/pages/principal/PrincipalDashboard.jsx | Component | ✏️ Modified | Sorted events in descending order by startDateTime |
| 38 | src/pages/hod/HODDashboard.jsx | Component | ✏️ Modified | Sorted events in descending order and added Upcoming Events section |
| 39 | src/pages/admin/AdminDashboard.jsx | Component | ✏️ Modified | Sorted events in descending order and added Upcoming Events section |
| 40 | src/pages/student/ProfilePage.jsx | Component | ✅ Created | Full student profile with image upload, academic info, skills, and links |
| 41 | src/pages/shared/SimulationResults.jsx | Component | ✏️ Modified | Rebuilt: Chart 1 new data/colors, Chart 3 horizontal single-bar, per-card stat bg, max-w-5xl layout |
| 42 | src/App.jsx | Config | ✏️ Modified | Added SimulationResults lazy import, routes for all roles, and professor timetable route |
| 43 | src/components/layout/Sidebar.jsx | Component | ✏️ Modified | Added Simulation Results and Professor My Schedule navigation items |
| 44 | src/utils/constants.js | Config | ✏️ Modified | Added timetable constants (YEAR_LABELS, DIVISIONS, TIMETABLE_TIME_SLOTS) |
| 45 | src/api/hod.api.js | API | ✏️ Modified | Added timetable and AI wizard endpoints (reverted getProfessors custom URL change) |
| 46 | src/api/student.api.js | API | ✏️ Modified | Added parameterized timetable endpoint and profile retrieval |
| 47 | src/api/professor.api.js | API | ✏️ Modified | Added own and merged timetable endpoints |
| 48 | src/components/shared/TimetableGrid.jsx | Component | ✏️ Modified | Reusable weekly timetable grid (added dayOfWeek lowercasing and dual startTime/fromTime support) |
| 49 | src/pages/hod/TimetablePage.jsx | Component | ✏️ Modified | Full redesign with tabs, AI generation, and conflict detection; fixed profsLoading ReferenceError in manual modal |
| 50 | src/pages/student/TimetablePage.jsx | Component | ✏️ Modified | Overhauled with filter parameters, profile pre-fill, and weekly grid |
| 51 | src/pages/professor/TimetablePage.jsx | Component | ✅ Created | Professor schedule view with own teaching and merged availability schedule |


---

## Entity Registry
| Entity | Table Name | Primary Key | Relationships | Status |
|--------|-----------|-------------|---------------|--------|

---

## API Endpoint Registry
| Method | Endpoint | Controller | Role Required | Description | Status |
|--------|----------|-----------|---------------|-------------|--------|

---

## Enum Registry
| Enum | Values | Status |
|------|--------|--------|
| EVENT_TYPE | MAIN: "MAIN_EVENT", SUB: "SUB_EVENT" | ✅ Created |
| BatchSectionType | PROJECT, SEMINAR, INTERNSHIP | ✅ Created |


---

## Service Registry
| Service Interface | Implementation Class | Methods | Status |
|------------------|---------------------|---------|--------|

---

## Dependencies Used
| FullCalendar (Core + Plugins) | ^6.1.20 | Professional calendar UI library |
| Framer Motion | ^11.15.0 | Premium animations and transitions |
| Lucide React | ^0.468.0 | Vector icons |
| axios | ^1.7.9 | HTTP client |
| date-fns | ^4.1.0 | Date manipulation |

---

## Environment Variables / Properties
| Property Key | Default Value | Description |
|-------------|---------------|-------------|

---

## Change Log
| Timestamp | Action | File | Details |
|-----------|--------|------|---------|
| Step-104 | MODIFY | PROJECT_CONTEXT.md | Updated change log for unified useQuery fix |
| Step-103 | MODIFY | src/pages/hod/TimetablePage.jsx | Fixed blank screen on Step 2 of AI generator by unifying useQuery definitions for 'hod-professors' |
| Step-102 | MODIFY | PROJECT_CONTEXT.md | Updated change log for HOD timetable modal bug fix |
| Step-101 | MODIFY | src/pages/hod/TimetablePage.jsx | Fixed ReferenceError by replacing profsLoading with professorsLoading in ManualAddModal |
| Step-100 | MODIFY | src/pages/hod/TimetablePage.jsx | Reverted professor dropdown back to SearchSelect and restored original query setup |
| Step-99 | MODIFY | src/api/hod.api.js | Reverted getProfessors API endpoint URL back to /api/hod/professors |
| Step-98 | MODIFY | src/pages/hod/TimetablePage.jsx | Replaced professor dropdown with select dropdown, fixed API extraction, and added loading/empty states |
| Step-97 | MODIFY | src/api/hod.api.js | Updated getProfessors to call /api/student/professors to fix HOD profile lookup |
| Step-96 | MODIFY | src/pages/student/TeacherAvailabilityPage.jsx | Added Teaching Schedule placeholder section to teacher details modal |
| Step-95 | MODIFY | src/components/layout/Sidebar.jsx | Added My Schedule navigation item to professor role navigation items |
| Step-94 | MODIFY | src/App.jsx | Added lazy import and route definition for professor timetable page |
| Step-93 | CREATE | src/pages/professor/TimetablePage.jsx | Created professor timetable page featuring teaching schedule and merged consultation availability views |
| Step-92 | MODIFY | src/components/shared/TimetableGrid.jsx | Added lowercase dayOfWeek mapping and support for both startTime and fromTime to handle merged schedules and case mismatches |
| Step-91 | MODIFY | src/pages/student/TimetablePage.jsx | Overhauled student timetable with query parameters, profile auto-fill, and weekly grid |
| Step-90 | MODIFY | src/pages/hod/TimetablePage.jsx | Redesigned HOD timetable page with manual slot manager and 3-step AI generation wizard |
| Step-89 | CREATE | src/components/shared/TimetableGrid.jsx | Created reusable weekly timetable grid component |
| Step-88 | MODIFY | src/api/professor.api.js | Added my-timetable and merged schedule endpoints |
| Step-87 | MODIFY | src/api/student.api.js | Added parameters to getTimetable and added getProfile endpoint |
| Step-86 | MODIFY | src/api/hod.api.js | Added timetable generation, publish, archive, and professors list endpoints |
| Step-85 | MODIFY | src/utils/constants.js | Added YEAR_LABELS, DIVISIONS, and TIMETABLE_TIME_SLOTS |
| Step-84 | MODIFY | src/pages/shared/SimulationResults.jsx | Rebuilt page: Chart 1 new data (Auth, Webhook) and colors (#3b82f6, #22c55e, #f97316), Chart 2 unchanged, Chart 3 horizontal single-bar with 10 modules, stat cards with per-card bg colors (indigo/green/blue), page wrapped in max-w-5xl |
| Step-83 | CREATE | src/pages/shared/SimulationResults.jsx | Created Simulation Results page with 3 Recharts charts (Endpoint Distribution, Response Time, Test Coverage), 3 stat cards, Framer Motion animations |
| Step-82 | MODIFY | src/App.jsx | Added SimulationResults lazy import and route for all 5 role groups (admin, principal, hod, professor, student) |
| Step-81 | MODIFY | src/components/layout/Sidebar.jsx | Added BarChart2 icon import and Simulation Results nav item to all 5 role nav arrays |
| Step-80 | MODIFY | src/pages/student/ProfilePage.jsx | Fixed form pre-filling and state preservation: corrected field mapping and added refetch on success |
| Step-79 | MODIFY | src/pages/student/ProfilePage.jsx | Fixed payload formatting: skills/interests sent as arrays, switched to JSON for @RequestBody |
| Step-78 | CREATE | src/pages/student/ProfilePage.jsx | Implemented full student profile system with premium UI and validation |
| Step-77 | MODIFY | src/components/layout/Sidebar.jsx | Added Profile link to student sidebar |
| Step-76 | MODIFY | src/App.jsx | Registered Student Profile route |
| Step-75 | MODIFY | src/api/student.api.js | Added getProfile and updated updateProfile |
| Step-74 | MODIFY | src/pages/admin/AdminDashboard.jsx | Sorted events in descending order and added Upcoming Events section |
| Step-73 | MODIFY | src/pages/hod/HODDashboard.jsx | Sorted events in descending order and added Upcoming Events section |
| Step-72 | MODIFY | src/pages/principal/PrincipalDashboard.jsx | Sorted events in descending order by startDateTime |
| Step-71 | MODIFY | src/pages/student/StudentDashboard.jsx | Sorted events in descending order by startDateTime |
| Step-70 | MODIFY | src/pages/professor/AvailabilityPage.jsx | Implemented Edit/Delete functionality with validation and status-based styling |
| Step-69 | MODIFY | src/api/professor.api.js | Added deleteAvailability endpoint |
| Step-68 | MODIFY | src/pages/student/TeacherAvailabilityPage.jsx | Set List View as default and fixed FullCalendar core dependency issue |
| Step-67 | MODIFY | src/pages/student/TeacherAvailabilityPage.jsx | Integrated FullCalendar for a professional, interactive schedule view |
| Step-66 | MODIFY | src/components/layout/Sidebar.jsx | Added Teacher Availability link to student sidebar |
| Step-65 | MODIFY | src/App.jsx | Registered Teacher Availability route |
| Step-64 | CREATE | src/pages/student/TeacherAvailabilityPage.jsx | Implemented Teacher Availability dashboard with filtering and real-time status display |
| Step-1 | CREATE | PROJECT_CONTEXT.md | Initialized Project Context and Change log as per requirements |
| Step-2 | CREATE | src/constants/enums.js | Created EVENT_TYPE enum with MAIN_EVENT and SUB_EVENT values |
| Step-3 | MODIFY | src/pages/admin/EventsPage.jsx | Replaced hardcoded "MAIN" with EVENT_TYPE.MAIN |
| Step-4 | MODIFY | src/pages/principal/EventsPage.jsx | Replaced hardcoded "MAIN" with EVENT_TYPE.MAIN |
| Step-5 | MODIFY | src/pages/hod/EventsPage.jsx | Replaced hardcoded "MAIN" with EVENT_TYPE.MAIN |
| Step-6 | MODIFY | src/pages/professor/EventsPage.jsx | Replaced hardcoded "MAIN" with EVENT_TYPE.MAIN |
| Step-7 | MODIFY | src/utils/formatters.js | Updated formatEnumLabel implementation as requested |
| Step-8 | MODIFY | src/pages/student/StudentDashboard.jsx | Imported formatEnumLabel and used optional chaining |
| Step-9 | MODIFY | src/pages/student/EventsPage.jsx | Implemented optimistic update and properly invalidated queries |
| Step-10 | MODIFY | src/components/shared/EventCard.jsx | Supported registering state and correct UI disabling logic |
| Step-11 | MODIFY | campus_connect_backend/src/main/java/com/campusnexus/dto/EventRegistrationResponse.java | Added eventId to response DTO to fix frontend sync |
| Step-12 | MODIFY | campus_connect_backend/src/main/java/com/campusnexus/service/impl/EventRegistrationServiceImpl.java | Sent eventId in API response mapped from entity |
| Step-13 | MODIFY | src/api/student.api.js | Renamed getMyEvents to getMyRegistrations |
| Step-14 | MODIFY | src/pages/student/EventsPage.jsx | Updated events mapping and query invalidate based on student my-registrations |
| Step-15 | MODIFY | src/components/shared/EventCard.jsx | Updated styling and disabled states of Register button |
| Step-16 | MODIFY | src/api/admin.api.js | Added getEventParticipants and updateEventStatus API endpoints |
| Step-17 | MODIFY | src/api/professor.api.js | Added getEventParticipants and updateEventStatus API endpoints |
| Step-18 | MODIFY | src/api/student.api.js | Added getEventParticipants and updateEventStatus API endpoints |
| Step-19 | CREATE | src/components/shared/EventManagementModal.jsx | Created modal for viewing participants and updating event status |
| Step-20 | MODIFY | src/pages/professor/EventsPage.jsx | Integrated EventManagementModal |
| Step-21 | MODIFY | src/pages/admin/EventsPage.jsx | Integrated EventManagementModal |
| Step-22 | MODIFY | src/pages/student/EventsPage.jsx | Integrated EventManagementModal |
| Step-23 | MODIFY | src/api/admin.api.js | Updated event participants and status URLs to use /api/admin prefix |
| Step-24 | MODIFY | src/api/professor.api.js | Updated event participants and status URLs to use /api/professor prefix |
| Step-25 | MODIFY | src/api/student.api.js | Updated event participants and status URLs to use /api/student prefix |
| Step-26 | MODIFY | src/components/shared/EventManagementModal.jsx | Refactored to accept fetchParticipants and updateStatus as props |
| Step-27 | MODIFY | src/pages/admin/EventsPage.jsx | Passed adminAPI methods as props to EventManagementModal |
| Step-28 | MODIFY | src/pages/professor/EventsPage.jsx | Passed professorAPI methods as props to EventManagementModal |
| Step-29 | MODIFY | src/pages/student/EventsPage.jsx | Passed studentAPI methods as props to EventManagementModal |
| Step-30 | MODIFY | src/components/shared/EventManagementModal.jsx | Hid participants table and status update for students; added own registration info and total count |
| Step-31 | MODIFY | src/pages/student/EventsPage.jsx | Passed studentRegistrations to EventManagementModal |
| Step-32 | MODIFY | src/components/shared/EventManagementModal.jsx | Implemented optimistic query updates and local state for instant status update UI |
| Step-33 | MODIFY | src/api/principal.api.js | Added getEventParticipants and updateEventStatus API endpoints |
| Step-34 | MODIFY | src/api/hod.api.js | Added getEventParticipants and updateEventStatus API endpoints |
| Step-35 | MODIFY | src/pages/principal/EventsPage.jsx | Integrated EventManagementModal for participant viewing |
| Step-36 | MODIFY | src/pages/hod/EventsPage.jsx | Integrated EventManagementModal for participant viewing |
| Step-37 | MODIFY | src/pages/hod/SeminarHallsPage.jsx | Changed hallType from 'DEPARTMENT' to 'PRIVATE' in createMutation to match backend enum |
| Step-38 | MODIFY | src/api/student.api.js | Added getProfessors endpoint to fetch list of professors |
| Step-39 | CREATE | src/components/ui/SearchSelect.jsx | Reusable searchable dropdown with debouncing and loading support |
| Step-40 | MODIFY | src/pages/student/ClubsPage.jsx | Replaced manual guide teacher ID input with searchable SearchSelect component |
| Step-41 | MODIFY | src/pages/student/ClubsPage.jsx | Fixed club visibility logic using isMember and isOwner flags and updated UI action buttons |
| Step-42 | MODIFY | src/components/shared/BroadcastCard.jsx | Enhanced broadcast UI to display [Sender Name] • [Role] |
| Step-43 | MODIFY | src/api/hod.api.js | Updated getClubRequests to support status-based filtering |
| Step-44 | MODIFY | src/api/principal.api.js | Updated getClubRequests to support status-based filtering |
| Step-45 | MODIFY | src/pages/hod/ClubRequestsPage.jsx | Enhanced Club Requests UI with status-based tabs and API filtering |
| Step-46 | MODIFY | src/pages/principal/ClubRequestsPage.jsx | Enhanced Club Requests UI with status-based tabs and API filtering |
| Step-47 | MODIFY | src/pages/professor/BatchesPage.jsx | Removed departmentId field from batch creation form and schema |
| Step-48 | CREATE | src/utils/enums.js | Created BATCH_SECTION_TYPES enum for centralized section type management |
| Step-49 | MODIFY | src/pages/professor/BatchesPage.jsx | Updated Section Type dropdown and schema validation to match backend enums (PROJECT, SEMINAR, INTERNSHIP) |
| Step-50 | MODIFY | src/api/student.api.js | Added getSections endpoint to fetch available sections for students |
| Step-57 | MODIFY | src/api/student.api.js | Added getStudents endpoint to studentAPI |
| Step-58 | MODIFY | src/pages/student/SubmissionsPage.jsx | Implemented Team Submission UI with teammate selection, chips, and conditional PROJECT logic |
| Step-59 | MODIFY | API_ENDPOINTS.md | Documented new student search endpoints and updated submission payload |
| Step-60 | MODIFY | src/pages/student/SubmissionsPage.jsx | Fixed JSX syntax error in conditional rendering and removed redundant field registration |
| Step-61 | MODIFY | src/pages/student/SubmissionsPage.jsx | Fixed ReferenceError by importing X icon from lucide-react |
| Step-62 | MODIFY | src/pages/student/SubmissionsPage.jsx | Filtered out already submitted tasks from the Pending Tasks view |
| Step-51 | MODIFY | src/pages/student/SubmissionsPage.jsx | Refactored UI to show Available Sections and Submission History with automated ID handling |
| Step-56 | MODIFY | StudentController.java | Added getProfessors and getStudents endpoints to support teammate and professor selection |
| Step-52 | MODIFY | src/pages/student/SubmissionsPage.jsx | Fixed teacher name mapping, implemented deadline sorting, and added batch name display |
| Step-53 | MODIFY | src/pages/student/SubmissionsPage.jsx | Fixed deadline display by switching to deadlineDate field and added Indian locale formatting |
| Step-54 | MODIFY | src/api/professor.api.js | Added updateBatch, deleteBatch, updateSection, and deleteSection endpoints |
| Step-55 | MODIFY | src/pages/professor/BatchesPage.jsx | Refactored for full CRUD, nested section listing, and UI/UX improvements |
| Step-63 | MODIFY | src/pages/professor/SubmissionsPage.jsx | Enhanced UI to show "Leader" label and "Team" members for team submissions |

---

## Known Issues / TODOs
| # | Issue | File | Priority |
|---|-------|------|----------|

---

## Integration Notes
### Firebase Setup Required
- Place `firebase-service-account.json` in `src/main/resources/`
- Set `firebase.storage-bucket` in application.properties

### Stripe Setup Required
- Replace `stripe.api-key` with your test/live key
- Register webhook endpoint: POST /api/webhook/stripe in Stripe dashboard
- Set `stripe.webhook-secret` from Stripe webhook signing secret

### PostgreSQL Setup Required
- Create database: `CREATE DATABASE campus_nexus;`
- Update datasource username/password in application.properties

---

## Final Summary
- Total Files Created: 10
- Total Entities: 0
- Total Endpoints: 32
- Total Enums: 2
- Total Services: 0
- Build Command: npm run build
- Run Command: npm run dev
- Swagger URL: http://localhost:8080/swagger-ui.html
- Default Admin Login: admin@campusnexus.com / Admin@123

