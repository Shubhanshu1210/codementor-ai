CodeMentor AI

AI-powered code review platform that analyzes source code using Google
Gemini and provides focused, actionable engineering feedback.

Live Demo: https://codementor-ai-dtsb.onrender.com\
GitHub: https://github.com/Shubhanshu1210/codementor-ai

Overview

CodeMentor AI is a full-stack AI-powered code review application built
with Java, Spring Boot, React, PostgreSQL, and Google Gemini.

Users can securely register and log in, submit source code through a
Monaco-based editor, and receive AI-generated feedback covering bugs,
code smells, performance, security, and best practices.

Each review receives an overall code-quality score from 0 to 10 and
is stored in PostgreSQL so users can view their review history later.

Features

JWT-based authentication

BCrypt password hashing

Real Google Gemini AI code analysis

Monaco Editor for source-code input

Multiple programming language support

Bug detection

Code smell analysis

Performance analysis

Security recommendations

Best-practice recommendations

Overall code-quality score from 0--10

Review history

Protected review details

PostgreSQL persistence

Swagger/OpenAPI documentation

Production deployment with Render

Responsive React interface

How It Works

User
  |
  v
React + Vite Frontend
  |
  | JWT Authentication
  v
Spring Boot REST API
  |
  +--------------> PostgreSQL
  |                  |
  |                  +-- Users, code files, reviews
  |
  v
Google Gemini API
  |
  v
AI Code Analysis
  |
  +-- Bug Detection
  +-- Code Smells
  +-- Performance
  +-- Security
  +-- Best Practices
  |
  v
Review Score + Feedback
  |
  v
React Review Details

Technology Stack

Backend

Java 21

Spring Boot 3.5.4

Spring Security

JWT / JJWT

Spring Data JPA

PostgreSQL

Google Gemini REST API

Swagger / OpenAPI

RestTemplate

Frontend

React

TypeScript

Vite

React Router

Axios

Tailwind CSS

Monaco Editor

Deployment

Render Web Service --- Spring Boot backend

Render Static Site --- React frontend

Render PostgreSQL --- database

GitHub --- source control and deployment

Project Structure

codementor-ai/
|
+-- src/
|   +-- main/
|       +-- java/              # Spring Boot backend
|       +-- resources/
|           +-- application.yaml
|
+-- frontend/
|   +-- src/
|       +-- api/               # API services
|       +-- auth/              # Authentication state
|       +-- components/        # Shared UI components
|       +-- pages/             # Application pages
|       +-- types/             # TypeScript types
|       +-- styles/            # Global styles
|   +-- package.json
|   +-- vite.config.ts
|
+-- pom.xml
+-- mvnw
+-- mvnw.cmd
+-- Dockerfile
+-- .env.example
+-- README.md

Live Application

Frontend: https://codementor-ai-dtsb.onrender.com

Backend API: https://codementor-ai-api.onrender.com

Swagger UI (local): http://localhost:8080/swagger-ui/index.html

Configuration

Never commit real credentials or .env files to GitHub.

Backend Environment Variables

DB_PASSWORD=your-local-postgres-password
JWT_SECRET=your-long-random-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.5-flash

Production also uses:

DATABASE_HOST=your-database-host
DATABASE_PORT=5432
DATABASE_NAME=your-database-name
DATABASE_USERNAME=your-database-username
FRONTEND_URL=https://your-frontend.onrender.com

GEMINI_MODEL defaults to gemini-3.5-flash.

The backend configuration is located at:

src/main/resources/application.yaml

Frontend Environment Variable

Local:

VITE_API_BASE_URL=http://localhost:8080

Production:

VITE_API_BASE_URL=https://codementor-ai-api.onrender.com

VITE_* variables are exposed to the browser. Never place database
passwords, JWT secrets, or Gemini API keys in frontend environment
variables.

Run Locally

Prerequisites

Java 21

Node.js and npm

PostgreSQL

Google Gemini API key

1. Clone the Repository

git clone https://github.com/Shubhanshu1210/codementor-ai.git
cd codementor-ai

2. Create PostgreSQL Database

CREATE DATABASE codementor;

3. Configure Backend

PowerShell:

$env:DB_PASSWORD = "your-local-postgres-password"
$env:JWT_SECRET = "your-long-random-jwt-secret"
$env:GEMINI_API_KEY = "your-gemini-api-key"
$env:GEMINI_MODEL = "gemini-3.5-flash"
$env:FRONTEND_URL = "http://localhost:5173"

Start Spring Boot:

.\mvnw.cmd spring-boot:run

Backend runs at:

http://localhost:8080

4. Start the Frontend

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173

API

Authentication

Register

POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Developer",
  "email": "jane@example.com",
  "password": "password123"
}

Login

POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password123"
}

Successful authentication returns a JWT response containing token,
message, and email.

Code Reviews

Submit Code

POST /api/review/submit
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "fileName": "Example.java",
  "language": "java",
  "code": "public class Example {}"
}

The backend sends submitted code to Google Gemini for analysis and
stores the resulting review in PostgreSQL.

Review History

GET /api/review/history
Authorization: Bearer <JWT>

Returns reviews belonging to the authenticated user.

Review Details

GET /api/review/{id}
Authorization: Bearer <JWT>

Users can access only their own stored reviews.

Testing

Backend Tests

.\mvnw.cmd clean test

Frontend Production Build

cd frontend
npm run build

Security

JWT authentication protects private API endpoints.

Passwords are hashed using BCrypt.

JWT secrets are provided through environment variables.

Gemini API credentials remain backend-only.

Frontend VITE_* variables are public.

Database credentials are never stored in source code.

.env files are excluded from Git.

CORS is restricted to configured frontend origins.

OPTIONS preflight requests are explicitly supported.

Users can access only their own review history and review details.

No API keys, passwords, JWT secrets, or database credentials are
committed to the repository.

Deployment

The application is deployed using Render.

Backend

GitHub Repository
       |
       v
Render Web Service
       |
       v
Spring Boot + Java 21
       |
       +-- PostgreSQL
       |
       +-- Google Gemini API

Frontend

GitHub Repository
       |
       v
Render Static Site
       |
       v
React + Vite

The production frontend communicates with:

https://codementor-ai-api.onrender.com

Future Improvements

Support for additional programming languages

Streaming AI review responses

Side-by-side code and review interface

Review filtering and search

Improved review scoring

Code diff visualization

GitHub repository integration

Automated code review through pull requests

User profile and review analytics

CI/CD automated testing

Author

Shubhanshu Kumar

Full-Stack Developer | Java | Spring Boot | React | PostgreSQL | AI
Integration

License

This project is intended for learning, portfolio, and demonstration
purposes.
