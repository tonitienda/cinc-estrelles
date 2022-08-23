# EDA: Schemas for public topics

## Context and Problem Statement

We need to send events to public topics and we need to decide an approach that is easy to maintain
and makes easy the life of consumers of the events.

## Analysis

### Types of consumers

In the EDA world we can separate the consumers into two main categories:

<span style="color:red; font-weight: bold">Find reference</span>

#### Semantic consumers

Some consumers are interested on the semantics of the event:

- an order has been created
- an order has been updated
- a user was banned
  ...

so they can perform an action that usually has some effect:

- trigger a command
- send a notification
- ...

This type of consumers need to know about the event type. There is no way around it, so they are more tightly coupled with the event, not necessarily with the producer of the event.

#### Structural consumers

Some consumers are interested <b>only</b> the data related to an event. They do not have to execute any action related to the semantics of the event. They only need to know that a given entity has changed and what the change is about.

They usually need to store an effect that affects the state of the system. They do not generate the effect itself.

Examples if such types of consumers are indexers that, for example, store the data to optimize queries, feed full text search indices, refresh cache, etc.

### Events Schema

There are mainly to approaches for the definition of the schemas of the events:

- Define a schema per event payload
- Define a schema per entity and let events payload be a subset of that schema

#### Schema per event

In this approach each event is seen as a separate message with a different shape. For example:

```json
{
  "header": {
     "type": "reservation-imported"
  },
  "body" {
    "date": "2022-12-12",
    "customer": {
        "email":"john.doe@example.com"
    }
  }
}
```

```json
{
  "header": {
     "type": "reservation-email-changed"
  },
  "body" {
    "email":"john.doe@example.com"
  }
}
```

#### Schema per entity

In this approach all events related to an entity will follow the shape defined by that entity:

```json
{
  "header": {
     "type": "reservation-imported"
  },
  "body" {
    "date": "2022-12-12",
    "customer": {
        "email":"john.doe@example.com"
    }
  }
}
```

```json
{
  "header": {
    "type": "reservation-email-changed"
  },
  "body": {
    "customer": {
      "email": "john.doe@example.com"
    }
  }
}
```

##### Pros

- Consumers only need to care about one schema for all events of an entity.
- Some consumers might only care about the body of the message (for example for indexing purposes)

##### Cons

- Size of the messages can get larger if, for example, fields deep in the schema are changed.

##### Problem

Since we want to let consumers relay only on the body of the message, how to convey retractions in terms of fields deletions or entity deletions?

If all consumers still need to be smart about the event type for some cases, we cannot get full leverage of this approach.

### Topics seggregation

<span style="color:red; font-weight: bold">
TODO: This depends in great measure on the approach decided for the schemas.
It makes sense to have one topic per schema, but just in case, mention and analyze having one topic per entity / event type. Are there advantadges of this approach? For example: consumers that only care about one type of message do not need to skip other messages. Can NATS filter messages by metadata? Is there a "native" header in NATS we can leverage?
</span>

## Proposed solution

## Status

Decided
