# Reservations Bounded Context

## Notes

### About command storage

- Commands will be stored in the DB best effort. They are used for traceability but not being able to store a command should not make the request fail.
- The command id will be used for traceability on the subsequent event. If the command cannot be stored, the subsequent event will be orphan.

### About event publication

- Events will be published using the outpost pattern.
- Not all information stored by the reservations service will be made public, so the event publisher is part of the reservations bounded context and will control what information is published what information will not.
- Therefore, the publisher can also be used as a sort of anti corruption later for outgoing messages, so we can update the internal model without breaking our subscribers.

## Context

```mermaid

flowchart LR

Client((Client))
Reservations
Broker[(Broker)]
Subscribers((Subscribers))

Client --> Reservations
Reservations --> Broker
Broker --> Subscribers
```

## Data

### Schemas

```mermaid
flowchart BT

subgraph public
    event-header
end

subgraph Reservations
    reservation
    reservation-request
    reservation-shape
    reservation-event
end

reservation-event -- extends --> reservation-shape
reservation-event -- extends --> event-header

reservation-request -- extends --> reservation-shape
reservation -- extends --> reservation-shape

```

## Modules

### Module Decomposition

```mermaid

flowchart LR

Client(Client)

subgraph ReservationsBackend
    http-api
    domain
    repository
    writer

    DB[(Data Store)]
end


Broker[(Broker)]

Client --> http-api
http-api -. commands .-> DB
http-api --> domain
domain --> repository
repository --> DB
DB --> writer
writer -- events --> Broker
```
