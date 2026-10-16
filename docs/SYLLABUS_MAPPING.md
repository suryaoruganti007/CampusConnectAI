# Syllabus coverage map

| Syllabus area | Project implementation |
|---|---|
| React, Vite, JSX, props/state, responsive UI | `frontend/src` (React + TypeScript + Vite) |
| Client/server architecture, REST, HTTP methods, Axios | `frontend/src/api/client.ts`; Spring REST controllers under `backend/src/main/java/com/campusconnect` |
| CRUD, DTOs, services/repositories, dependency injection | `course`, `assignment`, `auth`, `attendance`, `enrollment` packages |
| MySQL relational database, JPA | `User`, `Course`, `Enrollment`, `AttendanceRecord`, `Assignment`, `Submission`, document/chat entities |
| Validation and error handling | Jakarta Bean Validation DTO constraints; `common/ApiExceptionHandler.java` |
| Registration, login, roles, JWT, BCrypt, protected UI | `auth`, `security`, `user`; React auth context and protected routes |
| One-to-many/many-to-one relational modelling | Course-to-enrollment/attendance/assignment/submission/document relationships; enrollment unique constraint |
| AI chat and prompt/context injection | `chat/ChatService.java` |
| RAG ingestion, chunking, retrieval, context augmentation | `rag/RagService.java`, `DocumentController.java`; MySQL chunks are retrieved by cosine similarity when an embedding model is configured, otherwise lexical overlap |
| Pagination/sorting | `GET /api/courses/page` |
| Caching | `@Cacheable` and `@CacheEvict` on course service; enabled in application |
| Asynchronous processing foundation | `@EnableAsync` enabled; current request-critical ingestion remains synchronous |
| Logging and health | Spring Boot Logback defaults; Actuator health/info |
| Unit/integration testing | JUnit test suite and H2-backed Spring MVC integration tests under `backend/src/test` |
| Docker/containerization | `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml` |
| API docs, GitHub, deployment | Springdoc OpenAPI, root README, `.gitignore`, environment examples |

## Explicit implementation boundaries

This is a syllabus-oriented complete academic project, not a production-ready enterprise campus ERP. RAG supports dense embedding vectors and cosine similarity when `AI_EMBEDDING_MODEL` is configured, with lexical fallback when embeddings are unavailable. Document ingestion accepts UTF-8 text/Markdown/CSV rather than PDF/DOCX. The project does not include payments, timetable scheduling, notifications/email, file storage for arbitrary binary submissions, or a production migration strategy. Add those only if they are required by your course rubric. Production deployment should use a schema migration tool, stricter resource ownership checks, rate limiting, audit logs, backup/restore testing, and managed secrets.
