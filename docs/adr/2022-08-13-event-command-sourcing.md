# Event/Command sourcing and traceability

## Introduction

- Store events and commands to analyse the systems interaction
- Add traceability betwen commands and events
- How to trace between events and new commands

- Think of separation of Inside events and Outside events. Offer the minimum information in the Broker.

Assuming Ports and Adapters / Onion architecture

### Analysis

#### Data structure

Think about traceability command -> event -> command -> event

##### Metadata

Schema:

```javascript
{

    "id": "uuid",
    "timestamp": "number" (~unix timestamp in UTC),
    "source": {
        "name": "string" (service/resource name),
        "version": "string"
    },
    "parentId": "uuid | null" (correlation of the command or event that produced this one),
    "type": "string" (event / command type),
    "channel": "string?" (where the command was sent / received from. Think of cases that an event is published to multiple brokers. Should we allow it?)

}
```

#### Flow

##### Option A - Command/Event storage handled in IO Ring

```mermaid

sequenceDiagram

actor Client
participant IORing
participant Service
participant DB
participant Broker

Client ->> IORing: http_request(command)

IORing ->> DB: store(command)
IORing ->> Service: command
Service ->> Service: logic
Service -->> IORing: [event, new_state]
IORing ->> DB: store(event, new_state)
IORing ->> Broker: publish(event)

IORing -->> Client: 200

```

##### Option B - Broker centered Command/Event storage

```mermaid

sequenceDiagram

actor Client
participant HttpAPI
participant Service
participant Broker
participant DBWriter
participant DB

Client ->> HttpAPI: http_request(command)

HttpAPI ->> Broker: command

Broker ->> Writer: command
Broker ->> Service: command
Service ->> Service: logic

Writer ->> DB: store(command)
Service ->> Broker: publish(event)
Broker ->> DB: store(event, new_state)

HttpAPI -->> Client: 201

```

##### Option C - DB centered Command/Event storage

```mermaid

sequenceDiagram

actor Client
participant HttpAPI
participant Service
participant DB
participant Writter
participant Broker

Client ->> HttpAPI: http_request(command)

HttpAPI ->> Service: command
Service ->> DB: store(command)
Service ->> DB: query(current_state)
DB -->> Service: current_state
Service ->> Service: logic -> event
Service ->> Service: current_state + event = new_state
Service ->> DB: store(event, new_state)

Service -->> HttpAPI: result
Writter ->> DB: query(events)
DB --> Writter: events

loop for each event
    Writter ->> Broker: event
end

HttpAPI -->> Client: 200

```

##### Option C - IO handled in service

```mermaid

sequenceDiagram

actor Client
participant HttpAPI
participant Service
participant DB
participant Broker

Client ->> HttpAPI: http_request(command)
HttpAPI ->> Service: command

Service ->> DB: store(command)
Service ->> Service: logic
Service ->> DB: store(event, new_state)

Service -->> HttpAPI: result

HttpAPI -->> Client: [status, body]

```

## Context and Problem Statement

## Analysis

## Proposed solution

## Status

Decided
