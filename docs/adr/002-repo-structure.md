# 002 – Repository Structure

## Status
2025-05-26

## Context
Le projet « Parking Reservation System » comporte :
- **Deux applications** :  
  - `parking-app-back` (NestJS)  
  - `parking-app-front` (Vue 3 + Vite)
- Du **code partagé** à venir : DTO, schémas validation, utils date, client API TS.
- Une **équipe unique** qui travaille en sprints très courts (½ journée).
- Exigence de **conteneurs** et d’un pipeline CI/CD unique.  

Approche proposée :

1. **Monorepo** (tout dans un même dépôt).

## Decision
Nous adoptons un **monorepo pnpm workspaces** à la racine, avec la convention :


````
software-architecture-heuristics/
├── apps/ # Applications déployables
│ ├── parking-app-back/
│ └── parking-app-front/
├── packages/ # Librairies partagées
│ ├── shared-dto/
│ └── shared-utils/
├── docs/ # ADR, C4, guides
├── .gitignore
├── pnpm-workspace.yaml
└── package.json # scripts racine
````


Outils associés :
- **pnpm** : gestion des dépendances + `workspaces`.
- Convention de branches : `main`, `feat/*`, `fix/*`, `chore/*`, `refactor/*`
- Un seul pipeline GitHub Actions pour lint ➔ test ➔ build ➔ docker.

## Consequences

### Avantages
1. **Cohérence** : un seul commit / PR peut toucher back & front atomiquement.
2. **Code partagé facile** : import type‐safe entre apps via `shared/`.
3. **CI/CD simplifiée** : un seul pipeline, un seul versioning sprint (tags `sprint-1`, `sprint-2`).
4. **Onboarding rapide** : un seul `git clone && pnpm install`.

### Inconvénients
1. Historique Git plus volumineux, nécessite une bonne discipline de branches.
2. Des scripts globaux peuvent casser toutes les apps si mal configurés.
