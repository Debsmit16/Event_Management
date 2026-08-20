# Event Manager Dashboard

A full-stack, enterprise-grade Event Management Dashboard built with Next.js 14, Express.js, and PostgreSQL.

## Features

- **Event Management**: Create, edit, view, and delete events.
- **Participant Registration**: Users can apply to events seamlessly.
- **Owner Dashboard**: Event creators can view and manage their event participants.
- **Authentication**: Secure JWT-based authentication with bcrypt password hashing.
- **Optimized Rendering**: Server-Side Components and Debounced client-side filtering.
- **Enterprise Backend**: Raw SQL queries, Winston logging with request tracing, strict rate limiting, Zod validation, and robust error handling.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Node.js, Express.js, TypeScript, PostgreSQL (pg client)
- **Deployment Strategy**: AWS EC2, PM2, Nginx Reverse Proxy, Docker (for local DB)

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- Docker (for PostgreSQL)

### 1. Database Setup
```bash
# Start PostgreSQL via Docker (also runs the schema migration automatically)
docker-compose up -d
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
# DB_PASSWORD=postgres_password
# JWT_SECRET=your_secret_key_here

npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

npm run dev
```

Visit `http://localhost:3000`

## API Documentation

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/events` - Get all events (with pagination/search)
- `POST /api/events` - Create an event (Auth required)
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event (Auth required)
- `DELETE /api/events/:id` - Delete event (Auth required)
- `POST /api/events/:id/register` - Register for an event
- `GET /api/events/:id/participants` - Get event participants (Auth required)
- `PATCH /api/events/participants/:id/cancel` - Cancel a registration (Auth required)

## AWS Deployment Guide

This project is configured for a standard AWS EC2 deployment.
See the `docs/system-design.md` for architecture details.

1. Install Node.js, Nginx, and PM2 on EC2.
2. Clone repo and install dependencies.
3. Configure PostgreSQL (local to EC2 or RDS).
4. Build both frontend and backend (`npm run build`).
5. Start processes: `pm2 start ecosystem.config.js`
6. Copy `nginx/default.conf` to `/etc/nginx/sites-available/default` and restart Nginx.
