# CampusConnect AI

AI-assisted campus management system built with React + Vite, Spring Boot, Spring Security/JWT, and MySQL.

## Included in this source package

- React + TypeScript frontend
- Spring Boot REST API
- User registration and login with JWT
- Roles: `STUDENT`, `FACULTY`, `ADMIN`
- Course CRUD endpoints with authorization
- AI chat endpoint compatible with OpenAI-style APIs (including OmniRoute when configured)
- MySQL schema initialization through Spring Boot/JPA
- Docker Compose for local deployment
- Environment-variable examples and GitHub-ready `.gitignore`

This is a runnable foundation, not a claim that every syllabus feature is already implemented. Attendance, assignments/submissions, full RAG document ingestion/vector retrieval, comprehensive tests, and production-grade refresh-token/session management remain planned extensions.

## Requirements

- Java 21
- Maven 3.9+
- Node.js 20+
- MySQL 8.0+ (or Docker Desktop)
- Git

## Option A — run with Docker

1. Copy `.env.example` to `.env`.
2. Set strong values for `JWT_SECRET` and the database password. Add your AI provider key if using chat.
3. Run:

   ```powershell
   docker compose up --build
   ```

4. Open `http://localhost:5173`.
5. API health: `http://localhost:8080/api/health`.

The Compose setup exposes MySQL on port 3307 on the host to avoid clashing with a locally installed MySQL service. The backend connects to the Compose service name `mysql`.

## Option B — VS Code + locally installed MySQL

### 1. Create the database

Open MySQL Workbench and execute:

```sql
CREATE DATABASE campusconnect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'campus_app'@'localhost' IDENTIFIED BY 'change_this_password';
GRANT ALL PRIVILEGES ON campusconnect.* TO 'campus_app'@'localhost';
FLUSH PRIVILEGES;
```

If you already use a database account, substitute its username/password in the environment variables.

### 2. Start the backend

In PowerShell:

```powershell
cd backend
$env:DB_URL="jdbc:mysql://localhost:3306/campusconnect?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="campus_app"
$env:DB_PASSWORD="change_this_password"
$env:JWT_SECRET="replace-with-a-random-secret-at-least-32-characters-long"
$env:FRONTEND_ORIGIN="http://localhost:5173"
$env:AI_BASE_URL="http://localhost:20128/v1"
$env:AI_API_KEY="your-provider-key"
$env:AI_MODEL="your-provider-model"
mvn spring-boot:run
```

`AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL` are only required for live AI responses. If not configured, the chat endpoint returns a clear configuration message.

### 3. Start the frontend

Open a second VS Code terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Visit `http://localhost:5173`.

## First use

- Register a user through the UI.
- New registrations receive the `STUDENT` role.
- To create courses, a user must have `FACULTY` or `ADMIN`.
- For a local development admin, update a registered user's role directly in MySQL Workbench:

  ```sql
  UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
  ```

  Log out and log in again so the new role is reflected in the JWT.

Do not expose a public role-selection field during registration. Never commit production credentials or `.env`.

## API overview

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/courses` | Authenticated |
| GET | `/api/courses/{id}` | Authenticated |
| POST | `/api/courses` | Faculty/Admin |
| PUT | `/api/courses/{id}` | Faculty/Admin |
| DELETE | `/api/courses/{id}` | Admin |
| POST | `/api/chat` | Authenticated |

Send `Authorization: Bearer <token>` for authenticated requests.

## Deployment notes

- Frontend and backend should be deployed as separate services or behind a reverse proxy.
- Set `VITE_API_BASE_URL` to the public backend URL at frontend build time.
- Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `FRONTEND_ORIGIN`, and AI variables in the backend host's secret/environment settings.
- Never use `localhost` as the AI provider URL in a cloud deployment unless the provider runs inside the same network namespace. A laptop-local OmniRoute URL will not be reachable from a cloud-hosted backend.
- Use managed MySQL or a persistent database volume for deployment.
- Configure HTTPS and a strong, randomly generated JWT secret before exposing the application publicly.
- Set `SPRING_JPA_HIBERNATE_DDL_AUTO=validate` after introducing versioned Flyway/Liquibase migrations; this starter uses `update` for development convenience.

## GitHub

```powershell
git init
git add .
git status
git commit -m "Initial CampusConnect AI source"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CampusConnectAI.git
git push -u origin main
```

Check `git status` before committing. `.env`, build output, dependencies, and secrets are ignored.


## Expanded syllabus modules

The expanded version adds:

- **Enrollment**: `GET/POST/DELETE /api/enrollments`, plus faculty/admin roster at `/api/enrollments/course/{courseId}`.
- **Attendance**: student `GET /api/attendance` and `/summary`; faculty/admin can mark or update records with `POST /api/attendance` and inspect `/api/attendance/course/{courseId}`.
- **Assignments**: `GET/POST /api/assignments`, `PUT/DELETE /api/assignments/{id}`; students submit at `POST /api/assignments/{id}/submissions`, view `/api/assignments/submissions/mine`; faculty/admin review and grade submissions.
- **Campus documents and RAG**: faculty/admin upload text, Markdown, or CSV files using `POST /api/documents` as multipart form data (`title`, `file`); authenticated users can list documents and search via `/api/documents/search?q=...`; admin deletes with `DELETE /api/documents/{id}`.
- **AI chat history**: `POST /api/chat`, `GET /api/chat/history`. Retrieved document chunks are added to the system context when the configured OpenAI-compatible model is called.
- **API documentation**: `/swagger-ui.html` (requires authentication in this configuration).

### RAG implementation boundary

This edition persists documents and overlapping text chunks in MySQL. If `AI_EMBEDDING_MODEL` is configured and the selected OpenAI-compatible provider supports `/embeddings`, it stores chunk vectors and ranks them with cosine similarity; otherwise it falls back to lexical term overlap. The top chunks are injected into the LLM prompt. This is a small-dataset educational RAG implementation, not a dedicated vector database; for larger corpora use a vector store such as Qdrant or pgvector. PDF/DOCX extraction is not enabled; upload UTF-8 `.txt`, `.md`, or `.csv` files. Never upload confidential student records as general knowledge documents.

### Role workflows

- Register through the UI; public registration always assigns `STUDENT`.
- To promote a faculty/admin account for local development, run in MySQL Workbench:
  `UPDATE users SET role = 'FACULTY' WHERE email = 'faculty@example.com';`
  or `UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';`
- Sign out and sign in again after changing a role so the JWT reflects the updated role.
- Faculty/admin create courses and assignments. Students enroll in courses, submit assignments, and view attendance. Faculty/admin mark attendance for enrolled students and grade submissions.

### Build and verification

Run backend tests with `cd backend; mvn test`. Run frontend production build with `cd frontend; npm install; npm run build`. The source package was expanded but has not been compiled or integration-tested in this environment; run these commands locally and resolve any environment-specific errors before deployment. For production, configure strong secrets, HTTPS, managed/persistent MySQL, migrations, rate limiting, backups, and a reachable AI endpoint. The default Hibernate `update` setting is for development, not production schema governance.


### Performance and observability

Course list/detail responses use Spring cache annotations and writes evict affected caches. Spring Boot Actuator health/info endpoints are enabled. `GET /api/courses/page?page=0&size=10&sortBy=createdAt&direction=desc` demonstrates validated pagination and sorting. `@EnableAsync` is enabled for future background jobs; request-critical document indexing remains synchronous so an upload is searchable when the API returns. Logging is handled by Spring Boot Logback defaults.


Security-relevant module operations also emit asynchronous audit log entries through Spring `@Async`; these are application logs, not a tamper-proof audit ledger.
