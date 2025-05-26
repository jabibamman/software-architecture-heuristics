# 003 – Architecture Style (Hexagonal + DDD + Use Cases)

## Status  
2025-05-26

---

## Context  
Le système **Parking Reservation** doit :

1. **Faire respecter des règles métiers strictes – SUPER IMPORTANT**  
   - Durée maximale : **5 jours ouvrés** pour les employés, **30 jours** pour les managers.  
   - **Check-in** obligatoire avant **11 h** ; à défaut, la place est libérée.  
   - Rang **A/F** réservé aux véhicules **électriques** ou **hybrides** (prises murales).  
   - **Historisation complète** de toutes les réservations et de leurs états.

2. **Exposer plusieurs points d’entrée** :  
   - API **REST** pour le front Vue 3.  
   - Endpoint **QR Code** `/checkin/:slotId/:token`.  
   - **RabbitMQ** pour publier l’événement `ReservationCreated` vers le service d’e-mail.

3. **Rester testable & évolutif** : changer de SGBD, d’UI ou greffer un moteur heuristique ne doit pas toucher au domaine.

4. **Être pédagogique** : chaque membre (et le professeur) doit retrouver rapidement où se loge une règle ou un port.

> **Note d’équipe :** nous avons volontairement laissé **CancelReservation** hors MVP afin de garantir un périmètre livrable en 4 sprints.

---

## Decision  
Nous adoptons une **architecture hexagonale** (Ports & Adapters) couplée à **Domain-Driven Design (DDD)**.  
Les règles vivent dans le **domaine** ; les **Use Cases** orchestrent ces règles via des **Ports** ; les adaptateurs (HTTP, DB, MQ, Cron) implémentent ces ports.

### Découpage des couches

| Couche             | Contenu                                                                           | Dépendances autorisées         |
|--------------------|-----------------------------------------------------------------------------------|--------------------------------|
| **Domain**         | Entités, Value Objects, Domain Events, Exceptions                                 | **Aucune** lib externe         |
| **Application**    | Use Cases, DTOs, Ports (`ReservationRepository`, `NotificationPublisher`)         | Dépend uniquement de Domain    |
| **Infrastructure** | Implémentations concrètes des ports (TypeORM, AMQP, QR Code), mappers ORM         | Application + libs externes    |
| **Interface**      | Adapters driving : contrôleurs HTTP, guards, Cron job « 11 h rule »                | Dépend d’Application           |

---

## Modules cibles (backend NestJS)


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

## Architecture front (Vue 3 + Vite)
````
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

- **Tailwind CSS** pour le styling utilitaire.  
- **Pinia** pour l’état centralisé (filtrer les slots, gérer l’utilisateur).  
- **Vue Router** pour les vues Employee/Secretary/Manager.  
- **Services** pour consommer l’API NestJS et gérer les tokens JWT.


---

## Use Cases MVP

| Use Case                    | Règles appliquées                                                           | Ports utilisés                           |
|-----------------------------|------------------------------------------------------------------------------|------------------------------------------|
| **CreateReservation**       | Durée ≤ 5 jours (≤ 30 jours si manager), rang A/F si recharge, disponibilité  | `ReservationRepository`<br>`NotificationPublisher` |
| **CheckinReservation**      | Doit se faire avant 11 h sinon l’action échoue                                | `ReservationRepository`                  |
| **ReleaseExpiredReservations** | Cron 11 h : libère toutes les réservations non check-in, publie `ReservationReleased` | `ReservationRepository`<br>`NotificationPublisher` |

---

## Consequences

### Avantages
- **Tests unitaires rapides** sur Domain & Application, sans I/O.  
- **Faible couplage** : on peut remplacer la DB, la file de messages ou l’UI sans toucher au domaine.  
- **Clarté pédagogique** : chaque règle est portée par un Use Case explicite.  
- **Évolution vers micro-services** : extraction simple des adapters.

### Inconvénients
- **Overhead organisationnel** : quatre couches, nombreux dossiers.  
- **Rigueur nécessaire** : interdiction de mettre de la logique métier dans les contrôleurs.  
- **Courbe DDD** pour les novices.

---