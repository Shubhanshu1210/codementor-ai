# CodeMentor AI

CodeMentor AI is an AI-powered code review application. It combines a Java/Spring Boot backend with a React/Vite frontend to analyze submitted source code using Google's Gemini API and present focused engineering feedback.

Implemented capabilities include:

- JWT-authenticated user registration and login
- BCrypt password hashing
- Gemini-powered code review analysis
- PostgreSQL persistence for submitted files and reviews
- Monaco Editor for source-code input
- Review history and protected review details
- Analysis of bugs, code smells, performance, security, and best practices
- Overall code-quality scoring from 0 to 10
- Swagger/OpenAPI documentation

## Technology Stack

### Backend

- Java 21
- Spring Boot 3.5.4
- Spring Security
- JWT with JJWT
- Spring Data JPA
- PostgreSQL
- Gemini REST API
- Swagger/OpenAPI
- RestTemplate

### Frontend

- React
- Vite
- TypeScript
- React Router
- Axios
- Tailwind CSS
- Monaco Editor

## Project Structure

```text
codementor-ai/
├── src/                 # Spring Boot backend
├── frontend/            # React/Vite frontend
├── pom.xml
├── mvnw
├── mvnw.cmd
└── .env.example
```

## Configuration

Do not commit `.env` files or real credentials. Copy the root `.env.example` to a local environment configuration and provide values through your shell or local environment tooling.

Required backend variables:

```text
DB_PASSWORD=your-local-postgres-password
JWT_SECRET=your-long-random-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.5-flash
```

The backend reads these values from [application.yaml](src/main/resources/application.yaml). `GEMINI_MODEL` defaults to `gemini-3.5-flash` when it is not set.

The frontend uses the public browser variable below in `frontend/.env.example`:

```text
VITE_API_BASE_URL=http://localhost:8080
```

`VITE_*` values are exposed to the browser. Never put database credentials, JWT secrets, Gemini API keys, or other private values in frontend environment files.

## Run Locally

### Prerequisites

- Java 21
- Node.js and npm
- PostgreSQL 18 or a compatible PostgreSQL version
- A PostgreSQL database named `codementor`
- Backend environment variables configured

### Backend

Start PostgreSQL and create the database if it does not already exist:

```sql
CREATE DATABASE codementor;
```

From the repository root, configure the required environment variables and start Spring Boot:

```powershell
$env:DB_PASSWORD = "your-local-postgres-password"
$env:JWT_SECRET = "your-long-random-jwt-secret"
$env:GEMINI_API_KEY = "your-gemini-api-key"
$env:GEMINI_MODEL = "gemini-3.5-flash"
.\mvnw.cmd spring-boot:run
```

The backend runs at `http://localhost:8080`.

### Frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend at:

```text
http://localhost:5173
```

The backend CORS configuration allows `localhost:5173` and `localhost:3000`.

## Tests and Build

Run backend tests from the repository root:

```powershell
.\mvnw.cmd clean test
```

Build the frontend:

```powershell
cd frontend
npm run build
```

## API

The backend base URL is `http://localhost:8080`.

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json
```

Request body:

```json
{
  "name": "Jane Developer",
  "email": "jane@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

Both successful authentication endpoints return a JWT response containing `token`, `message`, and `email`.

### Reviews

#### Submit code for review

```http
POST /api/review/submit
Authorization: Bearer <JWT>
Content-Type: application/json
```

Request body:

```json
{
  "fileName": "Example.java",
  "language": "java",
  "code": "public class Example {}"
}
```

#### Review history

```http
GET /api/review/history
Authorization: Bearer <JWT>
```

#### Review details

```http
GET /api/review/{id}
Authorization: Bearer <JWT>
```

All review endpoints require the authenticated user's JWT in the `Authorization` header. Users can access only their own stored reviews.

Swagger UI is available at `http://localhost:8080/swagger-ui/index.html` when the backend is running.

## Security Notes

- Secrets are supplied through environment variables and must never be committed.
- API keys, JWTs, passwords, and database credentials must not be added to source code or documentation.
- Frontend `VITE_*` variables are public to the browser; keep Gemini credentials backend-only.
- Do not commit `.env` files.
- Local PostgreSQL credentials should remain outside the repository.
