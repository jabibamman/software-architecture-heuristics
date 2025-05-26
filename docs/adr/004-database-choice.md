# 004 – Database Choice (PostgreSQL + TypeORM)

## Status  
2025-05-26

---

## Context  
Le Parking Reservation System nécessite une base de données relationnelle capable de :

1. Stocker les **réservations** (avec clé composite : `slotId` + `dateRange`) et leur **historique** complet.  
2. Gérer les **utilisateurs** (employés, secrétaires, managers) et leurs **rôles**.  
3. Assurer la **cohérence transactionnelle** (ex. création + publication MQ).  
4. Prendre en charge de **l’évolution du schéma** (migrations) au fil des sprints.

Critères évalués :

- Maturité et support de TypeScript  
- Intégration avec NestJS  
- Outils de migration / seed  
- Performance & fiabilité en local et production  
- Courbe d’apprentissage pour l’équipe  

---

## Decision  
Nous choisissons **PostgreSQL** comme SGBD et **TypeORM** comme ORM.

### Pourquoi PostgreSQL ?  
- **Relationnel mature** : transactions ACID, clés composites, contraintes d’intégrité.  
- **JSON & indexes** : flexibilité pour stocker des métadonnées (ex. `metadata` de réservation).  
- **Outils de migration** : `typeorm` migration CLI ou `typeorm-migrations` intégrées.  
- **Communauté & fiabilité** : largement adopté en entreprise et open-source.

### Pourquoi TypeORM ?  
- **Intégration native avec NestJS** via `@nestjs/typeorm`.  
- **Modèles entité-relation** en TypeScript (decorators).  
- **Data Mapper & Active Record** selon besoin.  
- **Support des migrations** : génération automatique et CLI robuste.  
- **Large écosystème** : support de transactions et de requêtes avancées.

---

## Consequences

### Avantages  
- **Productivité** : scaffolding rapide (`Entity`, `Repository`, `Module`).  
- **Migrations** automatisées pour suivre l’évolution du modèle.  
- **Type-safety** end-to-end sur les entités et relations.  
- **Maintenance** facilitée grâce à la documentation et aux types.

### Inconvénients  
- **Performance** : overhead de l’ORM sur de très gros volumes (mais notre charge est modérée).  
- **Courbe d’apprentissage** : certains patterns TypeORM (lazy relations, QueryBuilder) demandent de l’entraînement.  
- **Configurabilité** : configuration parfois verbeuse (options de connexion, entités, migrations).

---

## Actions suivantes  
1. Ajouter le module `DatabaseModule` dans `apps/parking-app-back/src` :  
   ```ts
   TypeOrmModule.forRootAsync({ /* config PostgreSQL via .env */ })

2. Créer les premières entités migrées :

- Reservation (clé slotId + startDate + endDate)

- User (id, email, role)

3. Générer et tester une migration initiale :

`pnpm --filter parking-app-back run typeorm migration:generate -n InitSchema`

`pnpm --filter parking-app-back run typeorm migration:run`

4. Documenter la stratégie de seed (données de test pour parking slots A-F).

5. Mettre en place un job CI pour valider la migration automatique en pipeline.