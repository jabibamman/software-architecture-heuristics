# 002 – Repository Structure

## Status
2025-05-26

## Context
The **Parking Reservation System** project consists of:
- **Two applications**:
  - `parking-app-back` (NestJS)
  - `parking-app-front` (Vue 3 + Vite)
- **Shared code** planned: DTOs, validation schemas, date utilities, TS API client.
- A **single team** working in very short sprints (half-day).
- Requirement for **containerization** and a unified CI/CD pipeline.

### Proposed approach
1. **Monorepo** (everything in one repository).

## Decision
We adopt a **pnpm workspaces monorepo** at the root, with the following convention:



````
software-architecture-heuristics/
├── apps/               # Deployable applications
│   ├── parking-app-back/
│   └── parking-app-front/
├── packages/           # Shared libraries
│   ├── shared-dto/
│   └── shared-utils/
├── docs/               # ADRs, C4 diagrams, guides
├── .gitignore
├── pnpm-workspace.yaml
└── package.json        # Root scripts
````

**Associated tools:**
- **pnpm**: dependency management + `workspaces`
- Branch naming conventions: `main`, `feat/*`, `fix/*`, `chore/*`, `refactor/*`
- A single GitHub Actions pipeline for lint → test → build → docker.

## Consequences

### Advantages
1. **Atomic changes**: a single commit/PR can affect both back and front together.
2. **Easy code sharing**: type-safe imports between apps via `shared/`.
3. **Simplified CI/CD**: one pipeline, one sprint versioning (tags `sprint-1`, `sprint-2`).
4. **Quick onboarding**: just `git clone && pnpm install`.

### Disadvantages
1. Larger Git history—requires disciplined branching.
2. Global scripts can break all apps if misconfigured.