# Parking Reservation App (Software Architecture Heuristics)

This is a monorepo containing a parking reservation system.  
It is a student project used to apply and demonstrate clean architecture patterns and software engineering heuristics.

## 🧠 Project Structure

- **Backend**: NestJS app (inside `apps/parking-app-back`) with REST API
- **Frontend**: Vue 3 app (inside `apps/parking-app-front`) using TypeScript + TailwindCSS
- **Database**: PostgreSQL (via Docker)

## 🚀 Quick Start

The easiest way to launch the full stack (frontend + backend + PostgreSQL) is with the `start.sh` script:

```bash
./start.sh
```

This will:

1. Start the database using Docker
2. Install dependencies using `pnpm`
3. Launch both the backend and frontend in development mode

## 🔧 Manual Start (alternative)

If you prefer doing it manually:

```bash
pnpm install

# Start the database
docker compose up -d postgres

# In one terminal
pnpm dev:back

# In another terminal
pnpm dev:front
```

## 🛠️ Scripts

In the root `package.json`, the most useful scripts are:

```json
{
  "dev:back": "pnpm --filter parking-app-back start:dev",
  "dev:front": "pnpm --filter parking-app-front dev",
  "dev:back-front": "docker compose up -d postgres && concurrently \"pnpm dev:back\" \"pnpm dev:front\""
}
```

## 📦 Dependencies

- Node.js 18+
- pnpm
- Docker (for PostgreSQL)

Enjoy 🅿️🚗!
