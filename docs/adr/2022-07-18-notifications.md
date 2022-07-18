# Import reservations

## Context and Problem Statement

The customer has already some ways to get reservations. One is via Booking.com and
the other one via telephone.
They need to have a place where they can check and manage all reservations regardless of
where they come from. They also need to enable notifications in some cases. For example
when a reservation is done for the same day.

This analysis focus on the notifications part.

## Analysis

### Async vs Sync notifications

There are different ways to handle notifications.

- Send the notification from the API itself when a reservation is being stored.
- Build an async system where notifications and storing reservations is decoupled

#### Error handling

Regardless of using a sync or an async method to store and send notifications, we need to handle partial errors.

| Error   | Consequence                                               |
| ------- | --------------------------------------------------------- |
| Storage | The reservation is not stored and no notification is sent |
| Notify  | The notification is sent but no reservation is stored     |

#### Separate the API to store reservations and the notification system

In this approach once the reservation is received from Booking.com the API will send an event
(or similar) to a Queue and another component will take it and decide to send the notification
or not.

Advantages:

- When multiple sources of reservations are needed the same notification component can be reused.

Disadvantages:

- We need to build and maintain the notification component

## Proposed solution

## Decision Outcome

## Status

Decided
