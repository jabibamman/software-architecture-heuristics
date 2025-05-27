# 004 – Database Choice (PostgreSQL + TypeORM)

## Status  
2025-05-26

---

## Context  
The Parking Reservation System requires a relational database that can:

1. Store **reservations** (with composite key: `slotId` + `dateRange`) and their **complete history**.  
2. Manage **users** (employees, secretaries, managers) and their **roles**.  
3. Ensure **transactional consistency** (e.g., creation + MQ publication).  
4. Handle **schema evolution** (migrations) across sprints.

### Evaluation criteria:
- Maturity and TypeScript support  
- Integration with NestJS  
- Migration/seed tools  
- Performance & reliability (local and production)  
- Learning curve for the team  

---

## Decision  
We choose **PostgreSQL** as the DBMS and **TypeORM** as the ORM.

### Why PostgreSQL?  
- **Mature relational database**: ACID transactions, composite keys, integrity constraints.  
- **JSON & indexing**: flexibility for storing metadata (e.g., reservation metadata).  
- **Migration tools**: built-in TypeORM migration CLI or integrated extensions.  
- **Community & reliability**: widely adopted in enterprise and open-source.

### Why TypeORM?  
- **Native NestJS integration** via `@nestjs/typeorm`.  
- **TypeScript entity-relational models** (decorators).  
- **Data Mapper & Active Record patterns** as needed.  
- **Migration support**: automatic generation and robust CLI.  
- **Ecosystem maturity**: supports transactions and complex queries.

---

## Consequences

### Advantages  
- **Productivity**: quick scaffolding of `Entity`, `Repository`, `Module`.  
- **Automated migrations** to track model evolution.  
- **End-to-end type safety** on entities and relations.  
- **Simplified maintenance** thanks to documentation and strong typing.

### Disadvantages  
- **Performance overhead** of the ORM on very large volumes (our load is moderate).  
- **Learning curve**: some TypeORM patterns (lazy relations, QueryBuilder) require practice.  
- **Configuration verbosity**: sometimes verbose setup (connection options, entities, migrations).

---
