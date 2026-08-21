# 🚀 Event Manager Dashboard (Enterprise Edition)

**Live Demo URL:** `http://184.192.101.168` *(Note: Automatically deployed via CI/CD to AWS EC2)*

A full-stack, enterprise-grade Event Management Dashboard built as per the assignment specifications. This project strictly follows the core requirements while significantly expanding upon the bonus objectives by implementing a robust CI/CD pipeline, Redis rate-limiting, comprehensive automated testing, and a fully Dockerized deployment strategy.

---

## 🛠 Tech Stack (Core Requirements Met)

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, ShadCN UI
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (using `pg` client)
- **Database Access:** **Raw SQL Queries Only** (No ORMs like Prisma or Sequelize used)
- **Architecture:** Clean monolithic repository with separate `/frontend` and `/backend` directories.
- **Communication:** REST API architecture.

---

## 🎯 Core Features Implemented

1. **Create Event Form**: Full form allowing users to create events with Event Name, Description, Date, and Location. Submitted via `POST /api/v1/events`.
2. **List Events**: Fetches and beautifully displays all events from the backend PostgreSQL database.
3. **Delete Event**: Actionable delete buttons on events. Calls `DELETE /api/v1/events/:id` and optimistically updates the UI.
4. **Event By ID**: Dedicated event detail pages fetching specific data by ID. Users can apply/register to events here.
5. **Owner Dashboard**: 
   - Event owners can see all participants registered to their events.
   - Owners can **cancel registrations**, strictly enforcing a mandatory **Cancellation Reason** (minimum 5 characters).

---

## ✨ Bonus Points Implemented

1. **Form Validation**: Strict validation via **Zod** on both the frontend (React Hook Form) and the backend Express middlewares to prevent invalid submissions.
2. **Filtering Events**: Real-time client-side debounced search (by Name) and dropdown filters (by Location and Date).
3. **Sort Events**: Sorting implemented to order events by date (Ascending/Descending).
4. **Edit Event**: Fully implemented `PUT /api/v1/events/:id` endpoint with a dedicated frontend Edit Form.
5. **API Error Handling**: Graceful error handling on the backend (Winston logging, Centralized Error Middleware) mapping to user-friendly toast notifications on the frontend.
6. **Authentication (Bonus of Bonus)**: 
   - Complete custom **JWT-based authentication** flow.
   - Passwords securely hashed using **bcrypt**.
   - HTTP Bearer token middleware protecting sensitive backend routes.

---

## 🚀 Advanced & Enterprise Features (Beyond the Assignment)

To demonstrate production-readiness, the following advanced features were built from scratch:

1. **Automated Testing (Jest & Supertest)**: 
   - E2E and Integration test suites written for Auth and Event routes.
   - Tests run in isolation against a dynamic PostgreSQL test database.
2. **Redis & Advanced Rate-Limiting**: 
   - Integrated **Redis** to power `express-rate-limit`.
   - Protects endpoints from DDoS and Brute Force attacks (e.g., max 5 login attempts per 15 minutes).
3. **Fully Dockerized Stack**:
   - `docker-compose.yml` orchestrates the Frontend, Backend, PostgreSQL, and Redis containers.
   - Custom `Dockerfile` for optimized Alpine-based Node.js builds.
4. **Automated CI/CD Pipeline (GitHub Actions)**:
   - Automated workflows run on every PR/push to `dev`, `staging`, and `prod`.
   - Automatically runs Type-checking, DB Migrations, and Jest tests.
5. **AWS EC2 Production Deployment**:
   - Fully deployed to a live AWS EC2 instance.
   - Push to the `prod` branch triggers a seamless SSH deployment, recreating stateless containers via Docker Compose.
   - **Nginx Reverse Proxy** configured to securely route traffic to the Frontend (port 3000) and Backend API (port 5000).

---

## 📂 Project Structure

```
├── .github/workflows/       # CI/CD Pipeline configurations
├── frontend/                # Next.js 14 Application
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route logic
│   │   ├── middlewares/     # Auth, Error, and Rate-Limit guards
│   │   ├── models/          # Raw SQL Queries
│   │   ├── routes/          # Express Routers
│   │   ├── config/          # DB, Redis, and Migration configurations
│   │   └── __tests__/       # Jest Automated Tests
├── docs/
│   └── system-design.md     # Detailed System Design Document
├── docker-compose.yml       # Local and Prod Container Orchestration
└── userdata.sh              # EC2 Initialization Script
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose

### 1. Start the Databases
```bash
# Spins up PostgreSQL and Redis locally
docker-compose up db redis -d
```

### 2. Backend Setup
```bash
cd backend
npm install

# Rename .env.example to .env or create one:
# PORT=5000
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=events_db
# DB_USER=postgres
# DB_PASSWORD=postgres
# JWT_SECRET=super_secret_jwt_key_that_is_at_least_32_chars_long
# REDIS_URL=redis://localhost:6379

# Run Database Migrations
npm run migrate

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

npm run dev
```

Visit `http://localhost:3000` to interact with the application. To run the automated tests, simply execute `npm run test` inside the `/backend` directory.

---

*System Design detailed in `docs/system-design.md`*
