# 001 - Framework Choice

## Status
2025-05-26

The team needs a full-stack web solution that:
- supports TypeScript end-to-end,
- is modular and testable for backend rules (parking constraints, check-in, etc.),
- offers a fast, modern front-end developer experience,
- easily runs in Docker and fits our skill set (TS background).

## Decision
- **Backend** : NestJS 11 (TypeScript)  
  Reasons : opinionated modules, DI, class-based validation, easy REST + WebSockets, TypeORM out-of-the-box, great testability.
- **Frontend** : Vue 3 + Vite + TypeScript + Pinia + Vue Router  
  Reasons : lightweight, composition API (fine-grained reactivity), fast HMR with Vite, Tailwind integration straightforward.
- **Language** : 100 % TypeScript (monorepo)  
  Ensures shared DTOs, avoids context-switch between front/back.

## Consequences
- Single language across stack → reduced cognitive load.  
- Need to onboard team members unfamiliar with NestJS and Vue 3.  
- We leverage existing NestJS CLIs for code generation and testing.  
- Build chain is Node-centric → OK for Docker but requires official Node images.
