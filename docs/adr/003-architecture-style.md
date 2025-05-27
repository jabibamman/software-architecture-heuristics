# 003 – Architecture Style (Hexagonal + DDD + Use Cases)

## Status  
2025-05-26

---

## Context  
The **Parking Reservation** system must:

1. **Enforce strict business rules – SUPER IMPORTANT**  
   - Maximum duration: **5 working days** for employees, **30 days** for managers.  
   - **Check-in** required before **11 AM**; otherwise, the spot is released.  
   - Rows **A/F** reserved for **electric** or **hybrid** vehicles (wall chargers).  
   - **Complete history** of all reservations and their state changes.

2. **Expose multiple entry points**:  
   - **REST API** for the Vue 3 front-end.  
   - **QR code endpoint** `/checkin/:slotId/:token`.  
   - **RabbitMQ** to publish the `ReservationCreated` event to the email service.

3. **Remain testable & extensible**: switching the database, UI, or adding a heuristic engine must not affect the domain layer.

4. **Be educational**: every team member (and the professor) should quickly locate business rules or ports in the code.

> **Team note:** We have intentionally omitted **CancelReservation** from the MVP to maintain a deliverable scope within 4 sprints.
---

## Decision  
We adopt a **Hexagonal Architecture** (Ports & Adapters) combined with **Domain-Driven Design (DDD)**.  
Business rules reside in the **domain**; **Use Cases** orchestrate these rules through **Ports**; adapters (HTTP, DB, MQ, Cron) implement these ports.

### Layer breakdown

| Layer             | Contents                                                                           | Allowed dependencies              |
|-------------------|------------------------------------------------------------------------------------|-----------------------------------|
| **Domain**        | Entities, Value Objects, Domain Events, Exceptions                                 | **No** external libraries         |
| **Application**   | Use Cases, DTOs, Ports (`ReservationRepository`, `NotificationPublisher`)          | Depends only on Domain            |
| **Infrastructure**| Conrete implementations of ports (TypeORM, AMQP, QR Code), ORM mappers             | Depends on Application + external libs |
| **Interface**     | Driving adapters: HTTP controllers, guards, Cron job "11 AM rule"                  | Depends on Application            |

---

## Target modules (backend NestJS)

```
src/modules
├─ reservations
│  ├─ domain
│  │  ├─ entities/
│  │  │  ├─ Reservation.ts
│  │  │  └─ ParkingSlot.ts
│  │  ├─ value-objects/
│  │  │  ├─ DateRange.ts
│  │  │  └─ SlotId.ts
│  │  ├─ events/
│  │  │  ├─ reservation-created.event.ts
│  │  │  ├─ reservation-checkedin.event.ts
│  │  │  └─ reservation-released.event.ts
│  │  └─ exceptions/
│  │     └─ ReservationTooLong.exception.ts
│  │
│  ├─ application
│  │  ├─ dto/
│  │  │  ├─ CreateReservation.dto.ts
│  │  │  └─ ReservationResponse.dto.ts
│  │  ├─ ports/
│  │  │  ├─ reservation.repository.port.ts
│  │  │  └─ notification.publisher.port.ts
│  │  └─ use-cases/
│  │     ├─ create-reservation.use-case.ts
│  │     ├─ checkin-reservation.use-case.ts
│  │     └─ release-expired.use-case.ts
│  │
│  ├─ infrastructure
│  │  ├─ repositories/
│  │  │  └─ typeorm-reservation.repository.ts
│  │  └─ adapters/
│  │     └─ amqp-notification.adapter.ts
│  │
│  └─ interface
│     ├─ http/
│     │  └─ reservation.controller.ts
│     └─ cron/
│        └─ release-expired.job.ts
│
├─ users
│  ├─ domain
│  │  ├─ entities/
│  │  │  └─ User.ts
│  │  └─ exceptions/
│  │     └─ UserNotFound.exception.ts
│  │
│  ├─ application
│  │  ├─ dto/
│  │  │  ├─ CreateUser.dto.ts
│  │  │  └─ UserResponse.dto.ts
│  │  ├─ ports/
│  │  │  └─ user.repository.port.ts
│  │  └─ use-cases/
│  │     ├─ register-user.use-case.ts
│  │     └─ get-user.use-case.ts
│  │
│  └─ infrastructure
│     └─ repositories/
│        └─ typeorm-user.repository.ts
│
├─ auth
│  ├─ application
│  │  ├─ dto/
│  │  │  ├─ Login.dto.ts
│  │  │  └─ TokenResponse.dto.ts
│  │  ├─ ports/
│  │  │  └─ auth.service.port.ts
│  │  └─ use-cases/
│  │     ├─ login.use-case.ts
│  │     └─ refresh-token.use-case.ts
│  │
│  ├─ infrastructure
│  │  └─ jwt/
│  │     └─ jwt-adapter.ts
│  │
│  └─ interface
│     └─ http/
│        └─ auth.controller.ts
│
├─ stats
│  ├─ application
│  │  └─ use-cases/
│  │     └─ get-parking-stats.use-case.ts
│  │
│  └─ interface
│     └─ http/
│        └─ stats.controller.ts
│
└─ notifications
   ├─ application
   │  └─ use-cases/
   │     └─ send-notification.use-case.ts
   │
   └─ infrastructure
      └─ adapters/
         └─ amqp-notification.adapter.ts
```

---

## Front-end architecture (Vue 3 + Vite)
```
apps/parking-app-front
├─ public
│ └─ index.html
├─ src
│ ├─ assets/
│ ├─ components/
│ ├─ views/
│ ├─ router/
│ ├─ store/
│ ├─ services/
│ ├─ composables/
│ └─ main.ts 
└─ vite.config.ts
```

- **Tailwind CSS** for utility-first styling.  
- **Pinia** for centralized state (filter slots, manage user).  
- **Vue Router** for Employee/Secretary/Manager views.  
- **Services** to consume the NestJS API and handle JWT tokens.

---

## Use Cases MVP

| Use Case                    | Business rules enforced                                                      | Ports used                              |
|-----------------------------|-------------------------------------------------------------------------------|-----------------------------------------|
| **CreateReservation**       | Duration ≤ 5 days (≤ 30 days if manager), A/F slot if charging needed, availability | `ReservationRepository`<br>`NotificationPublisher` |
| **CheckinReservation**      | Must occur before 11 AM; otherwise, action fails                              | `ReservationRepository`                 |
| **ReleaseExpiredReservations** | Cron at 11 AM: release all non-checked-in reservations; publish `ReservationReleased` | `ReservationRepository`<br>`NotificationPublisher` |

---

## Consequences

### Advantages
- **Fast unit testing** of Domain & Application layers, without I/O.  
- **Low coupling**: DB, MQ, or UI can change without impacting the domain.  
- **Educational clarity**: each business rule has an explicit Use Case.  
- **Path to microservices**: easily extract adapters into separate services.

### Disadvantages
- **Organizational overhead**: four layers plus separate front & back.  
- **Strict discipline**: business logic must not be in HTTP controllers.  
- **DDD learning curve** for newcomers.

---