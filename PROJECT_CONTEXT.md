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
| 32 | src/api/student.api.js | API | ✏️ Modified | Added getSections endpoint |
| 33 | src/pages/student/SubmissionsPage.jsx | Component | ✏️ Modified | Overhauled UI with automated IDs and available sections list |
| 34 | campus_connect_backend/src/main/java/com/campusnexus/controller/StudentController.java | Controller | ✏️ Modified | Added getProfessors and getStudents endpoints |
| 35 | src/pages/professor/SubmissionsPage.jsx | Component | ✏️ Modified | Enhanced UI to display team members and leader label |
| 36 | src/pages/student/TeacherAvailabilityPage.jsx | Component | ✅ Created | Real-time teacher availability dashboard for students |
| 37 | src/pages/principal/PrincipalDashboard.jsx | Component | ✏️ Modified | Sorted events in descending order by startDateTime |
| 38 | src/pages/hod/HODDashboard.jsx | Component | ✏️ Modified | Sorted events in descending order and added Upcoming Events section |
| 39 | src/pages/admin/AdminDashboard.jsx | Component | ✏️ Modified | Sorted events in descending order and added Upcoming Events section |

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
- Total Files Created: 6
- Total Entities: 0
- Total Endpoints: 31
- Total Enums: 2
- Total Services: 0
- Build Command: npm run build
- Run Command: npm run dev
- Swagger URL: http://localhost:8080/swagger-ui.html
- Default Admin Login: admin@campusnexus.com / Admin@123

