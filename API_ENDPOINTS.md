# CampusNexus API Endpoints

> Complete backend endpoints documentation with expected request bodies and responses for frontend integration.

## AuthController
**Base Path:** `/api/auth`

### POST `/api/auth/register`
#### Request Body
**Type:** `RegisterRequest`

- `name` (*String*)
- `email` (*String*)
- `password` (*String*)
- `phone` (*String*)
- `role` (*Role*)
- `collegeId` (*UUID*)
- `departmentId` (*UUID*)

#### Response
**Type:** `ApiResponse<LoginResponse>`

- **ApiResponse** containing:
  - `accessToken` (*String*)
  - `refreshToken` (*String*)
  - `role` (*Role*)
  - `userId` (*UUID*)
  - `name` (*String*)
  - `email` (*String*)

---

### POST `/api/auth/login`
#### Request Body
**Type:** `LoginRequest`

- `email` (*String*)
- `password` (*String*)

#### Response
**Type:** `ApiResponse<LoginResponse>`

- **ApiResponse** containing:
  - `accessToken` (*String*)
  - `refreshToken` (*String*)
  - `role` (*Role*)
  - `userId` (*UUID*)
  - `name` (*String*)
  - `email` (*String*)

---

### POST `/api/auth/refresh`
#### Request Body
**Type:** `RefreshTokenRequest`

- `refreshToken` (*String*)

#### Response
**Type:** `ApiResponse<LoginResponse>`

- **ApiResponse** containing:
  - `accessToken` (*String*)
  - `refreshToken` (*String*)
  - `role` (*Role*)
  - `userId` (*UUID*)
  - `name` (*String*)
  - `email` (*String*)

---

### POST `/api/auth/logout`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<Void>`

- **ApiResponse** containing:
  - Primitive/Object (`Void`)

---

### GET `/api/auth/colleges`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<CollegeDropdownResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `city` (*String*)

---

### GET `/api/auth/departments/{collegeId}`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<DepartmentDropdownResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `code` (*String*)

---

## CampusAdminController
**Base Path:** `/api/admin`

### GET `/api/admin/search-users`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<UserSearchResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `email` (*String*)
    - `phone` (*String*)
    - `role` (*String*)

---

### POST `/api/admin/colleges`
#### Request Body
**Type:** `CollegeCreateRequest`

- `name` (*String*)
- `address` (*String*)
- `city` (*String*)
- `state` (*String*)
- `logoUrl` (*String*)

#### Response
**Type:** `ApiResponse<CollegeResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `uniqueCollegeCode` (*String*)
  - `name` (*String*)
  - `address` (*String*)
  - `city` (*String*)
  - `state` (*String*)
  - `logoUrl` (*String*)
  - `status` (*CollegeStatus*)
  - `principalName` (*String*)
  - `createdAt` (*LocalDateTime*)

---

### GET `/api/admin/colleges`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<CollegeResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `uniqueCollegeCode` (*String*)
    - `name` (*String*)
    - `address` (*String*)
    - `city` (*String*)
    - `state` (*String*)
    - `logoUrl` (*String*)
    - `status` (*CollegeStatus*)
    - `principalName` (*String*)
    - `createdAt` (*LocalDateTime*)

---

### PUT `/api/admin/colleges/{id}/approve`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<CollegeResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `uniqueCollegeCode` (*String*)
  - `name` (*String*)
  - `address` (*String*)
  - `city` (*String*)
  - `state` (*String*)
  - `logoUrl` (*String*)
  - `status` (*CollegeStatus*)
  - `principalName` (*String*)
  - `createdAt` (*LocalDateTime*)

---

### PUT `/api/admin/colleges/{id}/status`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<CollegeResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `uniqueCollegeCode` (*String*)
  - `name` (*String*)
  - `address` (*String*)
  - `city` (*String*)
  - `state` (*String*)
  - `logoUrl` (*String*)
  - `status` (*CollegeStatus*)
  - `principalName` (*String*)
  - `createdAt` (*LocalDateTime*)

---

### PUT `/api/admin/colleges/{id}/assign-principal`
#### Request Body
**Type:** `AssignPrincipalRequest`

- `userEmail` (*String*)

#### Response
**Type:** `ApiResponse<CollegeResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `uniqueCollegeCode` (*String*)
  - `name` (*String*)
  - `address` (*String*)
  - `city` (*String*)
  - `state` (*String*)
  - `logoUrl` (*String*)
  - `status` (*CollegeStatus*)
  - `principalName` (*String*)
  - `createdAt` (*LocalDateTime*)

---

### POST `/api/admin/seminar-halls`
#### Request Body
**Type:** `SeminarHallRequest`

- `name` (*String*)
- `capacity` (*Integer*)
- `location` (*String*)
- `amenities` (*String*)
- `hallType` (*SeminarHallType*)
- `collegeId` (*UUID*)
- `departmentId` (*UUID*)

#### Response
**Type:** `ApiResponse<SeminarHallResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `capacity` (*Integer*)
  - `location` (*String*)
  - `amenities` (*String*)
  - `hallType` (*SeminarHallType*)
  - `collegeName` (*String*)
  - `departmentName` (*String*)
  - `isActive` (*Boolean*)

---

### GET `/api/admin/seminar-halls`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<SeminarHallResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `capacity` (*Integer*)
    - `location` (*String*)
    - `amenities` (*String*)
    - `hallType` (*SeminarHallType*)
    - `collegeName` (*String*)
    - `departmentName` (*String*)
    - `isActive` (*Boolean*)

---

### POST `/api/admin/events`
#### Request Body
**Type:** `EventCreateRequest`

- `title` (*String*)
- `description` (*String*)
- `eventLevel` (*EventLevel*)
- `eventType` (*EventType*)
- `ticketPrice` (*BigDecimal*)
- `startDateTime` (*LocalDateTime*)
- `endDateTime` (*LocalDateTime*)
- `venue` (*String*)
- `maxParticipants` (*Integer*)
- `parentEventId` (*UUID*)
- `clubId` (*UUID*)
- `collegeId` (*UUID*)
- `departmentId` (*UUID*)
- `posterUrl` (*String*)

#### Response
**Type:** `ApiResponse<EventResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `description` (*String*)
  - `posterUrl` (*String*)
  - `eventLevel` (*EventLevel*)
  - `eventType` (*EventType*)
  - `status` (*EventStatus*)
  - `createdByName` (*String*)
  - `startDateTime` (*LocalDateTime*)
  - `endDateTime` (*LocalDateTime*)
  - `venue` (*String*)
  - `maxParticipants` (*Integer*)
  - `registeredCount` (*Integer*)
  - `isPaid` (*Boolean*)
  - `ticketPrice` (*BigDecimal*)
  - `createdAt` (*LocalDateTime*)
  - `subEvents` (*List<EventResponse>*)

---

### GET `/api/admin/events`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<EventResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `title` (*String*)
    - `description` (*String*)
    - `posterUrl` (*String*)
    - `eventLevel` (*EventLevel*)
    - `eventType` (*EventType*)
    - `status` (*EventStatus*)
    - `createdByName` (*String*)
    - `startDateTime` (*LocalDateTime*)
    - `endDateTime` (*LocalDateTime*)
    - `venue` (*String*)
    - `maxParticipants` (*Integer*)
    - `registeredCount` (*Integer*)
    - `isPaid` (*Boolean*)
    - `ticketPrice` (*BigDecimal*)
    - `createdAt` (*LocalDateTime*)
    - `subEvents` (*List<EventResponse>*)

---

### POST `/api/admin/broadcasts`
#### Request Body
**Type:** `BroadcastRequest`

- `title` (*String*)
- `message` (*String*)
- `level` (*BroadcastLevel*)
- `attachmentUrl` (*String*)

#### Response
**Type:** `ApiResponse<BroadcastResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `message` (*String*)
  - `attachmentUrl` (*String*)
  - `level` (*BroadcastLevel*)
  - `levelLabel` (*String*)
  - `senderName` (*String*)
  - `sentAt` (*LocalDateTime*)

---

### GET `/api/admin/dashboard`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<DashboardResponse>`

- **ApiResponse** containing:
  - `totalColleges` (*long*)
  - `totalUsers` (*long*)
  - `totalEvents` (*long*)
  - `totalRegistrations` (*long*)
  - `totalClubs` (*long*)
  - `activeStudents` (*long*)

---

## HODController
**Base Path:** `/api/hod`

### POST `/api/hod/events`
#### Request Body
**Type:** `EventCreateRequest`

- `title` (*String*)
- `description` (*String*)
- `eventLevel` (*EventLevel*)
- `eventType` (*EventType*)
- `ticketPrice` (*BigDecimal*)
- `startDateTime` (*LocalDateTime*)
- `endDateTime` (*LocalDateTime*)
- `venue` (*String*)
- `maxParticipants` (*Integer*)
- `parentEventId` (*UUID*)
- `clubId` (*UUID*)
- `collegeId` (*UUID*)
- `departmentId` (*UUID*)
- `posterUrl` (*String*)

#### Response
**Type:** `ApiResponse<EventResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `description` (*String*)
  - `posterUrl` (*String*)
  - `eventLevel` (*EventLevel*)
  - `eventType` (*EventType*)
  - `status` (*EventStatus*)
  - `createdByName` (*String*)
  - `startDateTime` (*LocalDateTime*)
  - `endDateTime` (*LocalDateTime*)
  - `venue` (*String*)
  - `maxParticipants` (*Integer*)
  - `registeredCount` (*Integer*)
  - `isPaid` (*Boolean*)
  - `ticketPrice` (*BigDecimal*)
  - `createdAt` (*LocalDateTime*)
  - `subEvents` (*List<EventResponse>*)

---

### GET `/api/hod/events`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<EventResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `title` (*String*)
    - `description` (*String*)
    - `posterUrl` (*String*)
    - `eventLevel` (*EventLevel*)
    - `eventType` (*EventType*)
    - `status` (*EventStatus*)
    - `createdByName` (*String*)
    - `startDateTime` (*LocalDateTime*)
    - `endDateTime` (*LocalDateTime*)
    - `venue` (*String*)
    - `maxParticipants` (*Integer*)
    - `registeredCount` (*Integer*)
    - `isPaid` (*Boolean*)
    - `ticketPrice` (*BigDecimal*)
    - `createdAt` (*LocalDateTime*)
    - `subEvents` (*List<EventResponse>*)

---

### PUT `/api/hod/events/{id}/approve`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<EventResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `description` (*String*)
  - `posterUrl` (*String*)
  - `eventLevel` (*EventLevel*)
  - `eventType` (*EventType*)
  - `status` (*EventStatus*)
  - `createdByName` (*String*)
  - `startDateTime` (*LocalDateTime*)
  - `endDateTime` (*LocalDateTime*)
  - `venue` (*String*)
  - `maxParticipants` (*Integer*)
  - `registeredCount` (*Integer*)
  - `isPaid` (*Boolean*)
  - `ticketPrice` (*BigDecimal*)
  - `createdAt` (*LocalDateTime*)
  - `subEvents` (*List<EventResponse>*)

---

### POST `/api/hod/club-requests/{clubId}/approve`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<ClubResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `description` (*String*)
  - `logoUrl` (*String*)
  - `status` (*ClubStatus*)
  - `statusLabel` (*String*)
  - `guideName` (*String*)
  - `memberCount` (*Integer*)
  - `createdByName` (*String*)
  - `createdAt` (*LocalDateTime*)

---

### POST `/api/hod/club-requests/{clubId}/reject`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<ClubResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `description` (*String*)
  - `logoUrl` (*String*)
  - `status` (*ClubStatus*)
  - `statusLabel` (*String*)
  - `guideName` (*String*)
  - `memberCount` (*Integer*)
  - `createdByName` (*String*)
  - `createdAt` (*LocalDateTime*)

---

### GET `/api/hod/club-requests`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<ClubResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `description` (*String*)
    - `logoUrl` (*String*)
    - `status` (*ClubStatus*)
    - `statusLabel` (*String*)
    - `guideName` (*String*)
    - `memberCount` (*Integer*)
    - `createdByName` (*String*)
    - `createdAt` (*LocalDateTime*)

---

### POST `/api/hod/timetable`
#### Request Body
**Type:** `TimetableRequest`

- `batchId` (*UUID*)
- `dayOfWeek` (*String*)
- `fromTime` (*LocalTime*)
- `toTime` (*LocalTime*)
- `subject` (*String*)
- `teacherId` (*UUID*)
- `room` (*String*)

#### Response
**Type:** `ApiResponse<TimetableResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `dayOfWeek` (*String*)
  - `fromTime` (*LocalTime*)
  - `toTime` (*LocalTime*)
  - `subject` (*String*)
  - `teacherName` (*String*)
  - `batchName` (*String*)
  - `room` (*String*)

---

### GET `/api/hod/timetable`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<TimetableResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `dayOfWeek` (*String*)
    - `fromTime` (*LocalTime*)
    - `toTime` (*LocalTime*)
    - `subject` (*String*)
    - `teacherName` (*String*)
    - `batchName` (*String*)
    - `room` (*String*)

---

### PUT `/api/hod/timetable/{id}`
#### Request Body
**Type:** `TimetableRequest`

- `batchId` (*UUID*)
- `dayOfWeek` (*String*)
- `fromTime` (*LocalTime*)
- `toTime` (*LocalTime*)
- `subject` (*String*)
- `teacherId` (*UUID*)
- `room` (*String*)

#### Response
**Type:** `ApiResponse<TimetableResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `dayOfWeek` (*String*)
  - `fromTime` (*LocalTime*)
  - `toTime` (*LocalTime*)
  - `subject` (*String*)
  - `teacherName` (*String*)
  - `batchName` (*String*)
  - `room` (*String*)

---

### DELETE `/api/hod/timetable/{id}`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<Void>`

- **ApiResponse** containing:
  - Primitive/Object (`Void`)

---

### POST `/api/hod/seminar-halls`
#### Request Body
**Type:** `SeminarHallRequest`

- `name` (*String*)
- `capacity` (*Integer*)
- `location` (*String*)
- `amenities` (*String*)
- `hallType` (*SeminarHallType*)
- `collegeId` (*UUID*)
- `departmentId` (*UUID*)

#### Response
**Type:** `ApiResponse<SeminarHallResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `capacity` (*Integer*)
  - `location` (*String*)
  - `amenities` (*String*)
  - `hallType` (*SeminarHallType*)
  - `collegeName` (*String*)
  - `departmentName` (*String*)
  - `isActive` (*Boolean*)

---

### GET `/api/hod/seminar-halls`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<SeminarHallResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `capacity` (*Integer*)
    - `location` (*String*)
    - `amenities` (*String*)
    - `hallType` (*SeminarHallType*)
    - `collegeName` (*String*)
    - `departmentName` (*String*)
    - `isActive` (*Boolean*)

---

### POST `/api/hod/broadcasts`
#### Request Body
**Type:** `BroadcastRequest`

- `title` (*String*)
- `message` (*String*)
- `level` (*BroadcastLevel*)
- `attachmentUrl` (*String*)

#### Response
**Type:** `ApiResponse<BroadcastResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `message` (*String*)
  - `attachmentUrl` (*String*)
  - `level` (*BroadcastLevel*)
  - `levelLabel` (*String*)
  - `senderName` (*String*)
  - `sentAt` (*LocalDateTime*)

---

## PrincipalController
**Base Path:** `/api/principal`

### POST `/api/principal/departments`
#### Request Body
**Type:** `DepartmentCreateRequest`

- `name` (*String*)
- `code` (*String*)
- `collegeId` (*UUID*)

#### Response
**Type:** `ApiResponse<DepartmentResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `code` (*String*)
  - `hodName` (*String*)
  - `collegeName` (*String*)
  - `collegeId` (*UUID*)
  - `createdAt` (*LocalDateTime*)

---

### GET `/api/principal/departments`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<DepartmentResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `code` (*String*)
    - `hodName` (*String*)
    - `collegeName` (*String*)
    - `collegeId` (*UUID*)
    - `createdAt` (*LocalDateTime*)

---

### PUT `/api/principal/departments/{id}/assign-hod`
#### Request Body
**Type:** `AssignHODRequest`

- `userId` (*UUID*)

#### Response
**Type:** `ApiResponse<DepartmentResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `code` (*String*)
  - `hodName` (*String*)
  - `collegeName` (*String*)
  - `collegeId` (*UUID*)
  - `createdAt` (*LocalDateTime*)

---

### GET `/api/principal/professors`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<UserSearchResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `email` (*String*)
    - `phone` (*String*)
    - `role` (*String*)

---

### POST `/api/principal/club-requests/{clubId}/approve`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<ClubResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `description` (*String*)
  - `logoUrl` (*String*)
  - `status` (*ClubStatus*)
  - `statusLabel` (*String*)
  - `guideName` (*String*)
  - `memberCount` (*Integer*)
  - `createdByName` (*String*)
  - `createdAt` (*LocalDateTime*)

---

### POST `/api/principal/club-requests/{clubId}/reject`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<ClubResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `description` (*String*)
  - `logoUrl` (*String*)
  - `status` (*ClubStatus*)
  - `statusLabel` (*String*)
  - `guideName` (*String*)
  - `memberCount` (*Integer*)
  - `createdByName` (*String*)
  - `createdAt` (*LocalDateTime*)

---

### GET `/api/principal/club-requests`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<ClubResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `description` (*String*)
    - `logoUrl` (*String*)
    - `status` (*ClubStatus*)
    - `statusLabel` (*String*)
    - `guideName` (*String*)
    - `memberCount` (*Integer*)
    - `createdByName` (*String*)
    - `createdAt` (*LocalDateTime*)

---

### POST `/api/principal/seminar-halls`
#### Request Body
**Type:** `SeminarHallRequest`

- `name` (*String*)
- `capacity` (*Integer*)
- `location` (*String*)
- `amenities` (*String*)
- `hallType` (*SeminarHallType*)
- `collegeId` (*UUID*)
- `departmentId` (*UUID*)

#### Response
**Type:** `ApiResponse<SeminarHallResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `capacity` (*Integer*)
  - `location` (*String*)
  - `amenities` (*String*)
  - `hallType` (*SeminarHallType*)
  - `collegeName` (*String*)
  - `departmentName` (*String*)
  - `isActive` (*Boolean*)

---

### GET `/api/principal/seminar-halls`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<SeminarHallResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `capacity` (*Integer*)
    - `location` (*String*)
    - `amenities` (*String*)
    - `hallType` (*SeminarHallType*)
    - `collegeName` (*String*)
    - `departmentName` (*String*)
    - `isActive` (*Boolean*)

---

### PUT `/api/principal/seminar-halls/{id}`
#### Request Body
**Type:** `SeminarHallRequest`

- `name` (*String*)
- `capacity` (*Integer*)
- `location` (*String*)
- `amenities` (*String*)
- `hallType` (*SeminarHallType*)
- `collegeId` (*UUID*)
- `departmentId` (*UUID*)

#### Response
**Type:** `ApiResponse<SeminarHallResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `capacity` (*Integer*)
  - `location` (*String*)
  - `amenities` (*String*)
  - `hallType` (*SeminarHallType*)
  - `collegeName` (*String*)
  - `departmentName` (*String*)
  - `isActive` (*Boolean*)

---

### POST `/api/principal/events`
#### Request Body
**Type:** `EventCreateRequest`

- `title` (*String*)
- `description` (*String*)
- `eventLevel` (*EventLevel*)
- `eventType` (*EventType*)
- `ticketPrice` (*BigDecimal*)
- `startDateTime` (*LocalDateTime*)
- `endDateTime` (*LocalDateTime*)
- `venue` (*String*)
- `maxParticipants` (*Integer*)
- `parentEventId` (*UUID*)
- `clubId` (*UUID*)
- `collegeId` (*UUID*)
- `departmentId` (*UUID*)
- `posterUrl` (*String*)

#### Response
**Type:** `ApiResponse<EventResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `description` (*String*)
  - `posterUrl` (*String*)
  - `eventLevel` (*EventLevel*)
  - `eventType` (*EventType*)
  - `status` (*EventStatus*)
  - `createdByName` (*String*)
  - `startDateTime` (*LocalDateTime*)
  - `endDateTime` (*LocalDateTime*)
  - `venue` (*String*)
  - `maxParticipants` (*Integer*)
  - `registeredCount` (*Integer*)
  - `isPaid` (*Boolean*)
  - `ticketPrice` (*BigDecimal*)
  - `createdAt` (*LocalDateTime*)
  - `subEvents` (*List<EventResponse>*)

---

### GET `/api/principal/events`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<EventResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `title` (*String*)
    - `description` (*String*)
    - `posterUrl` (*String*)
    - `eventLevel` (*EventLevel*)
    - `eventType` (*EventType*)
    - `status` (*EventStatus*)
    - `createdByName` (*String*)
    - `startDateTime` (*LocalDateTime*)
    - `endDateTime` (*LocalDateTime*)
    - `venue` (*String*)
    - `maxParticipants` (*Integer*)
    - `registeredCount` (*Integer*)
    - `isPaid` (*Boolean*)
    - `ticketPrice` (*BigDecimal*)
    - `createdAt` (*LocalDateTime*)
    - `subEvents` (*List<EventResponse>*)

---

### PUT `/api/principal/events/{id}/approve`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<EventResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `description` (*String*)
  - `posterUrl` (*String*)
  - `eventLevel` (*EventLevel*)
  - `eventType` (*EventType*)
  - `status` (*EventStatus*)
  - `createdByName` (*String*)
  - `startDateTime` (*LocalDateTime*)
  - `endDateTime` (*LocalDateTime*)
  - `venue` (*String*)
  - `maxParticipants` (*Integer*)
  - `registeredCount` (*Integer*)
  - `isPaid` (*Boolean*)
  - `ticketPrice` (*BigDecimal*)
  - `createdAt` (*LocalDateTime*)
  - `subEvents` (*List<EventResponse>*)

---

### POST `/api/principal/broadcasts`
#### Request Body
**Type:** `BroadcastRequest`

- `title` (*String*)
- `message` (*String*)
- `level` (*BroadcastLevel*)
- `attachmentUrl` (*String*)

#### Response
**Type:** `ApiResponse<BroadcastResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `message` (*String*)
  - `attachmentUrl` (*String*)
  - `level` (*BroadcastLevel*)
  - `levelLabel` (*String*)
  - `senderName` (*String*)
  - `sentAt` (*LocalDateTime*)

---

### GET `/api/principal/broadcasts`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<BroadcastResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `title` (*String*)
    - `message` (*String*)
    - `attachmentUrl` (*String*)
    - `level` (*BroadcastLevel*)
    - `levelLabel` (*String*)
    - `senderName` (*String*)
    - `sentAt` (*LocalDateTime*)

---

## ProfessorController
**Base Path:** `/api/professor`

### POST `/api/professor/batches`
#### Request Body
**Type:** `BatchCreateRequest`

- `batchName` (*String*)
- `year` (*Integer*)
- `semester` (*Integer*)
- `departmentId` (*UUID*)

#### Response
**Type:** `ApiResponse<BatchResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `batchName` (*String*)
  - `year` (*Integer*)
  - `semester` (*Integer*)
  - `departmentName` (*String*)
  - `professorName` (*String*)
  - `sectionCount` (*Integer*)
  - `createdAt` (*LocalDateTime*)

---

### GET `/api/professor/batches`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<BatchResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `batchName` (*String*)
    - `year` (*Integer*)
    - `semester` (*Integer*)
    - `departmentName` (*String*)
    - `professorName` (*String*)
    - `sectionCount` (*Integer*)
    - `createdAt` (*LocalDateTime*)

---

### POST `/api/professor/batches/{batchId}/sections`
#### Request Body
**Type:** `BatchSectionCreateRequest`

- `title` (*String*)
- `description` (*String*)
- `sectionType` (*BatchSectionType*)
- `deadlineDate` (*LocalDate*)

#### Response
**Type:** `ApiResponse<SectionResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `description` (*String*)
  - `sectionType` (*BatchSectionType*)
  - `deadlineDate` (*LocalDate*)
  - `isActive` (*Boolean*)
  - `submissionCount` (*Integer*)

---

### GET `/api/professor/batches/{batchId}/sections`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<SectionResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `title` (*String*)
    - `description` (*String*)
    - `sectionType` (*BatchSectionType*)
    - `deadlineDate` (*LocalDate*)
    - `isActive` (*Boolean*)
    - `submissionCount` (*Integer*)

---

### GET `/api/professor/submissions/{sectionId}`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<SubmissionResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `studentName` (*String*)
    - `teamName` (*String*)
    - `teamMembers` (*List<String>*)
    - `submissionType` (*SubmissionType*)
    - `fileUrl` (*String*)
    - `description` (*String*)
    - `submittedAt` (*LocalDateTime*)
    - `status` (*SubmissionStatus*)
    - `professorRemark` (*String*)
    - `remarkAt` (*LocalDateTime*)
    - `reviewedByName` (*String*)

---

### PUT `/api/professor/submissions/{submissionId}/remark`
#### Request Body
**Type:** `SubmissionRemarkRequest`

- `remark` (*String*)
- `status` (*SubmissionStatus*)

#### Response
**Type:** `ApiResponse<SubmissionResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `studentName` (*String*)
  - `teamName` (*String*)
  - `teamMembers` (*List<String>*)
  - `submissionType` (*SubmissionType*)
  - `fileUrl` (*String*)
  - `description` (*String*)
  - `submittedAt` (*LocalDateTime*)
  - `status` (*SubmissionStatus*)
  - `professorRemark` (*String*)
  - `remarkAt` (*LocalDateTime*)
  - `reviewedByName` (*String*)

---

### POST `/api/professor/notes`
#### Request Body
**Type:** `NotesUploadRequest`

- `title` (*String*)
- `description` (*String*)
- `subject` (*String*)
- `year` (*Integer*)
- `semester` (*Integer*)
- `fileUrl` (*String*)

#### Response
**Type:** `ApiResponse<NotesResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `description` (*String*)
  - `fileUrl` (*String*)
  - `subject` (*String*)
  - `year` (*Integer*)
  - `semester` (*Integer*)
  - `uploaderName` (*String*)
  - `departmentName` (*String*)
  - `uploadedAt` (*LocalDateTime*)

---

### GET `/api/professor/notes`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<NotesResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `title` (*String*)
    - `description` (*String*)
    - `fileUrl` (*String*)
    - `subject` (*String*)
    - `year` (*Integer*)
    - `semester` (*Integer*)
    - `uploaderName` (*String*)
    - `departmentName` (*String*)
    - `uploadedAt` (*LocalDateTime*)

---

### PUT `/api/professor/notes/{id}`
#### Request Body
**Type:** `NotesUploadRequest`

- `title` (*String*)
- `description` (*String*)
- `subject` (*String*)
- `year` (*Integer*)
- `semester` (*Integer*)
- `fileUrl` (*String*)

#### Response
**Type:** `ApiResponse<NotesResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `description` (*String*)
  - `fileUrl` (*String*)
  - `subject` (*String*)
  - `year` (*Integer*)
  - `semester` (*Integer*)
  - `uploaderName` (*String*)
  - `departmentName` (*String*)
  - `uploadedAt` (*LocalDateTime*)

---

### DELETE `/api/professor/notes/{id}`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<Void>`

- **ApiResponse** containing:
  - Primitive/Object (`Void`)

---

### POST `/api/professor/availability`
#### Request Body
**Type:** `TeacherAvailabilityRequest`

- `date` (*LocalDate*)
- `fromTime` (*LocalTime*)
- `toTime` (*LocalTime*)
- `status` (*TeacherAvailabilityStatus*)
- `note` (*String*)

#### Response
**Type:** `ApiResponse<AvailabilityResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `teacherName` (*String*)
  - `date` (*LocalDate*)
  - `fromTime` (*LocalTime*)
  - `toTime` (*LocalTime*)
  - `status` (*TeacherAvailabilityStatus*)
  - `note` (*String*)

---

### GET `/api/professor/availability`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<AvailabilityResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `teacherName` (*String*)
    - `date` (*LocalDate*)
    - `fromTime` (*LocalTime*)
    - `toTime` (*LocalTime*)
    - `status` (*TeacherAvailabilityStatus*)
    - `note` (*String*)

---

### PUT `/api/professor/availability/{id}`
#### Request Body
**Type:** `TeacherAvailabilityRequest`

- `date` (*LocalDate*)
- `fromTime` (*LocalTime*)
- `toTime` (*LocalTime*)
- `status` (*TeacherAvailabilityStatus*)
- `note` (*String*)

#### Response
**Type:** `ApiResponse<AvailabilityResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `teacherName` (*String*)
  - `date` (*LocalDate*)
  - `fromTime` (*LocalTime*)
  - `toTime` (*LocalTime*)
  - `status` (*TeacherAvailabilityStatus*)
  - `note` (*String*)

---

### POST `/api/professor/events`
#### Request Body
**Type:** `EventCreateRequest`

- `title` (*String*)
- `description` (*String*)
- `eventLevel` (*EventLevel*)
- `eventType` (*EventType*)
- `ticketPrice` (*BigDecimal*)
- `startDateTime` (*LocalDateTime*)
- `endDateTime` (*LocalDateTime*)
- `venue` (*String*)
- `maxParticipants` (*Integer*)
- `parentEventId` (*UUID*)
- `clubId` (*UUID*)
- `collegeId` (*UUID*)
- `departmentId` (*UUID*)
- `posterUrl` (*String*)

#### Response
**Type:** `ApiResponse<EventResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `title` (*String*)
  - `description` (*String*)
  - `posterUrl` (*String*)
  - `eventLevel` (*EventLevel*)
  - `eventType` (*EventType*)
  - `status` (*EventStatus*)
  - `createdByName` (*String*)
  - `startDateTime` (*LocalDateTime*)
  - `endDateTime` (*LocalDateTime*)
  - `venue` (*String*)
  - `maxParticipants` (*Integer*)
  - `registeredCount` (*Integer*)
  - `isPaid` (*Boolean*)
  - `ticketPrice` (*BigDecimal*)
  - `createdAt` (*LocalDateTime*)
  - `subEvents` (*List<EventResponse>*)

---

### GET `/api/professor/events`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<EventResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `title` (*String*)
    - `description` (*String*)
    - `posterUrl` (*String*)
    - `eventLevel` (*EventLevel*)
    - `eventType` (*EventType*)
    - `status` (*EventStatus*)
    - `createdByName` (*String*)
    - `startDateTime` (*LocalDateTime*)
    - `endDateTime` (*LocalDateTime*)
    - `venue` (*String*)
    - `maxParticipants` (*Integer*)
    - `registeredCount` (*Integer*)
    - `isPaid` (*Boolean*)
    - `ticketPrice` (*BigDecimal*)
    - `createdAt` (*LocalDateTime*)
    - `subEvents` (*List<EventResponse>*)

---

### POST `/api/professor/student-progress/{studentId}`
#### Request Body
**Type:** `StudentProgressRequest`

- `progressNote` (*String*)
- `percentage` (*Integer*)
- `subject` (*String*)

#### Response
**Type:** `ApiResponse<ProgressResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `studentName` (*String*)
  - `updatedByName` (*String*)
  - `progressNote` (*String*)
  - `percentage` (*Integer*)
  - `subject` (*String*)
  - `updatedAt` (*LocalDateTime*)

---

### GET `/api/professor/student-progress/{studentId}`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<ProgressResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `studentName` (*String*)
    - `updatedByName` (*String*)
    - `progressNote` (*String*)
    - `percentage` (*Integer*)
    - `subject` (*String*)
    - `updatedAt` (*LocalDateTime*)

---

## StudentController
**Base Path:** `/api/student`

### GET `/api/student/events`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<EventResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `title` (*String*)
    - `description` (*String*)
    - `posterUrl` (*String*)
    - `eventLevel` (*EventLevel*)
    - `eventType` (*EventType*)
    - `status` (*EventStatus*)
    - `createdByName` (*String*)
    - `startDateTime` (*LocalDateTime*)
    - `endDateTime` (*LocalDateTime*)
    - `venue` (*String*)
    - `maxParticipants` (*Integer*)
    - `registeredCount` (*Integer*)
    - `isPaid` (*Boolean*)
    - `ticketPrice` (*BigDecimal*)
    - `createdAt` (*LocalDateTime*)
    - `subEvents` (*List<EventResponse>*)

---

### POST `/api/student/events/{eventId}/register`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<EventRegistrationResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `ticketCode` (*String*)
  - `ticketStatus` (*TicketStatus*)
  - `paymentStatus` (*PaymentStatus*)
  - `stripeClientSecret` (*String*)
  - `eventTitle` (*String*)
  - `eventDate` (*LocalDateTime*)
  - `registeredAt` (*LocalDateTime*)

---

### GET `/api/student/events/my-registrations`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<EventRegistrationResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `ticketCode` (*String*)
    - `ticketStatus` (*TicketStatus*)
    - `paymentStatus` (*PaymentStatus*)
    - `stripeClientSecret` (*String*)
    - `eventTitle` (*String*)
    - `eventDate` (*LocalDateTime*)
    - `registeredAt` (*LocalDateTime*)

---

### GET `/api/student/events/{eventId}/ticket`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<EventRegistrationResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `ticketCode` (*String*)
  - `ticketStatus` (*TicketStatus*)
  - `paymentStatus` (*PaymentStatus*)
  - `stripeClientSecret` (*String*)
  - `eventTitle` (*String*)
  - `eventDate` (*LocalDateTime*)
  - `registeredAt` (*LocalDateTime*)

---

### POST `/api/student/clubs`
#### Request Body
**Type:** `ClubCreateRequest`

- `name` (*String*)
- `description` (*String*)
- `guideTeacherId` (*UUID*)
- `logoUrl` (*String*)

#### Response
**Type:** `ApiResponse<ClubResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `description` (*String*)
  - `logoUrl` (*String*)
  - `status` (*ClubStatus*)
  - `statusLabel` (*String*)
  - `guideName` (*String*)
  - `memberCount` (*Integer*)
  - `createdByName` (*String*)
  - `createdAt` (*LocalDateTime*)

---

### GET `/api/student/clubs`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<ClubResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `description` (*String*)
    - `logoUrl` (*String*)
    - `status` (*ClubStatus*)
    - `statusLabel` (*String*)
    - `guideName` (*String*)
    - `memberCount` (*Integer*)
    - `createdByName` (*String*)
    - `createdAt` (*LocalDateTime*)

---

### POST `/api/student/clubs/{clubId}/join`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<ClubResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `name` (*String*)
  - `description` (*String*)
  - `logoUrl` (*String*)
  - `status` (*ClubStatus*)
  - `statusLabel` (*String*)
  - `guideName` (*String*)
  - `memberCount` (*Integer*)
  - `createdByName` (*String*)
  - `createdAt` (*LocalDateTime*)

---

### POST `/api/student/submissions/{sectionId}`
#### Request Body
**Type:** `SubmissionRequest`

- `submissionType` (*SubmissionType*)
- `fileUrl` (*String*)
- `description` (*String*)
- `teamName` (*String*)
- `teamMemberIds` (*List<UUID>*)

#### Response
**Type:** `ApiResponse<SubmissionResponse>`

- **ApiResponse** containing:
  - `id` (*UUID*)
  - `studentName` (*String*)
  - `teamName` (*String*)
  - `teamMembers` (*List<String>*)
  - `submissionType` (*SubmissionType*)
  - `fileUrl` (*String*)
  - `description` (*String*)
  - `submittedAt` (*LocalDateTime*)
  - `status` (*SubmissionStatus*)
  - `professorRemark` (*String*)
  - `remarkAt` (*LocalDateTime*)
  - `reviewedByName` (*String*)

---

### GET `/api/student/submissions`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<SubmissionResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `studentName` (*String*)
    - `teamName` (*String*)
    - `teamMembers` (*List<String>*)
    - `submissionType` (*SubmissionType*)
    - `fileUrl` (*String*)
    - `description` (*String*)
    - `submittedAt` (*LocalDateTime*)
    - `status` (*SubmissionStatus*)
    - `professorRemark` (*String*)
    - `remarkAt` (*LocalDateTime*)
    - `reviewedByName` (*String*)

---

### GET `/api/student/notes`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<NotesResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `title` (*String*)
    - `description` (*String*)
    - `fileUrl` (*String*)
    - `subject` (*String*)
    - `year` (*Integer*)
    - `semester` (*Integer*)
    - `uploaderName` (*String*)
    - `departmentName` (*String*)
    - `uploadedAt` (*LocalDateTime*)

---

### GET `/api/student/broadcasts`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<BroadcastResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `title` (*String*)
    - `message` (*String*)
    - `attachmentUrl` (*String*)
    - `level` (*BroadcastLevel*)
    - `levelLabel` (*String*)
    - `senderName` (*String*)
    - `sentAt` (*LocalDateTime*)

---

### GET `/api/student/timetable`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<TimetableResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `dayOfWeek` (*String*)
    - `fromTime` (*LocalTime*)
    - `toTime` (*LocalTime*)
    - `subject` (*String*)
    - `teacherName` (*String*)
    - `batchName` (*String*)
    - `room` (*String*)

---

### GET `/api/student/teacher-availability`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<AvailabilityResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `teacherName` (*String*)
    - `date` (*LocalDate*)
    - `fromTime` (*LocalTime*)
    - `toTime` (*LocalTime*)
    - `status` (*TeacherAvailabilityStatus*)
    - `note` (*String*)

---

### GET `/api/student/progress`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<ProgressResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `studentName` (*String*)
    - `updatedByName` (*String*)
    - `progressNote` (*String*)
    - `percentage` (*Integer*)
    - `subject` (*String*)
    - `updatedAt` (*LocalDateTime*)

---

### PUT `/api/student/profile`
#### Request Body
**Type:** `UpdateProfileRequest`

- `name` (*String*)
- `phone` (*String*)
- `profilePicUrl` (*String*)
- `fcmToken` (*String*)

#### Response
**Type:** `ApiResponse<String>`

- **ApiResponse** containing:
  - Primitive/Object (`String`)

---

---

### GET `/api/student/professors`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<UserResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `email` (*String*)

---

### GET `/api/student/students`
#### Request Body
No request body.

#### Response
**Type:** `ApiResponse<List<UserResponse>>`

- **ApiResponse** containing:
  - **List** containing:
    - `id` (*UUID*)
    - `name` (*String*)
    - `email` (*String*)

---

## WebhookController
**Base Path:** `/api/webhook`

### POST `/api/webhook/stripe`
#### Request Body
**Type:** `String`

- Primitive/Object (`String`)

#### Response
**Type:** `ApiResponse<Void>`

- **ApiResponse** containing:
  - Primitive/Object (`Void`)

---

