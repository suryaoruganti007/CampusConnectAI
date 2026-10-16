# API reference

All protected endpoints require `Authorization: Bearer <JWT>`.

## Authentication
- `POST /api/auth/register` — `{name,email,password}`; role is always STUDENT.
- `POST /api/auth/login` — `{email,password}`.
- `GET /api/auth/me` — authenticated profile.

## Courses and enrollment
- `GET /api/courses`; `GET /api/courses/{id}`.
- `GET /api/courses/page?page=0&size=10&sortBy=createdAt&direction=desc`.
- Faculty/admin: `POST /api/courses`, `PUT /api/courses/{id}`; admin: `DELETE /api/courses/{id}`.
- `GET /api/enrollments`; `POST /api/enrollments/{courseId}`; `DELETE /api/enrollments/{courseId}`.
- Faculty/admin: `GET /api/enrollments/course/{courseId}`.

## Attendance
- Student: `GET /api/attendance`, `GET /api/attendance/summary`.
- Faculty/admin: `POST /api/attendance` with `{courseId,studentId,date,status}`; status is `PRESENT`, `ABSENT`, or `LATE`.
- Faculty/admin: `GET /api/attendance/course/{courseId}` optionally with `?date=YYYY-MM-DD`.

## Assignments/submissions
- `GET /api/assignments` optionally with `?courseId=`.
- Faculty/admin: `POST /api/assignments` with `{title,description,courseId,dueAt}` (`dueAt` is ISO local date-time), `PUT /api/assignments/{id}`, admin `DELETE /api/assignments/{id}`.
- Student: `POST /api/assignments/{id}/submissions` with `{content}`; `GET /api/assignments/submissions/mine`.
- Faculty/admin: `GET /api/assignments/{id}/submissions`; `PUT /api/assignments/submissions/{submissionId}/grade` with `{grade,feedback}`.

## Campus documents / RAG
- Faculty/admin: multipart `POST /api/documents`, fields `title` and `file`; UTF-8 `.txt`, `.md`, `.csv` accepted.
- Authenticated: `GET /api/documents`, `GET /api/documents/search?q=...`.
- Admin: `DELETE /api/documents/{id}`.

## AI chat
- `POST /api/chat` with `{message}` returns `{answer,configured,sources}`.
- `GET /api/chat/history` returns the latest 100 turns for the signed-in user.
- `GET /api/health` and `GET /api/features` are public.
